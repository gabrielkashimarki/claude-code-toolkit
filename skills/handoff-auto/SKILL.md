---
name: handoff-auto
description: Gera o documento de handoff da sessão atual e entrega a sessão nova já trabalhando com ele, em background quando roda no terminal, ou como prompt pronto para colar quando roda no Claude Code desktop. Use quando o hook de contexto avisar que a sessão passou do limiar de tokens, quando o usuário pedir para passar o bastão, ou quando o contexto estiver claramente perto do limite.
---

# Handoff automático de sessão

Objetivo: encerrar a sessão atual sem perder contexto. Você escreve um documento
de passagem de bastão e a sessão nova começa a trabalhar a partir dele. Como essa
sessão nova é aberta depende de onde você está rodando, ver o passo 2.

## Passos

1. **Escreva o documento** em `~/.claude/handoffs/AAAA-MM-DD-HHMM-<slug>.md`,
   com `<slug>` descrevendo o trabalho (ex: `2026-08-20-1430-hook-handoff.md`).
   Use a data e a hora reais (`date +%Y-%m-%d-%H%M`).

1b. **Registre a sessão onde o usuário guarda histórico ANTES de abrir a sessão nova**
   (nota de sessão no vault, log do projeto, o que o `CLAUDE.md` global mandar). Se a
   nota do dia sobre o mesmo assunto já existe, atualize em vez de criar outra.
   Conteúdo: o que mudou e por quê, com commits e caminhos; aponte o handoff para o
   que ficou pendente. Se esse destino é um repositório git, faça commit e push. Se
   falhar, diga isso no aviso do passo 3.

2. **Veja onde você está rodando** antes de abrir a sessão nova:

   ```
   echo $CLAUDE_CODE_ENTRYPOINT
   ```

   **Terminal** (`cli` ou vazio): abra a sessão nova em background, do diretório
   de trabalho atual.

   ```
   claude --bg --name "<nome curto do trabalho>" "Leia <caminho absoluto do handoff> e continue o trabalho descrito ali."
   ```

   O `--name` é obrigatório e aparece na lista de agentes (`claude agents`).

   **Desktop** (`claude-desktop`): não dispare `claude --bg`. O agente nasceria na
   lista do CLI, que a interface do desktop não enxerga. Em vez disso, entregue o
   prompt pronto para o usuário colar numa sessão nova do desktop.

   ```
   Leia <caminho absoluto do handoff> e continue o trabalho descrito ali.
   ```

3. **Avise o usuário** em uma ou duas linhas: caminho do arquivo, o que ficou
   pendente e, no terminal, o nome do agente; no desktop, o prompt para colar.

4. **Pare de trabalhar nesta sessão.** O handoff existe porque o contexto está
   perto do limite; continuar aqui queima justamente o que sobrou. Depois de avisar,
   não inicie tarefa nova, não abra arquivo novo, não rode comando de investigação.
   Se estiver no meio de uma operação que não pode ficar pela metade (escrita de
   arquivo, commit, push), termine só ela, registre o resultado no documento e pare.

   Termine a resposta com a instrução de retomada, conforme o entrypoint:

   **Terminal**: o agente em background já está trabalhando. Diga que esta sessão
   pode ser encerrada e que o acompanhamento é por `claude agents`.

   **Desktop**: ofereça as duas saídas e deixe a escolha com o usuário.

   - Sessão nova: abrir uma janela nova e colar o prompt do passo 2.
   - Mesma sessão: rodar `/clear` e então colar o prompt do passo 2. O `/clear`
     zera o contexto, então o documento de handoff passa a ser a única memória
     do trabalho; só faça isso depois de confirmar que o arquivo foi escrito.

   `/clear` é comando de interface, você não consegue rodar. Peça para o usuário rodar.

## O que o documento precisa ter

- **Objetivo**: o que o usuário pediu, na linguagem dele.
- **Estado atual**: onde o trabalho parou, o que está rodando, o que está quebrado.
- **Já feito**: decisões tomadas e por quê, com os fatos verificados (IDs, caminhos,
  números). O que foi testado e o resultado real, sem otimismo.
- **Próximos passos**: lista ordenada e acionável. Separe **fato medido** (com número,
  data e como foi medido) de **plano**. Todo plano ainda não testado leva a etiqueta
  "(a validar)" e o motivo da dúvida, para a sessão seguinte conferir antes de executar.
- **Armadilhas**: o que já falhou nesta sessão e não deve ser tentado de novo.
- **Arquivos e comandos**: caminhos absolutos, comandos que já funcionaram, branches
  e commits.
- **Skills sugeridas**: quais skills a próxima sessão deve invocar.

## Regras

- Escreva no idioma do usuário, sem travessão.
- Não repita o que já está em outro artefato (spec, plano, commit, diff). Aponte o caminho.
- Nunca copie segredo para o documento. Cite a referência `op://Cofre/Item/campo`,
  jamais o valor.
- O documento vira o ponto de partida de outro agente. Se uma informação não estiver
  ali, ela se perde.
