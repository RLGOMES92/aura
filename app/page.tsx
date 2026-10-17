import Link from "next/link";
import { products, eur } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";

const benefits = [
  { number: "01", title: "Menos ruído. Mais atitude.", copy: "Design minimalista para quem não precisa de dizer tudo." },
  { number: "02", title: "Feito para ti.", copy: "As peças são produzidas por encomenda, sem stock parado." },
  { number: "03", title: "Escolhe o teu fit.", copy: "Encontra o teu tamanho entre S, M, L e XL." },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate min-h-[610px] overflow-hidden bg-[#d8ff36] px-5 pb-16 pt-12 md:min-h-[680px] md:px-10 md:pb-24 md:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#ff633e] md:right-[9%] md:top-20 md:h-[26rem] md:w-[26rem]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-44 h-48 w-48 rotate-12 border-[3px] border-black md:right-[19%] md:top-48 md:h-64 md:w-64" />
        <div className="relative z-10 flex min-h-[490px] flex-col items-start justify-between md:min-h-[540px]">
          <div className="flex w-full items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.2em] md:text-sm">
            <span>Streetwear independente</span>
            <span className="hidden md:inline">A tua atitude, sem excesso.</span>
          </div>
          <div className="max-w-5xl py-16 md:py-20">
            <p className="mb-4 inline-flex -rotate-2 bg-[#ff633e] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black md:text-sm">A coleção atual</p>
            <h1 className="max-w-5xl text-[19vw] font-black leading-[0.76] tracking-[-0.09em] md:text-[12vw]">
              SAY LESS<span className="text-[#ff633e]">.</span><br />
              <span className="text-white" style={{ WebkitTextStroke: "2px #111" }}>WEAR IT.</span>
            </h1>
            <div className="mt-8 flex max-w-xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <p className="max-w-sm text-base font-medium leading-relaxed md:text-lg">Peças com uma ideia clara e espaço para seres tu. Descobre a primeira seleção da AURA VI VII.</p>
              <Link href="#colecao" className="inline-flex w-fit items-center gap-4 border-2 border-black bg-black px-6 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#ff633e] hover:text-black">
                EXPLORAR COLEÇÃO <span aria-hidden="true" className="text-xl">↘</span>
              </Link>
            </div>
          </div>
          <div className="flex w-full items-center justify-between border-t border-black/30 pt-4 text-[10px] font-bold uppercase tracking-[0.18em] md:text-xs">
            <span>Design com intenção</span><span>Produzido por encomenda</span><span>01 / AURA VI VII</span>
          </div>
        </div>
      </section>

      <section className="bg-[#151515] px-5 py-5 text-white md:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-xs font-extrabold uppercase tracking-[0.15em] md:justify-between md:text-sm">
          <span>✳ Feito por encomenda</span><span className="text-[#d8ff36]">✳ Menos, mas melhor</span><span>✳ O teu estilo, as tuas regras</span>
        </div>
      </section>

      <section id="colecao" className="scroll-mt-20 px-5 py-16 md:px-10 md:py-24">
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#e94f2e]">01 — Descobre</p>
            <h2 className="text-5xl font-black leading-none tracking-[-0.06em] md:text-7xl">A primeira<br className="md:hidden" /> seleção<span className="text-[#e94f2e]">.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-600 md:text-base">Duas peças para começar. Ideias simples, presença forte e detalhes pensados para fazer parte do teu dia a dia.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 md:gap-8">
          {products.map((p, i) => (
            <Link key={p.slug} href={`/produto/${p.slug}`} className="group block">
              <div className="relative overflow-hidden bg-[#f0eee8]">
                <div className="absolute left-4 top-4 z-10 bg-[#d8ff36] px-3 py-2 text-xs font-black uppercase tracking-wider">0{i + 1} / AURA</div>
                <ProductImage product={p} priority={i === 0} />
                <div className="absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#ff633e] text-2xl transition-transform group-hover:rotate-45 group-hover:scale-110" aria-hidden="true">↗</div>
              </div>
              <div className="flex items-start justify-between gap-4 border-b-2 border-black py-5">
                <div>
                  <h3 className="text-2xl font-black tracking-tight md:text-3xl">{p.name}</h3>
                  <p className="mt-2 max-w-sm text-sm text-neutral-600">{p.tagline}</p>
                </div>
                <span className="shrink-0 bg-[#d8ff36] px-3 py-2 text-base font-black">{eur(p.price)}</span>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] transition group-hover:text-[#e94f2e]">Descobrir peça <span aria-hidden="true">→</span></p>
            </Link>
          ))}
        </div>
      </section>

      <section id="ideia" className="scroll-mt-24 bg-[#ff633e] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em]">02 — A ideia</p>
            <h2 className="max-w-2xl text-5xl font-black leading-[0.9] tracking-[-0.07em] md:text-7xl">Não precisas de gritar para marcar presença.</h2>
          </div>
          <div className="max-w-xl md:justify-self-end">
            <p className="text-lg leading-relaxed">A AURA VI VII nasce da ideia de que o estilo não precisa de complicar. Silhuetas descontraídas, mensagens diretas e uma estética limpa — para vestir à tua maneira.</p>
            <Link href="#colecao" className="mt-7 inline-flex items-center gap-3 border-b-2 border-black pb-2 font-black uppercase tracking-wider">Encontra a tua peça <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#e94f2e]">03 — Porque AURA</p>
          <h2 className="text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">Menos complicação.<br />Mais identidade.</h2>
        </div>
        <div className="grid gap-0 border-t-2 border-black md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.number} className="border-b-2 border-black py-7 md:border-b-0 md:border-r-2 md:px-6 md:first:pl-0 md:last:border-r-0">
              <p className="mb-8 text-sm font-black text-[#e94f2e]">{benefit.number} /</p>
              <h3 className="text-2xl font-black tracking-tight">{benefit.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-neutral-600">{benefit.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-5 mb-16 bg-[#d8ff36] px-6 py-12 md:mx-10 md:mb-24 md:px-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em]">A tua próxima peça está aqui</p>
            <h2 className="max-w-2xl text-4xl font-black leading-none tracking-[-0.06em] md:text-6xl">Veste a ideia.<br />Faz dela tua.</h2>
          </div>
          <Link href="#colecao" className="inline-flex w-fit items-center gap-4 bg-black px-7 py-5 font-bold text-white transition hover:bg-[#ff633e] hover:text-black">VER AS PEÇAS <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
