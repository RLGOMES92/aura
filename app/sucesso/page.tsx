import Stripe from "stripe";
import Link from "next/link";
import { PageEvent } from "@/components/Pixels";

export const metadata = { title: "Encomenda confirmada" };

export default async function Sucesso({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid: { id: string; value: number } | null = null;
  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const s = await stripe.checkout.sessions.retrieve(session_id);
      if (s.payment_status === "paid") paid = { id: s.id, value: (s.amount_total ?? 0) / 100 };
    } catch {
      // Não afirmar que o pedido foi pago quando a sessão não pode ser validada.
    }
  }
  return (
    <main className="px-5 py-20">
      {paid && <PageEvent event="Purchase" data={{ name: "Order", value: paid.value }} eventId={paid.id} />}
      <h1 className="text-5xl font-black tracking-tight">{paid ? "Encomenda confirmada." : "A confirmar a encomenda."}</h1>
      {paid ? (
        <>
          <p className="mt-4 max-w-md">O pagamento foi confirmado. Guarda esta referência para qualquer contacto sobre o pedido:</p>
          <p className="mt-2 break-all font-mono text-sm" aria-label="Referência do pedido">{paid.id}</p>
          <p className="mt-4 max-w-md">Recebes um e-mail com o recibo agora e outro com o tracking quando a peça sair da produção.</p>
        </>
      ) : (
        <p className="mt-4 max-w-md">Ainda não conseguimos validar o pagamento. Se já concluíste o checkout, verifica o e-mail de confirmação antes de tentar pagar novamente.</p>
      )}
      <Link href="/" className="mt-8 inline-block bg-cobalt px-8 py-4 font-bold text-white">Voltar à loja</Link>
    </main>
  );
}
