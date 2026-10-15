# Plugins

Plugin do Claude Code empacota skills, hooks, agentes e MCPs. Instale no escopo do usuário (vale para todo projeto):

```bash
claude plugin marketplace add <dono/repo>
claude plugin install <plugin>@<marketplace>
```

Reinicie a sessão depois de instalar. Presença no disco não prova carregamento: confira com `claude plugin list` e, numa sessão nova, veja se as skills do plugin aparecem.

## Ligados

| Plugin | Marketplace (`add`) | Instalar | O que faz | Precisa |
|---|---|---|---|---|
| superpowers | `obra/superpowers` | `superpowers@superpowers-dev` | Processo: brainstorming, plano, TDD, debug sistemático, worktrees, verificação antes de concluir | bash (Git Bash no Windows), Node |
| ponytail | `DietrichGebert/ponytail` | `ponytail@ponytail` | Escada YAGNI: reusar antes de escrever, mínimo que funciona, nunca simplificar validação e segurança | Node |
| caveman | `JuliusBrussee/caveman` | `caveman@caveman` | Resposta curta no idioma do usuário; código, doc e commit em redação normal | Node 18+ |
| codex | `openai/codex-plugin-cc` | `codex@openai-codex` | Delega diagnóstico, segunda implementação ou revisão ao Codex | Node, `npm i -g @openai/codex`, `codex login` |
| claude-security | oficial | `claude-security@claude-plugins-official` | Varredura de vulnerabilidade com verificação adversarial e patch | `sh`, `python3` 3.9+, git |
| feature-dev | oficial | `feature-dev@claude-plugins-official` | Agentes de exploração, arquitetura e revisão de feature | git |
| typesafe | `typesafe-ai/skills` | `typesafe@typesafe-ai` | Julgamento rápido tipado (roteamento, extração, verificação) dentro de app | nada local |

O marketplace oficial (`anthropics/claude-plugins-official`) já vem configurado.

## Instalados e desligados (ligue quando precisar)

| Plugin | Marketplace | Quando ligar |
|---|---|---|
| code-review, pr-review-toolkit | oficial | revisão de PR no GitHub |
| hookify | oficial | criar regra de hook por conversa (precisa de `python3`) |
| figma | oficial | ler design do Figma (MCP remoto, OAuth) |
| vercel-plugin | `vercel/vercel-plugin` | projeto na Vercel (MCP remoto, `vercel` CLI) |
| ui-ux-pro-max | `nextlevelbuilder/ui-ux-pro-max-skill` | sistema visual do zero |
| aia-harness | `leandrosilvaferreira/claude-plugins-registry` | gerar harness de projeto (usa gh, jq, docker) |

Plugin ligado sobe o piso de contexto de toda sessão. Deixe desligado o que não usa toda semana:

```bash
claude plugin disable <plugin>@<marketplace>
claude plugin enable <plugin>@<marketplace>
```

## Configurações que o kit assume

- **ponytail** em `full`.
- **caveman** em `full`, respostas no idioma do usuário.
- **superpowers**: specs e planos saem do repositório e vão para o vault ou para a pasta de docs que o `CLAUDE.md` global indicar. Se o `CLAUDE.md` global disser outro destino, ele vence a skill.

O modelo de `settings.json` com esses plugins está em [templates/settings.json.example](../../templates/settings.json.example).
