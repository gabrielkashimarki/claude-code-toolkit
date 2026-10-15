# Skills

Skill é uma pasta com `SKILL.md`. Global fica em `~/.claude/skills/<nome>/`; de projeto, em `.claude/skills/<nome>/`. O Claude carrega só a descrição; o corpo entra quando a skill é usada.

## Próprias (vêm neste repositório)

| Skill | O que faz | Instalar |
|---|---|---|
| [handoff-auto](../../skills/handoff-auto/SKILL.md) | Escreve o documento de passagem e abre a sessão nova quando o contexto enche. Trabalha junto com os [hooks de handoff](contexto-e-tokens.md#hook-de-handoff) | copiar `skills/handoff-auto` para `~/.claude/skills/` |
| [humanizer-ptbr](../../skills/humanizer-ptbr/SKILL.md) | Tira padrão de texto de IA em PT-BR (33 padrões, sem travessão) | copiar `skills/humanizer-ptbr` para `~/.claude/skills/` |

No Windows, copie a pasta em vez de criar symlink.

## De terceiros (instale da fonte)

| Skill | Fonte | Instalar | Precisa |
|---|---|---|---|
| graphify | [graphifyy](https://pypi.org/project/graphifyy/) | `uv tool install graphifyy` e `graphify install` (ver nota abaixo) | Python, uv |
| semgrep | [trailofbits/skills](https://github.com/trailofbits/skills) | `npx skills add trailofbits/skills --skill semgrep --agent claude-code` | semgrep CLI (WSL ou Docker no Windows) |
| impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `npx skills add pbakaus/impeccable` | Node |
| remotion-best-practices | [remotion-dev/skills](https://www.remotion.dev/docs/ai/skills) | `npx skills add remotion-dev/skills --skill remotion-best-practices` | Node, ffmpeg |
| find-skills | [vercel-labs/skills](https://github.com/vercel-labs/skills) | `npx skills add vercel-labs/skills --skill find-skills` | Node |
| agent-reach | [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | `uv tool install agent-reach` | Python, uv, curl |
| get-brolls | [engenheirodevideo/get-brolls](https://github.com/engenheirodevideo/get-brolls) | `scripts/install.sh` ou `install.ps1` do próprio repo | Python 3.11+, Node 22+, ffmpeg, git |
| claude-real-video (crv) | pacote `claude-real-video` | `uv tool install "claude-real-video[whisper]"` | Python 3.10+, ffmpeg |
| video-use | [browser-use/video-use](https://github.com/browser-use/video-use) | `uv sync` no clone | Python 3.10+, ffmpeg com libass |

O `graphify install` também escreve um bloco no `~/.claude/CLAUDE.md` e hooks de `PreToolUse`. O bloco entra em toda sessão; se o roteamento pela descrição da skill bastar, apague o bloco e meça o piso de contexto antes e depois.

Confira o nome e o autor antes de instalar. Pacote com nome parecido não é o mesmo pacote.

Os comandos `npx skills add` aceitam `--agent claude-code codex` para instalar nos dois agentes de uma vez, e `--copy` para não depender de symlink no Windows.

## Skills de cliente (não vêm aqui)

Skill que carrega playbook, ID de conta ou credencial de cliente fica no repositório privado de configuração (`~/.claude` versionado), nunca neste. Padrão que funciona:

- O `SKILL.md` aponta para onde está a verdade do cliente (vault, banco, Drive) em vez de copiar o conteúdo.
- Credencial entra por `op://`, lida na hora pela skill.
- Escrita em sistema do cliente (anúncio, CRM, mensagem) sempre pede confirmação.

## Só macOS

| Skill | Por quê |
|---|---|
| controle do iPhone pelo espelhamento | usa iPhone Mirroring, pyobjc e permissão de Acessibilidade |
| skills que chamam `sips` ou `osascript` | comandos do macOS |
