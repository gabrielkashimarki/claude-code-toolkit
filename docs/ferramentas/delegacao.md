# Delegação: Codex e agy

O modelo principal (Claude) desenha, revisa e cuida da lógica difícil. Trabalho mecânico vai para outro agente, que usa outra cota e devolve um diff para o Claude revisar.

| Tipo de trabalho | Quem |
|---|---|
| Arquitetura, segurança, dados, concorrência, diagnóstico ambíguo | Claude, no modelo da sessão |
| Aplicar plano já decidido, renomear, migrar padrão, gerar variações | agy, com `gemini-3.8-flash-high` |
| Segunda implementação, diagnóstico paralelo, revisão independente | Codex |
| Busca e inventário no código | subagente leve do próprio Claude (ex: `Explore`) |

## Codex

Instale o CLI e o plugin:

```bash
npm i -g @openai/codex
codex login
claude plugin marketplace add openai/codex-plugin-cc
claude plugin install codex@openai-codex
```

Dentro do Claude Code, `/codex:rescue` manda a tarefa para o Codex. O Codex lê o `AGENTS.md` do projeto. Por isso o `CLAUDE.md` do projeto deve conter só `@AGENTS.md` e o que for exclusivo do Claude ([template](../../templates/CLAUDE.md.template)).

Use o plugin, não um MCP do Codex: os dois juntos duplicam ferramenta e contexto.

## agy (Antigravity CLI)

Instalação em [pré-requisitos](../01-pre-requisitos.md#delegação-recomendado). Uso não interativo:

```bash
agy -p "<pedido com objetivo, arquivos e critério de aceite>" \
  --model <id> --add-dir <repo> --dangerously-skip-permissions --print-timeout 120m
```

- `agy models` lista os ids. Eles variam por conta: com id inválido o agy imprime a lista e sai sem fazer nada.
- **Modelo:** trabalho mecânico vai no `gemini-3.8-flash-high`. Não use o Gemini Pro nem o Claude de dentro do agy para lógica: lógica fica com o Claude da sessão, que também planeja e revisa. É o padrão do `agy-rodar.sh`.
- O agy não guarda estado. Retomar uma tarefa é despachar de novo com o pedido, o relatório anterior e o `git diff`.
- Ele também gera e edita imagem pela cota do plano: peça "use sua ferramenta de geração de imagem" e passe a pasta com `--add-dir`.
- No modo de permissão automático, o classificador do Claude Code pode barrar a chamada ao agy. Libere `Bash(agy:*)` nas permissões.

### Várias contas ao mesmo tempo (só macOS)

Trocar só o `HOME` não separa as contas, porque o login fica no Keychain, num item único. O [scripts/agy-conta.sh](../../scripts/agy-conta.sh) roda o agy num sandbox que proíbe o acesso ao Keychain. Assim cada conta usa o arquivo de token do próprio `HOME`:

```bash
scripts/agy-conta.sh conta2 --logar
scripts/agy-conta.sh conta2 -p "..." --model <id> --add-dir <repo>
```

No Windows não existe `sandbox-exec`. Use uma conta só, ou um usuário do Windows por conta.

### Revezar contas e pular a que ficou sem cota

O [scripts/agy-rodar.sh](../../scripts/agy-rodar.sh) escolhe a conta por você:

```bash
AGY_CONTAS="principal conta2 conta3" scripts/agy-rodar.sh \
  -p "<pedido>" --add-dir <repo> --dangerously-skip-permissions --print-timeout 120m
```

- Cada chamada começa na conta seguinte à da anterior, espalhando o uso.
- Antes de despachar, confere em `models` se a conta tem o modelo. Se não tiver, pula.
- Se a saída trouxer "Individual quota reached", tenta a próxima conta. O pedido ganha um aviso para conferir `git status` e `git diff` antes de começar, porque a conta anterior pode ter deixado trabalho pela metade.
- Sai com 75 quando nenhuma conta tem cota e o modelo.
- Sem `AGY_CONTAS`, usa `principal` mais as pastas `~/agy-*`. Sem `--model`, usa `AGY_MODELO`, que por padrão é `gemini-3.8-flash-high`.
- Sem `agy-conta` (Windows, Linux), roda o agy direto numa conta só.

A cota volta em algumas horas. Conta que esgotou continua na lista e é pulada até voltar.

## Regras para qualquer agente delegado

- Cada agente trabalha no próprio worktree git (`superpowers:using-git-worktrees`).
- Um escritor por arquivo. Lockfile, configuração compartilhada e operação de git ficam com o coordenador.
- Repasse no pedido a regra de sessões paralelas: reler o arquivo antes de escrever e editar só o trecho, nunca reescrever o arquivo inteiro.
- O pedido leva objetivo, contexto mínimo, arquivos permitidos, critério de aceite e os comandos de checagem.
- "Terminei" não vale como prova. O coordenador lê o diff e roda os checks.
- Se o agente cair no meio (cota, rede), o que foi commitado fica. O resto está no disco: retome em outra conta a partir do `git diff`.

## Revisão em rodadas

Ao fim de cada ciclo de implementação, sugira de 3 a 8 rodadas de revisão. O número depende do tamanho e do risco da mudança, e cada rodada tem um foco diferente: requisitos, regressão e testes, segurança e dados, integração, UX, desempenho, clareza. A faixa é convenção do kit, não garantia. Convenção adaptada do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit).
