#!/bin/bash
# Testa o agy-rodar.sh com um agy-conta falso: revezamento, cota, conta sem modelo e --model próprio.
set -eu
AQUI="$(cd "$(dirname "$0")" && pwd)"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

cat > "$tmp/agy-conta" <<'EOF'
#!/bin/bash
conta=$1; shift
if [ "${1:-}" = models ]; then
  echo "Fetching available models..."
  [ "$conta" = semmodelo ] || printf 'gemini-3.8-flash-high\tGemini 3.8 Flash (High)\n'
  printf 'gpt-oss-120b-medium\tGPT-OSS 120B (Medium)\n'
  exit 0
fi
case $conta in semcota*) echo "Error: Individual quota reached"; exit 1 ;; esac
echo "rodou conta=$conta args=$*"
EOF
chmod +x "$tmp/agy-conta"
export AGY_CONTA_BIN="$tmp/agy-conta" AGY_RODAR_ESTADO="$tmp/estado"

roda() { AGY_CONTAS="$1" "$AQUI/agy-rodar.sh" -p "faça X" --add-dir /repo "${@:2}" 2>/dev/null; }
falha() { echo "FALHA: $*"; exit 1; }

rm -f "$tmp/estado"
s=$(roda "semcota boa") || falha "cota: saiu com erro"
case $s in *"conta=boa"*"Retomada"*) ;; *) falha "cota: não pulou para a próxima com aviso de retomada: $s" ;; esac

rm -f "$tmp/estado"
s=$(roda "semmodelo boa") || falha "modelo: saiu com erro"
case $s in *"conta=boa"*) ;; *) falha "modelo: não pulou a conta sem o modelo: $s" ;; esac
case $s in *Retomada*) falha "modelo: pôs aviso de retomada sem ter havido cota" ;; esac
case $s in *"--model gemini-3.8-flash-high"*) ;; *) falha "modelo padrão não foi passado: $s" ;; esac

rm -f "$tmp/estado"
set +e; roda "semcota semcota2" >/dev/null; codigo=$?; set -e
[ "$codigo" = 75 ] || falha "todas sem cota: esperava 75, veio $codigo"

rm -f "$tmp/estado"
s1=$(roda "a b"); s2=$(roda "a b"); s3=$(roda "a b")
case "$s1|$s2|$s3" in *"conta=a"*"|"*"conta=b"*"|"*"conta=a"*) ;; *) falha "revezamento: $s1 | $s2 | $s3" ;; esac

rm -f "$tmp/estado"
s=$(roda "semmodelo" --model gpt-oss-120b-medium) || falha "--model próprio: saiu com erro"
case $s in *"--model gpt-oss-120b-medium"*) ;; *) falha "--model próprio não foi respeitado: $s" ;; esac
case $s in *flash*) falha "--model próprio: injetou o padrão também" ;; esac

echo OK
