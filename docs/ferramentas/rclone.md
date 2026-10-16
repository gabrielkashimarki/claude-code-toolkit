# rclone

CLI que copia, sincroniza e confere arquivos entre Google Drive, Dropbox, S3, disco externo e mais de 70 outros destinos. Aqui ele entra para um caso: mover uma pasta grande de um Drive para outro sem baixar nada.

## Configurar um remoto

```bash
rclone config          # n, nome do remoto, "drive", e login no navegador
rclone listremotes
rclone about meudrive:  # cota e uso da conta logada
```

- Escopo `drive` lê e escreve. Para um remoto que só lê, escolha `drive.readonly`.
- O rclone vem com um client_id do Google compartilhado por todo mundo, e ele bate em `rateLimitExceeded` com facilidade. Para uso pesado, crie um client OAuth próprio no Google Cloud e informe no `rclone config`.
- O token fica em `~/.config/rclone/rclone.conf`. Trate esse arquivo como segredo: nunca entra em repositório.

## Copiar de um Drive para outro, servidor a servidor

Basta que a conta do remoto consiga ler a origem, seja porque a pasta foi compartilhada com ela ou porque está aberta para quem tem o link. Origem e destino podem ser pastas por ID ou drives compartilhados. Não é preciso criar um remoto novo para cada um: os parâmetros vão no próprio nome do remoto.

```bash
# IDs dos drives compartilhados que a conta enxerga
rclone backend drives meudrive:

# tamanho da origem (o ID é o fim da URL da pasta)
rclone size "meudrive,root_folder_id=ID_DA_PASTA:"

# ensaio, depois a cópia de verdade
rclone copy "meudrive,root_folder_id=ID_DA_PASTA:" "meudrive,team_drive=ID_DO_DRIVE:Destino/Nome" \
  --drive-server-side-across-configs --tpslimit 8 --transfers 8 -v --dry-run
```

Tire o `--dry-run` para copiar de verdade. A linha `Copied (server-side copy)` no log confirma que os bytes não passaram pela sua máquina. Se aparecer só `Copied`, ele está baixando e subindo.

- `--drive-server-side-across-configs` é obrigatório aqui: com parâmetros diferentes no nome, o rclone trata origem e destino como remotos distintos e, sem a flag, baixa e sobe tudo.
- O arquivo copiado ocupa a cota do destino: o dono da pasta, ou a organização no caso de drive compartilhado. Confira com `rclone about` antes de copiar.
- O Google limita cada usuário a 750 GB por dia de upload, e cópia servidor a servidor entra na conta. Acima disso, divida em dias.
- Pasta com milhares de arquivos demora mais para listar do que para copiar. Rode em segundo plano com `--log-file`.

## Conferir depois

```bash
rclone check "meudrive,root_folder_id=ID_DA_PASTA:" "meudrive,team_drive=ID_DO_DRIVE:Destino/Nome" \
  --drive-server-side-across-configs --one-way
```

O `check` compara tamanho e hash de cada arquivo. Se terminar com `0 differences found`, a cópia está completa.

`copy` nunca apaga nada no destino. `sync` apaga no destino o que não existe na origem: use `copy` a menos que queira um espelho exato, e só com `--dry-run` antes.
