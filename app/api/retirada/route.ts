import { NextResponse } from "next/server";
import Stripe from "stripe";
import { zoho } from "@/lib/zoho";
import { acquireLock, isDone, markDone, releaseLock } from "@/lib/idempotency";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, order } = body ?? {};
    if (typeof name !== "string" || typeof email !== "string" || typeof order !== "string"
      || !name.trim() || !email.trim() || !order.trim()
      || name.trim().length > 120 || email.trim().length > 254 || order.trim().length > 200
      || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[retirada] STRIPE_SECRET_KEY not configured");
      return NextResponse.json({ error: "temporarily unavailable" }, { status: 503 });
    }
    // O número do pedido é o ID da sessão Stripe apresentado no e-mail de confirmação.
    // Confirmamos pagamento e correspondência do e-mail antes de criar uma tarefa no CRM.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(order.trim());
    } catch {
      return NextResponse.json({ error: "order not found" }, { status: 400 });
    }
    const orderEmail = (session.customer_details?.email ?? session.customer_email ?? "").trim().toLowerCase();
    if (session.payment_status !== "paid" || !orderEmail || orderEmail !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: "order not found" }, { status: 400 });
    }

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return NextResponse.json({ error: "temporarily unavailable" }, { status: 503 });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const key = `withdrawal:${order.trim()}`;
    if (await isDone(key)) return NextResponse.json({ ok: true, duplicate: true });
    const lock = await acquireLock(key, 120);
    if (!lock) return NextResponse.json({ error: "request processing; retry" }, { status: 503 });

    try {
      if (await isDone(key)) return NextResponse.json({ ok: true, duplicate: true });

      const subject = `Retirada de contrato - ${order.trim()}`;
      const existingTask = await zoho("GET", `Tasks/search?criteria=${encodeURIComponent(`(Subject:equals:${subject})`)}`);
      if (existingTask?.data?.length) {
        await markDone(key);
        return NextResponse.json({ ok: true, duplicate: true });
      }

      // Contacto: usa o existente (não sobrescreve nome) ou cria
      const found = await zoho("GET", `Contacts/search?email=${encodeURIComponent(normalizedEmail)}`);
      const contactId: string =
        found?.data?.[0]?.id ?? (await zoho("POST", "Contacts", { data: [{ Email: normalizedEmail, Last_Name: name.trim() }] })).data[0].details.id;

      const due = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
      await zoho("POST", "Tasks", {
        data: [{
          Subject: subject,
          Description: `${name.trim()} <${normalizedEmail}> | Pedido ${order.trim()} | Recebida em ${new Date().toISOString()}`,
          Who_Id: { id: contactId },
          Due_Date: due,
          Priority: "High",
        }],
      });
      await markDone(key);
      return NextResponse.json({ ok: true });
    } finally {
      try { await releaseLock(key, lock); } catch (e) { console.error("[idempotency] release lock failed", e); }
    }
  } catch (e) {
    console.error("[retirada] Request failed", e instanceof Error ? e.message : "unknown error");
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
