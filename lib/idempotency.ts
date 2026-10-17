import { randomUUID } from "node:crypto";

const DONE_TTL_SECONDS = 60 * 60 * 24 * 30;

function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Upstash Redis idempotency is not configured");
  return { url, token };
}

async function command(args: (string | number)[]): Promise<unknown> {
  const { url, token } = config();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const data = await res.json() as { result?: unknown; error?: string };
  if (!res.ok || data.error) throw new Error("Upstash idempotency command failed");
  return data.result;
}

export async function isDone(key: string): Promise<boolean> {
  return (await command(["GET", "idempotency:done:" + key])) === "1";
}

export async function acquireLock(key: string, ttlSeconds = 900): Promise<string | null> {
  const token = randomUUID();
  const result = await command([
    "SET", "idempotency:lock:" + key, token, "NX", "EX", ttlSeconds,
  ]);
  return result === "OK" ? token : null;
}

export async function markDone(key: string): Promise<void> {
  await command(["SET", "idempotency:done:" + key, "1", "EX", DONE_TTL_SECONDS]);
}

export async function releaseLock(key: string, token: string): Promise<void> {
  // Só o dono do lock o pode libertar; evita apagar um lock mais recente após expiração.
  await command([
    "EVAL",
    "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
    1,
    "idempotency:lock:" + key,
    token,
  ]);
}
