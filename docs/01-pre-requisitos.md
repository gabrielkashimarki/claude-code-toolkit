# Pré-requisitos por sistema

O [prompt 01](../prompts/01-preparar-maquina.md) instala tudo isto sozinho. Esta página serve para quem quer saber antes o que vai entrar na máquina, ou instalar na mão.

Depois de instalar, confira com:

```bash
node scripts/doctor.mjs
```

## Base obrigatória

Sem estes itens o kit não funciona: os hooks não rodam, os plugins não carregam e o agente fica sem as ferramentas.

| Ferramenta | Para quê | macOS | Windows (PowerShell) |
|---|---|---|---|
| Gerenciador | instalar o resto | [Homebrew](https://brew.sh) | winget (já vem no Windows 11) |
| git | tudo | `brew install git` | `winget install Git.Git` |
| bash | hooks e scripts | já vem | vem com o Git for Windows (Git Bash) |
| gh | PR, issue, repo | `brew install gh` | `winget install GitHub.cli` |
| fnm + Node 22+ | hooks dos plugins, Codex, MCPs via npx | `brew install fnm` e `fnm install --lts` | `winget install Schniz.fnm` e `fnm install --lts` |
| Python 3.11 a 3.13 | claude-security, graphify, skills de vídeo | `brew install python@3.13` | `winget install Python.Python.3.13` |
| uv | instalar CLIs Python isoladas | `brew install uv` | `winget install astral-sh.uv` |
| Claude Code | agente principal | `curl -fsSL https://claude.ai/install.sh \| bash` | `irm https://claude.ai/install.ps1 \| iex` |
| Codex CLI | segunda opinião, plugin codex | `npm i -g @openai/codex` | igual |
| 1Password CLI | segredos por referência `op://` | `brew install 1password-cli` | `winget install AgileBits.1Password.CLI` |

O Node fica pelo fnm para cada projeto poder pedir a própria versão (`.node-version`, `.nvmrc`). No Windows, ponha `fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression` no perfil do PowerShell, e `eval "$(fnm env --use-on-cd)"` no `~/.bashrc` do Git Bash.

## Delegação (recomendado)

| Ferramenta | Para quê | macOS | Windows |
|---|---|---|---|
| Antigravity CLI (`agy`) | trabalho mecânico na cota do plano Google, não na do Claude | `curl -fsSL https://antigravity.google/cli/install.sh \| bash` | `irm https://antigravity.google/cli/install.ps1 \| iex` |

O `agy` é binário nativo: **não precisa de Node**. Instala em `~/.local/bin`. Não confunda com o app desktop Antigravity, que é outro produto. Para rodar várias contas Google ao mesmo tempo, ver [delegação](ferramentas/delegacao.md): o jeito que funciona no Mac usa o Keychain e o `sandbox-exec`, que não existem no Windows.

## Por skill (instale só se for usar)

| Ferramenta | Quem usa | macOS | Windows |
|---|---|---|---|
| ffmpeg (com libass e freetype) | remotion, get-brolls, crv, video-use | `brew install ffmpeg` | `winget install Gyan.FFmpeg` |
| yt-dlp | get-brolls, crv, agent-reach | `brew install yt-dlp` | `winget install yt-dlp.yt-dlp` |
| graphify | skill graphify | `uv tool install graphifyy` | igual |
| agent-reach | skill agent-reach | `uv tool install agent-reach` | igual |
| crv | skill claude-real-video | `uv tool install "claude-real-video[whisper]"` | igual |
| semgrep | skill semgrep | `brew install semgrep` | só via WSL ou Docker |
| Google Chrome | chrome-devtools-mcp, web-perf | `brew install --cask google-chrome` | `winget install Google.Chrome` |
| RTK | corta tokens da saída de comandos | `brew install rtk-ai/tap/rtk` | binário da [release oficial](https://github.com/rtk-ai/rtk/releases) |
| Docker | semgrep alternativo, bancos locais | `brew install colima docker docker-compose` (ou Docker Desktop) | `winget install Docker.DockerDesktop` |
| ripgrep, fd | busca rápida | `brew install ripgrep fd` | `winget install BurntSushi.ripgrep.MSVC sharkdp.fd` |
| jq | aia-harness, scripts de terminal que leem JSON | `brew install jq` | `winget install jqlang.jq` |
| agent-browser | navegador por CLI para agente ([ficha](ferramentas/navegador.md)) | `npm i -g agent-browser` e `agent-browser install` | igual |
| pnpm | projetos que pedem pnpm | `corepack enable pnpm` | igual |

## O que não roda no Windows (e o que fazer)

| Item | Problema | Saída |
|---|---|---|
| Hooks do superpowers e do claude-security | precisam de bash (os hooks de handoff do kit são Node e não precisam) | Instale o Git for Windows. Sem ele o hook do superpowers falha calado. |
| `python3` nos hooks do claude-security e do hookify | no Windows o comando costuma ser `python` ou `py` | Rode `python3 --version` no Git Bash. Se falhar, desative o alias da Microsoft Store em "Aliases de execução do aplicativo" e reinstale pelo winget. |
| Skills instaladas como symlink | Windows exige Modo de Desenvolvedor | Ligue o Modo de Desenvolvedor ou instale com `--copy` (`npx skills add ... --copy`). |
| Caminho absoluto `/Users/...` em `settings.json` ou `.mcp.json` | não existe no Windows | Use `$HOME` ou `~`. O `validar.mjs` reprova caminho absoluto neste repo. |
| `agy-conta` (várias contas agy em paralelo) | depende do Keychain e do `sandbox-exec` | No Windows, uma conta só, ou uma conta por usuário do Windows. |
| semgrep nativo | suporte fraco | WSL ou `docker run semgrep/semgrep`. |
| Skills que só existem no Mac (controle do iPhone por espelhamento, `sips`) | dependem do macOS | Não instale no Windows. |

## Variáveis de ambiente

Nenhuma é obrigatória para o kit. Algumas skills pedem chave própria (ex: `PEXELS_API_KEY`, `ELEVENLABS_API_KEY`). Guarde no 1Password e passe por referência: ver [memória e segredos](ferramentas/memoria-e-segredos.md).

| Variável | Quem usa | Padrão |
|---|---|---|
| `CLAUDE_HANDOFF_LIMIAR` | hook de handoff | `250000` tokens de conversa |
