// Uso: npx tsx --env-file=.env.local scripts/seed-stripe.ts
// Cria 1 Product + 1 Price na Stripe por cada sync variant da Printful,
// com metadata.printful_sync_variant_id (lido pelo webhook).
import Stripe from "stripe";
import { writeFileSync } from "node:fs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const headers: Record<string, string> = { Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}` };
if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

async function pf(path: string) {
  const res = await fetch(`https://api.printful.com${path}`, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(`Printful ${path}: ${JSON.stringify(json)}`);
  return json.result;
}

const FALLBACK_PRODUCTS = [
  { name: "Less Noise Tee", price: 3400, sizes: ["S", "M", "L", "XL"] },
  { name: "Stay Quiet Hoodie", price: 6400, sizes: ["S", "M", "L", "XL"] },
] as const;

async function createFallbackMap() {
  const out: Record<string, Record<string, string>> = {};

  for (const product of FALLBACK_PRODUCTS) {
    for (const size of product.sizes) {
      const stripeName = `${product.name} / ${size}`;
      const productRecord = await stripe.products.create({
        name: stripeName,
        metadata: { printful_sync_variant_id: `fallback_${product.name.toLowerCase().replace(/\s+/g, "-")}_${size}`, printful_product: product.name },
        default_price_data: { currency: "eur", unit_amount: product.price },
      });

      const priceId = productRecord.default_price as string;
      (out[product.name] ??= {})[size] = priceId;
      console.log(`${stripeName} -> ${priceId}`);
    }
  }

  return out;
}

async function main() {
  const list = await pf("/store/products?limit=100");
  const out: Record<string, Record<string, string>> = {};

  if (list.length === 0) {
    console.log("Printful sem produtos sincronizados. Criando fallback de demo na Stripe...");
    const fallback = await createFallbackMap();
    Object.assign(out, fallback);
  } else {
    for (const sp of list) {
      const { sync_product, sync_variants } = await pf(`/store/products/${sp.id}`);
      for (const v of sync_variants) {
        const key = String(v.id);
        // Nome do produto Stripe controlado por nós: "<produto Printful> / <variante>" (o /admin agrupa pelo 1º segmento)
        const label = (v.name.startsWith(sync_product.name)
          ? v.name.slice(sync_product.name.length).replace(/^[\s/|\-–—(]+|[)\s]+$/g, "")
          : v.name) || v.name;
        const stripeName = `${sync_product.name} / ${label}`;
        const size = label.split("/").pop()!.trim();
        const found = await stripe.products.search({
          query: `metadata['printful_sync_variant_id']:'${key}'`,
          limit: 1,
        });

        let priceId: string;
        if (found.data[0]) {
          priceId = found.data[0].default_price as string;
        } else {
          const product = await stripe.products.create({
            name: stripeName,
            metadata: { printful_sync_variant_id: key, printful_product: sync_product.name },
            default_price_data: {
              currency: v.currency.toLowerCase(),
              unit_amount: Math.round(parseFloat(v.retail_price) * 100),
            },
          });
          priceId = product.default_price as string;
        }
        (out[sync_product.name] ??= {})[size] = priceId;
        console.log(`${stripeName} -> ${priceId}`);
      }
    }
  }
  writeFileSync("lib/price-map.json", JSON.stringify(out, null, 2));
  console.log("\nEscrito em lib/price-map.json. Confirma que os tamanhos (S/M/L/XL) estão certos.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
