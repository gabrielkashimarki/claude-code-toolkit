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
| flow-studio | gerar vídeo e imagem no Google Flow pela cota do plano | clonar [mcp-google-flow](https://github.com/felipedamacenoteodoro/mcp-google-flow), build, `claude mcp add --scope user flow-studio -- node <clone>/dist/main.js` |
| Hostinger | DNS, VPS e sites da Hostinger | `npx hostinger-api-mcp@latest` com o padrão `op run` |
| Figma, Vercel | design e deploy | vêm nos plugins `figma` e `vercel-plugin` (OAuth) |

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
