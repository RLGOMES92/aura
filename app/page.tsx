import Link from "next/link";
import { products, eur } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";

const benefits = [
  { number: "01", title: "A sua ideia vira peça", copy: "Envie sua arte ou conte o que imaginou. A gente conversa sobre como levar sua ideia para a roupa." },
  { number: "02", title: "Do seu jeito", copy: "Escolha a peça, pense nas cores e personalize a mensagem para ter algo com a sua identidade." },
  { number: "03", title: "Feito por encomenda", copy: "Peças produzidas após o pedido. Consulte tamanhos, prazo e detalhes antes de finalizar." },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f5f2eb] text-[#111]">
      <section className="relative isolate overflow-hidden bg-[#d8ff36] px-5 pb-14 pt-8 md:px-10 md:pb-20 md:pt-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-28 h-72 w-72 rounded-full bg-[#ff633e] md:right-[8%] md:top-16 md:h-[29rem] md:w-[29rem]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[13%] top-36 hidden h-64 w-64 rotate-12 border-[3px] border-black md:block" />
        <div className="relative z-10 flex min-h-[500px] flex-col items-start justify-between md:min-h-[570px]">
          <div className="flex w-full items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em] md:text-xs"><span>Streetwear com identidade</span><span className="hidden md:inline">Criado para sair do óbvio</span></div>
          <div className="max-w-5xl py-14 md:py-20">
            <p className="mb-5 inline-flex -rotate-2 bg-[#ff633e] px-3 py-2 text-xs font-black uppercase tracking-[0.15em]">Vista sua ideia</p>
            <h1 className="max-w-5xl text-[18vw] font-black leading-[0.77] tracking-[-0.09em] md:text-[11.5vw]">MENOS<br />RUÍDO<span className="text-[#ff633e]">.</span><br /><span className="text-white" style={{ WebkitTextStroke: "2px #111" }}>MAIS ATITUDE.</span></h1>
            <p className="mt-7 max-w-xl text-base font-semibold leading-relaxed md:text-xl">Peças com personalidade. Escolha a coleção ou crie algo que tenha a sua cara — da sua arte à sua próxima peça favorita.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#colecao" className="inline-flex min-h-12 items-center justify-center bg-black px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#ff633e] hover:text-black">Ver coleção <span className="ml-3">↘</span></Link>
              <Link href="#personalize" className="inline-flex min-h-12 items-center justify-center border-2 border-black px-6 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-white">Crie sua peça <span className="ml-3">✳</span></Link>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t-2 border-black pt-4 text-[10px] font-black uppercase tracking-[0.16em] md:text-xs"><span>Design independente</span><span>Feito por encomenda</span><span>Seu estilo, suas regras</span></div>
        </div>
      </section>
      <section id="colecao" className="px-5 py-16 md:px-10 md:py-24">
        <div className="mb-8 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#ff633e]">Escolha sua base</p><h2 className="text-4xl font-black leading-none tracking-[-0.06em] md:text-6xl">A coleção atual<span className="text-[#ff633e]">.</span></h2></div><p className="max-w-md text-sm leading-relaxed text-black/70 md:text-base">Comece por uma das nossas peças e explore as opções de tamanho e personalização disponíveis.</p></div>
        <div className="grid gap-5 sm:grid-cols-2 md:gap-8">{products.map((product, index) => <Link key={product.slug} href={`/produto/${product.slug}`} className="group block"><div className="relative overflow-hidden border-2 border-black bg-white"><ProductImage product={product} priority={index === 0} /><span className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest">{index === 0 ? "A peça essencial" : "Conforto + atitude"}</span><span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-[#d8ff36] text-xl font-black transition group-hover:rotate-45">↗</span></div><div className="flex items-start justify-between gap-4 border-b-2 border-black py-4"><div><h3 className="text-xl font-black tracking-tight md:text-2xl">{product.name}</h3><p className="mt-1 text-sm text-black/65">{product.tagline}</p></div><span className="shrink-0 text-lg font-black">{eur(product.price)}</span></div></Link>)}</div>
        <p className="mt-4 text-xs text-black/55">Valores exibidos conforme a configuração atual da loja. A moeda e o checkout para venda no Brasil precisam ser alinhados antes da abertura oficial.</p>
      </section>
      <section id="personalize" className="relative overflow-hidden bg-[#111] px-5 py-16 text-white md:px-10 md:py-24">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#ff633e] md:right-12 md:top-8 md:h-80 md:w-80" />
        <div className="relative z-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16">
          <div><p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#d8ff36]">Personalização aberta</p><h2 className="max-w-3xl text-5xl font-black leading-[0.88] tracking-[-0.07em] md:text-7xl">SUA ARTE.<br />SUA IDEIA.<br /><span className="text-[#d8ff36]">SUA PEÇA.</span></h2><p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">Já tem uma estampa pronta? Envie sua arte. Quer criar do zero? Monte uma ideia com frase, cor e estilo. A gente recebe seu briefing e avalia a personalização com você.</p><Link href="/personalizar" className="mt-7 inline-flex min-h-14 items-center justify-center bg-[#d8ff36] px-6 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-[#ff633e]">Enviar arte ou criar do zero <span className="ml-3 text-xl">↗</span></Link><p className="mt-3 max-w-lg text-xs leading-relaxed text-white/50">A personalização é confirmada após análise da arte, viabilidade, preço e prazo. Não envie imagens sem direito de uso.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1"><div className="rotate-[-2deg] border-2 border-white/20 bg-white/5 p-6"><span className="text-4xl">↗</span><h3 className="mt-6 text-xl font-black">Tenho minha arte</h3><p className="mt-2 text-sm leading-relaxed text-white/65">Faça upload de uma imagem e conte em qual peça gostaria de aplicar.</p></div><div className="rotate-[2deg] border-2 border-[#d8ff36] bg-[#d8ff36] p-6 text-black"><span className="text-4xl">✳</span><h3 className="mt-6 text-xl font-black">Quero montar a minha</h3><p className="mt-2 text-sm leading-relaxed text-black/70">Teste uma frase e uma cor para começar a visualizar sua ideia.</p></div></div>
        </div>
      </section>
      <section className="grid gap-8 px-5 py-16 md:grid-cols-3 md:px-10 md:py-20">{benefits.map((item) => <article key={item.number} className="border-t-2 border-black pt-4"><span className="text-xs font-black text-[#ff633e]">/{item.number}</span><h3 className="mt-5 text-2xl font-black tracking-tight">{item.title}</h3><p className="mt-3 max-w-sm text-sm leading-relaxed text-black/65">{item.copy}</p></article>)}</section>
      <section className="bg-[#ff633e] px-5 py-12 md:px-10 md:py-16"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="text-xs font-black uppercase tracking-[0.2em]">Pronto para sair do básico?</p><h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.06em] md:text-6xl">Vista o que<br className="md:hidden" /> faz sentido.</h2></div><Link href="/personalizar" className="inline-flex min-h-14 items-center justify-center border-2 border-black bg-black px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black">Personalize agora ↗</Link></div></section>
    </main>
  );
}
