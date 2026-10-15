# Prompt 03: limpeza de projeto

Uma passada de faxina no projeto inteiro: código morto, TODO velho, dependência sem uso, aviso de lint acumulado. O comportamento não muda e cada passo é provado por comando, com os números de antes e depois.

Use quando o projeto cresceu sem ninguém olhar o todo. Para revisar uma mudança específica, use o [prompt 04](04-revisao-em-painel.md).

## Diferença para o que já existe

| Ferramenta | Escopo | Executa? |
|---|---|---|
| `/simplify` | só o diff atual | sim |
| `ponytail-audit` | projeto inteiro, só excesso de engenharia | não, só relatório |
| este prompt | projeto inteiro, código morto, TODO, dependência, lint | sim, em passos verificados |

## Como usar

Dentro do projeto, cole no agente:

```text
Leia https://raw.githubusercontent.com/gabrielkashimarki/claude-code-toolkit/main/prompts/03-limpeza.md
e execute o bloco da seção "Prompt" neste projeto.
```

## Prompt

```markdown
# Faxina medida neste projeto

Objetivo: deixar o repositório mensuravelmente mais limpo sem mudar comportamento e sem chutar o estado atual.

## 0. Linha de base, rodada agora

Descubra os comandos reais do projeto (AGENTS.md, package.json, CI) e rode:
- lint;
- tipos;
- testes;
- build;
- auditoria de dependências: `npx knip` em projeto JS/TS, ou o equivalente da stack, além de `npm audit` ou o do gerenciador.

Mostre os números de cada um: falhas, avisos, vulnerabilidades, itens sem uso. Se algo já falha, diga isso antes de qualquer outra coisa e não empilhe limpeza em cima de base quebrada sem eu saber.

## 1. Inventário, sem corrigir ainda

- Código morto: export sem uso, arquivo órfão, ramo inalcançável.
- TODO, FIXME e XXX, com arquivo:linha e contexto suficiente para julgar se ainda valem.
- Dependência declarada e nunca importada.
- Comentário `ponytail:` (atalho deliberado): liste e não mexa; rode `ponytail-debt` se estiver instalado.
- O que a linha de base já apontou.

## 2. Plano em três grupos

1. **Seguro, padrão se eu não responder:** só mudança mecânica que preserva comportamento. Import sem uso, arquivo sem nenhuma referência, TODO de trabalho já feito.
2. **Precisa do meu OK:** "sem uso" ambíguo (import dinâmico, rota por convenção do framework, API pública, arquivo carregado por config), dependência que pode ser peer ou usada só em script, TODO que documenta limitação real.
3. **Fora do escopo, só anotar:** dívida de arquitetura e o que a linha de base não mostrou.

Mostre o plano e espere minha decisão sobre o grupo 2. Sem resposta, faça só o grupo 1.

## 3. Execução em passos pequenos

- Um item por vez. Nunca junte limpezas sem relação no mesmo diff.
- Depois de cada item, rode a checagem que prova aquele item (o comando real, não de memória).
- Só passe para o próximo com o atual verificado.
- O grupo 1 é mecânico: se o agy estiver disponível, despache em lote com `agy-rodar` (docs/ferramentas/delegacao.md), um worktree por lote e arquivos disjuntos, e revise o diff antes de aceitar.
- Commit pequeno por grupo de itens do mesmo tipo, mensagem no imperativo.

## 4. Relatório

Rode de novo todos os comandos do passo 0 e mostre antes e depois lado a lado, com números absolutos e diferença. Não escreva "limpo" ou "corrigido" sem a saída do comando que prova. Liste o que ficou no grupo 2 aguardando decisão e o que foi anotado no grupo 3.
```

Adaptado do prompt de sanitização do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/main/docs/prompts/01-project-sanitation.md) (MIT).
