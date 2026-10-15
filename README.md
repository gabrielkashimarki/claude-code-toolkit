# Claude Code Toolkit

Kit de plugins, skills, MCPs, hooks e prompts que uso no dia a dia com Claude Code, Codex e Antigravity CLI (`agy`). Roda em macOS e Windows. Quem instala não lê tutorial: cola um prompt no agente, ele instala, configura, testa e devolve um manifesto da máquina.

Formato e parte das receitas vêm do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit), do Matheus Gomes (MIT). Ver [Créditos](#créditos-e-licença).

## 00. Por onde começar

| Seu momento | Caminho |
|---|---|
| Máquina nova ou bagunçada | [Prompt 01, preparar a máquina](prompts/01-preparar-maquina.md) |
| Projeto que já existe | [Prompt 02, adotar o kit no projeto](prompts/02-projeto-existente.md) |
| Quero saber o que precisa instalar antes | [Pré-requisitos por sistema](docs/01-pre-requisitos.md) |
| Quero entender como as peças conversam | [Como o kit funciona](docs/02-como-funciona.md) |
| Quero ver ferramenta por ferramenta | [Catálogo](docs/ferramentas/README.md) |

## 01. Preparar a máquina

Abra o Claude Code (ou o Codex) num terminal e cole:

```text
Leia https://raw.githubusercontent.com/gabrielkashimarki/claude-code-toolkit/main/prompts/01-preparar-maquina.md
e execute integralmente o bloco da seção "Prompt" neste computador.
```

O agente descobre o sistema, instala o que falta, liga plugins, skills, MCPs e hooks, roda `node scripts/doctor.mjs` e grava o manifesto em `~/.claude-toolkit/`. Login, senha e Touch ID ficam com você: o agente para e avisa quando precisar.

Para conferir sozinho, sem agente:

```bash
node scripts/doctor.mjs
```

## 02. Projeto existente

Dentro do projeto:

```text
Leia https://raw.githubusercontent.com/gabrielkashimarki/claude-code-toolkit/main/prompts/02-projeto-existente.md
e execute integralmente o bloco da seção "Prompt" neste projeto.
```

Faz diagnóstico, liga `AGENTS.md` e `CLAUDE.md` numa fonte só, configura o que se aplica e termina sugerindo de 3 a 8 rodadas de revisão.

## 03. O que vem no kit

| Camada | Peças | Para quê |
|---|---|---|
| Processo | superpowers, feature-dev | Brainstorm, plano, TDD, verificação antes de dizer "pronto" |
| Estilo | ponytail, caveman | Menos código, menos texto, sem perder segurança |
| Delegação | codex, agy | Segunda opinião e trabalho mecânico fora da cota do Claude |
| Contexto e tokens | graphify, Context7, RTK, hook de handoff | Ler menos, gastar menos, não perder a sessão quando o contexto enche |
| Segurança | claude-security, semgrep | Varredura e regra estática |
| Memória | `CLAUDE.md` global, memória do Claude, vault Obsidian | Cada fato num lugar só |
| Segredos | 1Password CLI (`op run`, `op inject`) | Nenhum segredo em arquivo, chat ou log |
| Interface e mídia | impeccable, chrome-devtools-mcp, remotion, get-brolls, crv | Front, performance, vídeo |
| Escrita | humanizer-ptbr | Texto em PT-BR sem cheiro de IA |

Detalhe de cada um em [docs/ferramentas](docs/ferramentas/README.md).

## 04. Pré-requisitos, resumo

| | macOS | Windows |
|---|---|---|
| Gerenciador | Homebrew | winget |
| Base | git, gh, jq | Git for Windows (traz o bash), gh, jq |
| Runtimes | Node 22+ (fnm), Python 3.11 a 3.13, uv | iguais |
| Agentes | Claude Code, Codex CLI, agy | iguais |
| Segredos | 1Password CLI | igual |

Comandos de instalação, opcionais e o que não roda no Windows: [docs/01-pre-requisitos.md](docs/01-pre-requisitos.md).

## 05. Global ou projeto

| Vai no global (`~/.claude`) | Vai no projeto |
|---|---|
| Plugins, skills de uso geral, hooks de sessão, MCPs pessoais | `AGENTS.md`, `CLAUDE.md` com `@AGENTS.md`, `.mcp.json` do projeto, regras de lint |
| `CLAUDE.md` com preferências pessoais | Comandos canônicos (instalar, testar, build) |
| Memória do Claude | Nada de segredo: só referências `op://` |

## 06. Estrutura

```text
docs/            pré-requisitos, como funciona, catálogo de ferramentas
prompts/         prompts para colar no agente
templates/       AGENTS.md, CLAUDE.md, settings.json, .mcp.json, manifesto, Next + Supabase
hooks/           handoff automático por tamanho de contexto (bash + jq)
skills/          skills próprias: handoff-auto, humanizer-ptbr
scripts/         doctor.mjs (confere a máquina), validar.mjs (CI do kit), agy-conta.sh e agy-rodar.sh (contas agy)
```

## Créditos e licença

- Estrutura, prompts de setup e de projeto existente, manifesto e a convenção de 3 a 8 revisões adaptados do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit), Copyright (c) 2026 Matheus Gomes, MIT.
- `humanizer-ptbr` deriva do [humanizer](https://github.com/blader/humanizer), de blader, MIT.
- Plugins e skills de terceiros não são copiados para cá: o kit aponta a fonte oficial e cada um segue a licença própria.

Licença MIT, ver [LICENSE](LICENSE).
