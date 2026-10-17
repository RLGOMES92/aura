import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#151515] px-5 py-10 text-white md:px-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <Link href="/" className="text-3xl font-black tracking-[-0.07em] md:text-5xl">AURA VI VII<span className="text-[#d8ff36]">.</span></Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">Menos ruído. Mais identidade. Descobre peças minimalistas pensadas para vestir à tua maneira.</p>
        </div>
        <nav aria-label="Informações da loja" className="grid grid-cols-2 gap-x-5 gap-y-4 text-xs font-bold uppercase tracking-[0.12em] md:justify-self-end">
          <Link className="transition hover:text-[#d8ff36]" href="/#colecao">Coleção</Link>
          <Link className="transition hover:text-[#d8ff36]" href="/informacoes-de-compra">Informações de compra</Link>
          <Link className="transition hover:text-[#d8ff36]" href="/legal/envios-e-devolucoes">Envios e devoluções</Link>
          <Link className="transition hover:text-[#d8ff36]" href="/legal/termos">Termos e condições</Link>
          <Link className="transition hover:text-[#d8ff36]" href="/legal/privacidade">Privacidade</Link>
          <a className="transition hover:text-[#d8ff36]" href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">Livro de Reclamações ↗</a>
        </nav>
      </div>
      <div className="mt-10 flex flex-col gap-3 border-t border-white/20 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} AURA VI VII. Todos os direitos reservados.</p>
        <Link href="/#colecao" className="text-[#d8ff36]">Voltar ao início ↑</Link>
      </div>
    </footer>
  );
}
