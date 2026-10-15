# Memória e segredos

## Memória em camadas

| Camada | Arquivo | Entra na sessão? |
|---|---|---|
| Preferências pessoais | `~/.claude/CLAUDE.md` | sempre |
| Índice da memória | `~/.claude/projects/<projeto>/memory/MEMORY.md` | sempre, por isso fica curto (teto de 5 KB) |
| Fatos de memória | um arquivo por fato na mesma pasta | só quando relevante |
| Regra do projeto | `AGENTS.md` + `CLAUDE.md` com `@AGENTS.md` | sempre, no projeto |
| História (spec, plano, nota de sessão) | vault Obsidian | só quando o agente abre |

Regras que evitam a memória apodrecer:

- Um fato por arquivo, com frontmatter (`name`, `description`, `type`). A `description` é o que o agente usa para decidir se lê.
- Antes de criar, procure se já existe e atualize. Fato que ficou errado se apaga.
- Não guarde o que o repositório já registra (estrutura de código, histórico do git).
- Para tarefa que muda de fase, registre a cada marco (commit, decisão fechada, medição lida), não só no fim. A nota é o que sobrevive a uma compactação ou a um handoff.

### Vault Obsidian (opcional)

Um repositório git privado com notas em Markdown. O kit usa a convenção:

```text
<vault>/99-Claude/logs/AAAA-MM-DD-<assunto>.md          sessão interna
<vault>/99-Claude/projects/<projeto>/                   spec e plano
<vault>/02-Negocio/Clientes/<CLIENTE>/sessoes/          sessão de cliente
```

Diga no `~/.claude/CLAUDE.md` onde fica o vault. Superpowers e afins mandam salvar spec em `docs/superpowers/`; a regra do `CLAUDE.md` vence a skill.

## Segredos com 1Password CLI

Nenhum segredo em arquivo, chat, log ou código. No arquivo vai só a referência:

```text
op://<Cofre>/<Item>/<campo>
```

| Situação | Comando |
|---|---|
| Ler um valor num script | `op read "op://Cofre/Item/campo"` |
| Rodar app com `.env` de referências | `op run --env-file=.env -- npm run dev` |
| Gerar arquivo de configuração a partir de um modelo | `op inject -i config.tpl -o config` |
| MCP com token | ver [o padrão `op run`](mcps.md#mcp-com-segredo-o-padrão-op-run) |

Modelo de `.env` em [templates/env.op.example](../../templates/env.op.example).

### Conta de serviço (agente sem Touch ID)

Para o agente usar o `op` sem pedir biometria a cada chamada, crie uma conta de serviço do 1Password com acesso só aos cofres necessários. Exporte o token em `OP_SERVICE_ACCOUNT_TOKEN` no ambiente que abre o agente. Esse token mesmo fica fora de qualquer arquivo versionado (no macOS, no Keychain; no Windows, no Gerenciador de Credenciais).

- A conta de serviço tem limite diário de requisições (a conta usada aqui tem 1.000 por dia; confira o do seu plano). Agrupe as leituras com `op inject` e nunca rode `op` em loop.
- Organize um cofre por cliente (`Agência — Cliente`) e cofres internos sem prefixo. Credencial nova vai para o cofre do cliente na hora.
- Cofre de cliente encerrado ganha prefixo de arquivo e não recebe credencial nova.
