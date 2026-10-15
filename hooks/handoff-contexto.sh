#!/bin/bash
# Dispara o handoff automatico quando o contexto da sessao passa do limiar.
# Le o JSON do hook no stdin, mede o contexto pelo transcript e devolve
# instrucao para o modelo chamar a skill handoff-auto.
# Limiar = tokens de CONVERSA acumulados (total menos o piso do prompt da sessao).
# Configuravel por env: CLAUDE_HANDOFF_LIMIAR (padrao 250000).
# No PostToolUse (meio de tarefa) so avisa, uma vez: cortar no meio perde o trabalho em
# andamento. O handoff de fato e pedido no Stop, que e fim de turno, fronteira natural.

set -u
LIMIAR="${CLAUDE_HANDOFF_LIMIAR:-250000}"
MARCADORES="$HOME/.claude/handoffs"
JQ=/usr/bin/jq
[ -x "$JQ" ] || JQ=$(command -v jq) || exit 0

entrada=$(cat)
transcript=$(printf '%s' "$entrada" | "$JQ" -r '.transcript_path // empty' 2>/dev/null)
sessao=$(printf '%s' "$entrada" | "$JQ" -r '.session_id // "sem-id"' 2>/dev/null)
evento=$(printf '%s' "$entrada" | "$JQ" -r '.hook_event_name // "PostToolUse"' 2>/dev/null)
[ -n "$transcript" ] && [ -f "$transcript" ] || exit 0

# desligado nesta sessao por "handoff off" (ver handoff-toggle.sh)
if [ -f "$MARCADORES/.desligado-$sessao" ]; then
  echo "$(date '+%F %T') evento=$evento desligado sessao=$sessao" > "$MARCADORES/.ultima-checagem"
  exit 0
fi

soma_usage='fromjson? | select(.isSidechain != true) | .message.usage? | select(. != null)
  | (.input_tokens // 0) + (.cache_read_input_tokens // 0) + (.cache_creation_input_tokens // 0)'

# maior contexto visto nas ultimas linhas do transcript, ignorando subagentes
tokens=$(tail -n 80 "$transcript" 2>/dev/null | "$JQ" -R "$soma_usage" 2>/dev/null | sort -n | tail -1)
[ -n "${tokens:-}" ] || tokens=0

# piso da sessao: primeiro usage do transcript. E o custo fixo do prompt (system,
# schemas de tool, listagem de MCP), que nao e trabalho acumulado. Sem descontar,
# uma sessao com muitos MCP ja nasce acima do limiar e dispara na primeira tool call.
base=$(head -n 80 "$transcript" 2>/dev/null | "$JQ" -R "$soma_usage" 2>/dev/null | head -1)
[ -n "${base:-}" ] && [ "$base" -le "$tokens" ] || base=$tokens
conversa=$(( tokens - base ))

mkdir -p "$MARCADORES"
echo "$(date '+%F %T') evento=$evento tokens=$tokens base=$base conversa=$conversa sessao=$sessao" > "$MARCADORES/.ultima-checagem"
marcador="$MARCADORES/.acionado-$sessao"
avisado="$MARCADORES/.avisado-$sessao"

# rearma depois de uma compactacao (conversa caiu para menos de 60% do limiar)
if [ "$conversa" -lt $(( LIMIAR * 6 / 10 )) ]; then
  rm -f "$marcador" "$avisado"
fi

[ "$conversa" -ge "$LIMIAR" ] || exit 0
k=$(( conversa / 1000 ))

if [ "$evento" != "Stop" ]; then
  [ -f "$avisado" ] && exit 0
  date > "$avisado"
  aviso="O contexto desta sessao passou do limiar de handoff: ~${k}k tokens de conversa (limiar ${LIMIAR}). Nao pare no meio: termine a etapa atual ate um marco natural (commit, decisao fechada, resultado medido e lido, resposta entregue). Ao chegar nele, invoque a skill handoff-auto. Nao comece etapa nova grande antes do handoff."
  "$JQ" -n --arg c "$aviso" --arg m "Conversa em ~${k}k tokens: handoff no proximo marco." \
    '{systemMessage:$m, hookSpecificOutput:{hookEventName:"PostToolUse", additionalContext:$c}}'
  exit 0
fi

[ -f "$marcador" ] && exit 0
date > "$marcador"

instrucao="O contexto desta sessao passou do limiar de handoff: ~${k}k tokens de conversa (limiar ${LIMIAR}). O turno terminou, entao este e o marco para passar o bastao: invoque a skill handoff-auto pela ferramenta Skill para gerar o documento de handoff e abrir a sessao nova do jeito que a skill manda para o ambiente atual (background no terminal, prompt pronto para colar no desktop). Depois de gerar, avise o usuario como a skill orienta e PARE de trabalhar nesta sessao. Se houver operacao que nao pode ficar pela metade, termine so ela, registre no documento e pare."
"$JQ" -n --arg r "$instrucao" --arg m "Conversa em ~${k}k tokens: gerando handoff automatico." \
  '{decision:"block", reason:$r, systemMessage:$m}'
