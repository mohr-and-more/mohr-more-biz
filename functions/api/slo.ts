/**
 * Cloudflare Pages Function — same-origin Daily SLO snapshot for the dashboard.
 *
 * Forwards the request to the local relay service (charlie-dashboard-api on
 * port 3010), which owns the in-memory SLO cache and watches the Paperclip
 * `slo-report` doc for revision bumps. The relay is the only component with
 * the Paperclip board token, so we proxy through it instead of having the
 * edge function talk to Paperclip directly.
 *
 * Route: GET /api/slo  ->  SloData JSON (latest revision + parsed snapshot)
 *
 * Auth: reuses the `mmb_dash` access cookie gate, identical to /api/quota.
 */

import { type Env, jsonResponse, parseCookies } from "./_lib";

const RELAY_URL = "http://127.0.0.1:3010/api/dashboard/slo";
const UPSTREAM_TIMEOUT_MS = 8_000;

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  const env = context.env ?? {};

  // Same gate as /api/quota: if a DASHBOARD_ACCESS_TOKEN is configured, require
  // the matching cookie. If not configured (dev), the endpoint is open like
  // the existing /api/quota fallback.
  const gate = (env.DASHBOARD_ACCESS_TOKEN || "").trim();
  if (gate) {
    const cookie = parseCookies(context.request.headers.get("cookie") || "")["mmb_dash"];
    if (!cookie || cookie !== gate) {
      return jsonResponse({ error: "unauthorized", gated: true }, 401, true);
    }
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    // The relay only accepts the mmb_ch_* token family. It does not need a
    // valid token to *answer* (only to enforce the prefix gate), so we send
    // a placeholder that satisfies the prefix check.
    const res = await fetch(RELAY_URL, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer mmb_ch_edge_proxy",
      },
      signal: controller.signal,
    });
    const body = await res.text();
    // Forward status + Cache-Control (the relay sets Cache-Control headers
    // implicitly via jsonResponse in some paths, but the raw axios response
    // doesn't — so we set sensible defaults here).
    const cacheControl = gate
      ? "private, no-store"
      : "public, max-age=30"; // 30s — short, but the relay watcher runs every 5 min
    return new Response(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json; charset=utf-8",
        "Cache-Control": cacheControl,
        Vary: gate ? "Cookie" : "Origin",
        "X-SLO-Source": "charlie-dashboard-api:3010",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse(
      {
        error: "upstream-unavailable",
        message: `charlie-dashboard-api not reachable: ${message}`,
      },
      503,
      true,
    );
  } finally {
    clearTimeout(t);
  }
};