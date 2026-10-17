import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, COUNTRIES } from "@/lib/shipping";
import { bundleDiscount, slugOfPrice } from "@/lib/bundle";
import { products } from "@/lib/products";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const { items, marketing } = (await req.json()) as {
      items: { priceId: string; qty: number }[]; marketing?: boolean;
    };
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "empty" }, { status: 400 });
    if (items.length > 20) return NextResponse.json({ error: "too many items" }, { status: 400 });

    const allowedPriceIds = new Set(products.flatMap((p) => Object.values(p.variants)));
    if (items.some((item) => !item || typeof item.priceId !== "string" || !allowedPriceIds.has(item.priceId)
      || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 10)) {
      return NextResponse.json({ error: "invalid item" }, { status: 400 });
    }
    const lines = items.map((i) => ({ price: i.priceId, quantity: i.qty }));

    // Tudo o que influencia o preço é calculado aqui, nunca no cliente.
    // Só aceitamos preços ativos, únicos e em EUR configurados no catálogo do servidor.
    const prices = await Promise.all(lines.map((l) => stripe.prices.retrieve(l.price)));
    if (prices.some((p) => !p.active || p.currency !== "eur" || p.type !== "one_time" || !p.unit_amount || p.unit_amount <= 0)) {
      return NextResponse.json({ error: "invalid item" }, { status: 400 });
    }
    const subtotal = prices.reduce((s, p, i) => s + (p.unit_amount ?? 0) * lines[i].quantity, 0);
    const discount = bundleDiscount(
      prices.map((p, i) => ({ slug: slugOfPrice.get(p.id), qty: lines[i].quantity, unit: p.unit_amount ?? 0 }))
    );
    const free = subtotal - discount >= FREE_SHIPPING_THRESHOLD * 100;

    // A Stripe não aceita `discounts` e `allow_promotion_codes` na mesma sessão
    const discountParams: Partial<Stripe.Checkout.SessionCreateParams> =
      discount > 0
        ? { discounts: [{ coupon: (await stripe.coupons.create({
            amount_off: discount, currency: "eur", duration: "once", max_redemptions: 1, name: "Bundle",
          })).id }] }
        : { allow_promotion_codes: true };

    const c = await cookies();
    const adsConsent = c.get("consent")?.value === "1";
    const metadata: Record<string, string> = {
      consent: adsConsent ? "1" : "0",
      marketing: marketing === true ? "1" : "0",
      ...(discount > 0 && { bundle: "1" }),
    };
    if (adsConsent) {
      for (const [k, v] of [["fbp", "_fbp"], ["fbc", "_fbc"], ["ttp", "_ttp"]] as const) {
        const val = c.get(v)?.value;
        if (val) metadata[k] = val;
      }
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL!;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines,
      ...discountParams,
      shipping_address_collection: { allowed_countries: [...COUNTRIES] },
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: free ? 0 : Math.round(SHIPPING_FEE * 100), currency: "eur" },
          display_name: free ? "Envio grátis" : "Envio standard",
        },
      }],
      phone_number_collection: { enabled: true },
      metadata,
      after_expiration: { recovery: { enabled: true } },
      success_url: `${site}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: site,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof Stripe.errors.StripeInvalidRequestError)
      return NextResponse.json({ error: "invalid item" }, { status: 400 });
    console.error("[checkout]", e);
    return NextResponse.json({ error: "checkout failed" }, { status: 500 });
  }
}
