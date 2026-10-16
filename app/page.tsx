import Link from "next/link";
import { products, eur } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";

export default function Home() {
  return (
    <main>
      <section className="px-5 pb-16 pt-10">
        <h1 className="text-[18vw] font-black leading-[0.82] tracking-tighter md:text-[12vw]">
          Say less.<br />Wear it.
        </h1>
        <p className="mt-8 max-w-sm text-lg">Peças minimalistas, uma frase de cada vez. Produzidas só depois da tua encomenda.</p>
        <Link href="#colecao" className="mt-6 inline-block bg-cobalt px-8 py-4 font-bold text-white">Ver coleção</Link>
      </section>
      <section id="colecao" className="grid gap-px bg-black md:grid-cols-2">
        {products.map((p, i) => (
          <Link key={p.slug} href={`/produto/${p.slug}`} className="block bg-paper p-5">
            <ProductImage product={p} priority={i === 0} />
            <span className="mt-4 flex justify-between gap-3">
              <span className="text-xl font-extrabold tracking-tight">{p.name}</span>
              <span className="font-bold">{eur(p.price)}</span>
            </span>
            <span className="text-stone">{p.tagline}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
