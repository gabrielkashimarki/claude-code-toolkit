#!/bin/bash
# Verifica que o hook so dispara por conversa acumulada, nao pelo piso do prompt.
set -eu
HOOK="$(cd "$(dirname "$0")" && pwd)/handoff-contexto.sh"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
export HOME="$tmp"
mkdir -p "$HOME/.claude"
export CLAUDE_HANDOFF_LIMIAR=80000

# transcript falso: piso de 110k (sessao com muitos MCP) e um ultimo turno
monta() {
  local total=$1 arq="$tmp/t-$1.jsonl"
  echo '{"type":"user","message":{"role":"user"}}' > "$arq"
  echo '{"type":"assistant","message":{"usage":{"input_tokens":4,"cache_creation_input_tokens":110000,"cache_read_input_tokens":0}}}' >> "$arq"
  echo "{\"type\":\"assistant\",\"message\":{\"usage\":{\"input_tokens\":4,\"cache_read_input_tokens\":$(( total - 4 ))}}}" >> "$arq"
  echo "$arq"
}
roda() {
  printf '{"transcript_path":"%s","session_id":"%s","hook_event_name":"%s"}' "$1" "$2" "${3:-PostToolUse}" | "$HOOK"
}

# 150k total = 40k de conversa: abaixo do limiar de 80k, nao dispara
saida=$(roda "$(monta 150000)" s1)
[ -z "$saida" ] || { echo "FALHA: disparou com 40k de conversa: $saida"; exit 1; }

# 200k total = 90k de conversa: no meio da tarefa so avisa, sem bloquear
saida=$(roda "$(monta 200000)" s2)
case "$saida" in *"Nao pare no meio"*) ;; *) echo "FALHA: nao avisou com 90k de conversa: $saida"; exit 1;; esac
case "$saida" in *'"decision"'*) echo "FALHA: bloqueou no PostToolUse: $saida"; exit 1;; esac

# o aviso nao repete
saida=$(roda "$(monta 200000)" s2)
[ -z "$saida" ] || { echo "FALHA: avisou duas vezes: $saida"; exit 1; }

# no fim do turno pede o handoff, uma vez
saida=$(roda "$(monta 200000)" s2 Stop)
case "$saida" in *'"decision": "block"'*handoff-auto*|*'"decision":"block"'*handoff-auto*) ;; *) echo "FALHA: Stop nao pediu handoff: $saida"; exit 1;; esac
saida=$(roda "$(monta 200000)" s2 Stop)
[ -z "$saida" ] || { echo "FALHA: Stop pediu handoff duas vezes"; exit 1; }

# padrao sem env: 250k
unset CLAUDE_HANDOFF_LIMIAR
saida=$(roda "$(monta 300000)" s3 Stop)
[ -z "$saida" ] || { echo "FALHA: disparou com 190k e limiar padrao 250k: $saida"; exit 1; }

echo OK
