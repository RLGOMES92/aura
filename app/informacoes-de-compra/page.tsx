import Link from "next/link";

const info = [
  { n: "01", title: "Produção por encomenda", text: "As peças são produzidas depois da encomenda. Este modelo permite preparar cada artigo para o pedido recebido." },
  { n: "02", title: "Escolhe o teu tamanho", text: "A seleção atual apresenta os tamanhos S, M, L e XL. Confirma o tamanho escolhido antes de adicionares a peça ao carrinho." },
  { n: "03", title: "Pagamento", text: "O pagamento é iniciado pelo checkout da Stripe. Os valores são apresentados em reais (BRL); o frete é pago pelo cliente e informado no checkout." },
  { n: "04", title: "Prazo indicado", text: "A Printful informa estimativas médias de entrega ao Brasil que podem variar conforme o produto, a produção e o CEP. Consulte o prazo atualizado antes de concluir a compra; não considere estimativas como garantia." },
];

export const metadata = {
  title: "Informações de compra",
  description: "Informações úteis sobre encomendas, tamanhos, pagamento e pedidos de retirada na AURA VI VII.",
};

export default function InformacoesDeCompra() {
  return (
    <main className="bg-[#f4f4f2]">
      <section className="bg-[#d8ff36] px-5 py-14 md:px-10 md:py-20">
        <p className="text-xs font-black uppercase tracking-[0.2em]">AURA VI VII / Guia de compra</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.88] tracking-[-0.07em] md:text-7xl">Antes de escolher.<br />Tudo mais claro.</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">Informações essenciais para saber como funciona a tua encomenda e o que rever antes de finalizar a compra.</p>
      </section>
      <section className="px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-0 border-t-2 border-black md:grid-cols-2">
          {info.map((item) => (
            <article key={item.n} className="border-b-2 border-black py-7 md:px-7 md:py-9 md:first:pl-0 md:[&:nth-child(2)]:border-l-2 md:[&:nth-child(2)]:pl-7">
              <p className="mb-8 text-sm font-black text-[#e94f2e]">{item.n} /</p>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">{item.title}</h2>
              <p className="mt-3 max-w-md leading-relaxed text-neutral-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-5 mb-12 bg-[#151515] px-6 py-8 text-white md:mx-10 md:mb-16 md:px-10 md:py-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d8ff36]">Precisas de fazer um pedido?</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Retirada do contrato</h2>
        <p className="mt-3 max-w-xl leading-relaxed text-white/70">Se pretendes exercer o direito de retirada, utiliza o formulário dedicado para identificar a encomenda e enviar a declaração.</p>
        <Link href="/retirada" className="mt-6 inline-flex items-center gap-4 bg-[#d8ff36] px-6 py-4 font-black text-black transition hover:bg-[#ff633e]">IR PARA O FORMULÁRIO <span aria-hidden="true">↗</span></Link>
      </section>
      <section className="px-5 pb-16 md:px-10">\n        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-black uppercase tracking-wider">\n          <Link href="/legal/envios-e-devolucoes" className="border-b border-black pb-1 hover:text-[#e94f2e]">Envios e devoluções ↗</Link>\n          <Link href="/legal/termos" className="border-b border-black pb-1 hover:text-[#e94f2e]">Termos e condições ↗</Link>\n          <Link href="/legal/privacidade" className="border-b border-black pb-1 hover:text-[#e94f2e]">Privacidade ↗</Link>\n        </div>
        <p className="max-w-3xl text-xs leading-relaxed text-neutral-500">Esta página resume informações gerais da loja e não substitui os termos legais completos, as condições de envio e devolução nem a confirmação final apresentada durante a compra.</p>
        <Link href="/#colecao" className="mt-5 inline-flex border-b border-black pb-1 text-xs font-black uppercase tracking-wider">Voltar à coleção ↑</Link>
      </section>
    </main>
  );
}
