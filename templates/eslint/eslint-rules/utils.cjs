// Adaptado de vibe-coding-toolkit (MIT), Copyright (c) 2026 Matheus Gomes.
"use strict";

const DEFAULT_MAX_LINES = 350;

const BANNED_CONSOLE_METHODS = new Set([
  "log",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "dir",
  "table",
  "time",
  "timeEnd",
  "timeLog",
  "group",
  "groupEnd",
  "groupCollapsed",
  "count",
  "countReset",
  "assert",
  "profile",
  "profileEnd",
]);

// Arquivo cujo nome base indica não ser código de produção. Arquivos de
// configuração e stories estão aqui pelo mesmo motivo que testes: seu tamanho
// nada diz sobre o quão bem fatorado está o código por trás deles.
const NON_SOURCE_BASENAME = /[.-](stories|config|conf)\.[^.]+$/;

// Diretórios cujo conteúdo não é escrito manualmente ou não faz parte
// da aplicação sob análise do linter.
const IGNORED_PATH_SEGMENTS = new Set([
  "node_modules",
  "dist",
  "build",
  ".next",
  "generated",
  "__generated__",
  "migrations",
  "migration",
  "locales",
  "__tests__",
  "__mocks__",
  "fixtures",
  "mocks",
]);

function normalizeFilePath(filename) {
  return filename.replace(/\\/g, "/");
}

// context.filename é a propriedade do ESLint 9; getFilename() é mantido como
// fallback para que as regras também rodem no ESLint 8 sem alterações.
function fileName(context) {
  return normalizeFilePath(context.filename ?? context.getFilename());
}

function isTestFile(filename) {
  return /(^|\/)(__tests__|__mocks__|fixtures|mocks)(\/|$)|[.-](test|spec)\.[cm]?[jt]sx?$/.test(
    filename
  );
}

function isCheckableSourceFile(filename) {
  if (filename.endsWith(".d.ts")) return false;
  const segments = filename.split("/");
  for (const segment of segments.slice(0, -1)) {
    if (IGNORED_PATH_SEGMENTS.has(segment)) return false;
  }
  const base = segments[segments.length - 1];
  return !isTestFile(filename) && !NON_SOURCE_BASENAME.test(base);
}

// Entradas da linha de base são comparadas como caminho completo ou como sufixo de caminho,
// permitindo que uma entrada escrita como no relatório do linter ("src/legacy.ts")
// coincida mesmo se o ESLint passar um caminho absoluto.
function isBaselineIgnored(filename, ignore) {
  return ignore.some(
    (entry) => filename === entry || filename.endsWith(`/${entry}`)
  );
}

module.exports = {
  BANNED_CONSOLE_METHODS,
  DEFAULT_MAX_LINES,
  fileName,
  isBaselineIgnored,
  isCheckableSourceFile,
  isTestFile,
};
