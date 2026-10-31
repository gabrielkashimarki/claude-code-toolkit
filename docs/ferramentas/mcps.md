# MCPs

MCP liga o agente a um serviço (documentação, navegador, API). Cada servidor ligado põe os schemas das ferramentas no contexto de toda sessão, então ligue só o que usa.

Escopos do `claude mcp add`:

- `--scope user`: vale para todos os projetos (fica em `~/.claude.json`).
- `--scope project`: grava em `.mcp.json` na raiz e vai para o git.
- `local` (padrão): só para você, só neste projeto.

## Base do kit

| MCP | Para quê | Instalar |
|---|---|---|
| Context7 | documentação atual de biblioteca e API | `claude mcp add --scope user --transport http context7 https://mcp.context7.com/mcp` |
| chrome-devtools | console, rede, performance, Core Web Vitals | `claude mcp add --scope user chrome-devtools -- npx -y chrome-devtools-mcp@latest` |

O Context7 funciona sem chave, com limite menor. Com chave, guarde no 1Password e passe o header `CONTEXT7_API_KEY` pelo padrão `op run` (abaixo). Nunca mande segredo nem código privado na consulta.

## Opcionais

| MCP | Para quê | Instalar |
|---|---|---|
| rea | engenharia reversa de binário, bundle web e app | `npm i -g rea-agents` e `claude mcp add --scope user rea -- rea mcp` ([fonte](https://github.com/morluto/rea)) |
| flow-studio | gerar vídeo e imagem no Google Flow pela cota do plano | ver [flow-studio](#flow-studio) abaixo |
| Hostinger | DNS, VPS e sites da Hostinger | `npx hostinger-api-mcp@latest` com o padrão `op run` |
| Figma, Vercel | design e deploy | vêm nos plugins `figma` e `vercel-plugin` (OAuth) |

### flow-studio

Usa o site do [Google Flow](https://flow.google.com) (Veo) num perfil próprio do Chrome, com a conta Google logada. Gasta os créditos do plano, não API. Precisa de Node 22+ e Google Chrome.

```bash
git clone https://github.com/felipedamacenoteodoro/mcp-google-flow.git ~/mcp-google-flow
cd ~/mcp-google-flow && npm ci && npm run build
mkdir -p ~/FlowStudio/input ~/FlowStudio/output
claude mcp add --scope user flow-studio \
  -e FLOW_MCP_MAX_CREDITS=30 \
  -e FLOW_MCP_PAID_PER_HOUR=4 \
  -e FLOW_MCP_LANGUAGE=pt-BR \
  -e FLOW_MCP_INPUT_DIRS="$HOME/FlowStudio/input" \
  -e FLOW_MCP_OUTPUT_DIR="$HOME/FlowStudio/output" \
  -- node "$HOME/mcp-google-flow/dist/main.js"
```

- **Limites:** o padrão do repositório é 100 créditos por sessão e 10 ações pagas por hora. Os valores acima seguram o gasto até alguém pedir mais. Toda geração devolve o preço antes e só gasta com `confirm=true`.
- **Pastas:** o upload só aceita arquivo de `FLOW_MCP_INPUT_DIRS` (várias separadas por `:`, ou `;` no Windows). Para usar referências de um projeto, acrescente a pasta dele.
- **Login:** peça ao agente `flow_sign_in`. Ele abre um Chrome comum, sem automação, e a pessoa entra na conta Google à mão. O Google recusa login em navegador automatizado, e o servidor nunca vê a senha.
- **Conferir sem gastar:** `flow_session_info` e `flow_list_options`.
- **Atualizar:** `git pull && npm ci && npm run build` no clone, depois reinicie a sessão.

Gmail, Google Calendar, Google Drive e Notion entram como conectores do claude.ai (Configurações, Conectores) e não precisam de instalação local.

## MCP com segredo: o padrão `op run`

Nada de token em `~/.claude.json` nem em `.mcp.json`. O processo do MCP sobe dentro do `op run`, que troca as referências `op://` pelos valores só na memória do processo:

```bash
claude mcp add --scope user hostinger \
  -e API_TOKEN=op://MeuCofre/Hostinger/credential \
  -- op run --no-masking -- npx -y hostinger-api-mcp@latest
```

O arquivo de configuração fica só com a referência. Detalhes da conta de serviço e do limite diário de requisições em [memória e segredos](memoria-e-segredos.md).

No Windows, o `op` precisa estar no PATH do processo que abre o Claude Code. Não use caminho absoluto do macOS (`/Users/...`, `/opt/homebrew/...`) em configuração que vai para outra máquina.

## MCPs internos

MCP que fala com sistema de cliente (anúncios, CRM, reservas, base de conhecimento da empresa) fica fora deste repositório. Siga o mesmo padrão: repositório privado, segredo por `op run` e ferramenta de escrita (criar campanha, mudar orçamento, mandar mensagem) separada da de leitura, para o agente poder ler sem pedir e só pedir antes de escrever.

Modelo de `.mcp.json` de projeto em [templates/mcp.json.example](../../templates/mcp.json.example).
