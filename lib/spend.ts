// Gasto em anúncios por produto, guardado no Upstash Redis (REST, sem SDK).
const url = process.env.UPSTASH_REDIS_REST_URL;
const auth = { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` };

export const spendEnabled = Boolean(url && process.env.UPSTASH_REDIS_REST_TOKEN);

export async function getSpend(): Promise<Record<string, number>> {
  if (!spendEnabled) return {};
  try {
    const r = await fetch(`${url}/get/adspend`, { headers: auth, cache: "no-store" });
    const { result } = await r.json();
    return result ? JSON.parse(result) : {};
  } catch { return {}; }
}

export async function setSpend(v: Record<string, number>) {
  if (!spendEnabled) throw new Error("Upstash não configurado");
  const r = await fetch(`${url}/set/adspend`, { method: "POST", headers: auth, body: JSON.stringify(v) });
  if (!r.ok) throw new Error("Falha ao guardar gasto");
}
