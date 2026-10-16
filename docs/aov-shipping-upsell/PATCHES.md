# components/CartProvider.tsx
import { ShippingProgress } from "./ShippingProgress";
const [marketing, setMarketing] = useState(false);          // junto aos outros useState
body: JSON.stringify({ items: items.map(({ priceId, qty }) => ({ priceId, qty })), marketing })

# No drawer, dentro de {items.length > 0 && (...)}, antes da linha do Subtotal:
<ShippingProgress total={total} />

# Antes do botão "Pagar com segurança":
<label className="mb-3 flex gap-2 text-sm">
  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
  Quero receber novidades e ofertas por e-mail. Posso sair quando quiser.
</label>

# Troca o texto pequeno final por:
Cada peça é produzida só depois da tua encomenda.

# app/produto/[slug]/page.tsx (fim do <main>)
import { Related } from "@/components/Related";
<Related current={p.slug} />

# Webhook Stripe (Zoho): troca session.consent?.promotions por session.metadata?.marketing
Email_Opt_Out: session.metadata?.marketing !== "1",
Marketing_OK: session.metadata?.marketing === "1",

# Carrinho abandonado (checkout.session.expired): onde estava
#   session.consent?.promotions === "opt_in"
# passa a ser
#   session.metadata?.marketing === "1"

# Se acrescentaste consent_collection: { promotions: "auto" } ao checkout, remove-o (ver nota).
