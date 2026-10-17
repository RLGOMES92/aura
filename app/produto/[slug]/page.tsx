import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProduct, brl } from "@/lib/products";
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
    offers: { "@type": "Offer", priceCurrency: "BRL", price: p.price, availability: "https://schema.org/InStock" },
  };
  const details = [
    { label: "Conceito", value: p.tagline },
    { label: "Produção", value: "Produzido por encomenda." },
    { label: "Tamanhos", value: "S · M · L · XL" },
  ];
  return (
    <main className="bg-[#f4f4f2]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="px-5 pt-5 md:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 md:text-xs">
          <Link href="/" className="transition hover:text-black">Início</Link><span>/</span><Link href="/#colecao" className="transition hover:text-black">Coleção</Link><span>/</span><span className="text-black">{p.name}</span>
        </nav>
      </div>
      <section className="grid gap-0 px-5 pb-12 pt-5 md:grid-cols-2 md:gap-12 md:px-10 md:pb-20 md:pt-8">
        <div className="relative">
          <div className="absolute left-4 top-4 z-10 bg-[#d8ff36] px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em]">AURA VI VII / 0{products.findIndex((item) => item.slug === p.slug) + 1}</div>
          <ProductImage product={p} priority />
          <div className="mt-3 flex items-center justify-between border-b border-black/20 pb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            <span>Design com intenção</span><span>Feito por encomenda</span>
          </div>
        </div>
        <div className="flex flex-col pt-8 md:sticky md:top-32 md:self-start md:pt-6">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#e94f2e]">A primeira seleção / AURA</p>
          <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.07em] md:text-7xl">{p.name}<span className="text-[#e94f2e]">.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-600 md:text-lg">{p.description}</p>
          <div className="mt-7 flex items-end justify-between border-y-2 border-black py-5">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">Preço</p><p className="mt-1 text-3xl font-black tracking-tight">{brl(p.price)}</p></div>
            <p className="max-w-[145px] text-right text-xs leading-relaxed text-neutral-500">Escolhe o tamanho antes de adicionar ao carrinho.</p>
          </div>
          <div className="mt-6"><AddToCart product={p} /></div>
          <div className="mt-6 grid grid-cols-3 border-y border-black/20 py-4">
            <div className="pr-2"><span className="block text-lg">✳</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-wide">Feito por encomenda</span></div>
            <div className="border-x border-black/20 px-3"><span className="block text-lg">↔</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-wide">Tamanhos S–XL</span></div>
            <div className="pl-3"><span className="block text-lg">↗</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-wide">Checkout Stripe</span></div>
          </div>
          <div className="mt-7">
            <h2 className="text-sm font-black uppercase tracking-[0.15em]">Sobre esta peça</h2>
            <dl className="mt-3">
              {details.map((detail) => <div key={detail.label} className="grid grid-cols-[100px_1fr] gap-3 border-t border-black/15 py-3 text-sm"><dt className="font-bold">{detail.label}</dt><dd className="text-neutral-600">{detail.value}</dd></div>)}
            </dl>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-neutral-500">Consulta as informações de compra antes de finalizar a encomenda. O prazo e as condições aplicáveis devem ser confirmados na página de informações da loja.</p>
          <Link href="/informacoes-de-compra" className="mt-2 w-fit border-b border-black pb-1 text-xs font-bold uppercase tracking-wider hover:text-[#e94f2e]">Informações de compra ↗</Link>
        </div>
      </section>
      <section className="bg-[#151515] px-5 py-12 text-white md:px-10 md:py-16">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d8ff36]">AURA VI VII / A ideia</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2 md:items-end">
          <h2 className="text-4xl font-black leading-[0.9] tracking-[-0.06em] md:text-6xl">O essencial<br />fala mais alto.</h2>
          <p className="max-w-lg leading-relaxed text-white/70">Peças de streetwear com uma mensagem direta e uma estética sem excesso. Escolhe a tua, encontra o teu tamanho e leva a ideia contigo.</p>
        </div>
      </section>
      <div className="px-5 py-12 md:px-10 md:py-16"><Related current={p.slug} /></div>
    </main>
  );
}
