import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black px-5 py-10 text-sm">
      <nav className="flex flex-wrap gap-x-6 gap-y-3 font-semibold">
        <Link href="/legal/envios-e-devolucoes">Envios e devoluções</Link>
        <Link href="/retirada">Retirar do contrato</Link>
        <Link href="/legal/termos">Termos</Link>
        <Link href="/legal/privacidade">Privacidade</Link>
        <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">Livro de Reclamações</a>
      </nav>
      <p className="mt-4 text-stone">© {new Date().getFullYear()} [NOME DA EMPRESA]. NIF [NIF].</p>
    </footer>
  );
}
