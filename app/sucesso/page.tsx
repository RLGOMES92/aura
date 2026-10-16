import Stripe from "stripe";
import { PageEvent } from "@/components/Pixels";

export const metadata = { title: "Encomenda confirmada" };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function Sucesso({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid: { id: string; value: number } | null = null;
  if (session_id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      if (s.payment_status === "paid") paid = { id: s.id, value: (s.amount_total ?? 0) / 100 };
    } catch {}
  }
  return (
    <main className="px-5 py-20">
      {paid && <PageEvent event="Purchase" data={{ name: "Order", value: paid.value }} eventId={paid.id} />}
      <h1 className="text-5xl font-black tracking-tight">Encomenda confirmada.</h1>
      <p className="mt-4 max-w-md">Recebes um e-mail com o recibo agora e outro com o tracking quando a peça sair da produção.</p>
      <a href="/" className="mt-8 inline-block bg-cobalt px-8 py-4 font-bold text-white">Voltar à loja</a>
    </main>
  );
}
