# Loja POD (Next.js + Stripe + Printful + Zoho)

1. `npm i`
2. `cp .env.example .env.local` e preenche (ver docs/ para cada integração)
3. Preenche os [campos] em `lib/legal.ts` e `components/Footer.tsx`
4. `npm run seed` cria produtos/preços na Stripe a partir da Printful e escreve `lib/price-map.json` (o `printfulName` em `lib/products.ts` tem de ser igual ao nome na Printful; confirma os slugs em `lib/bundle.ts`)
5. `stripe listen --forward-to localhost:3000/api/webhooks/stripe` e copia o whsec_ para o .env.local
6. `npm run dev`

Campos a criar no Zoho (módulo Deals): Stripe_Session_ID, Tracking_URL, Tracking_Number, Carrier (texto), Marketing_OK (caixa).
Módulo Contacts: Recovery_URL (texto).
O pedido da Printful fica em RASCUNHO até PRINTFUL_CONFIRM=true.

Tudo o que falta fazer à mão: docs/SETUP.md
