#!/bin/bash
# Liga e desliga o handoff automatico por sessao.
# Hook UserPromptSubmit: se o prompt for "handoff off" ou "handoff on", grava ou
# apaga o marcador ~/.claude/handoffs/.desligado-<session_id>, que o
# handoff-contexto.sh consulta antes de medir o contexto. O prompt e bloqueado
# (nao chega ao modelo) e a confirmacao aparece na tela.

set -u
MARCADORES="$HOME/.claude/handoffs"
JQ=/usr/bin/jq
[ -x "$JQ" ] || JQ=$(command -v jq) || exit 0

entrada=$(cat)
sessao=$(printf '%s' "$entrada" | "$JQ" -r '.session_id // empty' 2>/dev/null)
prompt=$(printf '%s' "$entrada" | "$JQ" -r '.prompt // empty' 2>/dev/null \
  | tr '[:upper:]' '[:lower:]' | sed -E 's/^[[:space:]]+//; s/[[:space:].]+$//')
[ -n "$sessao" ] || exit 0

case "$prompt" in
  "handoff off"|"/handoff off"|handoff-off|/handoff-off)
    mkdir -p "$MARCADORES"
    date > "$MARCADORES/.desligado-$sessao"
    msg="Handoff automatico desligado nesta sessao. Para religar: handoff on" ;;
  "handoff on"|"/handoff on"|handoff-on|/handoff-on)
    rm -f "$MARCADORES/.desligado-$sessao"
    msg="Handoff automatico ligado nesta sessao." ;;
  *) exit 0 ;;
esac

"$JQ" -n --arg r "$msg" '{decision:"block", reason:$r}'
