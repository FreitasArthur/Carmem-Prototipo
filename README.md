# Carmen-Prototipo

Protótipo de landing page institucional para Carmem Testoni | Advogados Associados.

## Desenvolvimento

```bash
npm ci
npm run dev
npm run build
npm test
```

No Windows PowerShell, caso a política de execução bloqueie o arquivo
`npm.ps1`, use o executável do npm diretamente:

```powershell
npm.cmd install
npm.cmd run dev
```

O projeto roda como uma aplicação Next local comum, sem autenticação externa e
sem runtime de servidor. A exportação estática é publicada no Cloudflare
Workers Static Assets. Para publicar em um domínio depois, configure a variável
`NEXT_PUBLIC_SITE_URL` com a URL final do site antes do build.

O build gera uma exportação estática em `out/`. Para conferir essa versão
localmente, execute `npm start`. As verificações de segurança disponíveis são:

```bash
npm run security:audit
npm run verify:whatsapp
```

O arquivo `public/_headers` configura cache e headers de segurança no
Cloudflare. O canal para relatos de vulnerabilidade fica em
`public/.well-known/security.txt`. O monitor externo deve ser configurado para
o endereço publicado; consulte `SECURITY.md`.

## Feed do Instagram

A seção abaixo de Contato consome um feed JSON autorizado e exibe a bio, a foto
do perfil e as quatro publicações mais recentes de `@advocaciacarmemtestoni`.
Para ativar a atualização automática:

1. Crie uma conta no Behold e conecte a conta profissional do Instagram com a
   autorização da proprietária.
2. Crie um feed do tipo JSON, limite-o a quatro posts e copie a URL pública no
   formato `https://feeds.behold.so/SEU_FEED_ID`.
3. Defina `NEXT_PUBLIC_INSTAGRAM_FEED_URL` antes de executar o build. O arquivo
   `.env.example` documenta o nome da variável sem armazenar credenciais.

A URL do feed não contém a senha nem o token do Instagram. O serviço mantém a
autorização e a atualização das publicações; o site busca os dados novamente em
cada visita.

## Observações para publicação

- Substituir as fotografias temporárias por imagens oficiais, quando disponíveis.
- Confirmar OAB, endereço, horário de atendimento, Instagram e e-mail antes da publicação definitiva.
- O formulário serve apenas para contato inicial e direciona a mensagem para o WhatsApp informado.
