# Navegador

Quatro jeitos de o agente usar um navegador, cada um para um lugar:

| Ferramenta | Onde roda | Melhor para |
|---|---|---|
| Browser do app (Claude desktop) | só nas sessões do Claude desktop | ver e testar o app local com você olhando junto |
| Claude in Chrome | o seu Chrome, com os seus logins | tarefa que precisa da sua conta logada |
| chrome-devtools-mcp | qualquer cliente MCP | console, rede, performance, Core Web Vitals |
| **agent-browser** | qualquer agente com terminal: agy, Codex, runner no servidor, CI | automação sem tela e sem MCP |

Na sessão do Claude desktop, prefira o browser do app. O agent-browser entra onde os outros não chegam.

## agent-browser

CLI da Vercel ([vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)) que controla um Chrome pelo DevTools Protocol. Ele lê a página pela árvore de acessibilidade e devolve referências curtas (`@e1`, `@e2`) para clicar e preencher. É a mesma ideia do browser do app, só que num comando de terminal.

Vantagens sobre um MCP de navegador:
- **Funciona em qualquer agente:** o agy e o Codex só precisam rodar comando.
- **Não gasta contexto parado:** MCP carrega a descrição das ferramentas em toda sessão, e o CLI só custa quando é usado.
- **Roda sem tela:** serve para o runner no servidor e para a CI.

### Instalar

```bash
npm i -g agent-browser
agent-browser install          # baixa um Chrome próprio (cerca de 180 MB) em ~/.agent-browser
agent-browser --version
```

O npm pode avisar que bloqueou os scripts de instalação do pacote. O `agent-browser install` faz o download do Chrome do mesmo jeito.

### Usar

```bash
agent-browser open localhost:3000
agent-browser snapshot              # árvore de acessibilidade com as referências @eN
agent-browser click @e3
agent-browser fill @e4 "texto"
agent-browser screenshot tela.png   # --full para a página inteira, --annotate numera os elementos
agent-browser close
```

- Tire um snapshot novo depois de qualquer ação que muda a página. A referência só vale para o snapshot de onde veio, e uma referência velha pode apontar para o elemento errado sem dar erro.
- Quando a ação parece não fazer nada, quase sempre a página ainda estava carregando. Tire um snapshot de conferência antes de repetir.
- A referência completa sai do próprio CLI, na versão instalada: `agent-browser skills get core` (e `--full`). Não copie o manual para dentro do projeto.

Extras, carregados sob demanda com `agent-browser skills get <nome>`: `electron` (apps desktop), `derive-client` (gera cliente de API a partir do tráfego gravado), `dogfood` (exploração de QA), `protected-vercel-deployments` (preview protegido da Vercel), `slack`.

### Num pedido para o agy ou o Codex

Acrescente ao pedido:

```text
Para conferir no navegador, use o agent-browser: rode "agent-browser skills get core" antes, teste só contra o servidor local (nunca produção), tire snapshot novo depois de cada ação e feche com "agent-browser close" no fim.
```

### Cuidados

- O Chrome do agent-browser é separado do seu: sem os seus logins. Não passe senha real no pedido. Para testar login, use conta de teste do próprio projeto.
- Não aponte para produção nem para painel de cliente sem pedir antes.
