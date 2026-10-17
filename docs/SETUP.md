# O que só tu podes fazer (por ordem)

## 1. Printful
- Cria a loja "Manual order / API" e o produto. O NOME do produto na Printful tem de ser igual a `printfulName` em lib/products.ts.
- Token em Developers (ler produtos, criar pedidos). Se for token de conta: PRINTFUL_STORE_ID.
- Webhook (HTTPS):
  curl -X POST https://api.printful.com/webhooks -H "Authorization: Bearer $PRINTFUL_TOKEN" -H "Content-Type: application/json" -d '{"url":"https://TEUDOMINIO/api/webhooks/printful?secret=SEGREDO","types":["package_shipped","order_failed"]}'

## 2. Stripe
- Teste: STRIPE_SECRET_KEY. Corre `npm run seed` (gera lib/price-map.json). Confirma os tamanhos.
- Webhook de produção para /api/webhooks/stripe com os eventos: checkout.session.completed e checkout.session.expired.
- Opcional: cupão VOLTA10 (código promocional) para o e-mail 3.

## 3. Zoho CRM (região EU)
Campos (nome de API exato):
- Deals: Stripe_Session_ID, Tracking_URL, Tracking_Number, Carrier (texto), Marketing_OK (caixa)
- Contacts: Recovery_URL (texto)
Workflows:
- Envio: Deals, quando Tracking_URL é editado e não está vazio -> e-mail "A tua encomenda já seguiu caminho" (transacional).
- Pós-compra (só Marketing_OK marcado): e-mail 2 aos 18 dias do Closing_Date; e-mail 3 aos 28 dias.
- Carrinho abandonado (só Email_Opt_Out desmarcado e Recovery_URL preenchido): e-mail 1 após 1 h, e-mail 2 após 24 h; parar se o contacto tiver um Deal novo.
- Retirada: Tasks, ao criar com Subject contendo "Retirada de contrato" -> e-mail de confirmação ao contacto (comprovativo de receção).
Os textos dos e-mails estão no chat; cola-os nos templates.

## 4. Anúncios
- Meta e TikTok: pixel + token da API de eventos. Testa com META_TEST_EVENT_CODE e remove-o em produção.

## 5. Legal
- Preenche [campos] em lib/legal.ts e components/Footer.tsx. Pede revisão jurídica. Confirma a redação do botão de retirada na lei nacional.

## 6. Imagens
- Mockups em public/products/ e no campo `images` de cada produto (ou URLs files.cdn.printful.com).

## 7. Produção
- Vercel + domínio HTTPS, NEXT_PUBLIC_SITE_URL, chaves live, PRINTFUL_CONFIRM=true só aqui, ADMIN_USER/ADMIN_PASS fortes, Upstash.
- Sentry (ligar a [printful], [zoho], [capi], order_failed).
- Compra real de baixo valor + reembolso antes de qualquer anúncio.

## 8. Idempotência obrigatória antes de aceitar pedidos
- Configura `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` na Vercel (Production e Preview de teste). O webhook Stripe e o formulário de retirada falham de forma segura se o Redis não estiver configurado.
- O webhook usa um lock distribuído por sessão Stripe e uma marca de conclusão com TTL de 30 dias. Se o Zoho falhar, a Stripe recebe erro para repetir; a repetição procura o pedido Printful existente pelo `external_id` antes de tentar sincronizar o CRM novamente.
- Testa primeiro com chaves de teste Stripe e uma loja Printful de teste/drafts. Só ativa `PRINTFUL_CONFIRM=true` depois de validar custos, morada, variante e saldo, porque isso submete pedidos à produção e cobra o saldo Printful.
- Não publiques enquanto os campos legais em `lib/legal.ts` e `components/Footer.tsx` tiverem valores de exemplo, e enquanto os campos personalizados/workflows do Zoho não estiverem criados e verificados.
