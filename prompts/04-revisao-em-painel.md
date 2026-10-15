# Prompt 04: revisão em painel

Revisão de uma mudança por vários revisores independentes, cada um com uma lente, e uma síntese que junta tudo num relatório só. Use antes de juntar qualquer mudança que não seja trivial.

## Por que um painel

Um revisor só puxa para a lente dele. Quem caça bug de lógica deixa passar falha de segurança, e quem olha segurança não vê regra de hook do React. O painel junta peças que você já tem e que hoje rodam separadas:

| Lente | Ferramenta | Por quê |
|---|---|---|
| Correção | `/code-review` | bug de lógica, com cenário de falha e verificação |
| Segurança | `claude-security` (revisão do diff) | OWASP, segredo, injeção, autorização, RLS |
| Outro modelo | `/codex:adversarial-review` | o Codex erra diferente do Claude; pega o que o Claude normaliza |
| Framework | lente própria (React, Next, Supabase), com `impeccable` se houver interface | regra de hook, render, acessibilidade, uso do cliente Supabase |

O valor está na síntese. Quatro listas coladas uma embaixo da outra são só uma lista quatro vezes maior e menos confiável.

## Como usar

```text
Leia https://raw.githubusercontent.com/gabrielkashimarki/claude-code-toolkit/main/prompts/04-revisao-em-painel.md
e execute o bloco da seção "Prompt" sobre <diff, PR ou branch>.
```

## Prompt

```markdown
# Revisão em painel

Alvo: [diff atual | PR número | branch comparada com a base]. Não revise sozinho primeiro: despache o painel.

## 1. Painel, em paralelo

Rode cada lente de forma independente, sem uma ver o achado da outra. Tire a lente que não se aplica (sem lente de framework em mudança só de backend ou CLI).

- Correção: /code-review sobre o alvo, no esforço adequado ao tamanho da mudança.
- Segurança: claude-security restrito ao diff, ou um subagente com a lente OWASP: segredo no código, injeção, autenticação e autorização, RLS e uso da chave secreta do Supabase, entrada externa sem validação, dependência com CVE.
- Outro modelo: /codex:adversarial-review sobre o mesmo alvo. Se o plugin codex não estiver disponível, registre a ausência e siga.
- Framework: subagente com a stack real do projeto (ex: React e Next: regras de hook, Server e Client Components, cache, acessibilidade; Supabase: cliente certo em cada camada, nenhuma chave secreta no cliente).

Cada achado volta no formato: arquivo:linha, gravidade, uma frase, cenário de falha concreto (a entrada ou o estado que quebra). Achado sem cenário de falha é palpite e o próprio revisor descarta.

## 2. Síntese

1. Juntar: o mesmo problema apontado por mais de um revisor vira uma entrada só, com a melhor descrição e a lista de quem concordou.
2. Filtrar: descartar o que não tem cenário de falha ou já é tratado em outro ponto do código. Confira no diff real antes de descartar ou de aceitar; não confie no revisor em nenhuma das direções.
3. Ordenar: CRÍTICO (segurança, perda de dado, bloqueia o merge), ALTO (bug real), MÉDIO (manutenção), BAIXO (estilo, opcional).

## 3. Relatório

Um relatório, do mais grave ao menos grave. Cada entrada: arquivo:linha, frase, cenário de falha, gravidade, revisores que levantaram. Lista vazia de CRÍTICO e ALTO é resultado válido e deve ser dito com todas as letras.

Não corrija nada nesta etapa. No fim, pergunte quais achados corrigir. Correção autorizada passa pelos checks do projeto e entra na rodada seguinte, se houver.

Se esta for uma das rodadas da sequência de 3 a 8 sugerida pelo prompt 02, diga em qual rodada está e qual foco vem na próxima.
```

Estrutura de painel e síntese adaptadas do prompt de code review multiagente do [vibe-coding-toolkit](https://github.com/soumatheusgomes/vibe-coding-toolkit/blob/main/docs/prompts/03-multi-agent-code-review.md) (MIT).
