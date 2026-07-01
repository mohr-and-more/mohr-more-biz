"use client";

import { STATUS_META, type DashboardStatus } from "@/lib/dashboard-api";

/**
 * Colour-coded status badge. Colours follow the MMB-171 spec:
 * Todo=neutral, In Progress=blau, In Review=lila, Done=grün,
 * Cancelled=grau, Blocked=rot.
 */
export function StatusBadge({ status }: { status: DashboardStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.todo;
  return (
    <span
      className="dash-badge"
      style={{ color: meta.color, backgroundColor: meta.bg, borderColor: meta.color }}
    >
      {meta.label}
    </span>
  );
}
