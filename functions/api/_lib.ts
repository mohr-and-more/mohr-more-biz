/**
 * Shared data-shaping for the mohr-more-biz dashboard Pages Functions.
 *
 * Centralizes the Paperclip-API fetch + the plain-language derivation
 * (4-word subject, what-to-do summary, name resolution) so both the
 * human-facing endpoint (`/api/issues`) and the machine-facing endpoint
 * (`/api/dashboard/issues`) return byte-identical shaped records.
 */

export interface Env {
  PAPERCLIP_API_BASE?: string;
  PAPERCLIP_COMPANY_ID?: string;
  PAPERCLIP_API_TOKEN?: string;
  /** When set, /api/issues requires a cookie `mmb_dash` matching this value. */
  DASHBOARD_ACCESS_TOKEN?: string;
  /** Comma-separated list of service tokens authorised for /api/dashboard/issues. */
  CHARLIE_API_KEYS?: string;
  /**
   * Optional Cloudflare KV namespace bound as `RATE_LIMIT` for the durable,
   * fleet-wide per-token rate limit on /api/dashboard/issues. When absent the
   * endpoint degrades to a best-effort per-isolate in-memory limit.
   */
  RATE_LIMIT?: KVNamespace;
}

export const DEFAULT_API_BASE = "https://app.mohr-more.biz";
export const DEFAULT_COMPANY_ID = "b7e413ab-35c1-4034-b474-8aad39901e72";
export const ISSUE_LIMIT = 500;
export const UPSTREAM_TIMEOUT_MS = 12_000;

interface RawIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  projectId?: string | null;
  assigneeAgentId?: string | null;
  assigneeUserId?: string | null;
  createdByAgentId?: string | null;
  createdByUserId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  hiddenAt?: string | null;
}
interface RawAgent { id: string; name: string; title?: string | null }
interface RawProject { id: string; name: string }
interface RawProfile { user?: { id: string; name?: string | null; email?: string | null } }

export interface DashboardIssue {
  identifier: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project: string;
  requester: string;
  assignee: string;
  subject: string;
  summary: string;
  paperclipUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  issues: DashboardIssue[];
  projects: string[];
  requesters: string[];
  assignees: string[];
  statuses: string[];
}

const VALID = new Set(["todo", "backlog", "in_progress", "in_review", "done", "cancelled", "blocked"]);
function normalizeStatus(s: string): string {
  return VALID.has(s) ? s : "todo";
}

export function jsonResponse(body: unknown, status: number, private_ = false): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": private_ ? "private, no-store" : "public, max-age=30",
      Vary: private_ ? "Cookie" : "Origin",
    },
  });
}

export function parseCookies(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

function toSubject(title: string): string {
  const words = title.replace(/[#*`_>]/g, " ").replace(/\s+/g, " ").trim().split(" ").slice(0, 4).join(" ").replace(/[\s.,;:]+$/, "");
  if (words.length <= 42) return words;
  return words.slice(0, 42).replace(/\s+\S*$/, "") + "…";
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:]+$/, "") + "…";
}

function toSummary(description: string, title: string): string {
  const text = (description || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/\s+/g, " ")
    .trim();
  if (text) return truncate(text, 260);
  return `„${truncate(title, 80)}" — Details siehe Paperclip.`;
}

function displayUserName(u: { name?: string | null; email?: string | null }): string {
  const name = (u.name || "").trim();
  if (name.length >= 3) return name;
  const local = (u.email || "").split("@")[0].replace(/[._-]+/g, " ").trim();
  if (local) return local.replace(/\b\w/g, (c) => c.toUpperCase());
  return name || "Nutzer:in";
}

function distinct(values: string[]): string[] {
  return [...new Set(values.filter((v) => v && v !== "—"))].sort((a, b) => a.localeCompare(b, "de"));
}

/** Fetch the full dashboard dataset from Paperclip and shape it. */
export async function fetchDashboardData(env: Env): Promise<DashboardData> {
  const apiBase = (env.PAPERCLIP_API_BASE || DEFAULT_API_BASE).replace(/\/$/, "");
  const companyId = env.PAPERCLIP_COMPANY_ID || DEFAULT_COMPANY_ID;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (env.PAPERCLIP_API_TOKEN) headers.Authorization = `Bearer ${env.PAPERCLIP_API_TOKEN}`;

  const timeout = () => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    return { signal: controller.signal, clear: () => clearTimeout(t) };
  };
  const getJson = async (path: string) => {
    const { signal, clear } = timeout();
    try {
      const res = await fetch(`${apiBase}${path}`, { headers, signal });
      if (!res.ok) return null;
      return (await res.json()) as unknown;
    } catch {
      return null;
    } finally {
      clear();
    }
  };

  const [issuesRes, projectsRes, agentsRes] = await Promise.all([
    getJson(`/api/companies/${companyId}/issues?limit=${ISSUE_LIMIT}`),
    getJson(`/api/companies/${companyId}/projects`),
    getJson(`/api/companies/${companyId}/agents`),
  ]);

  const rawIssues = (Array.isArray(issuesRes) ? issuesRes : []) as RawIssue[];
  const projects = (Array.isArray(projectsRes) ? projectsRes : []) as RawProject[];
  const agents = (Array.isArray(agentsRes) ? agentsRes : []) as RawAgent[];

  const projectName = new Map<string, string>(projects.map((p) => [p.id, p.name || "—"]));
  const agentName = new Map<string, string>(agents.map((a) => [a.id, a.name || "Agent"]));

  const userIds = new Set<string>();
  for (const it of rawIssues) {
    if (it.createdByUserId) userIds.add(it.createdByUserId);
    if (it.assigneeUserId) userIds.add(it.assigneeUserId);
  }
  const userName = new Map<string, string>();
  await Promise.all(
    [...userIds].map(async (id) => {
      const profile = (await getJson(`/api/companies/${companyId}/users/${id}/profile`)) as RawProfile | null;
      userName.set(id, profile?.user ? displayUserName(profile.user) : "—");
    }),
  );

  const resolveAssignee = (it: RawIssue): string => {
    if (it.assigneeAgentId && agentName.has(it.assigneeAgentId)) return agentName.get(it.assigneeAgentId)!;
    if (it.assigneeUserId && userName.has(it.assigneeUserId)) return userName.get(it.assigneeUserId)!;
    return "—";
  };
  const resolveRequester = (it: RawIssue): string => {
    if (it.createdByUserId && userName.has(it.createdByUserId)) return userName.get(it.createdByUserId)!;
    if (it.createdByAgentId && agentName.has(it.createdByAgentId)) return agentName.get(it.createdByAgentId)!;
    return "—";
  };

  const prefix = rawIssues[0]?.identifier?.split("-")[0] || "MMB";

  const issues: DashboardIssue[] = rawIssues
    .filter((it) => !it.hiddenAt && it.identifier)
    .map((it) => ({
      identifier: it.identifier,
      title: it.title || "Ohne Titel",
      description: it.description || "",
      status: normalizeStatus(it.status),
      priority: it.priority || "medium",
      project: (it.projectId && projectName.get(it.projectId)) || "—",
      requester: resolveRequester(it),
      assignee: resolveAssignee(it),
      subject: toSubject(it.title || it.identifier),
      summary: toSummary(it.description || "", it.title || ""),
      paperclipUrl: `${apiBase}/${prefix}/issues/${it.identifier}`,
      createdAt: it.createdAt || "",
      updatedAt: it.updatedAt || "",
    }));

  return {
    issues,
    projects: distinct(issues.map((i) => i.project)),
    requesters: distinct(issues.map((i) => i.requester)),
    assignees: distinct(issues.map((i) => i.assignee)),
    statuses: distinct(issues.map((i) => i.status)),
  };
}

// ---------------------------------------------------------------------------
// Filter parameter parsing — case-insensitive, label-tolerant.
// Matches the dashboard's status badges ("In Progress" / "in_progress").
// ---------------------------------------------------------------------------

const STATUS_LABEL_TO_KEY: Record<string, string> = {
  todo: "todo",
  backlog: "backlog",
  "in progress": "in_progress",
  inprogress: "in_progress",
  in_progress: "in_progress",
  "in review": "in_review",
  inreview: "in_review",
  in_review: "in_review",
  done: "done",
  cancelled: "cancelled",
  canceled: "cancelled",
  blocked: "blocked",
};

export function normStatusFilter(raw: string | null): string | null {
  if (!raw) return null;
  const key = STATUS_LABEL_TO_KEY[raw.trim().toLowerCase().replace(/\s+/g, " ")] ?? null;
  return key;
}

/** Apply the four optional dashboard filters (project/status/assignee/requester). */
export function filterDashboard(data: DashboardData, filters: {
  project?: string | null;
  status?: string | null; // already normalised key
  assignee?: string | null;
  requester?: string | null;
}): DashboardData {
  const norm = (s: string | null | undefined): string | null =>
    s && s.trim() ? s.trim().toLowerCase() : null;
  const proj = norm(filters.project);
  const stat = filters.status || null;
  const ass = norm(filters.assignee);
  const req = norm(filters.requester);

  const issues = data.issues.filter((i) => {
    if (proj && i.project.toLowerCase() !== proj) return false;
    if (stat && i.status !== stat) return false;
    if (ass && i.assignee.toLowerCase() !== ass) return false;
    if (req && i.requester.toLowerCase() !== req) return false;
    return true;
  });

  return {
    issues,
    projects: distinct(issues.map((i) => i.project)),
    requesters: distinct(issues.map((i) => i.requester)),
    assignees: distinct(issues.map((i) => i.assignee)),
    statuses: distinct(issues.map((i) => i.status)),
  };
}
