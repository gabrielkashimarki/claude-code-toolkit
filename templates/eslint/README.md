# Regras de Qualidade ESLint

Regras de qualidade de código sem dependências pesadas, adaptadas do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit), Copyright (c) 2026 Matheus Gomes, MIT. A lógica é a mesma da fonte; mudaram só textos e o perfil Supabase.

## Regras
- `quality/max-lines`: impõe limite de linhas por arquivo (padrão 350) em código de produção, ignorando testes, tipos e barrels.
- `quality/no-direct-console`: proíbe chamadas diretas a `console.*`, direcionando para o logger do projeto.
- `quality/no-direct-data-access`: impede importação de clientes de banco/Supabase em camadas de apresentação (`app/`, `components/`, `.tsx`).

## Instalação em projeto Next.js
1. Instale dependências: `npm i -D eslint eslint-config-next`
2. Copie `eslint-rules/` (e `verify.mjs`, se quiser o autoteste) para a raiz do projeto.
3. Copie `next-supabase.config.mjs.example` como `eslint.config.mjs`.

## Autoteste
Precisa do `eslint@9` instalado onde o comando roda. Na raiz do projeto, com `verify.mjs` copiado junto de `eslint-rules/`:

```bash
node verify.mjs ./eslint-rules/index.cjs
```

A CI do kit roda o mesmo comando numa cópia em pasta temporária.

## Adoção em projetos legados
1. Meça o débito por regra com `npx eslint . -f json`.
2. Comece com severidade `"warn"`.
3. Para `quality/max-lines`, adicione os arquivos já grandes na lista `ignore`.
4. Mude para `"error"` quando a contagem zerar.
