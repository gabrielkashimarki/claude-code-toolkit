#!/usr/bin/env node
// Liga e desliga o handoff automatico por sessao.
// Hook UserPromptSubmit: se o prompt for "handoff off" ou "handoff on", grava ou
// apaga o marcador ~/.claude/handoffs/.desligado-<session_id>, que o
// handoff-contexto.mjs consulta antes de medir o contexto. O prompt e bloqueado
// (nao chega ao modelo) e a confirmacao aparece na tela.

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

  const sessao = typeof entrada.session_id === 'string' ? entrada.session_id.trim() : '';
  if (!sessao) {
    process.exit(0);
  }

  const promptBruto = typeof entrada.prompt === 'string' ? entrada.prompt : '';
  const prompt = promptBruto
    .toLowerCase()
    .replace(/^\s+/, '')
    .replace(/[\s.]+$/, '');

  const home = process.env.HOME || os.homedir();
  const marcadores = path.join(home, '.claude', 'handoffs');
  const marcadorDesligado = path.join(marcadores, `.desligado-${sessao}`);

  const opcoesOff = new Set(['handoff off', '/handoff off', 'handoff-off', '/handoff-off']);
  const opcoesOn = new Set(['handoff on', '/handoff on', 'handoff-on', '/handoff-on']);

  if (opcoesOff.has(prompt)) {
    fs.mkdirSync(marcadores, { recursive: true });
    fs.writeFileSync(marcadorDesligado, new Date().toISOString() + '\n');
    const resposta = {
      decision: 'block',
      reason: 'Handoff automatico desligado nesta sessao. Para religar: handoff on',
    };
    process.stdout.write(JSON.stringify(resposta) + '\n');
    process.exit(0);
  }

  if (opcoesOn.has(prompt)) {
    fs.rmSync(marcadorDesligado, { force: true });
    const resposta = {
      decision: 'block',
      reason: 'Handoff automatico ligado nesta sessao.',
    };
    process.stdout.write(JSON.stringify(resposta) + '\n');
    process.exit(0);
  }

  process.exit(0);
} catch {
  process.exit(0);
}
