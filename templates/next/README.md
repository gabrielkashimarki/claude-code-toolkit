# Modelos Next.js + Supabase

Pontos de partida para comparar com o que o projeto já tem. Não são scaffold: copie o que encaixar e ajuste os caminhos.

| Arquivo | Destino sugerido | Dependências |
|---|---|---|
| `env.ts.example` | `src/lib/env.ts` | `zod` |
| `logger.ts.example` | `src/lib/logger.ts` | `pino` |
| `supabase-server.ts.example` | `src/lib/supabase/server.ts` | `@supabase/ssr`, `@supabase/supabase-js` |

Variáveis em [`../env.op.example`](../env.op.example), só com referências `op://`.

A chave secreta do Supabase (`SUPABASE_SECRET_KEY`) ignora a RLS. Ela só entra em código de servidor que precisa disso de verdade (job, webhook), nunca no cliente de sessão do usuário.

Antes de usar, confira a API atual de `@supabase/ssr` no Context7: ela muda entre versões.
