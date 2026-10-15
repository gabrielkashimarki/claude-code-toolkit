# Prompt 01: preparar a máquina

Instala, atualiza e valida o ambiente global: base do sistema, Node, Python, Claude Code, Codex, agy, plugins, skills, MCPs e hooks deste kit. Serve para máquina nova ou para arrumar uma que já tem coisa instalada. Roda em macOS e Windows.

O escopo é o computador. Projetos, lockfiles, credenciais e sessões existentes não são tocados.

## Como usar

Cole num agente que tenha terminal (Claude Code ou Codex), não no shell:

```text
Leia https://raw.githubusercontent.com/gabrielkashimarki/claude-code-toolkit/main/prompts/01-preparar-maquina.md
e execute integralmente o bloco da seção "Prompt" neste computador.
```

Com o repositório clonado:

```text
Leia prompts/01-preparar-maquina.md deste repositório e execute integralmente o bloco da seção "Prompt" neste computador.
```

## Prompt

```markdown
# Preparar este computador com o Claude Code Toolkit

Fonte: https://github.com/gabrielkashimarki/claude-code-toolkit. Baixe a revisão atual da branch main num diretório temporário fora de qualquer projeto e use todos os arquivos dessa mesma revisão. Registre o commit usado.

Execute o trabalho. Um tutorial ou uma lista de recomendações não conclui o pedido.

## 1. Autorização

Está autorizado, sem perguntar de novo:
- instalar e atualizar tudo da base obrigatória (seção 3);
- instalar e configurar plugins, skills, MCPs e hooks do kit no escopo do usuário;
- corrigir PATH e arquivos de inicialização do shell;
- remover duplicata confirmada, depois de saber qual instalação está em uso.

Antes de alterar qualquer configuração com conteúdo (settings.json, ~/.claude.json, perfil do shell), faça cópia com data no nome e registre como restaurar.

Pare e me chame só para: login, senha do sistema, Touch ID ou UAC, custo, ou mudança que quebre algo que já funciona. Nunca peça senha, token ou código no chat. Não publique nada, não mande mensagem, não contrate serviço, não altere projeto.

A execução tem que ser repetível: rodar de novo verifica e corrige, sem duplicar instalação, hook ou servidor MCP.

## 2. Diagnóstico antes de mexer

Descubra e registre:
- sistema, versão, arquitetura; no Windows, se é nativo ou WSL (não misture os dois);
- shell, terminal, PATH e arquivos de inicialização;
- gerenciador de pacotes (Homebrew no macOS, winget no Windows);
- o que já existe: runtimes, CLIs, plugins (`claude plugin list`), MCPs (`claude mcp list`), skills (~/.claude/skills), hooks (~/.claude/settings.json);
- duplicatas reais (mesma ferramenta por dois gerenciadores) separadas de symlink e de instalação que um projeto exige.

Rode `node scripts/doctor.mjs --json` da cópia do kit, se o Node já existir, e use a saída como ponto de partida.

## 3. Base obrigatória

Instale quando faltar, atualize quando estiver velho, configure para uso. Só conferir que existe não basta.

Sistema: git; bash (no Windows, Git for Windows); jq; gh; ripgrep; fd.
Runtimes: fnm com Node LTS (22 ou mais) como padrão e troca automática por projeto; npm; Python 3.11 a 3.13; uv.
Agentes: Claude Code; Codex CLI (`@openai/codex`); Antigravity CLI (`agy`, binário nativo, sem Node).
Segredos: 1Password CLI (`op`).

Plugins do Claude Code, no escopo do usuário (marketplaces e nomes em docs/ferramentas/plugins.md):
superpowers, ponytail, caveman, codex, claude-security, feature-dev, typesafe.

MCPs no escopo do usuário: Context7 e chrome-devtools (comandos em docs/ferramentas/mcps.md).

Hooks e skills do kit: copie hooks/handoff-*.sh para ~/.claude/hooks/, skills/handoff-auto e skills/humanizer-ptbr para ~/.claude/skills/ (cópia, não symlink, no Windows). Junte o bloco hooks de templates/settings.json.example ao ~/.claude/settings.json existente, sem apagar hooks que já estão lá e sem duplicar os do kit.

Use o instalador oficial de cada ferramenta (tabela em docs/01-pre-requisitos.md). Confira nome e autor antes de instalar: pacote com nome parecido não é o mesmo. Não instale a mesma ferramenta por dois gerenciadores. Preserve o método de instalação que já existe quando ele funciona.

Se um item não tiver suporte no sistema (por exemplo semgrep nativo no Windows, agy-conta fora do macOS), registre, ofereça a alternativa documentada e siga com o resto.

## 4. Preferências

- ponytail em full para programação;
- caveman em full, respostas no idioma do usuário; código, documentação e commits em redação normal;
- Context7 para documentação de biblioteca, sem mandar segredo ou código privado na consulta;
- nada de trocar provedor, modelo ou forma de cobrança (API paga, proxy) sem eu escolher.

Se já existir ~/.claude/CLAUDE.md, preserve. Se não existir, ofereça criar a partir das regras de docs/02-como-funciona.md (onde cada coisa mora) e pergunte idioma e destino de specs e notas antes de escrever.

## 5. Opcionais

Depois da base, mostre a tabela "Por skill" de docs/01-pre-requisitos.md com o que já está instalado e pergunte quais extras eu quero (ffmpeg, yt-dlp, graphify, RTK, Docker, Chrome, skills de vídeo, semgrep). Instale só o que eu escolher.

## 6. Login

Abra o fluxo oficial e diga exatamente o que eu tenho que fazer para: `claude` (login), `codex login`, `gh auth login`, `agy` (login interativo), `op` (conta ou conta de serviço por OP_SERVICE_ACCOUNT_TOKEN). Confirme cada login sem mostrar credencial.

## 7. Validação

Num terminal novo, sem variável temporária:
- `node scripts/doctor.mjs` sem item obrigatório faltando;
- `bash hooks/teste-handoff-contexto.sh` imprime OK;
- `claude plugin list` mostra os plugins da base ligados;
- `claude mcp list` mostra Context7 e chrome-devtools conectados;
- troca de versão do Node por projeto funciona e volta ao padrão;
- `python3 --version` funciona dentro do bash (no Windows, dentro do Git Bash).

Não faça chamada paga só para testar.

## 8. Entrega

Grave em ~/.claude-toolkit/ (fora de projetos):
- relatorio-AAAA-MM-DD.md: ambiente, checklist da base, o que foi instalado, atualizado ou reaproveitado (versão antes e depois), backups e como restaurar, testes e resultado, pendências que dependem de mim;
- manifesto.json no formato de templates/environment-manifest.json.example, com o que de fato ficou na máquina, sem segredo e sem dado pessoal. Esse arquivo serve para reproduzir a máquina em outro computador.

Na resposta final: o que ficou pronto, o que não foi validado, o que depende de mim e os caminhos dos dois arquivos. Não diga que terminou só porque os instaladores rodaram. Diga que terminou quando cada item da base tiver passado na validação.
```

Estrutura adaptada do prompt de setup do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/main/docs/prompts/10-development-environment-setup.md) (MIT).
