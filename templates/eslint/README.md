# Regras de Qualidade ESLint

Regras de qualidade de código sem dependências pesadas, adaptadas de [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit).

## Regras
- `quality/max-lines`: impõe limite de linhas por arquivo (padrão 350) em código de produção, ignorando testes, tipos e barrels.
- `quality/no-direct-console`: proíbe chamadas diretas a `console.*`, direcionando para o logger do projeto.
- `quality/no-direct-data-access`: impede importação de clientes de banco/Supabase em camadas de apresentação (`app/`, `components/`, `.tsx`).

## Instalação em projeto Next.js
1. Instale dependências: `npm i -D eslint eslint-config-next`
2. Copie `eslint-rules/` para a raiz do projeto.
3. Copie `next-supabase.config.mjs.example` como `eslint.config.mjs`.

## Autoteste
```bash
node eslint-rules/../verify.mjs
# ou a partir deste repositório:
node templates/eslint/verify.mjs templates/eslint/eslint-rules/index.cjs
```

## Adoção em projetos legados
1. Meça o débito por regra com `npx eslint . -f json`.
2. Comece com severidade `"warn"`.
3. Para `quality/max-lines`, adicione os arquivos já grandes na lista `ignore`.
4. Mude para `"error"` quando a contagem zerar.
