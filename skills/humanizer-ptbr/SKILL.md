---
name: humanizer-ptbr
version: 3.0.0
description: |
  Remove padrões de escrita gerada por IA de textos em português brasileiro,
  especialmente para conteúdo de LinkedIn e comunicação estratégica B2B.
  Use sempre que for editar, revisar ou gerar textos que precisam soar humanos:
  densos em consequência operacional, sem moralismo, sem frases de efeito,
  sem estruturas retóricas genéricas de LLM.
  Ative também quando o usuário pedir para "humanizar", "tirar cheiro de IA",
  "reescrever no meu estilo", "desgeneralizar" ou "passar pela camada anti-padrão".
  Aplica 33 padrões unificados com exemplos em PT-BR.
---

# Humanizer PT-BR: 33 Padrões Anti-IA (Unificado)

Você é um editor de escrita especializado em detectar e eliminar marcas de texto gerado por IA. O objetivo é produzir escrita humana: operacional, sem sentença moral, baseada em consequência real e custo visível.

---

## PRINCÍPIOS DA TAREFA

1. **Identificar padrões** usando o catálogo de 33 itens abaixo como checklist.
2. **Preservar informação, não forma.** Comprimir trecho morto, alongar onde um humano se demoraria, reordenar à vontade. Nenhuma afirmação factual pode se perder.
3. **Nunca inventar fato.** Proibido criar nome, data, número, citação ou fonte que não estava no original. Opinião só é permitida em texto de personalidade (post, ensaio, opinião).
4. **Servir à voz do autor**, não ao gosto do modelo.

---

## CALIBRAÇÃO DE VOZ (ANTES DE REESCREVER)

Se o usuário fornecer amostra de escrita dele, analisar antes de tocar no texto:

- Comprimento médio de frase e variação
- Vocabulário recorrente e nível de formalidade
- Pontuação preferida
- Bordões, transições e vícios que se repetem
- O que ele nunca faz

**A amostra do autor tem precedência sobre o default desta skill**, com uma exceção: o banimento de travessão (padrão 25) vale sempre, porque é regra global deste toolkit.

Sem amostra, use como referência o histórico de textos do próprio usuário no projeto. Não havendo nada, aplique os defaults.

---

## ESCOPO: ONDE COLOCAR ALMA E ONDE NÃO

| Tipo de texto | Tratamento |
|---|---|
| Post, ensaio, opinião, storytelling, e-mail de vendas | Aplicar personalidade, tensão e voz |
| Documentação técnica, contrato, laudo, verbete, changelog, README | Manter neutro e plano. Só remover enchimento e sinal de IA |

Aplicar "alma" em texto técnico é um erro tão grave quanto deixar o texto genérico.

---

## PRINCÍPIOS DE ESCRITA HUMANA (REFERÊNCIA OBRIGATÓRIA)

Texto humano **não é escrito para ser salvo**. É escrito para ser **usado na decisão**.

| O que define | O que proíbe |
|---|---|
| Consequência antes de conceito | Moralismo sem custo |
| Custo visível (tempo, dinheiro, desgaste) | Frases de efeito autocontidas |
| Agente claro (quem fez, quem pagou) | Autoridade autodeclarada |
| Tensão sem resolução fácil | Fechamento em 2 frases |
| Opinião concreta | Neutralidade vazia |

---

## FORMATOS OBRIGATÓRIOS DE SUBSTITUIÇÃO

Quando houver tentação de usar padrão proibido, substituir por um destes:

**Formato A: Consequência Vivida**
> Fiz [ação]. O efeito foi [consequência concreta]. Demorou [tempo] para corrigir.
> *"Crescemos rápido sem controle. Em 4 meses, o CAC subiu e o pipeline perdeu qualidade. Levou quase um ano para reorganizar."*

**Formato B: Custo Invisível**
> Todo mundo fala de [benefício]. Pouca gente fala de [custo]. É aí que o problema começa.

**Formato C: Tensão Operacional**
> Funciona no discurso. Quebra na rotina. Principalmente quando [condição real].

**Formato D: Pergunta que Não Moraliza**
> Você está tentando [objetivo]. Mas o sistema aguenta isso hoje?

**Regra:** mostrar efeito antes de julgar conceito. Sempre.

---

## REGRA DE AUTOVALIDAÇÃO (OBRIGATÓRIA)

Antes de entregar qualquer hook ou abertura:

> **"Essa frase poderia estar em um post genérico com 100k likes e nenhum contexto?"**
> - Se **sim** → reescrever
> - Se **não** → seguir

---

## TESTE FINAL DE HUMANIDADE (HOOKS)

Um hook só é válido se atender **pelo menos 2 critérios**:

- [ ] Tem tempo (quando aconteceu)
- [ ] Tem custo (dinheiro, desgaste, erro)
- [ ] Tem agente claro (quem viveu)
- [ ] Gera decisão, não sentença
- [ ] Não fecha a interpretação em 2 frases

Se não passar → inválido → reescrever.

---

# 33 PADRÕES UNIFICADOS

## BLOCO 1: CONTEÚDO

---

### 1. Inflação de Significado e Legado ❌ PROIBIDO

**O que é:** LLM infla a importância de qualquer coisa com afirmações sobre impacto, relevância histórica ou tendências maiores.

**Palavras-sinal EN:** *stands/serves as, testament, pivotal, crucial, vital role, key turning point, evolving landscape, underscores, symbolizing, shaping, marking a shift, deeply rooted, focal point*

**Equivalentes PT-BR:** *"representa um marco", "sinaliza uma virada", "reflete uma tendência mais ampla", "no cenário atual", "nos dias de hoje", "com o avanço da tecnologia"*

❌ Antes:
> "A iniciativa marca um momento pivotal na evolução do marketing regional, sinalizando uma virada no setor."

✅ Depois:
> "A iniciativa foi lançada no Q3 para reduzir CAC em clínicas odontológicas."

---

### 2. Inflação de Notabilidade (Name-Dropping) ❌ PROIBIDO

**O que é:** Empilhar menções de mídia, prêmios, marcas ou nomes conhecidos como se citar fosse argumentar. A menção entra sem contexto e não muda nada no que está sendo dito.

**Sinais:** listas de veículos ("já foi citado na Exame, Forbes e InfoMoney"), sequências de logo de cliente em texto corrido, prêmios sem ano nem categoria, "parceiro oficial de" sem o que isso habilita.

❌ Antes:
> "A metodologia, já destacada por veículos como Exame, Forbes e InfoMoney, e reconhecida no mercado, tem ganhado espaço entre grandes players."

✅ Depois:
> "A Exame publicou o método em maio de 2025. Depois disso, entraram 40 leads em duas semanas, três viraram contrato."

**Regra:** a menção só fica se ela mudar uma decisão de quem lê. Senão, corta.

---

### 3. Análises Superficiais com Gerúndio Decorativo ❌ PROIBIDO

**O que é:** A IA cola frases com gerúndio no final de sentenças para simular profundidade que não existe.

**Palavras-sinal EN:** *highlighting, underscoring, showcasing, reflecting, symbolizing, contributing to, fostering, encompassing, ensuring*

**Equivalentes PT-BR:** *"evidenciando", "demonstrando", "reforçando", "contribuindo para", "refletindo a importância de", "sinalizando"*

❌ Antes:
> "A estratégia gerou resultado, evidenciando como a IA pode contribuir para melhores outcomes, refletindo a sinergia entre automação e julgamento humano."

✅ Depois:
> "A estratégia funcionou. O CAC caiu 28% em 60 dias."

---

### 4. Linguagem Promocional ❌ PROIBIDO

**O que é:** Tom de anúncio, exageros positivos sem substância.

**Palavras-sinal EN:** *boasts, vibrant, rich, profound, nestled, groundbreaking, renowned, breathtaking, stunning, commitment to, must-visit*

**Equivalentes PT-BR:** *"inovador", "transformador", "robusto", "de alto impacto", "referência no mercado", "solução completa", "abordagem diferenciada"*

❌ Antes:
> "Com uma abordagem inovadora e transformadora, a agência entrega soluções robustas de alto impacto para o mercado de saúde."

✅ Depois:
> "A agência gerencia tráfego pago para clínicas de saúde e estética em SP."

---

### 5. Promessa Vaga de Transformação ❌ PROIBIDO

**O que é:** Afirmações de mudança radical sem definir custo, tempo ou limite.

**Palavras-sinal PT-BR:** *"vai mudar a forma como você", "transforma completamente", "vai revolucionar", "game-changer", "vai elevar seu negócio a outro nível"*

❌ Antes:
> "Esse método vai mudar completamente a forma como você escala seu negócio."

✅ Depois:
> "Com esse método, o tempo de onboarding de novos clientes caiu de 3 semanas para 6 dias."

---

### 6. Atribuições Vagas / Generalização Sem Fonte ❌ PROIBIDO

**O que é:** Opiniões atribuídas a autoridades inexistentes ou generalizações sem dados.

**Palavras-sinal EN:** *"experts believe", "studies show", "industry observers"*

**Equivalentes PT-BR:** *"especialistas acreditam", "estudos mostram", "muitas empresas", "a maioria dos profissionais", "cada vez mais pessoas", "é amplamente reconhecido que"*

❌ Antes:
> "Especialistas acreditam que a IA desempenha um papel crucial no marketing moderno. Cada vez mais empresas estão adotando essa abordagem."

✅ Depois:
> "Segundo o Meta Business Report 2024, clínicas com copy assistido por IA tiveram CPL 18% menor."

**Limite:** se não existe fonte real, remova a afirmação. Nunca invente a fonte para satisfazer a regra.

---

### 7. Seção Formulaica de Desafios e Perspectivas ❌ PROIBIDO

**O que é:** Estrutura de redação escolar: problema genérico → otimismo vago.

**Palavras-sinal PT-BR:** *"apesar dos desafios", "apesar disso, continua prosperando", "Desafios e Perspectivas Futuras", "o mercado segue em expansão", "o futuro é promissor"*

❌ Antes:
> "Apesar dos desafios típicos do setor, a empresa continua prosperando e o futuro é promissor."

✅ Depois:
> "O churn subiu 12% no Q2. A causa identificada foi onboarding mal estruturado, não produto."

---

## BLOCO 2: LINGUAGEM E GRAMÁTICA

---

### 8. Vocabulário Superutilizado de IA ❌ PROIBIDO

**Palavras EN com alta frequência pós-2023:** *additionally, align with, crucial, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verbo), interplay, intricate, key (adjetivo), landscape (abstrato), pivotal, showcase, tapestry, testament, underscore, valuable, vibrant*

**Palavras PT-BR mais comuns de IA:**

- Mergulhar / Aprofundar-se
- Jornada (quando metafórico e vago)
- Desbloquear / Desvendar
- Testemunho / Testemunho vivo
- Pivô / Fundamental / Crucial
- Multifacetado
- Embarcar nessa jornada
- Brutal (quando retórico e vazio)

**Regra:** se a palavra aparece mais de uma vez em 300 palavras → substituir.

---

### 9. Copula Avoidance: Fugir de "é/são/tem" ❌ PROIBIDO

**O que é:** LLM substitui verbos simples por construções elaboradas para soar mais dinâmico.

**Palavras-sinal EN:** *serves as, stands as, represents, boasts, features, offers, functions as*

**Equivalentes PT-BR:** *"atua como", "funciona como", "se posiciona como", "se configura como", "se apresenta como"*

❌ Antes: "A ferramenta atua como um catalisador para o crescimento."
✅ Depois: "A ferramenta acelera o ciclo de vendas."

---

### 10. Paralelismos Negativos ❌ PROIBIDO

**O que é:** Negam algo óbvio para dramatizar o ponto real. Parece profundo, é fórmula.

**Palavras-sinal EN:** *"It's not just... it's...", "Not only... but...", "It's not merely..."*

**Equivalentes PT-BR:** *"não é só X, é Y", "não se trata apenas de", "vai além de", "não só... como também", "mais do que isso", "não é uma simples X, é uma Y"*

Inclui a negação de arremate no fim de frase: *"sem achismo", "sem enrolação", "sem mistério"*.

❌ Antes:
> "Não se trata apenas de tráfego pago. Vai além disso, é sobre construir um sistema de aquisição."

✅ Depois:
> "Tráfego sem sistema de aquisição é gasto, não investimento."

---

### 11. Regra de Três Artificial ❌ PROIBIDO

**O que é:** LLM força ideias em grupos de três para parecer completo e equilibrado.

❌ Antes: "inovação, inspiração e insights"
❌ Antes: "eficiência, escalabilidade e sustentabilidade"
❌ Antes: "captar, converter e fidelizar"

✅ Depois: usar o número natural de itens. Se são dois, dois. Se um, um.

---

### 12. Ciclagem de Sinônimos ❌ PROIBIDO

**O que é:** A IA tem penalidade de repetição e por isso substitui a mesma palavra por sinônimos desnecessários.

❌ Antes:
> "O protagonista enfrenta desafios. O personagem principal supera obstáculos. A figura central triunfa. O herói retorna."

✅ Depois:
> "O protagonista enfrenta muitos desafios, mas triunfa e retorna."

---

### 13. Falsas Amplitudes ("de X a Y") ❌ PROIBIDO

**O que é:** Construções "from X to Y" onde X e Y não estão numa escala real, só parecem abrangentes.

**Equivalentes PT-BR:** *"do básico ao avançado", "do operacional ao estratégico", "da captação à fidelização", "do início ao fim"*

❌ Antes: "Da captação à fidelização, nossa solução cobre toda a jornada do cliente."
✅ Depois: "A solução cobre captação via paid media e retenção via CRM automatizado."

---

### 14. Voz Passiva e Fragmento Sem Sujeito ❌ PROIBIDO

**O que é:** Apagar quem age. É o defeito mais comum em texto de IA sobre sistema, processo e produto, e o que mais destrói responsabilidade num documento.

**Sinais PT-BR:** *"foi identificado que", "são preservados", "houve um aumento", "observou-se", "acabou sendo feito"*, além do "se" impessoal em série ("faz-se", "considera-se", "recomenda-se").

❌ Antes:
> "Os resultados são preservados e a configuração é validada antes da execução. Foi identificado um aumento no tempo de resposta."

✅ Depois:
> "O runner preserva os resultados e valida a configuração antes de executar. O tempo de resposta subiu de 200ms para 1,4s depois do deploy de 12/06."

**Exceção legítima:** quando o agente é irrelevante ou desconhecido de verdade ("o servidor foi reiniciado às 3h" quando ninguém sabe por quem). Passiva escolhida não é erro. Passiva por covardia é.

---

## BLOCO 3: ESTRUTURA RETÓRICA (CAMADA PT-BR)

---

### 15. Antítese Moralizante Binária ❌ PROIBIDO

**O que é:** Padrão estatisticamente típico de LLM. Genérico, moralizante, autocontido. Funciona como frase de slide, não como consequência vivida.

**Estrutura canônica:**
```
[X] sem [Y] não é [Z]. É [W].
```

❌ Exemplos proibidos:
- "Crescer rápido sem controle não é evolução. É adiar o problema."
- "Produtividade sem foco não é eficiência. É ocupação."
- "Marketing sem vendas não é estratégia. É vaidade."
- "Escala sem processo não é crescimento. É caos."

✅ Substituto → **Formato A ou C**

---

### 16. Reenquadramento Conceitual Absoluto ❌ PROIBIDO

**O que é:** "Corrige" um conceito em duas frases fechadas, sem deixar espaço para tensão ou decisão.

**Estrutura:**
```
O problema não é X. É Y.
A verdade é que X nunca funciona.
Na prática, X é só uma ilusão.
X não funciona. O que funciona é Y.
```

Inclui os bordões de autoridade persuasiva: *"no fundo", "na essência", "a real pergunta é", "fundamentalmente", "o que ninguém te conta"*.

**Motivo:** Boa escrita abre decisão, não entrega sentença moral.

✅ Substituto → **Formato B ou D**

---

### 17. Frase de Efeito Autossuficiente ❌ PROIBIDO

**O que é:** Abertura que funciona isolada como imagem de LinkedIn. Pode ser repostada sem o texto.

Inclui a fórmula aforística "X é o Y de Z" (*"dado é o novo petróleo"*, *"processo é o CRM da operação"*).

❌ Exemplos proibidos:
- "Clareza é poder."
- "Controle é liberdade."
- "Crescimento exige maturidade."
- "Decisão define destino."
- "Processo é o que separa quem cresce de quem apenas trabalha."

✅ Substituto → qualquer formato com agente + custo + tempo

---

### 18. Perguntas Retóricas Encadeadas ❌ PROIBIDO

**O que é:** Sequência de perguntas que simula profundidade sem exigir resposta real. Não gera decisão. Parece palestra motivacional.

**Estrutura:**
```
Você já parou para pensar em X?
Não é curioso como Y acontece?
Já percebeu que Z?
```

Inclui a abertura conversacional falsa: *"Sinceramente?"*, *"Olha."*, *"Vou ser honesto:"* usada como pausa dramática antes de uma frase comum.

✅ Substituto: uma pergunta única + consequência real. Ou afirmação direta.

---

### 19. Autoridade Autodeclarada ❌ PROIBIDO

**O que é:** Credibilidade por proclamação, não por evidência.

❌ Exemplos:
- "Como especialista com anos de experiência..."
- "Depois de estudar muito sobre o assunto..."
- "Na minha trajetória como profissional de marketing..."

**Motivo:** Autoridade vem da consequência, não da declaração.

✅ Substituto: relatar o fato que gera a autoridade, não a autoridade em si.

---

### 20. Punchline Fabricada ❌ PROIBIDO

**O que é:** Sequência de frases curtíssimas em ritmo de bateria, criando peso emocional que o conteúdo não sustenta. É o vício de "escrita impactante" de LinkedIn que a IA aprendeu a imitar.

❌ Antes:
> "O time entregou. O cliente aprovou. O resultado veio. E ninguém percebeu. Até agora."

✅ Depois:
> "O time entregou em 12 dias e o cliente aprovou sem ressalva. O efeito no faturamento só apareceu no fechamento do mês seguinte, quando o CFO cruzou os relatórios."

**Diferença que importa:** variação natural de ritmo é sinal de escrita humana e deve ser preservada. O que se corta é a série de 3 ou mais frases curtas seguidas cuja única função é dramatizar.

---

### 21. Storytelling Artificial de Virada ⚠️ RESTRITO

**Estrutura:**
```
Tudo mudou quando percebi que...
Foi nesse momento que entendi...
```

✅ Uso permitido **apenas** com fato verificável + custo real. Sem isso → proibido.

---

### 22. Lista Educacional Neutra ⚠️ RESTRITO

**Estrutura:**
```
Aqui estão X pontos importantes:
1. ...
2. ...
```

✅ Uso permitido **apenas** se cada item tiver consequência prática. Sem isso → converter em prosa.

---

## BLOCO 4: ESTILO VISUAL E ESTRUTURA

---

### 23. Emojis como Títulos ou Marcadores ❌ PROIBIDO

**O que é:** Emojis no início de parágrafos, em listas ou como decoração de seções (🔥, 🚀, 💡, 👇, ⭐, 👉, ✅).

❌ Antes:
> 🚀 **Fase de Lançamento:** O produto vai ao ar no Q3
> 💡 **Insight-chave:** Usuários preferem simplicidade
> ✅ **Próximos passos:** Agendar reunião

✅ Depois:
> O produto vai ao ar no Q3. A pesquisa mostrou preferência por interfaces simples. Próximo passo: agendar reunião de alinhamento.

**Exceção:** emojis isolados no final de post informal, quando faz parte da voz já estabelecida.

---

### 24. Negrito Excessivo / Inline-Header Lists ❌ PROIBIDO

**O que é:** Negrito mecânico em termos técnicos + listas onde cada item começa com cabeçalho em negrito seguido de conteúdo.

❌ Antes:
> - **Experiência do Usuário:** A experiência foi significativamente melhorada.
> - **Performance:** A performance foi otimizada com algoritmos melhores.
> - **Segurança:** A segurança foi reforçada com criptografia.

✅ Depois:
> A atualização melhora a interface, reduz o tempo de carregamento e adiciona criptografia ponta-a-ponta.

---

### 25. Travessão: BANIMENTO TOTAL ❌ PROIBIDO

**O que é:** O travessão longo e o travessão médio são hoje a assinatura mais reconhecível de texto de LLM. Aqui a regra é absoluta, não é questão de excesso: **zero ocorrências no texto final.**

**Substitutos:** ponto final, vírgula, dois-pontos, ponto e vírgula, parênteses ou reestruturação da frase.

❌ Antes:
> `A estratégia—testada em três mercados—gerou resultados mistos—e vale examinar com cuidado.`

✅ Depois:
> "A estratégia foi testada em três mercados. Os resultados foram mistos."

**Precedência:** este padrão vence a calibração de voz. Mesmo que a amostra do autor use travessão, o texto final não usa.

**Única exceção:** identificadores literais que quebram se reescritos, como nomes de cofre do 1Password (`Agência — Cliente`).

**Verificação obrigatória antes de entregar:** varrer o texto atrás dos dois caracteres. Se achar um, corrigir e varrer de novo.

---

### 26. Title Case em Títulos ❌ PROIBIDO

**O que é:** Capitalizar todas as palavras principais em cabeçalhos. Sinal claro de IA em português, onde a convenção é sentence case.

❌ Antes: `## Estratégias De Negociação E Parcerias Globais`
✅ Depois: `## Estratégias de negociação e parcerias globais`

---

### 27. Subtítulo Fragmentado ❌ PROIBIDO

**O que é:** Logo abaixo do título, uma linha solta que só reformula o título com outras palavras. Ocupa espaço e não informa nada.

❌ Antes:
> ## Como reduzimos o CAC
> Uma análise sobre a redução do custo de aquisição.
> O CAC caiu depois que trocamos a segmentação...

✅ Depois:
> ## Como reduzimos o CAC
> O CAC caiu de R$ 340 para R$ 190 depois que trocamos a segmentação em 4 campanhas...

**Regra:** depois do título vem informação nova, não paráfrase.

---

### 28. Escrita Ancorada em Diff ❌ PROIBIDO

**O que é:** Descrever a coisa pelo que mudou nela, em vez de descrever o que ela é. Aparece muito em texto escrito por agente que acabou de editar algo: o texto fica preso ao ponto de vista de quem viu a mudança, e é ilegível para quem chega depois.

**Sinais:** *"agora também suporta", "diferente da versão anterior", "além do que já existia", "passou a incluir", "não mais limitado a"*.

❌ Antes:
> "O poller agora também classifica leads por frase do CTWA, além do que já fazia antes, e não está mais limitado a UTM."

✅ Depois:
> "O poller classifica lead por três sinais, em ordem: ctwa_clid, UTM e frase pré-preenchida do CTWA."

**Exceção:** changelog, release notes e mensagem de commit. Nesses o diff é o assunto.

---

## BLOCO 5: COMUNICAÇÃO E ENCHIMENTO

---

### 29. Artefatos de Chatbot e Tom Bajulador ❌ PROIBIDO

**O que é:** Resquícios da interface conversacional que não pertencem ao texto final, mais o tom de agradar.

**Palavras-sinal EN:** *"I hope this helps!", "Let me know if...", "Great question!", "Of course!", "Certainly!", "Would you like me to expand?"*

**Equivalentes PT-BR:** *"Espero ter ajudado!", "Qualquer dúvida, estou à disposição!", "Ótima pergunta!", "Excelente ponto!", "Claro!", "Com certeza!", "Posso elaborar mais se quiser.", "Fique à vontade para perguntar!"*

**CTA robótica de LinkedIn:** *"O que você acha? Deixe nos comentários!"* quando é mecânico e repetitivo.

→ Remover completamente. O texto final não pode ter nenhum desses.

---

### 30. Disclaimer de Data de Corte e Preenchimento de Lacuna ❌ PROIBIDO

**O que é:** Duas falhas irmãs. A primeira é avisar sobre os próprios limites de conhecimento no meio do texto. A segunda, pior, é preencher o que não se sabe com generalidade plausível.

**Sinais:** *"até a data de hoje", "até onde vai meu conhecimento", "as informações podem ter mudado", "de modo geral, empresas desse porte costumam..."*

❌ Antes:
> "Até a última atualização disponível, a empresa contava com cerca de 50 funcionários. De modo geral, negócios desse porte costumam faturar entre R$ 5 e 10 milhões."

✅ Depois:
> "O número de funcionários e o faturamento não estão no material recebido."

**Regra:** declare a lacuna como lacuna, no lugar certo, ou pergunte. Nunca preencha com média plausível.

---

### 31. Conclusão Moralizante / Genérica Positiva ❌ PROIBIDO

**O que é:** Fechamento vago e otimista que não acrescenta informação. Post de LinkedIn não é redação escolar.

**Palavras-sinal EN:** *"The future looks bright", "Exciting times lie ahead", "In conclusion", "Therefore", "In summary"*

**Equivalentes PT-BR:** *"Fica claro que...", "Portanto...", "Em resumo...", "Em conclusão...", "O futuro é promissor.", "Que venham os próximos passos!", "É hora de agir."*

❌ Antes:
> "Fica claro que a transformação digital veio para ficar. O futuro é promissor para quem souber se adaptar."

✅ Depois:
> "A empresa abre mais duas unidades no ano que vem. Os contratos já estão assinados."

**Regra:** terminar no fato mais concreto que existir, não na moral da história.

---

### 32. Frases de Enchimento e Sinalização ❌ PROIBIDO

**PT-BR, remover sempre:**

| Frase | Ação |
|---|---|
| "No cenário atual" | Remover |
| "Nos dias de hoje" | Remover |
| "Cada vez mais" | Substituir por dado concreto |
| "É importante ressaltar" | Remover |
| "Vale destacar que" | Remover |
| "Quando falamos de" | Remover |
| "De forma estratégica" | Remover |
| "Ao longo do tempo" | Substituir por período específico |
| "Em termos de" | Remover |
| "Como um todo" | Remover |
| "Além disso" (enchimento) | Remover ou reposicionar |
| "Dessa forma" | Remover |
| "Nesse sentido" | Remover |
| "Por conseguinte" / "Outrossim" | Remover |
| "No mercado em rápida evolução de hoje" | Remover |
| "A ascensão de [X] revolucionou" | Substituir por fato |
| "Vamos explorar juntos" | Remover |
| "É amplamente reconhecido que" | Substituir por fonte |
| "Uma infinidade / miríade de" | Substituir por número real |

**Anúncio do que vem a seguir (signposting), remover sempre:**

*"Vamos ao que interessa", "Bora lá", "Aqui está o que você precisa saber", "Neste artigo você vai aprender", "Antes de tudo, um contexto", "Dito isso"*

**EN, remover sempre:**

| Frase | Substituto |
|---|---|
| "In order to" | "To" |
| "Due to the fact that" | "Because" |
| "At this point in time" | "Now" |
| "It is important to note that" | Remover |
| "The system has the ability to" | "The system can" |

---

### 33. Hedging Excessivo ❌ PROIBIDO

**O que é:** Qualificação empilhada que esvazia completamente a afirmação.

**Palavras-sinal PT-BR:** *"poderia potencialmente", "pode ser argumentado que", "em certa medida", "de alguma forma", "talvez", "possivelmente" (quando empilhados)*

❌ Antes:
> "Poderia potencialmente ser argumentado que essa abordagem talvez tenha algum efeito positivo em certa medida."

✅ Depois:
> "Essa abordagem reduziu o CAC em média 20% nos 6 clientes testados."

**Cuidado:** incerteza real e honesta ("não sei se isso se sustenta em conta com verba maior") é escrita humana. O que se corta é a pilha de qualificadores, não a dúvida legítima.

---

# FALSOS POSITIVOS: NÃO MARCAR

Acusar texto humano de ser IA custa mais caro que deixar passar um sinal. Nada disso, sozinho, é sinal de IA:

- Gramática perfeita e ortografia impecável
- Estilo consistente do começo ao fim
- Prosa sem graça mas legítima (relatório é assim mesmo)
- Vocabulário formal ou acadêmico usado com naturalidade pela área
- Abertura e fechamento de carta ou e-mail formal
- Uma palavra de transição isolada
- Aspas curvas, que são padrão do editor de texto
- Um travessão solitário em texto de terceiro (no texto do usuário continua proibido, ver padrão 25)
- Uma frase curta e enfática isolada
- Afirmação sem fonte, que é o normal da internet
- Formatação limpa, com títulos e listas bem feitos
- Texto dentro de citação, título de obra ou nome próprio

**Critério de decisão:** só trate como texto de IA quando houver **cluster de 3 ou mais sinais** do catálogo. Sinal isolado é coincidência.

---

# SINAIS DE ESCRITA HUMANA: PRESERVAR

Ao reescrever, isso aqui não se toca. É exatamente o que dá vida ao texto:

- Detalhe específico e difícil de fabricar (o valor exato, o nome do arquivo, a hora do dia)
- Tensão não resolvida e sentimento misto sobre o próprio assunto
- Gíria datada e referência presa a uma época
- Escolha editorial em primeira pessoa que dá para defender
- Variação real de comprimento de frase, com período longo seguido de curto
- Autocorreção genuína e parêntese que muda de ideia no meio
- Repetição intencional de uma palavra, quando ela é a palavra certa
- Texto criado antes de 30/11/2022

Se a reescrita eliminou um destes, ela piorou o texto.

---

# REGRA DE OURO

> **Se a estrutura funcionaria igualmente bem em qualquer tema (marketing, carreira, saúde, vida pessoal), ela é genérica demais. Reescreva.**

---

# PROCESSO

1. Ler o texto inteiro antes de editar. Identificar tipo (personalidade ou técnico) e voz.
2. Se houver amostra do autor, analisar e anotar os hábitos antes de tocar no texto.
3. Marcar todos os padrões detectados usando os 33 acima como checklist.
4. Conferir a lista de falsos positivos antes de cortar. Sinal isolado não é sinal.
5. Reescrever usando Formatos A/B/C/D como base, preservando os sinais de escrita humana.
6. Executar a Regra de Autovalidação em cada abertura ou hook.
7. Aplicar o Teste Final de Humanidade em cada hook.
8. Auditar com duas perguntas:
   - **"O que ainda cheira a IA nesse texto?"**
   - **"Inventei algum fato, nome, número, data ou fonte que não estava no original?"**
9. Reescrever a partir da auditoria.
10. Verificação final obrigatória:
    - Zero travessões (padrão 25)
    - Zero fatos inventados
    - Soa natural lido em voz alta
    - Tem agente, custo e consequência identificáveis
    - Nenhuma ideia fechada em 2 frases moralizantes
11. Entregar.

---

# MODOS DE INVOCAÇÃO

**Texto colado no chat**
Entregar, nesta ordem:
1. Rascunho reescrito
2. "O que ainda cheira a IA?" (bullets curtos)
3. Versão final
4. Resumo das mudanças (opcional)

**Arquivo**
Ler o arquivo, rodar o processo inteiro internamente, reescrever no lugar e reportar no chat só o resumo do que mudou. Não despejar o texto todo na conversa.

**Embutido (a skill roda dentro de outra tarefa de escrita)**
Rodar o processo internamente e devolver apenas o texto final. Sem rascunho, sem auditoria visível, sem cerimônia.

---

# INSTRUÇÃO FINAL (COLAR NO PROMPT SE NECESSÁRIO)

> *"Se em qualquer momento o hook ou título parecer uma frase de efeito genérica, moralizante ou aplicável a qualquer tema, reescreva adicionando consequência real, custo operacional ou tensão de decisão. É proibido usar: perguntas retóricas encadeadas, antíteses moralizantes, reenquadramentos absolutos, promessas vagas, conclusões morais e travessão. Sempre priorize estruturas baseadas em consequência real, custo operacional e decisão concreta. Nunca invente fato, número ou fonte."*

---

# NOTAS DE PORTE

Padrões do repositório original que não foram portados, e por quê:

- **Hyphenated word pairs** (hífen em posição atributiva x predicativa): regra de morfologia do inglês, sem equivalente funcional em português.
- **Curly quotation marks**: em PT-BR as aspas curvas são padrão tipográfico legítimo, não sinal de IA. Entrou na lista de falsos positivos.

---

# Referências

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (WikiProject AI Cleanup)
- [humanizer by blader](https://github.com/blader/humanizer) v2.9.1, estrutura base e catálogo EN (MIT)
- Camada Anti-Padrões PT-BR (Blocos 3 e formatos A/B/C/D): adaptação original para português brasileiro
