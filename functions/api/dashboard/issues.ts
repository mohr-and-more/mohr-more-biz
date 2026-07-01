/**
 * GET /api/dashboard/issues
 *
 * Returns dashboard-formatted issues from Paperclip.
 *
 * Auth:  Bearer token (from CHARLIE_API_KEYS env var)
 * Rate:  60 req/min per IP (KV: MOHR_MORE_RATE_LIMIT)
 *
 * Query params:
 *   ?status=open          — filter by status (open, in_progress, in_review, done, etc.)
 *   ?priority=critical    — filter by priority
 *   ?assignee=<agentId>   — filter by assignee
 *   ?limit=50             — max issues (default 100, max 200)
 *
 * MMB-174 / MMB-228
 */

import {
  authenticate,
  checkRateLimit,
  fetchPaperclipIssues,
  fetchAgents,
  mapToDashboardIssue,
  CORS_HEADERS,
  jsonError,
  jsonOk,
} from "../_lib";

interface Env {
  CHARLIE_API_KEYS: string;
  PAPERCLIP_API_TOKEN: string;
  MOHR_MORE_RATE_LIMIT?: KVNamespace;
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // ── Auth ──
  if (!authenticate(request, env as unknown as Record<string, string>)) {
    return jsonError(401, "Unauthorized: Invalid or missing Bearer token.");
  }

  // ── Rate Limit ──
  const rateResult = await checkRateLimit(request, env.MOHR_MORE_RATE_LIMIT);
  if (!rateResult.allowed) {
    return jsonError(429, "Rate limit exceeded. Max 60 requests per minute.", {
      retryAfter: 60,
    });
  }

  // ── Parse query params ──
  const url = new URL(request.url);
  const params = url.searchParams;

  const statusParam = params.get("status") || undefined;
  const priorityParam = params.get("priority") || undefined;
  const assigneeParam = params.get("assignee") || undefined;
  const limitParam = Math.min(parseInt(params.get("limit") || "100", 10), 200);

  // ── Map "open" status to non-done statuses ──
  let statusFilter = statusParam;
  if (statusParam === "open") {
    statusFilter = undefined; // we'll filter client-side for non-done
  }

  try {
    const apiToken = env.PAPERCLIP_API_TOKEN;

    if (!apiToken) {
      return jsonError(500, "Server misconfiguration: PAPERCLIP_API_TOKEN not set.");
    }

    // ── Fetch issues + agents in parallel ──
    const [issues, agents] = await Promise.all([
      fetchPaperclipIssues(apiToken, {
        status: statusFilter,
        priority: priorityParam,
        assigneeAgentId: assigneeParam,
        limit: limitParam,
      }),
      fetchAgents(apiToken),
    ]);

    // ── Map to dashboard format ──
    let dashboardIssues = issues.map((issue) => mapToDashboardIssue(issue, agents));

    // ── Client-side "open" filter (excludes done + cancelled) ──
    if (statusParam === "open") {
      dashboardIssues = dashboardIssues.filter(
        (i) => i.status !== "done" && i.status !== "cancelled"
      );
    }

    // ── Sort by priority (critical first), then by lastActivityAt desc ──
    const priorityOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    dashboardIssues.sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 99;
      const pb = priorityOrder[b.priority] ?? 99;
      if (pa !== pb) return pa - pb;
      return (b.lastActivityAt || "").localeCompare(a.lastActivityAt || "");
    });

    // ── Return ──
    return jsonOk({
      total: dashboardIssues.length,
      issues: dashboardIssues,
      meta: {
        rateLimit: { remaining: rateResult.remaining, limit: 60 },
        filters: {
          status: statusParam || "all",
          priority: priorityParam || "all",
          assignee: assigneeParam || "all",
        },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonError(502, `Failed to fetch issues from Paperclip: ${message}`);
  }
};
