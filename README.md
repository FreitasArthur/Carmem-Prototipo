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

## Observações para publicação

- Substituir as fotografias temporárias por imagens oficiais, quando disponíveis.
- Confirmar OAB, endereço, horário de atendimento, Instagram e e-mail antes da publicação definitiva.
- O formulário serve apenas para contato inicial e direciona a mensagem para o WhatsApp informado.
