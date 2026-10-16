# .env.local (novas)
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
META_CAPI_TOKEN=
TIKTOK_EVENTS_TOKEN=
META_TEST_EVENT_CODE=   # só em testes; remove em produção

# app/layout.tsx -> dentro de <CartProvider>, depois de {children}:
import { Pixels } from "@/components/Pixels";
<Pixels />

# components/AddToCart.tsx -> no onClick, quando há size:
import { track } from "./Pixels";
track("AddToCart", { name: product.name, value: product.price });

# app/produto/[slug]/page.tsx -> dentro do <main>:
import { PageEvent } from "@/components/Pixels";
<PageEvent event="ViewContent" data={{ name: p.name, value: p.price }} />

# app/api/webhooks/stripe/route.ts -> depois do try/catch do Zoho:
import { sendPurchase } from "@/lib/capi";
try { await sendPurchase(session); } catch (e) { console.error("[capi]", e); }
