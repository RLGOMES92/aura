# components/CartProvider.tsx
import { BundleSummary } from "./BundleSummary";
import { bundleDiscount } from "@/lib/bundle";

# 1) Tipo: acrescenta slug
export type CartItem = { slug: string; priceId: string; name: string; size: string; price: number; qty: number };

# 2) Depois de calcular `total`:
const discount = bundleDiscount(items.map((i) => ({ slug: i.slug, qty: i.qty, unit: Math.round(i.price * 100) }))) / 100;
const net = total - discount;

# 3) No drawer: <ShippingProgress total={net} />  (em vez de total)
#    Antes da linha do Subtotal: <BundleSummary items={items} />
#    Na linha do Subtotal mostra {eur(net)} (em vez de {eur(total)})

# components/AddToCart.tsx
add({ slug: product.slug, priceId: product.variants[size], name: product.name, size, price: product.price })

# lib/bundle.ts: confirma que BUNDLE.slugs batem com os slugs reais em lib/products.ts

# Carrinhos antigos no localStorage não têm slug: limpa o localStorage ao testar.
# Cupões "Bundle" ficam criados na Stripe (1 por checkout). É normal; podes arquivá-los de vez em quando.
