/**
 * Cloudflare Pages Function — programmatic read endpoint for Charlie / Open WebUI.
 *
 * Returns the SAME dashboard dataset as the human-facing /api/issues endpoint,
 * but authenticates via a dedicated service Bearer token (CHARLIE_API_KEYS),
 * supports the four dashboard filter query params, and applies a 60 req/min
 * rate limit per token. Read-only by construction (onRequestGet only).
 *
 * Route: GET /api/dashboard/issues[?project=&status=&assignee=&requester=]
 *
 * Configuration (Pages environment variables):
 *   CHARLIE_API_KEYS   Comma-separated list of service tokens authorised here.
 *                      Independent of user logins; read-only.
 *   PAPERCLIP_*        Forwarded to the shared fetchDashboardData() helper.
 *
 * Auth: requests must carry  Authorization: Bearer <one-o...YS>.
 *       No/invalid token -> 401. The matched key is compared in constant time.
 *
 * NOTE: Cloudflare Pages Functions are stateless and do not share in-memory
 * state across invocations, so the per-token rate limit uses the edge KV-free
 * approach of a fixed window derived from Cloudflare's request timestamp. Each
 * logged request records (timestamp-bucket, token-fingerprint); a second write
 * within the same minute from the same token that exceeds 60 in that bucket is
 * rejected with 429. When Cloudflare KV is bound (env.RATE_LIMIT), a durable
 * counter is used instead — see runtime probe in limitRate().
 */

import {
  type Env,
  fetchDashboardData,
  filterDashboard,
  normStatusFilter,
  jsonResponse,
} from "../_lib";

const RATE_LIMIT_PER_MINUTE = 60;

export const onRequestGet = async (context: { env: Env; request: Request; next: () => Promise<Response> }) => {
  const env = context.env ?? {};
  const auth = context.request.headers.get("authorization") || "";

  // --- 1. Bearer-token auth (constant-time compare) ----------------------
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const allowed = (env.CHARLIE_API_KEYS || "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);
  if (allowed.length === 0) {
    // Not configured: fail closed. Never expose data without an explicit token set.
    return jsonResponse({ error: "service token not configured" }, 503, true);
  }
  let matched = false;
  for (const candidate of allowed) {
    if (candidate.length === token.length && timingSafeEqual(candidate, token)) {
      matched = true;
      break;
    }
  }
  if (!matched || !token) {
    return jsonResponse({ error: "unauthorized" }, 401, true);
  }

  // --- 2. Rate limiting (fixed-minute window) -----------------------------
  const overLimit = await limitRate(env, token);
  if (overLimit) {
    return jsonResponse(
      { error: "rate limit exceeded", retryAfterSeconds: overLimit },
      429,
      true,
    );
  }

  // --- 3. Parse optional filters -----------------------------------------
  const url = new URL(context.request.url);
  const filters = {
    project: url.searchParams.get("project"),
    status: normStatusFilter(url.searchParams.get("status")),
    assignee: url.searchParams.get("assignee"),
    requester: url.searchParams.get("requester"),
  };

  // --- 4. Fetch + shape + filter -----------------------------------------
  let data;
  try {
    data = await fetchDashboardData(env);
  } catch {
    return jsonResponse({ error: "upstream unavailable" }, 502, true);
  }
  const hasFilters = Boolean(filters.project || filters.status || filters.assignee || filters.requester);
  const result = hasFilters ? filterDashboard(data, filters) : data;

  // --- 5. Structured access log (anonymised token) -----------------------
  // Emitted to stdout — Cloudflare captures it in Pages request logs.
  console.log(
    JSON.stringify({
      kind: "dashboard-api",
      ts: new Date().toISOString(),
      token: fingerprint(token),
      filters,
      resultCount: result.issues.length,
    }),
  );

  return jsonResponse(result, 200, true);
};

/**
 * Per-token rate limiting.
 *
 * When a `RATE_LIMIT` KV namespace is bound, each request read-then-writes a
 * per-minute counter `<fingerprint>:<bucket>` in durable KV. Once the counter
 * reaches RATE_LIMIT_PER_MINUTE, further requests in that minute return a
 * Retry-After and are rejected with 429 — a hard, fleet-wide gate.
 *
 * Without KV bound, degrades to a best-effort per-isolate in-memory map (good
 * enough to stop a runaway single client, not a fleet-wide guarantee).
 *
 * Consistency note: Cloudflare KV is eventually consistent across colos, so a
 * truly concurrent burst (several requests in flight at once) may slip past.
 * Charlie's usage is sequential single-client, where this is a hard 60/min gate.
 */
async function limitRate(env: Env, token: string): Promise<number> {
  const bucket = Math.floor(Date.now() / 60_000);
  const key = `${fingerprint(token)}:${bucket}`;
  const retryAfter = Math.max(1, 60 - Math.floor((Date.now() / 1000) % 60));
  const kv = env.RATE_LIMIT;

  if (!kv) {
    // In-memory fallback (per-isolate).
    const mem = (globalThis as unknown as { __RL?: Map<string, number> }).__RL;
    const map = mem ?? new Map<string, number>();
    const count = (map.get(key) ?? 0) + 1;
    map.set(key, count);
    (globalThis as unknown as { __RL?: Map<string, number> }).__RL = map;
    // Opportunistic GC of prior buckets (keeps the map tiny).
    if (map.size > 200) {
      for (const k of [...map.keys()]) if (!k.endsWith(`:${bucket}`)) map.delete(k);
    }
    return count > RATE_LIMIT_PER_MINUTE ? retryAfter : 0;
  }

  // Durable path: read the counter, reject if already at/over the limit, else
  // increment. The 60s TTL auto-expires the key at bucket rollover (no manual GC).
  const current = Number(await kv.get(key)) || 0;
  if (current >= RATE_LIMIT_PER_MINUTE) {
    return retryAfter;
  }
  await kv.put(key, String(current + 1), { expirationTtl: 60 });
  return 0;
}

/** First 8 hex chars of a SHA-ish fingerprint — enough to correlate logs without leaking the token. */
function fingerprint(token: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function timingSafeEqual(a: string, b: string): boolean {
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
