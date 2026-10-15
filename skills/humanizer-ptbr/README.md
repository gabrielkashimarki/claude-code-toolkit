# humanizer-ptbr

Skill para Claude que remove padrões de escrita gerada por IA de textos em **português brasileiro**, especialmente para LinkedIn e comunicação B2B.

Baseado no [humanizer](https://github.com/blader/humanizer) v2.9.1 (EN, MIT) com uma camada adicional de estrutura retórica em PT-BR. Total de **33 padrões unificados**.

---

## O problema

LLMs escrevem para o maior denominador comum. O resultado é texto que:

- Infla qualquer coisa com "momento pivotal", "cenário atual" e "testemunho vivo"
- Abre com antíteses moralizantes: *"Produtividade sem foco não é eficiência. É ocupação."*
- Fecha com otimismo vago: *"O futuro é promissor para quem souber se adaptar."*
- Usa gerúndio decorativo: *"evidenciando a sinergia entre automação e julgamento humano"*
- Soa como post de LinkedIn de 100k likes sem nenhum contexto real

Essa skill força o modelo a produzir texto com **consequência real, agente claro e custo visível**.

---

## 33 padrões detectados

### Bloco 1: Conteúdo
| # | Padrão | Status |
|---|---|---|
| 1 | Inflação de Significado e Legado | ❌ Proibido |
| 2 | Inflação de Notabilidade (name-dropping) | ❌ Proibido |
| 3 | Gerúndio Decorativo | ❌ Proibido |
| 4 | Linguagem Promocional | ❌ Proibido |
| 5 | Promessa Vaga de Transformação | ❌ Proibido |
| 6 | Atribuições Vagas / Generalização Sem Fonte | ❌ Proibido |
| 7 | Seção Formulaica de Desafios e Perspectivas | ❌ Proibido |

### Bloco 2: Linguagem e Gramática
| # | Padrão | Status |
|---|---|---|
| 8 | Vocabulário Superutilizado de IA (EN + PT-BR) | ❌ Proibido |
| 9 | Copula Avoidance ("atua como", "se configura como") | ❌ Proibido |
| 10 | Paralelismos Negativos ("não se trata apenas de...") | ❌ Proibido |
| 11 | Regra de Três Artificial | ❌ Proibido |
| 12 | Ciclagem de Sinônimos | ❌ Proibido |
| 13 | Falsas Amplitudes ("da captação à fidelização") | ❌ Proibido |
| 14 | Voz Passiva e Fragmento Sem Sujeito | ❌ Proibido |

### Bloco 3: Estrutura Retórica (camada PT-BR)
| # | Padrão | Status |
|---|---|---|
| 15 | Antítese Moralizante Binária ("X sem Y não é Z. É W.") | ❌ Proibido |
| 16 | Reenquadramento Conceitual Absoluto ("O problema não é X. É Y.") | ❌ Proibido |
| 17 | Frase de Efeito Autossuficiente ("Clareza é poder.") | ❌ Proibido |
| 18 | Perguntas Retóricas Encadeadas | ❌ Proibido |
| 19 | Autoridade Autodeclarada ("Como especialista...") | ❌ Proibido |
| 20 | Punchline Fabricada (staccato dramático) | ❌ Proibido |
| 21 | Storytelling Artificial de Virada | ⚠️ Restrito |
| 22 | Lista Educacional Neutra | ⚠️ Restrito |

### Bloco 4: Estilo Visual e Estrutura
| # | Padrão | Status |
|---|---|---|
| 23 | Emojis como Títulos ou Marcadores | ❌ Proibido |
| 24 | Negrito Excessivo / Inline-Header Lists | ❌ Proibido |
| 25 | Travessão (banimento total, zero ocorrências) | ❌ Proibido |
| 26 | Title Case em Títulos | ❌ Proibido |
| 27 | Subtítulo Fragmentado | ❌ Proibido |
| 28 | Escrita Ancorada em Diff | ❌ Proibido |

### Bloco 5: Comunicação e Enchimento
| # | Padrão | Status |
|---|---|---|
| 29 | Artefatos de Chatbot e Tom Bajulador | ❌ Proibido |
| 30 | Disclaimer de Data de Corte e Preenchimento de Lacuna | ❌ Proibido |
| 31 | Conclusão Moralizante / Genérica Positiva | ❌ Proibido |
| 32 | Frases de Enchimento e Sinalização (tabela com 25+ itens) | ❌ Proibido |
| 33 | Hedging Excessivo | ❌ Proibido |

---

## Guardas contra excesso de zelo

Duas listas evitam que a skill destrua texto humano:

**Falsos positivos:** gramática perfeita, prosa sem graça mas legítima, vocabulário formal da área, aspas curvas, afirmação sem fonte. Nada disso, sozinho, é sinal de IA. O critério de decisão é **cluster de 3 ou mais sinais**.

**Sinais humanos a preservar:** detalhe difícil de fabricar, tensão não resolvida, gíria datada, autocorreção no meio da frase, variação real de ritmo. Se a reescrita apagou um destes, ela piorou o texto.

---

## Exemplo

**Antes (cheira a IA):**
> No cenário atual, cada vez mais empresas estão adotando soluções inovadoras e transformadoras. Produtividade sem processo não é eficiência. É ocupação. Como especialista com anos de experiência, acredito que isso representa um marco fundamental. O futuro é promissor para quem souber se adaptar.

**Depois (humanizado):**
> Testamos a ferramenta em 3 clientes durante 60 dias. Em dois, o tempo de onboarding caiu pela metade. No terceiro, não fez diferença: o gargalo era comercial, não operacional.

---

## Formatos de substituição obrigatórios

A skill não só remove padrões, ela substitui por estruturas com substância:

**Formato A: Consequência Vivida**
> Fiz [ação]. O efeito foi [consequência concreta]. Demorou [tempo] para corrigir.

**Formato B: Custo Invisível**
> Todo mundo fala de [benefício]. Pouca gente fala de [custo]. É aí que o problema começa.

**Formato C: Tensão Operacional**
> Funciona no discurso. Quebra na rotina. Principalmente quando [condição real].

**Formato D: Pergunta que Não Moraliza**
> Você está tentando [objetivo]. Mas o sistema aguenta isso hoje?

---

## Calibração de voz e escopo

Passe uma amostra da sua escrita junto com o texto. A skill analisa os hábitos (comprimento de frase, vocabulário, bordões) e reescreve imitando você em vez de aplicar o default. A amostra sobrepõe as regras da skill, com uma exceção: o banimento de travessão vale sempre.

Escopo de personalidade: post, ensaio, opinião e e-mail de vendas recebem voz e tensão. Documentação técnica, contrato e changelog ficam neutros, só perdem o enchimento.

---

## Instalação

### Claude Code
```bash
mkdir -p ~/.claude/skills/humanizer-ptbr
cp ~/Skills/SKILL-HUMANIZER-BR.md ~/.claude/skills/humanizer-ptbr/SKILL.md
```

### Claude.ai (Projects)
1. Crie um novo Project no Claude.ai
2. Vá em **Project Instructions**
3. Cole o conteúdo do `SKILL.md`
4. Salve. A skill fica ativa em todas as conversas do projeto

---

## Uso

No Claude Code:
```
/humanizer-ptbr

[cole seu texto aqui]
```

Ou diretamente:
```
Humaniza esse texto: [seu texto]
```

### Modos

**Texto colado:** devolve rascunho, bullets de "o que ainda cheira a IA" e versão final.
**Arquivo:** lê, reescreve no lugar e reporta só o resumo no chat.
**Embutido:** roda dentro de outra tarefa de escrita e devolve apenas o texto final.

---

## Regra de ouro

> **Se a estrutura funcionaria igualmente bem em qualquer tema (marketing, carreira, saúde, vida pessoal), ela é genérica demais. Reescreva.**

---

## Referências

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [humanizer by blader](https://github.com/blader/humanizer) v2.9.1, estrutura base (MIT)
- Camada Anti-Padrões PT-BR: adaptação original para português brasileiro

## Licença

MIT
