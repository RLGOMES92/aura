import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProduct, eur } from "@/lib/products";
import { AddToCart } from "@/components/AddToCart";
import { PageEvent } from "@/components/Pixels";
import { Related } from "@/components/Related";
import { ProductImage } from "@/components/ProductImage";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: `${p.tagline} ${p.description}`.slice(0, 155) } : {};
}

export default async function PDP({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    offers: { "@type": "Offer", priceCurrency: "EUR", price: p.price, availability: "https://schema.org/InStock" },
  };
  return (
    <main className="grid gap-8 px-5 py-8 md:grid-cols-2">
      <PageEvent event="ViewContent" data={{ name: p.name, value: p.price }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductImage product={p} priority />
      <div className="md:pt-8">
        <h1 className="text-4xl font-black tracking-tight">{p.name}</h1>
        <p className="mt-1 text-2xl font-bold">{eur(p.price)}</p>
        <p className="mt-5 max-w-md">{p.description}</p>
        <div className="mt-8 max-w-md"><AddToCart product={p} /></div>
        <p className="mt-6 text-sm text-stone">Produzido por encomenda. Envio em 5 a 8 dias úteis.</p>
      </div>
      <Related current={p.slug} />
    </main>
  );
}
