import Link from "next/link";
import { products, eur } from "@/lib/products";

// Server component. Mostra as outras peças na página de produto.
export function Related({ current }: { current: string }) {
  const others = products.filter((p) => p.slug !== current).slice(0, 2);
  if (others.length === 0) return null;
  return (
    <section className="mt-12 md:col-span-2">
      <h2 className="text-xl font-extrabold">Combina com</h2>
      <div className="mt-4 grid gap-px bg-black sm:grid-cols-2">
        {others.map((p) => (
          <Link key={p.slug} href={`/produto/${p.slug}`} className="flex aspect-[3/2] flex-col justify-between bg-paper p-4">
            <span className="text-xl font-extrabold">{p.name}</span>
            <span className="flex justify-between text-sm"><span className="text-stone">{p.tagline}</span><span className="font-bold">{eur(p.price)}</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
