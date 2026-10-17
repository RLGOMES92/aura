import { NextResponse } from "next/server";
import Stripe from "stripe";
import { zoho } from "@/lib/zoho";
import { sendPurchase } from "@/lib/capi";
import { acquireLock, isDone, markDone, releaseLock } from "@/lib/idempotency";

export const runtime = "nodejs";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// --- Zoho: contacto existente é atualizado (sem mexer no nome); senão é criado ---
async function upsertContact(email: string, name: string | null | undefined, extra: Record<string, unknown>) {
  const found = await zoho("GET", `Contacts/search?email=${encodeURIComponent(email)}`);
  const id = found?.data?.[0]?.id as string | undefined;
  if (id) { await zoho("PUT", `Contacts/${id}`, { data: [extra] }); return id; }
  const [first, ...rest] = (name ?? "").trim().split(/\s+/);
  const created = await zoho("POST", "Contacts", {
    data: [{ Email: email, ...(first && { First_Name: first }), Last_Name: rest.join(" ") || first || email, ...extra }],
  });
  return created.data[0].details.id as string;
}

// --- Printful ---
function hasPrintfulMetadata(session: Stripe.Checkout.Session) {
  return (session.line_items?.data ?? []).every((li) => {
    const product = li.price?.product as Stripe.Product | string | null | undefined;
    if (!product || typeof product === "string") return false;
    const syncVariantId = product.metadata?.printful_sync_variant_id;
    return typeof syncVariantId === "string" && syncVariantId.trim().length > 0;
  });
}

async function createPrintfulOrder(session: Stripe.Checkout.Session) {
  const ship = session.collected_information?.shipping_details;
  if (!ship?.address) throw new Error("Sem morada de envio");

  const items = (session.line_items?.data ?? []).map((li) => {
    const product = li.price?.product as Stripe.Product | string | null | undefined;
    if (!product || typeof product === "string") throw new Error("Produto sem metadata Printful");
    const syncVariantId = Number(product.metadata.printful_sync_variant_id);
    if (!Number.isFinite(syncVariantId) || syncVariantId <= 0) {
      throw new Error(`Produto sem sync_variant_id válido: ${product.metadata.printful_sync_variant_id ?? "missing"}`);
    }
    return { sync_variant_id: syncVariantId, quantity: li.quantity ?? 1 };
  });

  if (items.length === 0) throw new Error("Sem itens no checkout");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}`, "Content-Type": "application/json",
  };
  if (process.env.PRINTFUL_STORE_ID) headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;

  // Stripe pode reenviar o webhook depois de o pedido Printful já ter sido criado
  // (por exemplo, se o Zoho falhar). Recupera a encomenda existente antes de criar.
  const externalOrderUrl = `https://api.printful.com/orders/@${encodeURIComponent(session.id)}`;
  const existingResponse = await fetch(externalOrderUrl, { headers });
  if (existingResponse.ok) {
    const existing = await existingResponse.json();
    return existing.result;
  }
  if (existingResponse.status !== 404) {
    throw new Error(`Printful lookup: HTTP ${existingResponse.status}`);
  }

  // Por defeito cria RASCUNHO. Só confirma (e cobra o teu saldo) com PRINTFUL_CONFIRM=true.
  const confirm = process.env.PRINTFUL_CONFIRM === "true" ? "?confirm=true" : "";
  const res = await fetch(`https://api.printful.com/orders${confirm}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      external_id: session.id,
      recipient: {
        name: ship.name, address1: ship.address.line1, address2: ship.address.line2 ?? "",
        city: ship.address.city, state_code: ship.address.state ?? "", country_code: ship.address.country,
        zip: ship.address.postal_code, email: session.customer_details?.email, phone: session.customer_details?.phone ?? "",
      },
      items,
    }),
  });
  const json = await res.json();
  if (!res.ok) {
    // Fecha a condição de corrida: outra entrega pode ter criado o mesmo external_id.
    const retryLookup = await fetch(externalOrderUrl, { headers });
    if (retryLookup.ok) {
      const existing = await retryLookup.json();
      return existing.result;
    }
    throw new Error(`Printful: ${JSON.stringify(json)}`);
  }
  return json.result;
}

async function syncZoho(session: Stripe.Checkout.Session, printfulId: number) {
  const email = session.customer_details?.email;
  if (!email) return;
  const marketing = session.metadata?.marketing === "1";
  const contactId = await upsertContact(email, session.customer_details?.name, { Email_Opt_Out: !marketing });

  // Stripe pode repetir o mesmo evento; consulta o ID da sessão antes de criar outro negócio.
  const existingDeal = await zoho(
    "GET",
    `Deals/search?criteria=${encodeURIComponent(`(Stripe_Session_ID:equals:${session.id})`)}`,
  );
  if (existingDeal?.data?.length) return;

  await zoho("POST", "Deals", {
    data: [{
      Deal_Name: `Pedido ${session.id.slice(-8)}`,
      Stage: "Closed Won",
      Amount: (session.amount_total ?? 0) / 100,
      Closing_Date: new Date().toISOString().slice(0, 10),
      Contact_Name: { id: contactId },
      Stripe_Session_ID: session.id,
      Marketing_OK: marketing,
      Description: `Printful #${printfulId} | Stripe ${session.id}`,
    }],
  });
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  // Carrinho abandonado: guarda o link de recuperação (só com consentimento de e-mail)
  if (event.type === "checkout.session.expired") {
    const s = event.data.object as Stripe.Checkout.Session;
    const email = s.customer_details?.email;
    const url = s.after_expiration?.recovery?.url;
    if (s.metadata?.marketing === "1" && email && url) {
      try { await upsertContact(email, s.customer_details?.name, { Recovery_URL: url, Email_Opt_Out: false }); }
      catch (e) { console.error("[zoho-expired]", e); }
    }
    return NextResponse.json({ received: true });
  }

  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

  try {
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ["line_items.data.price.product"],
    });

    if (!session.collected_information?.shipping_details?.address || !session.customer_details?.email || !session.line_items?.data?.length || !hasPrintfulMetadata(session)) {
      console.warn(`[webhook] Ignorando checkout sintético/incompleto: ${session.id}`);
      return NextResponse.json({ received: true, ignored: true });
    }

    // Lock distribuído: evita que entregas concorrentes criem dois registos no CRM.
    // Se Redis não estiver configurado, falhamos de forma segura em vez de arriscar duplicados.
    const key = `stripe-session:${session.id}`;
    if (await isDone(key)) return NextResponse.json({ received: true, duplicate: true });

    const lock = await acquireLock(key);
    if (!lock) return NextResponse.json({ error: "processing; retry webhook" }, { status: 500 });

    try {
      if (await isDone(key)) return NextResponse.json({ received: true, duplicate: true });

      // Printful é consultada por external_id antes da criação, pelo que uma repetição
      // após falha do CRM recupera o mesmo pedido em vez de o criar de novo.
      const order = await createPrintfulOrder(session);
      await syncZoho(session, order.id);
      try { await sendPurchase(session); } catch (e) { console.error("[capi]", e); }
      await markDone(key);
      return NextResponse.json({ received: true });
    } finally {
      try { await releaseLock(key, lock); } catch (e) { console.error("[idempotency] release lock failed", e); }
    }
  } catch (e) {
    console.error("[printful]", e);
    return NextResponse.json({ error: "fulfillment failed" }, { status: 500 }); // Stripe repete
  }
}
