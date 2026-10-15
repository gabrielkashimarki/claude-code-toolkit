// Adaptado de vibe-coding-toolkit (MIT), Copyright (c) 2026 Matheus Gomes.
// Autoteste para as regras quality/*. Usa o RuleTester do próprio ESLint e
// nada mais — sem framework de testes, sem dependências de desenvolvimento além do ESLint.
//
// Uso a partir da raiz de um projeto que instalou as regras:
//   node templates/eslint/verify.mjs
// Passe um caminho para verificar uma cópia em outro local:
//   node verify.mjs ./eslint-rules/index.cjs
//
// RuleTester.run() lança erro no primeiro caso com falha, portanto uma saída
// diferente de zero sinaliza falha; não há biblioteca de asserção para configurar.
// Os fontes de teste são JavaScript puro com extensões .ts/.tsx de propósito: as
// regras inspecionam nomes de arquivo e a sintaxe que o espree já entende,
// dispensando o parser do TypeScript.
import path from "node:path";
import { pathToFileURL } from "node:url";

import { RuleTester } from "eslint";

const target = process.argv[2] ?? "./eslint-rules/index.cjs";
const plugin = (await import(pathToFileURL(path.resolve(target)).href)).default;

const ruleTester = new RuleTester();
const testFilenames = ["src/order.e2e-spec.ts", "src/order-spec.ts", "src/order-test.js", "src/order.spec.mts", "src/order.test.cts"];
// Identificadores únicos por linha: repetir uma declaração causaria colisão
// e falharia como erro de parse antes mesmo de qualquer regra ser executada.
const lines = (count) =>
  Array.from({ length: count }, (_, i) => `const value${i} = ${i};`).join("\n") +
  "\n";

ruleTester.run("quality/max-lines", plugin.rules["max-lines"], {
  valid: [
    ...testFilenames.map((filename) => ({
      name: `sufixo de teste é isento por padrão: ${filename}`,
      code: lines(20), filename, options: [{ max: 10 }],
    })),
    {
      name: "um barrel que não é index é isento pelo conteúdo",
      code: Array.from({ length: 20 }, (_, i) => `export * from "./module${i}";`).join("\n"),
      filename: "src/public-api.ts", options: [{ max: 10 }],
    },
    {
      name: "declarações vazias não transformam um módulo de reexportação em lógica de execução",
      code: 'import { value } from "./module";\nexport { value };\n' + ";\n".repeat(20),
      filename: "src/public-api.ts", options: [{ max: 10 }],
    },
    {
      name: "um arquivo dentro do limite",
      code: lines(3),
      filename: "src/service.ts",
      options: [{ max: 10 }],
    },
    {
      name: "arquivos de teste são isentos por padrão",
      code: lines(20),
      filename: "src/service.test.ts",
      options: [{ max: 10 }],
    },
    {
      name: "arquivos em diretório de teste são isentos por padrão",
      code: lines(20),
      filename: "src/__tests__/helpers.ts",
      options: [{ max: 10 }],
    },
    {
      name: "arquivos de declaração (.d.ts) nunca são verificados",
      code: lines(20),
      filename: "src/types.d.ts",
      options: [{ max: 10 }],
    },
    {
      name: "um barrel puro de reexportação é isento pelo conteúdo",
      code: Array.from({ length: 20 }, (_, i) => `export { item${i} } from "./module${i}";`).join("\n"),
      filename: "src/index.ts",
      options: [{ max: 10 }],
    },
    {
      name: "código gerado nunca é verificado",
      code: lines(20),
      filename: "src/generated/client.ts",
      options: [{ max: 10 }],
    },
    {
      name: "uma entrada na baseline silencia um arquivo conhecido",
      code: lines(20),
      filename: "src/legacy.ts",
      options: [{ max: 10, ignore: ["src/legacy.ts"] }],
    },
  ],
  invalid: [
    ...testFilenames.map((filename) => ({
      name: `includeTests inclui verificação com sufixo de teste: ${filename}`,
      code: lines(20), filename, options: [{ max: 10, includeTests: true }],
      errors: [{ messageId: "tooLong" }],
    })),
    {
      name: "um sufixo similar de produção ainda é verificado",
      code: lines(20), filename: "src/order-specification.ts", options: [{ max: 10 }],
      errors: [{ messageId: "tooLong" }],
    },
    ...["src/index.ts", "src/components/index.tsx", "src/types.ts", "src/constants.ts", "C:\\repo\\src\\index.ts"].map((filename) => ({
      name: `código executável é verificado independentemente do nome base: ${filename}`,
      code: lines(20), filename, options: [{ max: 10 }],
      errors: [{ messageId: "tooLong" }],
    })),
    {
      name: "um arquivo acima do limite",
      code: lines(20),
      filename: "src/service.ts",
      options: [{ max: 10 }],
      errors: [{ messageId: "tooLong" }],
    },
    {
      name: "includeTests traz arquivos de teste de volta ao limite",
      code: lines(20),
      filename: "src/service.test.ts",
      options: [{ max: 10, includeTests: true }],
      errors: [{ messageId: "tooLong" }],
    },
  ],
});

console.log("quality/max-lines: ok");

ruleTester.run("quality/no-direct-console", plugin.rules["no-direct-console"], {
  valid: [
    ...testFilenames.map((filename) => ({
      name: `sufixo de teste pode usar console: ${filename}`, code: "console.log('test');", filename,
    })),
    {
      name: "um auxiliar de log é permitido",
      code: "logger.info('hello');",
      filename: "src/service.ts",
    },
    {
      name: "arquivos de teste podem emitir logs livremente",
      code: "console.log('hello');",
      filename: "src/service.test.ts",
    },
    {
      name: "um método permitido não é reportado",
      code: "console.error('boom');",
      filename: "src/service.ts",
      options: [{ allow: ["error"] }],
    },
    {
      name: "um método que não seja do console não é reportado",
      code: "console.render('x');",
      filename: "src/service.ts",
    },
    {
      name: "um identificador que apenas termina em console não é o console",
      code: "fakeconsole.log('x');",
      filename: "src/service.ts",
    },
  ],
  invalid: [
    {
      name: "uma chamada direta a console em código de produção",
      code: "console.log('hello');",
      filename: "src/service.ts",
      errors: [
        {
          messageId: "banned",
          data: { method: "log", logger: "o utilitário de log do projeto" },
        },
      ],
    },
    {
      name: "a opção logger define o substituto na mensagem",
      code: "console.warn('hello');",
      filename: "src/service.ts",
      options: [{ logger: "logger.warn()" }],
      errors: [{ messageId: "banned", data: { method: "warn", logger: "logger.warn()" } }],
    },
  ],
});

console.log("quality/no-direct-console: ok");

const dataAccess = {
  modules: ["@/db", "@/db/index"],
  layers: ["/src/app/", "/src/components/"],
  extensions: [".tsx"],
};

ruleTester.run(
  "quality/no-direct-data-access",
  plugin.rules["no-direct-data-access"],
  {
    valid: [
      ...testFilenames.map((filename) => ({
        name: `sufixo de teste pode acessar dados: ${filename}`,
        code: "import { db } from '@/db';", filename: `/repo/${filename}`,
        options: [{ ...dataAccess, layers: ["/src/"] }],
      })),
      {
        name: "uma camada monitorada importando algo diferente do cliente",
        code: "import { userColumns } from '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [dataAccess],
      },
      {
        name: "uma camada que não é monitorada pode importar o cliente",
        code: "import { db } from '@/db';",
        filename: "/repo/src/server/user-repository.ts",
        options: [dataAccess],
      },
      {
        name: "um módulo que não é o módulo de dados",
        code: "import { db } from './local-cache';",
        filename: "/repo/src/app/page.ts",
        options: [dataAccess],
      },
      {
        name: "arquivos de teste são isentos",
        code: "import { db } from '@/db';",
        filename: "/repo/src/app/page.test.ts",
        options: [dataAccess],
      },
      {
        name: "uma importação por efeito colateral não extrai binding",
        code: "import '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [dataAccess],
      },
      {
        name: "uma lista de bindings customizada não coincide com o nome padrão",
        code: "import { db } from '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [{ ...dataAccess, bindings: ["prisma"] }],
      },
    ],
    invalid: [
      {
        name: "uma camada monitorada importando o cliente por nome",
        code: "import { db } from '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [dataAccess],
        errors: [{ messageId: "forbidden", data: { module: "@/db" } }],
      },
      {
        name: "a lista de extensões monitora um arquivo fora dos caminhos de camada",
        code: "import { db } from '@/db';",
        filename: "/repo/src/widgets/table.tsx",
        options: [dataAccess],
        errors: [{ messageId: "forbidden", data: { module: "@/db" } }],
      },
      {
        name: "uma importação default sempre conta como puxar o cliente",
        code: "import anything from '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [dataAccess],
        errors: [{ messageId: "forbidden", data: { module: "@/db" } }],
      },
      {
        name: "uma importação de namespace sempre conta como puxar o cliente",
        code: "import * as everything from '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [dataAccess],
        errors: [{ messageId: "forbidden", data: { module: "@/db" } }],
      },
      {
        name: "uma importação renomeada é comparada pelo nome importado original",
        code: "import { db as database } from '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [dataAccess],
        errors: [{ messageId: "forbidden", data: { module: "@/db" } }],
      },
      {
        name: "uma lista de bindings customizada coincide com seu próprio nome",
        code: "import { prisma } from '@/db';",
        filename: "/repo/src/app/page.ts",
        options: [{ ...dataAccess, bindings: ["prisma"] }],
        errors: [{ messageId: "forbidden", data: { module: "@/db" } }],
      },
    ],
  }
);

console.log("quality/no-direct-data-access: ok");
