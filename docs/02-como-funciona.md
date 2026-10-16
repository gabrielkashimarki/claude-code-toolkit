# Como o kit funciona

## A ideia

Três regras seguram o resto:

1. **O Claude pensa, outro agente digita.** Desenho, revisão e lógica difícil ficam com o modelo principal. Trabalho mecânico (aplicar um plano já decidido, renomear, gerar variações) vai para o `agy` ou o Codex, que usam outra cota.
2. **Cada fato mora num lugar só.** Regra repetida em três arquivos diverge em uma semana.
3. **Contexto é dinheiro.** Toda ferramenta aqui ou economiza leitura (graphify, Context7, RTK) ou salva a sessão quando o contexto enche (hook de handoff).

## Uma tarefa, do pedido ao commit

| Etapa | Quem faz | Peça |
|---|---|---|
| Entender o pedido e desenhar | Claude | `superpowers:brainstorming` |
| Escrever o plano | Claude | `superpowers:writing-plans` |
| Executar tarefas mecânicas do plano | agy ou Codex, cada um no próprio worktree | [delegação](ferramentas/delegacao.md) |
| Manter o código mínimo | todos | ponytail |
| Conferir antes de dizer "pronto" | Claude | `superpowers:verification-before-completion` |
| Revisar | Claude + Codex | de 3 a 8 rodadas, foco diferente em cada |
| Segurança | Claude | claude-security, semgrep |

## Onde cada coisa mora

| O quê | Onde | Por quê |
|---|---|---|
| Preferências pessoais (idioma, estilo de commit, o que pedir antes) | `~/.claude/CLAUDE.md` | Vale para todo projeto |
| Fato técnico sobre a máquina ou a infra | memória do Claude (`~/.claude/projects/<projeto>/memory/`), com `MEMORY.md` como índice curto | Só o índice entra na sessão; o resto é lido sob demanda |
| Regra do projeto (comandos, stack, limites) | `AGENTS.md` na raiz do projeto | Claude, Codex e agy leem o mesmo arquivo |
| Particularidade só do Claude | `CLAUDE.md` do projeto, começando com `@AGENTS.md` | Sem cópia do `AGENTS.md` |
| Spec, plano, nota de sessão | vault Obsidian (ou pasta de docs fora do repositório) | Repositório guarda código, vault guarda história |
| Passagem entre sessões | `~/.claude/handoffs/` | Descartável; o que importa vai para a nota de sessão |
| Segredo | 1Password | No arquivo vai só `op://Cofre/Item/campo` |

## Entregar arquivo no Mac

Quando o Claude salva um arquivo que você vai abrir, importar ou anexar em outro app, peça no `~/.claude/CLAUDE.md` que ele rode `open -R <caminho>` depois de salvar. É um comando nativo do macOS: abre o Finder com o arquivo já selecionado e não executa nada. Não precisa instalar nada.

## Global ou projeto

Plugin, skill de uso geral e hook de sessão vão no global (`~/.claude`), porque servem a todo projeto. O que depende da stack (lint, skills de framework, MCP do banco) vai no projeto. Skill instalada nos dois lugares carrega duas vezes e gasta contexto à toa: o prompt 02 procura e remove duplicata.

## Economia de contexto

| Peça | Corta o quê |
|---|---|
| caveman | prosa da resposta (código, commit e doc continuam normais) |
| ponytail | código que não precisava existir |
| graphify | releitura do repositório para perguntas de estrutura |
| Context7 | busca na web por documentação de biblioteca |
| RTK | saída longa de `git`, `ls`, testes e build |
| hook de handoff | sessão que morre no meio por contexto cheio |
| `MEMORY.md` curto | memória carregada sem necessidade |

Meça antes de acreditar. O piso de uma sessão (prompt de sistema, schemas de ferramenta, MCPs) aparece no primeiro `usage` do transcript, e é o mesmo número que o hook de handoff desconta. Cada MCP e cada plugin ligado sobe esse piso.
