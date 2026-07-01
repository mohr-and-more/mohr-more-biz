/**
 * Cloudflare Pages Function — same-origin z.ai quota source for the dashboard.
 *
 * Serves quota trend data (5h/7d window usage vs limits) baked at build time by
 * scripts/bake-quota.mjs from /home/admin01/ops/reports snapshots. Baking the
 * data at build time (rather than proxying a runtime upstream) removes the
 * dependency on the api.mohr-more.biz tunnel route and makes the endpoint
 * deterministic + fast. The snapshot updates once daily, so a build-time bake
 * is always fresh enough (redeployed by the daily routine).
 *
 * Route: GET /api/quota  ->  QuotaData JSON (latest 5h/7d + per-day series)
 *
 * Auth: reuses the `mmb_dash` access cookie gate, identical to /api/issues.
 */

import quotaData from "./_quota-data.json";
import { type Env, jsonResponse, parseCookies } from "./_lib";

export const onRequestGet = (context: { env: Env; request: Request }) => {
  const env = context.env ?? {};

  const gate = (env.DASHBOARD_ACCESS_TOKEN || "").trim();
  if (gate) {
    const cookie = parseCookies(context.request.headers.get("cookie") || "")["mmb_dash"];
    if (!cookie || cookie !== gate) {
      return jsonResponse({ error: "unauthorized", gated: true }, 401, true);
    }
  }

  // Baked data is static → a short edge cache is safe and cheap.
  return jsonResponse(quotaData, 200, Boolean(gate));
};
