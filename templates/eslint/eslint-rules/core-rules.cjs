// Adaptado de vibe-coding-toolkit (MIT), Copyright (c) 2026 Matheus Gomes.
"use strict";

const {
  BANNED_CONSOLE_METHODS,
  DEFAULT_MAX_LINES,
  fileName,
  isBaselineIgnored,
  isCheckableSourceFile,
  isTestFile,
} = require("./utils.cjs");

// Uma importação default ou namespace traz tudo o que o módulo exporta,
// contando sempre como acesso ao cliente. Importações nomeadas são verificadas
// pelo nome importado original, não pelo alias local, então `import { db as database }`
// ainda é detectado.
function importsGuardedBinding(node, bindings) {
  return node.specifiers.some((specifier) => {
    if (
      specifier.type === "ImportDefaultSpecifier" ||
      specifier.type === "ImportNamespaceSpecifier"
    ) {
      return true;
    }
    return (
      specifier.type === "ImportSpecifier" &&
      specifier.imported.type === "Identifier" &&
      bindings.has(specifier.imported.name)
    );
  });
}

const maxLines = {
  meta: {
    type: "suggestion",
    docs: { description: "Impõe um limite de tamanho para arquivos de código-fonte." },
    messages: {
      tooLong: [
        "Arquivo grande demais ({{lines}} linhas | máximo {{max}}).",
        "",
        "Refatore em unidades menores e focadas:",
        "  - Lógica de negócio -> serviço de domínio ou módulo de caso de uso",
        "  - Blocos de UI repetidos -> subcomponente reutilizável",
        "  - Código de acesso a dados -> repositório ou adaptador",
        "  - Agrupamentos de funções auxiliares -> módulo utilitário específico do domínio",
      ].join("\n"),
    },
    schema: [
      {
        type: "object",
        properties: {
          max: { type: "integer", minimum: 1 },
          ignore: { type: "array", items: { type: "string" } },
          includeTests: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] ?? {};
    const max = options.max ?? DEFAULT_MAX_LINES;
    const ignore = options.ignore ?? [];
    // Opcional, padrão false. Arquivos de teste ficam fora de isCheckableSourceFile por
    // design; ativar isso permite aplicar o mesmo limite a eles em um bloco separado
    // com "warn", sem abrandar o "error" no código de produção.
    const includeTests = options.includeTests ?? false;
    const filename = fileName(context);
    const checkable =
      isCheckableSourceFile(filename) ||
      (includeTests && isTestFile(filename) && !filename.endsWith(".d.ts"));
    if (!checkable || isBaselineIgnored(filename, ignore)) {
      return {};
    }
    return {
      Program(node) {
        // Isenta módulos de reexportação ou somente tipos pela sintaxe, nunca pelo nome base.
        const declarationOnly = node.body.every((statement) => {
          if (["ImportDeclaration", "ExportAllDeclaration", "EmptyStatement"].includes(statement.type)) return true;
          if (["ExportNamedDeclaration", "ExportDefaultDeclaration"].includes(statement.type)) {
            if (!statement.declaration) return true;
            statement = statement.declaration;
          }
          return ["TSTypeAliasDeclaration", "TSInterfaceDeclaration"].includes(statement.type);
        });
        if (declarationOnly) return;
        const lines = context.sourceCode.lines.length;
        if (lines > max) {
          context.report({
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            messageId: "tooLong",
            data: { lines, max },
          });
        }
      },
    };
  },
};

const noDirectConsole = {
  meta: {
    type: "problem",
    docs: { description: "Proíbe saída direta pelo console fora de adaptadores de log." },
    messages: {
      banned: "Use {{logger}} em vez de console.{{method}}().",
    },
    schema: [
      {
        type: "object",
        properties: {
          allow: { type: "array", items: { type: "string" } },
          logger: { type: "string" },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] ?? {};
    const allow = new Set(options.allow ?? []);
    const logger = options.logger ?? "o utilitário de log do projeto";
    // O próprio adaptador de log do projeto — o arquivo que encapsula o console,
    // além de arquivos que precisam registrar logs antes do restante da infraestrutura
    // estar acessível — é isento por override de glob na configuração, não por
    // uma lista fixa aqui. Arquivos de teste são isentos na própria regra porque todas
    // as regras deste plugin os tratam da mesma forma.
    const filename = fileName(context);
    if (isTestFile(filename)) return {};
    return {
      MemberExpression(node) {
        if (
          node.object.type === "Identifier" &&
          node.object.name === "console" &&
          node.property.type === "Identifier" &&
          BANNED_CONSOLE_METHODS.has(node.property.name) &&
          !allow.has(node.property.name)
        ) {
          context.report({
            node,
            messageId: "banned",
            data: { logger, method: node.property.name },
          });
        }
      },
    };
  },
};

const noDirectDataAccess = {
  meta: {
    type: "problem",
    docs: {
      description: "Mantém o cliente de banco de dados fora das camadas de apresentação.",
    },
    messages: {
      forbidden:
        "Não importe {{module}} nesta camada; passe por um módulo de dados ou serviço.",
    },
    // modules e layers são obrigatórios com minItems 1. Uma regra configurada
    // pela metade deve falhar explicitamente ao carregar a config, em vez de silenciosamente
    // nunca acusar nada.
    schema: [
      {
        type: "object",
        properties: {
          modules: { type: "array", items: { type: "string" }, minItems: 1 },
          layers: { type: "array", items: { type: "string" }, minItems: 1 },
          bindings: { type: "array", items: { type: "string" } },
          extensions: { type: "array", items: { type: "string" } },
        },
        required: ["modules", "layers"],
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] ?? {};
    const modules = new Set(options.modules ?? []);
    const layers = options.layers ?? [];
    const bindings = new Set(options.bindings ?? ["db"]);
    const extensions = options.extensions ?? [];
    const filename = fileName(context);
    if (isTestFile(filename)) return {};
    // Duas formas independentes de identificar camada de apresentação: o arquivo reside sob
    // um dos caminhos monitorados ou possui uma extensão monitorada, onde quer que esteja.
    // A checagem por extensão existe porque um componente é um componente independentemente
    // do diretório em que foi colocado.
    const guarded =
      layers.some((layer) => filename.includes(layer)) ||
      extensions.some((extension) => filename.endsWith(extension));
    if (!guarded) return {};
    return {
      ImportDeclaration(node) {
        const source = String(node.source.value);
        if (!modules.has(source)) return;
        if (!importsGuardedBinding(node, bindings)) return;
        context.report({ node, messageId: "forbidden", data: { module: source } });
      },
    };
  },
};

module.exports = {
  maxLines,
  noDirectConsole,
  noDirectDataAccess,
};
