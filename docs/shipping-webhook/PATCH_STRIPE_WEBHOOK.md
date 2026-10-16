# app/api/webhooks/stripe/route.ts
# 1) Apaga o bloco zohoCache/zohoToken/zoho() e importa:
import { zoho } from "@/lib/zoho";
# 2) Troca as chamadas: zoho("Contacts/upsert", {...}) -> zoho("POST", "Contacts/upsert", {...})
#    e zoho("Deals", {...}) -> zoho("POST", "Deals", {...})
# 3) No objeto do Deal acrescenta:
Stripe_Session_ID: session.id,

# .env.local
PRINTFUL_WEBHOOK_SECRET=<gera com: openssl rand -hex 24>

# Registar o webhook na Printful (precisa de HTTPS; em local usa um túnel):
curl -X POST https://api.printful.com/webhooks \
  -H "Authorization: Bearer $PRINTFUL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://TEUDOMINIO/api/webhooks/printful?secret=SEGREDO","types":["package_shipped","order_failed"]}'
# (token de conta: acrescenta -H "X-PF-Store-Id: ID_DA_LOJA")
