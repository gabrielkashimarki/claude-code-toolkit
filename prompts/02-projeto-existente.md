# Prompt 02: adotar o kit num projeto existente

Prepara um projeto que já existe para trabalhar com o kit: uma fonte só de instruções para Claude, Codex e agy, as ferramentas que se aplicam, checks que dá para rodar e revisão em rodadas. Também serve para atualizar um projeto que adotou uma versão antiga.

Pressupõe a máquina pronta ([prompt 01](01-preparar-maquina.md)).

## Como usar

Dentro do projeto, cole no agente:

```text
Leia https://raw.githubusercontent.com/gabrielkashimarki/claude-code-toolkit/main/prompts/02-projeto-existente.md
e execute integralmente o bloco da seção "Prompt" neste projeto.
```

## Prompt

```markdown
# Adotar o Claude Code Toolkit neste projeto

Fonte: https://github.com/gabrielkashimarki/claude-code-toolkit. Baixe a revisão atual num diretório temporário fora do projeto e use os arquivos dessa revisão. Registre o commit usado.

Se o diretório aberto for o próprio toolkit, pare e pergunte qual é o projeto.

## 1. Limites

Autorizado: configurar o que se aplica no escopo do projeto, escrever AGENTS.md e CLAUDE.md, instalar skills de projeto, ajustar checks e CI, refatoração pequena que o setup precise.

Pede decisão minha: trocar stack, ORM ou banco; versão principal incompatível; aplicar migration; tocar produção; custo novo; apagar arquivo cuja função não está clara. Prepare a proposta com impacto e como desfazer e siga com o resto.

Não faça push, deploy, mensagem ou automação agendada. Não crie hook de git, bloqueio de main ou exigência de branch. Não afrouxe teste, lint ou permissão para fazer check passar. Instalação global vira pedido separado, com o comando e o efeito.

## 2. Diagnóstico

Antes de editar, registre:
- o que o produto faz e para quem, separando o que você viu do que supôs;
- stack, versões, gerenciador, lockfiles, comandos reais de instalar, rodar, lint, tipos, testes e build;
- estado do git e alterações locais (preserve tudo);
- instruções que já existem (CLAUDE.md, AGENTS.md, .cursorrules, docs) e onde se contradizem;
- ferramentas de fato carregadas na sessão: plugins, skills, MCPs, hooks. Instalado não é o mesmo que carregado.

Rode os checks existentes que forem seguros e anote o resultado de antes. Não conecte a produção para isso.

## 3. Desenho

Use superpowers:brainstorming. Faça uma pergunta por vez, só quando a resposta mudar uma decisão importante. Monte uma tabela com cada peça do kit (docs/ferramentas/*): precisa aqui?, estado atual, ação, risco, como validar. Peça que não se aplica leva o motivo. Peça bloqueada leva a condição para destravar.

Specs e planos vão para onde o ~/.claude/CLAUDE.md mandar (vault ou pasta de docs), não para docs/superpowers/ do repositório.

## 4. Instruções numa fonte só

- AGENTS.md na raiz, a partir de templates/AGENTS.md.template: produto em uma linha, comandos reais, limites, delegação. Curto. Detalhe fica onde já está, e o AGENTS.md aponta.
- CLAUDE.md do projeto com @AGENTS.md na primeira linha e só o que for exclusivo do Claude.
- Instrução útil que já existe é incorporada, não descartada. Instrução repetida em dois arquivos vira uma.

## 5. Ferramentas que se aplicam

- Context7 já global: confirme com uma consulta real sobre uma biblioteca do projeto.
- graphify: .graphifyignore (templates/graphifyignore.example) e grafo determinístico (graphify extract . --code-only --no-cluster) se o projeto for grande o bastante para ajudar.
- chrome-devtools: só se houver interface web; valide contra o servidor local, nunca contra produção.
- skills de framework no escopo do projeto (ex: Next/React: npx skills add vercel-labs/agent-skills), sem duplicar o que já está global.
- .mcp.json do projeto só com servidor que o projeto inteiro usa; segredo por op run (templates/mcp.json.example).
- Next + Supabase: compare com templates/next/ (env validado com Zod, logger sem segredo, cliente Supabase no servidor). Adote só o que encaixa no que existe. Não rode scaffold sobre o projeto nem troque o ORM para igualar o exemplo.
- Regras de ESLint (templates/eslint): em projeto com legado, meça por regra, comece em "warn" com a lista "ignore" dos arquivos já grandes e só vire "error" quando a contagem zerar. Nunca ligue em "error" quebrando o lint que hoje passa.

## 6. Delegação

Trabalho mecânico do plano vai para agy ou Codex (docs/ferramentas/delegacao.md), cada um no próprio worktree, um escritor por arquivo. Você revisa o diff e roda os checks antes de aceitar.

## 7. Verificação

- Os checks de antes rodam de novo. Falha nova é sua: corrija antes de seguir. Falha antiga é registrada e separada.
- Sessão limpa acha o AGENTS.md e os comandos.
- Rodar este prompt de novo não duplica seção, servidor MCP, hook nem skill.

## 8. Entrega

Resposta final:
- o que mudou;
- prova de cada item (comando e resultado);
- o que não foi validado;
- o que depende de mim;
- comandos para rodar o projeto.

Termine sugerindo de 3 a 8 rodadas de revisão, com o número justificado numa frase pelo tamanho e risco da mudança. Cada rodada tem um foco diferente (requisitos, regressão, segurança e dados, integração, UX, desempenho, clareza). Entregue um prompt pronto para colar, com o número, os focos e os checks reais. Para rodada de revisão ampla use o painel do prompts/04-revisao-em-painel.md. A sugestão não autoriza rodar as revisões sozinho.
```

Estrutura e convenção de revisão adaptadas do prompt de projeto existente do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/main/docs/prompts/12-existing-project-setup.md) (MIT).
