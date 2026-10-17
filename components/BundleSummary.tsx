import { products, brl } from "@/lib/products";
import { BUNDLE, bundleDiscount } from "@/lib/bundle";
import type { CartItem } from "./CartProvider";

export function BundleSummary({ items }: { items: CartItem[] }) {
  const lines = items.map((i) => ({ slug: i.slug, qty: i.qty, unit: Math.round(i.price * 100) }));
  const discount = bundleDiscount(lines);

  if (discount > 0)
    return (
      <p className="mb-3 flex justify-between text-sm font-semibold">
        <span>Bundle {Math.round(BUNDLE.pct * 100)}%</span><span>−{brl(discount / 100)}</span>
      </p>
    );

  const have = BUNDLE.slugs.filter((s) => lines.some((l) => l.slug === s));
  if (have.length !== 1) return null;
  const missing = products.find((p) => p.slug === BUNDLE.slugs.find((s) => s !== have[0]));
  if (!missing) return null;
  const saving = bundleDiscount([...lines, { slug: missing.slug, qty: 1, unit: Math.round(missing.price * 100) }]);
  return (
    <p className="mb-3 text-sm">
      Junta a <a href={`/produto/${missing.slug}`} className="font-bold underline">{missing.name}</a> e poupas {brl(saving / 100)}.
    </p>
  );
}
