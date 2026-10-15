#!/usr/bin/env node
// Testes unitarios dos hooks de handoff (handoff-contexto.mjs e handoff-toggle.mjs).
// Verifica limites de contexto, notificacoes, bloqueio, chaveamento liga/desliga e resiliencia.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const dirHooks = path.dirname(fileURLToPath(import.meta.url));
const hookContexto = path.join(dirHooks, 'handoff-contexto.mjs');
const hookToggle = path.join(dirHooks, 'handoff-toggle.mjs');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'handoff-teste-'));

try {
  fs.mkdirSync(path.join(tmp, '.claude'), { recursive: true });

  // transcript falso: piso de 110k (sessao com muitos MCP) e um ultimo turno
  function monta(total) {
    const arq = path.join(tmp, `t-${total}.jsonl`);
    const linhas = [
      JSON.stringify({ type: 'user', message: { role: 'user' } }),
      JSON.stringify({
        type: 'assistant',
        message: {
          usage: {
            input_tokens: 4,
            cache_creation_input_tokens: 110000,
            cache_read_input_tokens: 0,
          },
        },
      }),
      JSON.stringify({
        type: 'assistant',
        message: {
          usage: {
            input_tokens: 4,
            cache_read_input_tokens: total - 4,
          },
        },
      }),
    ];
    fs.writeFileSync(arq, linhas.join('\n') + '\n');
    return arq;
  }

  function rodaContexto(transcriptPath, sessionId, hookEventName = 'PostToolUse', envExtra = {}) {
    const payload = JSON.stringify({
      transcript_path: transcriptPath,
      session_id: sessionId,
      hook_event_name: hookEventName,
    });
    const env = { ...process.env, HOME: tmp, ...envExtra };
    return spawnSync(process.execPath, [hookContexto], {
      input: payload,
      encoding: 'utf8',
      env,
    });
  }

  function rodaToggle(sessionId, prompt, envExtra = {}) {
    const payload = JSON.stringify({
      session_id: sessionId,
      prompt,
    });
    const env = { ...process.env, HOME: tmp, ...envExtra };
    return spawnSync(process.execPath, [hookToggle], {
      input: payload,
      encoding: 'utf8',
      env,
    });
  }

  const envLimiar80k = { CLAUDE_HANDOFF_LIMIAR: '80000' };

  // 150k total = 40k de conversa: abaixo do limiar de 80k, nao dispara
  let res = rodaContexto(monta(150000), 's1', 'PostToolUse', envLimiar80k);
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '', `FALHA: disparou com 40k de conversa: ${res.stdout}`);

  // 200k total = 90k de conversa: no meio da tarefa so avisa, sem bloquear
  res = rodaContexto(monta(200000), 's2', 'PostToolUse', envLimiar80k);
  assert.equal(res.status, 0);
  assert.match(res.stdout, /Nao pare no meio/, `FALHA: nao avisou com 90k de conversa: ${res.stdout}`);
  assert.doesNotMatch(res.stdout, /"decision"/, `FALHA: bloqueou no PostToolUse: ${res.stdout}`);

  // o aviso nao repete
  res = rodaContexto(monta(200000), 's2', 'PostToolUse', envLimiar80k);
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '', `FALHA: avisou duas vezes: ${res.stdout}`);

  // no fim do turno pede o handoff, uma vez
  res = rodaContexto(monta(200000), 's2', 'Stop', envLimiar80k);
  assert.equal(res.status, 0);
  assert.match(res.stdout, /"decision"\s*:\s*"block"/, `FALHA: Stop nao pediu bloqueio: ${res.stdout}`);
  assert.match(res.stdout, /handoff-auto/, `FALHA: Stop nao pediu handoff: ${res.stdout}`);

  res = rodaContexto(monta(200000), 's2', 'Stop', envLimiar80k);
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '', 'FALHA: Stop pediu handoff duas vezes');

  // padrao sem env: 250k
  const envSemLimiar = { ...process.env, HOME: tmp };
  delete envSemLimiar.CLAUDE_HANDOFF_LIMIAR;
  res = spawnSync(
    process.execPath,
    [hookContexto],
    {
      input: JSON.stringify({
        transcript_path: monta(300000),
        session_id: 's3',
        hook_event_name: 'Stop',
      }),
      encoding: 'utf8',
      env: envSemLimiar,
    }
  );
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '', `FALHA: disparou com 190k e limiar padrao 250k: ${res.stdout}`);

  // rearma depois de uma compactacao: conversa < 60% do limiar apaga .acionado e .avisado
  const marcadorS2 = path.join(tmp, '.claude', 'handoffs', '.acionado-s2');
  const avisadoS2 = path.join(tmp, '.claude', 'handoffs', '.avisado-s2');
  assert.equal(fs.existsSync(marcadorS2), true);
  rodaContexto(monta(150000), 's2', 'PostToolUse', envLimiar80k);
  assert.equal(fs.existsSync(marcadorS2), false, 'marcador .acionado nao foi apagado no rearme');
  assert.equal(fs.existsSync(avisadoS2), false, 'marcador .avisado nao foi apagado no rearme');

  // handoff-toggle: off grava o marcador e bloqueia
  res = rodaToggle('s4', 'handoff off');
  assert.equal(res.status, 0);
  let toggleParsed = JSON.parse(res.stdout);
  assert.equal(toggleParsed.decision, 'block');
  assert.equal(toggleParsed.reason, 'Handoff automatico desligado nesta sessao. Para religar: handoff on');
  const desligadoS4 = path.join(tmp, '.claude', 'handoffs', '.desligado-s4');
  assert.equal(fs.existsSync(desligadoS4), true);

  // variantes de desligar (/handoff off, handoff-off, /handoff-off com espacos e ponto)
  res = rodaToggle('s4-var', '  /handoff off. ');
  assert.equal(res.status, 0);
  assert.equal(fs.existsSync(path.join(tmp, '.claude', 'handoffs', '.desligado-s4-var')), true);

  // com o marcador desligado, handoff-contexto nao dispara mesmo acima do limiar
  res = rodaContexto(monta(200000), 's4', 'Stop', envLimiar80k);
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '', 'disparou mesmo com sessao desligada');
  const ultimaChecagem = fs.readFileSync(path.join(tmp, '.claude', 'handoffs', '.ultima-checagem'), 'utf8');
  assert.match(ultimaChecagem, /desligado/);
  assert.match(ultimaChecagem, /sessao=s4/);

  // on apaga o marcador e confirma religamento
  res = rodaToggle('s4', 'handoff on');
  assert.equal(res.status, 0);
  toggleParsed = JSON.parse(res.stdout);
  assert.equal(toggleParsed.decision, 'block');
  assert.equal(toggleParsed.reason, 'Handoff automatico ligado nesta sessao.');
  assert.equal(fs.existsSync(desligadoS4), false);

  // outro prompt nao imprime nada
  res = rodaToggle('s4', 'como faco deploy?');
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '');

  // sem session_id nao imprime nada
  res = spawnSync(
    process.execPath,
    [hookToggle],
    {
      input: JSON.stringify({ prompt: 'handoff off' }),
      encoding: 'utf8',
      env: { ...process.env, HOME: tmp },
    }
  );
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '');

  // stdin invalido: vazio, null, nao-json, tipos primitivos, arquivo inexistente
  for (const hook of [hookContexto, hookToggle]) {
    for (const entradaInvalida of ['', '   \n', 'null', '{invalido', '123', '[]']) {
      res = spawnSync(process.execPath, [hook], {
        input: entradaInvalida,
        encoding: 'utf8',
        env: { ...process.env, HOME: tmp },
      });
      assert.equal(res.status, 0);
      assert.equal(res.stdout, '');
    }
  }

  // transcript inexistente em handoff-contexto sai 0 sem saida
  res = rodaContexto(path.join(tmp, 'nao-existe.jsonl'), 's5', 'PostToolUse');
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '');

  // limiar com valor nao numerico vira o padrao (250000)
  res = rodaContexto(monta(300000), 's6', 'Stop', { CLAUDE_HANDOFF_LIMIAR: 'invalido' });
  assert.equal(res.status, 0);
  assert.equal(res.stdout, '', 'nao assumiu padrao de 250k ao receber limiar invalido');

  console.log('OK');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
