/**
 * Shared library for Dashboard API functions.
 *
 * Provides: Paperclip → DashboardIssue mapping, Bearer auth, KV rate-limiting.
 * MMB-174 / MMB-228
 */

// ── Types ──────────────────────────────────────────────

export interface DashboardIssue {
  id: string;
  identifier: string;
  subject: string;            // ≤4-word headline derived from title
  summary: string;            // "Was ist zu tun" summary from description
  status: string;
  priority: string;
  assigneeName: string | null;
  assigneeRole: string | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  url: string;                // deep link to Paperclip issue
}

interface AgentInfo {
  id: string;
  name: string;
  role: string;
}

interface PaperclipIssue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigneeAgentId: string | null;
  assigneeUserId: string | null;
  labels: Array<{ id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

// ── Config ─────────────────────────────────────────────

const PAPERCLIP_API_URL = "https://app.mohr-more.biz/api";
const COMPANY_ID = "b7e413ab-35c1-4034-b474-8aad39901e72";

// ── Helpers ────────────────────────────────────────────

/**
 * Extract a ≤4-word headline from an issue title.
 * Strips common prefixes like "INFRA BLOCKER:", "BUG:", etc.
 */
export function extractFourWordSubject(title: string): string {
  let clean = title
    .replace(/^\[?[A-Z][A-Z\s/-]{3,}:\s*/i, "") // strip "PREFIX:" headers
    .replace(/^\[[A-Z-]+\]\s*/i, "")              // strip [TAG] prefixes
    .trim();

  const words = clean.split(/\s+/).filter(Boolean);
  const subject = words.slice(0, 4).join(" ");

  if (words.length > 4) {
    return subject + "…";
  }
  return subject || clean || title;
}

/**
 * Generate a "Was ist zu tun" summary from the issue description.
 * Extracts the first actionable paragraph (skips markdown headers).
 */
export function extractSummary(description: string | null): string {
  if (!description) return "Keine Beschreibung vorhanden.";

  // Remove markdown headers, code blocks, frontmatter
  const lines = description
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^---[\s\S]*?---/g, "")
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return t && !t.startsWith("#") && !t.startsWith("```") && !t.startsWith("|");
    });

  // Find first substantive line (≥10 chars)
  for (const line of lines) {
    const clean = line.trim().replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
    if (clean.length >= 10) {
      // Truncate at ~200 chars
      return clean.length > 200 ? clean.slice(0, 197) + "…" : clean;
    }
  }

  return lines[0]?.trim().slice(0, 200) || "Keine Details vorhanden.";
}

/**
 * Resolve an agentId to a human-readable name.
 */
export function resolveAgentName(
  agentId: string | null,
  agents: Map<string, AgentInfo>
): { name: string | null; role: string | null } {
  if (!agentId) return { name: null, role: null };
  const agent = agents.get(agentId);
  if (agent) {
    return { name: agent.name, role: agent.role };
  }
  return { name: agentId.slice(0, 8), role: null };
}

/**
 * Map a Paperclip issue to the dashboard format.
 */
export function mapToDashboardIssue(
  issue: PaperclipIssue,
  agents: Map<string, AgentInfo>
): DashboardIssue {
  const { name, role } = resolveAgentName(issue.assigneeAgentId, agents);
  const labels = (issue.labels || []).map((l) => l.name || l.id);

  return {
    id: issue.id,
    identifier: issue.identifier,
    subject: extractFourWordSubject(issue.title),
    summary: extractSummary(issue.description),
    status: issue.status,
    priority: issue.priority,
    assigneeName: name,
    assigneeRole: role,
    labels,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    lastActivityAt: issue.lastActivityAt || issue.updatedAt,
    url: `https://app.mohr-more.biz/issues/${issue.id}`,
  };
}

// ── Auth ───────────────────────────────────────────────

/**
 * Validate Bearer token against CHARLIE_API_KEYS env var.
 * Supports comma-separated list of valid keys.
 */
export function authenticate(request: Request, env: Record<string, string>): boolean {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) return false;

  const validKeys = (env.CHARLIE_API_KEYS || "").split(",").map((k) => k.trim());
  return validKeys.includes(token);
}

// ── Rate Limiting ──────────────────────────────────────

/**
 * KV-based rate limiting (MMB-175).
 * Limit: 60 requests per minute per IP.
 */
export async function checkRateLimit(
  request: Request,
  kv: KVNamespace | undefined
): Promise<{ allowed: boolean; remaining: number }> {
  if (!kv) return { allowed: true, remaining: 999 };

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const windowKey = `rl:${ip}:${Math.floor(Date.now() / 60_000)}`;
  const limit = 60;

  const current = parseInt((await kv.get(windowKey)) || "0", 10);

  if (current >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await kv.put(windowKey, String(current + 1), { expirationTtl: 120 });

  return { allowed: true, remaining: limit - current - 1 };
}

// ── API Client ─────────────────────────────────────────

/**
 * Fetch issues from Paperclip API.
 */
export async function fetchPaperclipIssues(
  apiToken: string,
  filters: { status?: string; priority?: string; assigneeAgentId?: string; limit?: number }
): Promise<PaperclipIssue[]> {
  const params = new URLSearchParams();
  params.set("limit", String(filters.limit || 100));
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.assigneeAgentId) params.set("assigneeAgentId", filters.assigneeAgentId);

  const url = `${PAPERCLIP_API_URL}/companies/${COMPANY_ID}/issues?${params}`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    throw new Error(`Paperclip API error: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json() as PaperclipIssue[] | { issues: PaperclipIssue[] };
  const issues = Array.isArray(data) ? data : (data.issues || []);
  return issues;
}

/**
 * Fetch all agents for name resolution.
 */
export async function fetchAgents(apiToken: string): Promise<Map<string, AgentInfo>> {
  const url = `${PAPERCLIP_API_URL}/companies/${COMPANY_ID}/agents?limit=200`;

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    return new Map();
  }

  const data = await resp.json() as AgentInfo[] | { agents: AgentInfo[] };
  const agents = Array.isArray(data) ? data : (data.agents || []);

  const map = new Map<string, AgentInfo>();
  for (const a of agents) {
    map.set(a.id, { id: a.id, name: a.name, role: a.role });
  }
  return map;
}

// ── Constants ──────────────────────────────────────────

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://mohr-more.biz",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

export function jsonError(status: number, message: string, extra: Record<string, unknown> = {}): Response {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function jsonOk(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      ...CORS_HEADERS,
    },
  });
}
