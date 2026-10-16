import Stripe from "stripe";
import { unstable_cache } from "next/cache";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// ESTIMATIVAS: ajusta aos teus valores reais
export const VAT = 0.23;          // IVA PT. Vendas OSS para outros países usam outras taxas.
const STRIPE_PCT = 0.015;         // cartões europeus; cartões fora do EEE custam mais
const STRIPE_FIXED = 0.25;

export type Row = { product: string; orders: number; units: number; gross: number; net: number; printful: number; fees: number };

async function printfulCost(sessionId: string): Promise<number | null> {
  try {
    const h: Record<string, string> = { Authorization: `Bearer ${process.env.PRINTFUL_TOKEN}` };
    if (process.env.PRINTFUL_STORE_ID) h["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
    const r = await fetch(`https://api.printful.com/orders/@${sessionId}`, { headers: h });
    if (!r.ok) return null;
    return parseFloat((await r.json()).result?.costs?.total ?? "0");
  } catch { return null; }
}

async function compute(days: number) {
  const stripe = getStripe();
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  const paid: Stripe.Checkout.Session[] = [];
  for await (const s of stripe.checkout.sessions.list({ created: { gte: since }, limit: 100, expand: ["data.line_items"] })) {
    if (s.payment_status === "paid") paid.push(s);
    if (paid.length >= 300) break;
  }

  const costs: (number | null)[] = [];
  for (let i = 0; i < paid.length; i += 10) // lotes de 10 por causa do rate limit da Printful
    costs.push(...(await Promise.all(paid.slice(i, i + 10).map((s) => printfulCost(s.id)))));

  const rows = new Map<string, Row>();
  let missing = 0;
  paid.forEach((s, i) => {
    const total = (s.amount_total ?? 0) / 100;
    const cost = costs[i] ?? (missing++, 0);
    const lines = s.line_items?.data ?? [];
    const sum = lines.reduce((a, l) => a + l.amount_total, 0) || 1;
    for (const l of lines) {
      const name = (l.description ?? "Outro").split(" / ")[0];
      const share = l.amount_total / sum;
      const r = rows.get(name) ?? { product: name, orders: 0, units: 0, gross: 0, net: 0, printful: 0, fees: 0 };
      r.orders += 1; r.units += l.quantity ?? 1;
      r.gross += total * share; r.net += (total / (1 + VAT)) * share;
      r.printful += cost * share; r.fees += (total * STRIPE_PCT + STRIPE_FIXED) * share;
      rows.set(name, r);
    }
  });
  return { rows: [...rows.values()].sort((a, b) => b.gross - a.gross), missing, orders: paid.length };
}

export const getStats = unstable_cache(compute, ["stats"], { revalidate: 300 });
