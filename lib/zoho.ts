// Cliente Zoho CRM partilhado (OAuth2 refresh token, região EU). Reutiliza também no webhook da Stripe.
let cache: { token: string; exp: number } | null = null;

async function token(): Promise<string> {
  if (cache && Date.now() < cache.exp) return cache.token;
  const res = await fetch("https://accounts.zoho.eu/oauth/v2/token", {
    method: "POST",
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error("Zoho auth failed");
  cache = { token: data.access_token, exp: Date.now() + 55 * 60_000 };
  return data.access_token;
}

export async function zoho(method: "GET" | "POST" | "PUT", path: string, body?: unknown) {
  const res = await fetch(`https://www.zohoapis.eu/crm/v6/${path}`, {
    method,
    headers: {
      Authorization: `Zoho-oauthtoken ${await token()}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null; // pesquisa sem resultados
  const json = await res.json();
  if (!res.ok) throw new Error(`Zoho ${method} ${path}: ${JSON.stringify(json)}`);
  return json;
}
