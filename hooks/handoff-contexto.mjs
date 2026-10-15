#!/usr/bin/env node
// Dispara o handoff automatico quando o contexto da sessao passa do limiar.
// Le o JSON do hook no stdin, mede o contexto pelo transcript e devolve
// instrucao para o modelo chamar a skill handoff-auto.
// Limiar = tokens de CONVERSA acumulados (total menos o piso do prompt da sessao).
// Configuravel por env: CLAUDE_HANDOFF_LIMIAR (padrao 250000).
// No PostToolUse (meio de tarefa) so avisa, uma vez: cortar no meio perde o trabalho em
// andamento. O handoff de fato e pedido no Stop, que e fim de turno, fronteira natural.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

try {
  let entradaTexto = '';
  try {
    entradaTexto = fs.readFileSync(0, 'utf8');
  } catch {
    process.exit(0);
  }

  if (!entradaTexto || !entradaTexto.trim()) {
    process.exit(0);
  }

  let entrada;
  try {
    entrada = JSON.parse(entradaTexto);
  } catch {
    process.exit(0);
  }

  if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) {
    process.exit(0);
  }

  const transcript = typeof entrada.transcript_path === 'string' ? entrada.transcript_path : '';
  const sessao = typeof entrada.session_id === 'string' && entrada.session_id ? entrada.session_id : 'sem-id';
  const evento = typeof entrada.hook_event_name === 'string' && entrada.hook_event_name ? entrada.hook_event_name : 'PostToolUse';

  if (!transcript) {
    process.exit(0);
  }

  try {
    if (!fs.statSync(transcript).isFile()) {
      process.exit(0);
    }
  } catch {
    process.exit(0);
  }

  const limiarEnv = process.env.CLAUDE_HANDOFF_LIMIAR;
  let limiar = 250000;
  if (limiarEnv !== undefined && limiarEnv !== '') {
    const num = Number(limiarEnv);
    if (Number.isFinite(num) && num >= 0) {
      limiar = Math.floor(num);
    }
  }

  const home = process.env.HOME || os.homedir();
  const marcadores = path.join(home, '.claude', 'handoffs');
  const arquivoDesligado = path.join(marcadores, `.desligado-${sessao}`);
  const arquivoChecagem = path.join(marcadores, '.ultima-checagem');
  const marcador = path.join(marcadores, `.acionado-${sessao}`);
  const avisado = path.join(marcadores, `.avisado-${sessao}`);

  function formatarDataHora(d = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // desligado nesta sessao por "handoff off" (ver handoff-toggle.mjs)
  if (fs.existsSync(arquivoDesligado)) {
    fs.mkdirSync(marcadores, { recursive: true });
    fs.writeFileSync(arquivoChecagem, `${formatarDataHora()} evento=${evento} desligado sessao=${sessao}\n`);
    process.exit(0);
  }

  const conteudo = fs.readFileSync(transcript, 'utf8');
  const todasLinhas = conteudo.endsWith('\n')
    ? conteudo.slice(0, -1).split(/\r?\n/)
    : conteudo.split(/\r?\n/);

  function extrairTokens(linha) {
    if (!linha || !linha.trim()) return null;
    let obj;
    try {
      obj = JSON.parse(linha);
    } catch {
      return null;
    }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    if (obj.isSidechain === true) return null;
    const usage = obj.message?.usage;
    if (!usage || typeof usage !== 'object') return null;

    const input = Number(usage.input_tokens) || 0;
    const cacheRead = Number(usage.cache_read_input_tokens) || 0;
    const cacheCreation = Number(usage.cache_creation_input_tokens) || 0;
    return input + cacheRead + cacheCreation;
  }

  // maior contexto visto nas ultimas linhas do transcript, ignorando subagentes
  const ultimas80 = todasLinhas.slice(-80);
  let tokens = 0;
  let encontrouTokens = false;
  for (const linha of ultimas80) {
    const valor = extrairTokens(linha);
    if (valor !== null) {
      if (!encontrouTokens || valor > tokens) {
        tokens = valor;
        encontrouTokens = true;
      }
    }
  }

  // piso da sessao: primeiro usage do transcript. E o custo fixo do prompt (system,
  // schemas de tool, listagem de MCP), que nao e trabalho acumulado. Sem descontar,
  // uma sessao com muitos MCP ja nasce acima do limiar e dispara na primeira tool call.
  const primeiras80 = todasLinhas.slice(0, 80);
  let base = null;
  for (const linha of primeiras80) {
    const valor = extrairTokens(linha);
    if (valor !== null) {
      base = valor;
      break;
    }
  }
  if (base === null || base > tokens) {
    base = tokens;
  }
  const conversa = tokens - base;

  fs.mkdirSync(marcadores, { recursive: true });
  fs.writeFileSync(
    arquivoChecagem,
    `${formatarDataHora()} evento=${evento} tokens=${tokens} base=${base} conversa=${conversa} sessao=${sessao}\n`
  );

  // rearma depois de uma compactacao (conversa caiu para menos de 60% do limiar)
  if (conversa < Math.floor((limiar * 6) / 10)) {
    fs.rmSync(marcador, { force: true });
    fs.rmSync(avisado, { force: true });
  }

  if (conversa < limiar) {
    process.exit(0);
  }

  const k = Math.floor(conversa / 1000);

  if (evento !== 'Stop') {
    if (fs.existsSync(avisado)) {
      process.exit(0);
    }
    fs.writeFileSync(avisado, formatarDataHora() + '\n');
    const aviso = `O contexto desta sessao passou do limiar de handoff: ~${k}k tokens de conversa (limiar ${limiar}). Nao pare no meio: termine a etapa atual ate um marco natural (commit, decisao fechada, resultado medido e lido, resposta entregue). Ao chegar nele, invoque a skill handoff-auto. Nao comece etapa nova grande antes do handoff.`;
    const saida = {
      systemMessage: `Conversa em ~${k}k tokens: handoff no proximo marco.`,
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: aviso,
      },
    };
    process.stdout.write(JSON.stringify(saida) + '\n');
    process.exit(0);
  }

  if (fs.existsSync(marcador)) {
    process.exit(0);
  }
  fs.writeFileSync(marcador, formatarDataHora() + '\n');

  const instrucao = `O contexto desta sessao passou do limiar de handoff: ~${k}k tokens de conversa (limiar ${limiar}). O turno terminou, entao este e o marco para passar o bastao: invoque a skill handoff-auto pela ferramenta Skill para gerar o documento de handoff e abrir a sessao nova do jeito que a skill manda para o ambiente atual (background no terminal, prompt pronto para colar no desktop). Depois de gerar, avise o usuario como a skill orienta e PARE de trabalhar nesta sessao. Se houver operacao que nao pode ficar pela metade, termine so ela, registre no documento e pare.`;
  const saida = {
    decision: 'block',
    reason: instrucao,
    systemMessage: `Conversa em ~${k}k tokens: gerando handoff automatico.`,
  };
  process.stdout.write(JSON.stringify(saida) + '\n');
  process.exit(0);
} catch {
  process.exit(0);
}
