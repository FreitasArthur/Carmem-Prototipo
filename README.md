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

O projeto agora roda como uma aplicação Next local comum, sem autenticação
externa, sem configuração de hosting gerenciado e sem runtime de Worker. Para
publicar em um domínio depois, configure a variável `NEXT_PUBLIC_SITE_URL` com
a URL final do site antes do build.

O build gera uma exportação estática em `out/`. Para conferir essa versão
localmente, execute `npm start`. As verificações de segurança disponíveis são:

```bash
npm run security:audit
npm run verify:whatsapp
```

O arquivo `netlify.toml` já contém a configuração de build, cache e headers de
segurança. A publicação e o monitor externo devem ser ativados somente quando o
domínio definitivo estiver disponível; consulte `SECURITY.md`.

## Feed do Instagram

A seção abaixo de Contato consome o feed JSON autorizado de
`@advocaciacarmemtestoni` e exibe a bio, a foto do perfil e as quatro
publicações mais recentes. A URL pública do feed já está configurada no projeto.
Se for necessário trocar de feed futuramente, defina
`NEXT_PUBLIC_INSTAGRAM_FEED_URL` antes de executar o build; o arquivo
`.env.example` documenta o formato da variável sem armazenar credenciais.

A URL do feed não contém a senha nem o token do Instagram. O serviço mantém a
autorização e a atualização das publicações; o site busca os dados novamente em
cada visita.

## Observações para publicação

- Substituir as fotografias temporárias por imagens oficiais, quando disponíveis.
- Confirmar OAB, endereço, horário de atendimento, Instagram e e-mail antes da publicação definitiva.
- O formulário serve apenas para contato inicial e direciona a mensagem para o WhatsApp informado.
