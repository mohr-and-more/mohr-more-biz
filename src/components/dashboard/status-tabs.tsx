"use client";

import { STATUS_META, type DashboardStatus } from "@/lib/dashboard-api";

interface StatusTabsProps {
  /** All statuses present in the dataset. */
  statuses: DashboardStatus[];
  /** Count per status (from the full unfiltered dataset). */
  counts: Record<string, number>;
  /** Total number of issues. */
  total: number;
  /** Currently active status filter ("" = all). */
  active: string;
  onChange: (status: string) => void;
}

const TAB_ORDER: (DashboardStatus | "all")[] = [
  "all",
  "blocked",
  "in_progress",
  "in_review",
  "todo",
  "backlog",
  "done",
  "cancelled",
];

/**
 * Horizontal status-tab navigation with count badges.
 * Mobile: horizontally scrollable, snap-scroll, each tab ≥44px touch target.
 * Desktop: wraps to fit.
 */
export function StatusTabs({ statuses, counts, total, active, onChange }: StatusTabsProps) {
  const presentSet = new Set(statuses);

  const tabs = TAB_ORDER.filter((t) => {
    if (t === "all") return true;
    return presentSet.has(t as DashboardStatus);
  });

  return (
    <nav className="dash-tabs" aria-label="Status-Filter">
      {tabs.map((tab) => {
        const key = tab === "all" ? "" : tab;
        const isActive = active === key;
        const count = tab === "all" ? total : (counts[tab] ?? 0);
        const label = tab === "all" ? "Alle" : STATUS_META[tab as DashboardStatus]?.label ?? tab;

        return (
          <button
            key={tab}
            type="button"
            className={`dash-tab${isActive ? " dash-tab--active" : ""}`}
            onClick={() => onChange(key)}
            aria-pressed={isActive}
          >
            <span className="dash-tab-label">{label}</span>
            <span className="dash-tab-count">{count}</span>
          </button>
        );
      })}
    </nav>
  );
}
