// Gasto em anúncios por produto, guardado no Upstash Redis (REST, sem SDK).
const url = process.env.UPSTASH_REDIS_REST_URL;
const auth = { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` };

export const spendEnabled = Boolean(url && process.env.UPSTASH_REDIS_REST_TOKEN);

export async function getSpend(): Promise<Record<string, number>> {
  if (!spendEnabled) return {};
  try {
    const r = await fetch(`${url}/get/adspend`, { headers: auth, cache: "no-store" });
    if (!r.ok) return {};
    const { result } = await r.json();
    if (!result) return {};
    const parsed: unknown = JSON.parse(result);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([key, value]) =>
      key.length <= 120 && typeof value === "number" && Number.isFinite(value) && value >= 0
    ));
  } catch { return {}; }
}

export async function setSpend(v: Record<string, number>) {
  if (!spendEnabled) throw new Error("Upstash não configurado");
  const safe = Object.fromEntries(Object.entries(v).filter(([key, value]) =>
    key.length <= 120 && typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1_000_000
  ));
  const r = await fetch(`${url}/set/adspend`, { method: "POST", headers: auth, body: JSON.stringify(safe) });
  if (!r.ok) throw new Error("Falha ao guardar gasto");
}
