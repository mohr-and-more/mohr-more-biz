/**
 * Data-access layer for the public Issue Dashboard.
 *
 * Pure, framework-agnostic helpers: types, status model, normalisation,
 * filtering and search. No React here — UI components live in
 * `src/components/dashboard/`. The server-side mapping happens in the
 * Cloudflare Pages Function at `functions/api/issues.ts`, which talks to the
 * Paperclip API so the browser never has to (Paperclip sends no CORS headers).
 */

/** Normalised dashboard status keys (subset of the Paperclip lifecycle). */
export type DashboardStatus =
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"
  | "cancelled"
  | "blocked"
  | "backlog";

export interface DashboardIssue {
  /** Paperclip identifier, e.g. "MMB-90". */
  identifier: string;
  title: string;
  description: string;
  status: DashboardStatus;
  priority: string;
  /** Project name (or "—"). */
  project: string;
  /** Human-friendly requester name (or "—"). */
  requester: string;
  /** Human-friendly assignee name (or "—"). */
  assignee: string;
  /** Short, plain-language kernel of the issue (≤ ~4 words). */
  subject: string;
  /** Plain-language summary of what's needed to finish the issue. */
  summary: string;
  /** Absolute Paperclip deep link to the issue. */
  paperclipUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  issues: DashboardIssue[];
  /** Distinct, sorted filter option sources. */
  projects: string[];
  requesters: string[];
  assignees: string[];
  statuses: DashboardStatus[];
}

export interface DashboardFilters {
  search: string;
  project: string; // "" = any
  requester: string; // "" = any
  assignee: string; // "" = any
  status: string; // "" = any
}

export const EMPTY_FILTERS: DashboardFilters = {
  search: "",
  project: "",
  requester: "",
  assignee: "",
  status: "",
};

/** Status badge colour model (per MMB-171 spec). */
export interface StatusMeta {
  label: string;
  /** Foreground colour. */
  color: string;
  /** Soft background tint. */
  bg: string;
  /** 0 = neutral, higher = more attention (for sorting). */
  order: number;
}

export const STATUS_META: Record<DashboardStatus, StatusMeta> = {
  blocked: { label: "Blockiert", color: "#ef4444", bg: "rgba(239,68,68,0.12)", order: 5 },
  in_progress: { label: "In Arbeit", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", order: 4 },
  in_review: { label: "Wartet auf Prüfung", color: "#bd93f9", bg: "rgba(189,147,249,0.14)", order: 3 },
  todo: { label: "Offen", color: "#e5e5e5", bg: "rgba(229,229,229,0.08)", order: 2 },
  backlog: { label: "Zurückgestellt", color: "#9ca3af", bg: "rgba(156,163,175,0.10)", order: 1 },
  done: { label: "Erledigt", color: "#22c55e", bg: "rgba(34,197,94,0.12)", order: 0 },
  cancelled: { label: "Abgebrochen", color: "#6b7280", bg: "rgba(107,114,128,0.12)", order: -1 },
};


/** Priority visual signal model (per MMB-397 spec). */
export type PriorityLevel = "urgent" | "high" | "medium" | "low";

export interface PriorityMeta {
  label: string;
  /** Foreground colour for the signal dot / text. */
  color: string;
  /** 0 = neutral, higher = more attention (for sorting). */
  order: number;
}

export const PRIORITY_META: Record<string, PriorityMeta> = {
  urgent: { label: "Dringend", color: "#ef4444", order: 4 },
  high: { label: "Hoch", color: "#f59e0b", order: 3 },
  medium: { label: "Mittel", color: "#8fc6ff", order: 2 },
  low: { label: "Niedrig", color: "#6b7280", order: 1 },
};

/** Normalise a raw Paperclip priority string to a known level. */
export function normalisePriority(raw: string): PriorityLevel {
  const p = (raw || "").trim().toLowerCase();
  if (p === "urgent" || p === "critical" || p === "p0") return "urgent";
  if (p === "high" || p === "p1") return "high";
  if (p === "low" || p === "p2" || p === "p3") return "low";
  return "medium";
}


/** Fetch dashboard data from the same-origin Pages Function. */
export async function fetchDashboard(signal?: AbortSignal): Promise<DashboardData> {
  const res = await fetch("/api/issues", { signal, headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Dashboard API antwortet mit Status ${res.status}`);
  }
  const data = (await res.json()) as DashboardData;
  return data;
}

// ---------------------------------------------------------------------------
// z.ai quota report (MMB-176) — 5h/7d utilization for the dashboard header.
// Served same-origin by the Cloudflare Pages Function /api/quota, which proxies
// the live snapshot produced on brainbug01 by zai-quota-report.py.
// ---------------------------------------------------------------------------

export interface QuotaPoint {
  /** UTC calendar day, `YYYY-MM-DD`. */
  date: string;
  /** Rolling 5-hour window prompt count for that day's snapshot. */
  v5h: number;
  /** Rolling 7-day window prompt count for that day's snapshot. */
  v7d: number;
}

export interface QuotaLatest {
  generated_at: string;
  combined_5h: number;
  combined_7d: number;
  pct_5h: number;
  pct_7d: number;
  cost_cents: number;
  flatrate_ok: boolean;
  coverage_note?: string;
  tradingagents_available: boolean;
  hermes_5h: number;
  hermes_7d: number;
  pi_local_7d: number;
  claude_local_7d: number;
}

export interface QuotaData {
  available: boolean;
  generated_at?: string;
  note?: string;
  limits: { window_5h: number; window_7d: number };
  latest?: QuotaLatest;
  series: QuotaPoint[];
}

/** Quota status verdict (Grün/Gelb/Rot) for the 5h and 7d windows. */
export type QuotaLevel = "green" | "yellow" | "red";

export function quotaLevel(pct: number): QuotaLevel {
  if (pct > 80) return "red"; /* MMB-412 #5: 60/80 split */
  if (pct >= 60) return "yellow";
  return "green";
}

export const QUOTA_LEVEL_META: Record<QuotaLevel, { label: string; color: string; bg: string }> = {
  green: { label: "Grün", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  yellow: { label: "Gelb", color: "#eab308", bg: "rgba(234,179,8,0.14)" },
  red: { label: "Rot", color: "#ef4444", bg: "rgba(239,68,68,0.14)" },
};

/** Fetch z.ai quota data from the same-origin Pages Function. */
export async function fetchQuota(signal?: AbortSignal): Promise<QuotaData> {
  const res = await fetch("/api/quota", { signal, headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Quota API antwortet mit Status ${res.status}`);
  }
  return (await res.json()) as QuotaData;
}

/**
 * Apply the active filters + search to the issue list.
 * Search is case-insensitive across title, subject and summary.
 */
export function applyFilters(issues: DashboardIssue[], filters: DashboardFilters): DashboardIssue[] {
  const q = filters.search.trim().toLowerCase();
  const tokens = q.length ? q.split(/\s+/) : [];

  const filtered = issues.filter((it) => {
    if (filters.project && it.project !== filters.project) return false;
    if (filters.requester && it.requester !== filters.requester) return false;
    if (filters.assignee && it.assignee !== filters.assignee) return false;
    if (filters.status && it.status !== filters.status) return false;
    if (tokens.length) {
      const hay = `${it.title} ${it.subject} ${it.summary}`.toLowerCase();
      if (!tokens.every((tok) => hay.includes(tok))) return false;
    }
    return true;
  });

  // Stable, useful ordering: attention first, then newest update.
  return filtered.sort((a, b) => {
    const sa = STATUS_META[a.status]?.order ?? 0;
    const sb = STATUS_META[b.status]?.order ?? 0;
    if (sb !== sa) return sb - sa;
    return (b.updatedAt || "").localeCompare(a.updatedAt || "");
  });
}
