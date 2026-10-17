import priceMap from "./price-map.json"; // IDs gerados pelo seed da Stripe

export type Size = "S" | "M" | "L" | "XL";
export const SIZES: Size[] = ["S", "M", "L", "XL"];

export type Product = {
  slug: string;
  printfulName: string;
  name: string; tagline: string; description: string;
  price: number; // BRL
  images?: string[];
  variants: Record<Size, string>;
};

const map = priceMap as Record<string, Record<string, string>>;
const variants = (printfulName: string, slug: string) =>
  Object.fromEntries(SIZES.map((s) => [s, map[printfulName]?.[s] ?? `price_REPLACE_${slug}_${s}`])) as Record<Size, string>;

const base: Omit<Product, "variants">[] = [
  {
    slug: "less-noise-tee", printfulName: "Less Noise Tee", name: "Camiseta Less Noise",
    tagline: "Algodão encorpado. Uma frase no verso.",
    description: "Camiseta de modelagem boxy em algodão encorpado, com estampa minimalista na frente. Feita por encomenda.",
    price: 179.90,
  },
  {
    slug: "stay-quiet-hoodie", printfulName: "Stay Quiet Hoodie", name: "Moletom Stay Quiet",
    tagline: "Corte oversized e interior macio. A mensagem fala por si.",
    description: "Moletom com capuz, modelagem oversized e bordado discreto. Corte limpo e tecido confortável para o dia a dia.",
    price: 329.90,
  },
];

export const products: Product[] = base.map((p) => ({ ...p, variants: variants(p.printfulName, p.slug) }));
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const brl = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
