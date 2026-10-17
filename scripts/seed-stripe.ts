// Uso: npx tsx --env-file=.env.local scripts/seed-stripe.ts
// Cria preços BRL na Stripe para as variantes sincronizadas dos dois produtos AURA VI VII.
// Antes de executar, confira STRIPE_SECRET_KEY (modo live somente após testes) e PRINTFUL_TOKEN/STORE_ID.
import Stripe from "stripe";
import { writeFileSync } from "node:fs";

if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY ausente.");
if (!process.env.PRINTFUL_TOKEN) throw new Error("PRINTFUL_TOKEN ausente.");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const headers: Record<string, string> = { Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}` };
if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

const catalog: Record<string, { retail: number; slug: string }> = {
  "Less Noise Tee": { retail: 17990, slug: "less-noise-tee" },
  "Stay Quiet Hoodie": { retail: 32990, slug: "stay-quiet-hoodie" },
};
const sizes = ["S", "M", "L", "XL"] as const;

async function pf(path: string) {
  const res = await fetch(`https://api.printful.com${path}`, { headers });
  const json = await res.json();
  if (!res.ok) throw new Error(`Printful ${path}: HTTP ${res.status}`);
  return json.result;
}

async function main() {
  const list = await pf("/store/products?limit=100");
  if (!Array.isArray(list) || list.length === 0) throw new Error("Nenhum produto sincronizado encontrado na Printful.");

  const out: Record<string, Record<string, string>> = {};
  for (const sp of list) {
    const details = await pf(`/store/products/${sp.id}`);
    const productName = details.sync_product?.name;
    const config = catalog[productName];
    if (!config) continue;
    const syncVariants = details.sync_variants ?? [];
    const matched: Record<string, { id: number; name: string }> = {};
    for (const v of syncVariants) {
      const name = String(v.name ?? "");
      const label = name.startsWith(productName) ? name.slice(productName.length).replace(/^[\s/|\-–—(]+|[)\s]+$/g, "") : name;
      const size = label.split("/").pop()?.trim().toUpperCase();
      if (sizes.includes(size as typeof sizes[number])) matched[size!] = { id: Number(v.id), name };
    }
    for (const size of sizes) {
      const variant = matched[size];
      if (!variant?.id) throw new Error(`Printful: falta variante ${productName} tamanho ${size}. Nada foi escrito em price-map.json.`);
      const found = await stripe.products.search({
        query: `metadata['printful_sync_variant_id']:'${variant.id}'`, limit: 1,
      });
      let productId: string;
      if (found.data[0]) {
        productId = found.data[0].id;
      } else {
        const p = await stripe.products.create({
          name: `${productName} / ${size}`,
          metadata: { printful_sync_variant_id: String(variant.id), printful_product: productName },
        });
        productId = p.id;
      }
      const existing = await stripe.prices.list({ product: productId, active: true, limit: 100 });
      const price = existing.data.find(p => p.currency === "brl" && p.unit_amount === config.retail && p.type === "one_time");
      const created = price ?? await stripe.prices.create({
        product: productId, currency: "brl", unit_amount: config.retail,
        metadata: { printful_sync_variant_id: String(variant.id), aura_currency: "BRL" },
      });
      await stripe.products.update(productId, { default_price: created.id });
      (out[productName] ??= {})[size] = created.id;
      console.log(`${productName} ${size}: preço BRL confirmado na Stripe`);
    }
  }
  for (const name of Object.keys(catalog)) {
    if (sizes.some(size => !out[name]?.[size])) throw new Error(`Não foi possível mapear todas as variantes de ${name}; price-map.json não será atualizado.`);
  }
  writeFileSync("lib/price-map.json", JSON.stringify(out, null, 2) + "\n");
  console.log("lib/price-map.json atualizado com IDs Stripe BRL. Revise os IDs e rode npm run build.");
}

main().catch((e) => { console.error(e); process.exit(1); });
