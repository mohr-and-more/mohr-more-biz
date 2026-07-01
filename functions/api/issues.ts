/**
 * Cloudflare Pages Function — same-origin data source for the public dashboard.
 *
 * The dashboard page is part of a statically-exported Next.js app, so it has no
 * server runtime of its own. This function (runs on the Cloudflare edge) is the
 * "Backend" the spec asks for: it talks to the Paperclip API so the browser
 * never has to (Paperclip does not send CORS headers, and we don't want to
 * leak internal hostnames to the client).
 *
 * Route: GET /api/issues  ->  DashboardData JSON
 *
 * Auth: as a go-live step, protect /dashboard and /api/issues with a Cloudflare
 * Access (Zero Trust) email policy for @mohr-more.biz — see the issue plan.
 * When DASHBOARD_ACCESS_TOKEN is set, this endpoint requires a cookie `mmb_dash`
 * matching that value.
 *
 * Data shaping + filter logic live in ./_lib and are shared with the machine-
 * facing endpoint /api/dashboard/issues (MMB-174).
 */

import { type Env, fetchDashboardData, jsonResponse, parseCookies } from "./_lib";

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  const env = context.env ?? {};

  const gate = (env.DASHBOARD_ACCESS_TOKEN || "").trim();
  if (gate) {
    const cookie = parseCookies(context.request.headers.get("cookie") || "")["mmb_dash"];
    if (!cookie || cookie !== gate) {
      return jsonResponse({ error: "unauthorized", gated: true }, 401, true);
    }
  }

  let data;
  try {
    data = await fetchDashboardData(env);
  } catch {
    return jsonResponse({ error: "upstream unavailable" }, 502, Boolean(gate));
  }
  return jsonResponse(data, 200, Boolean(gate));
};
