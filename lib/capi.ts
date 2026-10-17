import crypto from "crypto";
import type Stripe from "stripe";

const sha = (s: string) => crypto.createHash("sha256").update(s.trim().toLowerCase()).digest("hex");

// Só envia se o cliente deu consentimento (guardado na metadata pelo /api/checkout).
export async function sendPurchase(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  if (m.consent !== "1") return;

  const email = session.customer_details?.email;
  const value = (session.amount_total ?? 0) / 100;
  const time = session.created; // hora original do checkout, estável em reentregas do webhook
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso`;
  const jobs: Promise<Response>[] = [];

  if (process.env.NEXT_PUBLIC_META_PIXEL_ID && process.env.META_CAPI_TOKEN) {
    jobs.push(fetch(
      `https://graph.facebook.com/v21.0/${process.env.NEXT_PUBLIC_META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(process.env.META_TEST_EVENT_CODE && { test_event_code: process.env.META_TEST_EVENT_CODE }),
          data: [{
            event_name: "Purchase", event_time: time, event_id: session.id,
            action_source: "website", event_source_url: url,
            user_data: { ...(email && { em: [sha(email)] }), ...(m.fbp && { fbp: m.fbp }), ...(m.fbc && { fbc: m.fbc }) },
            custom_data: { currency: "EUR", value },
          }],
        }),
      }
    ));
  }

  if (process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID && process.env.TIKTOK_EVENTS_TOKEN) {
    jobs.push(fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Access-Token": process.env.TIKTOK_EVENTS_TOKEN },
      body: JSON.stringify({
        event_source: "web", event_source_id: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
        data: [{
          event: "CompletePayment", event_time: time, event_id: session.id,
          user: { ...(email && { email: sha(email) }), ...(m.ttp && { ttp: m.ttp }) },
          properties: { currency: "EUR", value },
          page: { url },
        }],
      }),
    }));
  }

  const res = await Promise.allSettled(jobs);
  res.forEach((r) => r.status === "rejected" && console.error("[capi]", r.reason));
}
