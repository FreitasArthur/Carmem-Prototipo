# Política de segurança

## Contato oficial protegido

O único número autorizado para os links de WhatsApp deste projeto é
`5547997711897`. O build e a automação de CI falham se outro número aparecer
na configuração ou na exportação final.

## Relato responsável

Não abra uma issue pública para relatar uma vulnerabilidade. Use o recurso
**Security advisories** do repositório privado e informe a página afetada,
o impacto esperado e passos mínimos para reprodução. Não inclua dados reais
de clientes ou credenciais.

## Monitoramento após a publicação

Quando o domínio HTTPS estiver ativo, configure um serviço externo para executar
periodicamente:

```bash
MONITOR_SITE_URL=https://exemplo.com.br npm run monitor:site
```

O monitor falha quando o site sai do ar, perde HTTPS ou headers de segurança,
ou passa a exibir um número de WhatsApp diferente do oficial.

## Resposta a incidente

Em caso de alteração não autorizada, suspenda a publicação no Netlify, preserve
os logs, revogue sessões e tokens, restaure um deploy conhecido e verificado,
e revise acessos do GitHub, Netlify, registrador e DNS antes de republicar.
