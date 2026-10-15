#!/bin/bash
# Despacha um pedido ao agy revezando as contas e pulando para a próxima quando a cota acaba.
#
# Uso: agy-rodar.sh -p "<pedido>" --add-dir <repo> [outros argumentos do agy]
#
# - Contas: AGY_CONTAS="principal conta2 conta3"; sem a variável, usa "principal" mais as pastas ~/agy-*.
# - Modelo: AGY_MODELO (padrão gemini-3.8-flash-high), a não ser que os argumentos já tragam --model.
#   Conta que não lista o modelo em "models" é pulada (com id inválido o agy só imprime a lista e sai).
# - Cota: se a saída tiver "Individual quota reached", tenta a próxima conta. O pedido ganha um aviso
#   de retomada, porque a conta anterior pode ter deixado alterações pela metade no disco.
# - Revezamento: cada chamada começa na conta seguinte à da chamada anterior.
# - Sem agy-conta (Windows ou Linux): roda o agy direto, numa conta só.
#
# Saída: código do agy; 75 quando todas as contas estão sem cota ou sem o modelo.
set -uo pipefail

MODELO=${AGY_MODELO:-gemini-3.8-flash-high}
AVISO_COTA="Individual quota reached"
RETOMADA="(Retomada: a execução anterior parou por falta de cota em outra conta. Antes de começar, confira git status e git diff; continue de onde parou, sem refazer o que já está feito.)"

tem_modelo=0
for a in "$@"; do case $a in --model|--model=*) tem_modelo=1 ;; esac; done
[ $tem_modelo = 1 ] || set -- "$@" --model "$MODELO"
for a in "$@"; do
  [ "${prox_modelo:-0}" = 1 ] && { MODELO=$a; prox_modelo=0; }
  case $a in --model) prox_modelo=1 ;; --model=*) MODELO=${a#--model=} ;; esac
done

AQUI=$(cd "$(dirname "$0")" && pwd)
CONTA_BIN=${AGY_CONTA_BIN:-$(command -v agy-conta || true)}
if [ -z "$CONTA_BIN" ] && command -v sandbox-exec >/dev/null && [ -x "$AQUI/agy-conta.sh" ]; then
  CONTA_BIN=$AQUI/agy-conta.sh
fi
if [ -z "$CONTA_BIN" ]; then
  echo "agy-rodar: sem agy-conta, rodando o agy direto numa conta só" >&2
  exec agy "$@"
fi

if [ -n "${AGY_CONTAS:-}" ]; then
  read -r -a CONTAS <<< "$AGY_CONTAS"
else
  CONTAS=(principal)
  for d in "$HOME"/agy-*/; do [ -d "$d" ] && n=$(basename "$d") && CONTAS+=("${n#agy-}"); done
fi
N=${#CONTAS[@]}

# ponytail: estado do revezamento num arquivo sem trava; chamadas simultâneas podem começar na mesma
# conta, o que só desequilibra o uso. Trava com mkdir se isso pesar.
ESTADO=${AGY_RODAR_ESTADO:-$HOME/.cache/agy-rodar/proxima}
mkdir -p "$(dirname "$ESTADO")"
inicio=$(cat "$ESTADO" 2>/dev/null || echo 0)
case $inicio in ''|*[!0-9]*) inicio=0 ;; esac
echo $(( (inicio + 1) % N )) > "$ESTADO"

# acrescenta o aviso de retomada ao texto que vem depois de -p/--print/--prompt
com_retomada() {
  local saida=() prox=0 a
  for a in "$@"; do
    if [ $prox = 1 ]; then a="$a"$'\n\n'"$RETOMADA"; prox=0; fi
    case $a in -p|--print|--prompt) prox=1 ;; esac
    saida+=("$a")
  done
  ARGS=("${saida[@]}")
}

SAIDA=$(mktemp); trap 'rm -f "$SAIDA"' EXIT
ARGS=("$@")
for (( i = 0; i < N; i++ )); do
  conta=${CONTAS[$(( (inicio + i) % N ))]}
  if ! "$CONTA_BIN" "$conta" models 2>/dev/null | awk -v m="$MODELO" '$1 == m { achou = 1 } END { exit !achou }'; then
    echo "agy-rodar: conta $conta sem o modelo $MODELO (ou sem login), pulando" >&2
    continue
  fi
  echo "agy-rodar: conta $conta, modelo $MODELO" >&2
  "$CONTA_BIN" "$conta" "${ARGS[@]}" 2>&1 | tee "$SAIDA"
  codigo=${PIPESTATUS[0]}
  if grep -q "$AVISO_COTA" "$SAIDA"; then
    echo "agy-rodar: conta $conta sem cota, tentando a próxima" >&2
    com_retomada "$@"
    continue
  fi
  exit "$codigo"
done

echo "agy-rodar: nenhuma conta com cota e com o modelo $MODELO" >&2
exit 75
