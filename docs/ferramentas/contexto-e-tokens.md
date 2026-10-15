# Contexto e tokens

## Hook de handoff

Mede o contexto da conversa pelo transcript e, quando passa do limiar, pede ao Claude a skill [handoff-auto](../../skills/handoff-auto/SKILL.md): ela escreve o documento de passagem e abre a sessão nova.

- No meio de uma tarefa (`PostToolUse`), o hook só avisa, uma vez: cortar ali perderia o trabalho em andamento.
- No fim do turno (`Stop`), ele pede o handoff de fato.
- O limiar conta só os **tokens de conversa**: total menos o piso do primeiro turno (prompt de sistema, schemas, MCPs). Sem esse desconto, uma sessão com muitos MCPs dispararia na primeira chamada de ferramenta.
- O padrão é 250.000 tokens. Mude com `CLAUDE_HANDOFF_LIMIAR`.
- Para desligar numa sessão, digite `handoff off`. Para religar, `handoff on`.

Instalar:

```bash
mkdir -p ~/.claude/hooks ~/.claude/skills
cp hooks/handoff-*.mjs ~/.claude/hooks/
cp -R skills/handoff-auto ~/.claude/skills/
node hooks/teste-handoff.mjs
```

Depois junte o bloco `hooks` de [templates/settings.json.example](../../templates/settings.json.example) ao seu `~/.claude/settings.json`, sem apagar hooks que já existem. Só precisa de Node, que a base já tem: roda igual no macOS e no Windows, sem bash e sem jq. Se der erro, o hook sai calado, sem quebrar a sessão.

## RTK

Proxy que compacta a saída de comandos comuns (`git`, `ls`, testes, build) antes de ela chegar ao modelo.

```bash
brew install rtk-ai/tap/rtk      # Windows: binário da release oficial
rtk init --global                # integra no Claude Code
rtk gain                         # quanto economizou
rtk proxy <comando>              # roda sem compactar quando precisar da saída original
```

Confira se ficou um hook só: wrapper e hook juntos compactam duas vezes. Meça o antes e o depois com `rtk gain` antes de manter.

## Graphify

Grafo do repositório para perguntas de estrutura ("quem chama X", "o que depende de Y") sem reler arquivo por arquivo.

- `graphify extract . --code-only --no-cluster` monta o grafo só do código, sem chamar LLM e sem gastar token.
- Crie um `.graphifyignore` com segredos, dependências, skills vendorizadas e arquivos gerados ([exemplo](../../templates/graphifyignore.example)).
- `GRAPHIFY_NO_AUTO_REFRESH=1` evita atualização automática quando você não quer.
- Grafo velho induz a erro. Se o código mudou muito, regenere antes de confiar.

## Context7

Documentação atual de biblioteca, por MCP ([instalar](mcps.md#base-do-kit)). Primeiro resolva o id da biblioteca, depois consulte um conceito por vez. Vale mais que o treino do modelo para API que muda rápido (Next, Supabase, SDKs de IA).

## Caveman e ponytail

- **caveman** encurta a prosa da resposta e mantém código, commit e documentação normais.
- **ponytail** corta o código que não precisava existir.

Os dois vêm como plugin ([plugins](plugins.md)). Não copie as regras deles para o `CLAUDE.md`. Um resumo das regras do ponytail em texto, medido em teste, gerou 30% mais código do que não ter regra nenhuma.

## Medir o piso

O primeiro `usage` do transcript (`~/.claude/projects/<projeto>/<sessão>.jsonl`) é o custo fixo de cada sessão. Plugin, MCP e `CLAUDE.md` grandes sobem esse número. Antes de ligar algo novo, anote o piso. Depois de ligar, compare.
