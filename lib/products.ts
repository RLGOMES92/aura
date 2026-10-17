import priceMap from "./price-map.json"; // gerado por `npm run seed`

export type Size = "S" | "M" | "L" | "XL";
export const SIZES: Size[] = ["S", "M", "L", "XL"];

export type Product = {
  slug: string;
  printfulName: string; // tem de ser IGUAL ao nome do produto na Printful
  name: string; tagline: string; description: string;
  price: number; // EUR
  images?: string[]; // ex.: "/products/less-noise-tee-1.jpg" (pasta public/) ou URL da Printful
  variants: Record<Size, string>; // Price IDs da Stripe
};

const map = priceMap as Record<string, Record<string, string>>;
const variants = (printfulName: string, slug: string) =>
  Object.fromEntries(SIZES.map((s) => [s, map[printfulName]?.[s] ?? `price_REPLACE_${slug}_${s}`])) as Record<Size, string>;

const base: Omit<Product, "variants">[] = [
  {
    slug: "less-noise-tee", printfulName: "Less Noise Tee", name: "Camiseta Less Noise",
    tagline: "Algodão encorpado. Uma frase no verso.",
    description: "Camiseta de modelagem boxy em algodão encorpado, com estampa minimalista na frente. Feita por encomenda.",
    price: 34,
  },
  {
    slug: "stay-quiet-hoodie", printfulName: "Stay Quiet Hoodie", name: "Moletom Stay Quiet",
    tagline: "Corte oversized e interior macio. A mensagem fala por si.",
    description: "Moletom com capuz, modelagem oversized e bordado discreto. Corte limpo e tecido confortável para o dia a dia.",
    price: 64,
  },
];

export const products: Product[] = base.map((p) => ({ ...p, variants: variants(p.printfulName, p.slug) }));
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const eur = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n); // preços e Stripe continuam em EUR até configurar venda em BRL
