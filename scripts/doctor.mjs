#!/usr/bin/env node
// Confere se a máquina tem o que o toolkit precisa. Só lê: não instala nem altera nada.
// Uso: node scripts/doctor.mjs [--json] [--nao-falhar] [--autoteste]
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir, platform, arch, release } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const WIN = platform() === "win32";
const HOME = homedir();

// cmd: candidatos em ordem. min/max: versão aceita (inclusive).
const FERRAMENTAS = [
  { id: "git", obrigatorio: true, cmd: [["git", "--version"]] },
  { id: "bash", obrigatorio: true, cmd: [["bash", "--version"]], dica: "Windows: instale o Git for Windows" },
  { id: "jq", obrigatorio: false, cmd: [["jq", "--version"]] },
  { id: "gh", obrigatorio: true, cmd: [["gh", "--version"]] },
  { id: "node", obrigatorio: true, cmd: [["node", "--version"]], min: "22" },
  { id: "npm", obrigatorio: true, cmd: [["npm", "--version"]] },
  { id: "python", obrigatorio: true, cmd: [["python3", "--version"], ["python", "--version"], ["py", "-3", "--version"]], min: "3.11", max: "3.13" },
  { id: "uv", obrigatorio: true, cmd: [["uv", "--version"]] },
  { id: "claude", obrigatorio: true, cmd: [["claude", "--version"]] },
  { id: "codex", obrigatorio: true, cmd: [["codex", "--version"]] },
  { id: "op", obrigatorio: true, cmd: [["op", "--version"]] },
  { id: "fnm", obrigatorio: false, cmd: [["fnm", "--version"]] },
  { id: "agy", obrigatorio: false, cmd: [["agy", "--version"]] },
  { id: "ffmpeg", obrigatorio: false, cmd: [["ffmpeg", "-version"]] },
  { id: "yt-dlp", obrigatorio: false, cmd: [["yt-dlp", "--version"]] },
  { id: "graphify", obrigatorio: false, cmd: [["graphify", "--version"]] },
  { id: "rtk", obrigatorio: false, cmd: [["rtk", "--version"]] },
  { id: "docker", obrigatorio: false, cmd: [["docker", "--version"]] },
  { id: "rg", obrigatorio: false, cmd: [["rg", "--version"]] },
  { id: "semgrep", obrigatorio: false, cmd: [["semgrep", "--version"]] },
];

const PLUGINS = [
  "superpowers@superpowers-dev",
  "ponytail@ponytail",
  "caveman@caveman",
  "codex@openai-codex",
  "claude-security@claude-plugins-official",
  "feature-dev@claude-plugins-official",
  "typesafe@typesafe-ai",
];
const MCPS = ["context7", "chrome-devtools"];
const SKILLS = ["handoff-auto", "humanizer-ptbr"];
const HOOKS = ["handoff-toggle.mjs", "handoff-contexto.mjs"];

export function extrairVersao(texto) {
  const m = String(texto).match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  return m ? m[0] : null;
}

// -1, 0 ou 1 comparando só os campos que "b" informa ("3.13" casa com "3.13.5").
export function compararVersao(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < pb.length; i++) {
    const x = pa[i] ?? 0;
    if (x !== pb[i]) return x < pb[i] ? -1 : 1;
  }
  return 0;
}

export function dentroDaFaixa(versao, min, max) {
  if (!versao) return false;
  if (min && compararVersao(versao, min) < 0) return false;
  if (max && compararVersao(versao, max) > 0) return false;
  return true;
}

function rodar([cmd, ...args]) {
  // shell só no Windows, para achar npm.cmd, codex.cmd etc. Comandos são fixos, sem entrada externa.
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: WIN, timeout: 15000 });
  if (r.error || r.status !== 0) return null;
  return (r.stdout || r.stderr || "").trim().split(/\r?\n/)[0];
}

function checarFerramenta(f) {
  for (const c of f.cmd) {
    const saida = rodar(c);
    if (saida === null) continue;
    const versao = extrairVersao(saida);
    const ok = f.min || f.max ? dentroDaFaixa(versao, f.min, f.max) : true;
    return { id: f.id, obrigatorio: f.obrigatorio, status: ok ? "ok" : "versao", versao, comando: c[0] };
  }
  return { id: f.id, obrigatorio: f.obrigatorio, status: "ausente", versao: null, dica: f.dica };
}

function lerJson(caminho) {
  try {
    return JSON.parse(readFileSync(caminho, "utf8"));
  } catch {
    return null;
  }
}

function checarClaude() {
  const settings = lerJson(join(HOME, ".claude", "settings.json")) ?? {};
  const global = lerJson(join(HOME, ".claude.json")) ?? {};
  const ligados = settings.enabledPlugins ?? {};
  const mcps = global.mcpServers ?? {};
  const textoHooks = JSON.stringify(settings.hooks ?? {});
  return [
    ...PLUGINS.map((p) => ({ id: `plugin ${p}`, obrigatorio: true, status: ligados[p] ? "ok" : "ausente" })),
    ...MCPS.map((m) => ({ id: `mcp ${m}`, obrigatorio: true, status: mcps[m] ? "ok" : "ausente" })),
    ...SKILLS.map((s) => ({
      id: `skill ${s}`,
      obrigatorio: true,
      status: existsSync(join(HOME, ".claude", "skills", s, "SKILL.md")) ? "ok" : "ausente",
    })),
    ...HOOKS.map((h) => ({
      id: `hook ${h}`,
      obrigatorio: true,
      status: existsSync(join(HOME, ".claude", "hooks", h)) && textoHooks.includes(h) ? "ok" : "ausente",
    })),
  ];
}

function autoteste() {
  assert.equal(extrairVersao("Python 3.13.5"), "3.13.5");
  assert.equal(extrairVersao("v22.11.0"), "22.11.0");
  assert.equal(extrairVersao("jq-1.7.1"), "1.7.1");
  assert.equal(extrairVersao("sem versão"), null);
  assert.ok(dentroDaFaixa("3.13.5", "3.11", "3.13"));
  assert.ok(dentroDaFaixa("3.11.0", "3.11", "3.13"));
  assert.ok(!dentroDaFaixa("3.14.0", "3.11", "3.13"));
  assert.ok(!dentroDaFaixa("3.10.9", "3.11", "3.13"));
  assert.ok(dentroDaFaixa("26.10.0", "22"));
  assert.ok(!dentroDaFaixa("20.18.0", "22"));
  assert.ok(!dentroDaFaixa(null, "22"));
  console.log("autoteste OK");
}

const args = new Set(process.argv.slice(2));
if (args.has("--autoteste")) {
  autoteste();
  process.exit(0);
}

const resultado = {
  ambiente: { so: platform(), versao_so: release(), arquitetura: arch(), node: process.version },
  componentes: [...FERRAMENTAS.map(checarFerramenta), ...checarClaude()],
};
const faltando = resultado.componentes.filter((c) => c.obrigatorio && c.status !== "ok");

if (args.has("--json")) {
  console.log(JSON.stringify(resultado, null, 2));
} else {
  const icone = { ok: "ok   ", versao: "VERSÃO", ausente: "FALTA" };
  console.log(`${resultado.ambiente.so} ${resultado.ambiente.arquitetura} ${resultado.ambiente.versao_so}\n`);
  for (const c of resultado.componentes) {
    const marca = c.status === "ok" ? icone.ok : c.obrigatorio ? icone[c.status] : "opc  ";
    const extra = [c.versao, c.dica].filter(Boolean).join("  ");
    console.log(`${marca}  ${c.id.padEnd(48)} ${extra}`);
  }
  console.log(faltando.length ? `\n${faltando.length} item(ns) obrigatório(s) pendente(s).` : "\nBase completa.");
}

if (faltando.length && !args.has("--nao-falhar")) process.exit(1);
