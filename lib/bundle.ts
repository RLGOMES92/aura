import { products } from "./products";

// Bundle: leva 1 de cada peça e ganha % de desconto sobre esse par.
export const BUNDLE = { slugs: ["less-noise-tee", "stay-quiet-hoodie"], pct: 0.15 };

export const slugOfPrice = new Map(
  products.flatMap((p) => Object.values(p.variants).map((id) => [id, p.slug] as const))
);

export type BLine = { slug?: string; qty: number; unit: number }; // unit em cêntimos

// Desconto em cêntimos. Usado no cliente (UI) e no servidor (valor que conta).
export function bundleDiscount(lines: BLine[]): number {
  const per = BUNDLE.slugs.map((s) => {
    const ls = lines.filter((l) => l.slug === s);
    return { qty: ls.reduce((a, l) => a + l.qty, 0), unit: ls.length ? Math.min(...ls.map((l) => l.unit)) : 0 };
  });
  const n = Math.min(...per.map((p) => p.qty));
  if (n <= 0) return 0;
  return Math.round(n * per.reduce((a, p) => a + p.unit, 0) * BUNDLE.pct);
}
