#!/usr/bin/env node
// Validação do próprio toolkit (roda na CI em macOS, Windows e Linux).
// Confere: links relativos dos .md, JSON válido, frontmatter das skills,
// ausência de caminho pessoal absoluto e de cara de segredo.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const IGNORAR = new Set([".git", "node_modules"]);
const erros = [];

function listar(dir) {
  return readdirSync(dir).flatMap((nome) => {
    if (IGNORAR.has(nome)) return [];
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
  });
}

const arquivos = listar(RAIZ);
const rel = (f) => relative(RAIZ, f).split("\\").join("/");

// ponytail: regex de link simples, cobre [texto](alvo) de uma linha; troque por parser de Markdown se aparecer link quebrado em várias linhas.
for (const f of arquivos.filter((f) => f.endsWith(".md"))) {
  const texto = readFileSync(f, "utf8").replace(/```[\s\S]*?```/g, "");
  for (const [, alvo] of texto.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(alvo)) continue;
    const semAncora = decodeURIComponent(alvo.split("#")[0]);
    if (!existsSync(resolve(dirname(f), semAncora))) erros.push(`${rel(f)}: link quebrado para ${alvo}`);
  }
}

for (const f of arquivos.filter((f) => f.endsWith(".json") || f.endsWith(".json.example"))) {
  try {
    JSON.parse(readFileSync(f, "utf8"));
  } catch (e) {
    erros.push(`${rel(f)}: JSON inválido (${e.message})`);
  }
}

for (const f of arquivos.filter((f) => /skills\/[^/]+\/SKILL\.md$/.test(rel(f)))) {
  const topo = readFileSync(f, "utf8").match(/^---\n([\s\S]*?)\n---/);
  if (!topo || !/^name:\s*\S/m.test(topo[1]) || !/^description:/m.test(topo[1])) {
    erros.push(`${rel(f)}: frontmatter sem name ou description`);
  }
}

const PROIBIDOS = [
  [/\/Users\/[a-z0-9_-]+/i, "caminho pessoal do macOS"],
  [/C:\\Users\\[a-z0-9_-]+/i, "caminho pessoal do Windows"],
  [/\bsk-(ant-|proj-)?[A-Za-z0-9_-]{20,}/, "chave de API"],
  [/\bgh[pousr]_[A-Za-z0-9]{30,}/, "token do GitHub"],
  [/\bAKIA[0-9A-Z]{16}\b/, "chave da AWS"],
  [/\bops_[A-Za-z0-9_-]{30,}/, "token de conta de serviço do 1Password"],
  [/\bxox[abposr]-[A-Za-z0-9-]{10,}/, "token do Slack"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "chave privada"],
  [/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./, "JWT"],
];
const TEXTO = new Set([".md", ".mjs", ".js", ".ts", ".sh", ".json", ".example", ".template", ".yml", ".yaml", ""]);
const ESTE = fileURLToPath(import.meta.url);
for (const f of arquivos.filter((f) => TEXTO.has(extname(f)) && f !== ESTE)) {
  const texto = readFileSync(f, "utf8");
  for (const [re, nome] of PROIBIDOS) if (re.test(texto)) erros.push(`${rel(f)}: parece ${nome}`);
}

for (const f of arquivos.filter((f) => f.endsWith(".sh"))) {
  if (!readFileSync(f, "utf8").startsWith("#!")) erros.push(`${rel(f)}: script sem shebang`);
}

if (erros.length) {
  console.error(erros.join("\n"));
  console.error(`\n${erros.length} problema(s).`);
  process.exit(1);
}
console.log(`validar OK (${arquivos.length} arquivos)`);
