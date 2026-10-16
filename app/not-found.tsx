import Link from "next/link";
export default function NotFound() {
  return (
    <main className="px-5 py-24">
      <h1 className="text-5xl font-black tracking-tight">Página não encontrada.</h1>
      <p className="mt-4">O link pode estar errado ou a peça já não está disponível.</p>
      <Link href="/" className="mt-8 inline-block bg-cobalt px-8 py-4 font-bold text-white">Voltar à loja</Link>
    </main>
  );
}
