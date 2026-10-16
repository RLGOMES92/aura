import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { zoho } from "@/lib/zoho";

export const runtime = "nodejs";

type Payload = {
  type: string;
  data?: {
    shipment?: { carrier?: string; tracking_number?: string; tracking_url?: string };
    order?: { id: number; external_id?: string }; // external_id = Stripe session.id
  };
};

// A Printful (v1) não assina webhooks: protegemos com um segredo no URL.
function authorized(req: Request) {
  const given = Buffer.from(new URL(req.url).searchParams.get("secret") ?? "");
  const expected = Buffer.from(process.env.PRINTFUL_WEBHOOK_SECRET ?? "");
  return expected.length > 0 && given.length === expected.length && timingSafeEqual(given, expected);
}

const ok = () => NextResponse.json({ received: true });

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Payload;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }

  // Cliente pagou mas a produção falhou: tens de agir (liga isto a Sentry/e-mail)
  if (body.type === "order_failed") {
    console.error("[printful] ORDER FAILED", JSON.stringify(body.data));
    return ok();
  }
  if (body.type !== "package_shipped") return ok();

  const ext = body.data?.order?.external_id;
  const s = body.data?.shipment;
  if (!ext || !s?.tracking_url) {
    console.error("[printful] shipment sem external_id/tracking_url", JSON.stringify(body.data));
    return ok();
  }

  try {
    const found = await zoho(
      "GET",
      `Deals/search?criteria=${encodeURIComponent(`(Stripe_Session_ID:equals:${ext})`)}&fields=id,Tracking_URL`
    );
    const deal = found?.data?.[0];
    if (!deal) {
      console.error("[printful] Deal não encontrado para", ext);
      return ok(); // não adianta a Printful repetir
    }
    if (deal.Tracking_URL === s.tracking_url) return ok(); // retry da Printful: não reenviar e-mail

    await zoho("PUT", `Deals/${deal.id}`, {
      data: [{
        Tracking_URL: s.tracking_url,
        Tracking_Number: s.tracking_number ?? "",
        Carrier: s.carrier ?? "",
      }],
    });
    return ok();
  } catch (e) {
    console.error("[printful->zoho]", e);
    return NextResponse.json({ error: "zoho failed" }, { status: 500 }); // Printful repete
  }
}
