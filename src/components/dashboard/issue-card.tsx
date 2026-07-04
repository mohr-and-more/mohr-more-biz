"use client";

import {
  PRIORITY_META,
  STATUS_META,
  normalisePriority,
  type DashboardIssue,
  type DashboardStatus,
} from "@/lib/dashboard-api";

/**
 * Horizontal issue card — one card per row, full width.
 * Layout (mobile-first):
 *   ┌────────────────────────────────────────────────────────────┐
 *   │ LEFT (meta + title + people)          │  RIGHT (status)    │
 *   │ ──────────────────────────────────────│                    │
 *   │ footer: priority + open link          │                    │
 *   └────────────────────────────────────────────────────────────┘
 *
 * On mobile (≤640px) everything stacks vertically with ≥44px touch targets.
 */
export function IssueCard({ issue }: { issue: DashboardIssue }) {
  const statusMeta = STATUS_META[issue.status as DashboardStatus] ?? STATUS_META.todo;
  const prioMeta = PRIORITY_META[normalisePriority(issue.priority)];

  return (
    <article className="dash-card" data-status={issue.status}>
      <div className="dash-card-main">
        <header className="dash-card-head">
          <div className="dash-card-meta">
            <span className="dash-id">{issue.identifier}</span>
            {issue.project && issue.project !== "—" ? (
              <span className="dash-project">{issue.project}</span>
            ) : null}
          </div>
          <span
            className="dash-prio"
            style={{ color: prioMeta.color }}
            title={`Priorität: ${prioMeta.label}`}
          >
            <span className="dash-prio-dot" style={{ backgroundColor: prioMeta.color }} />
            {prioMeta.label}
          </span>
        </header>

        <h3 className="dash-title" title={issue.title}>
          {issue.title}
        </h3>

        {issue.summary ? <p className="dash-body">{issue.summary}</p> : null}

        <div className="dash-card-people">
          <span className="dash-person">
            <span className="dash-person-label">Verantwortlich</span>
            <span className="dash-person-name">{issue.assignee}</span>
          </span>
          <span className="dash-person">
            <span className="dash-person-label">Auftraggeber</span>
            <span className="dash-person-name">{issue.requester}</span>
          </span>
        </div>
      </div>

      <footer className="dash-card-foot">
        <span
          className="dash-badge"
          style={{
            color: statusMeta.color,
            backgroundColor: statusMeta.bg,
            borderColor: statusMeta.color,
          }}
        >
          {statusMeta.label}
        </span>
        <a
          className="dash-open"
          href={issue.paperclipUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Öffnen
          <span aria-hidden="true"> ↗</span>
        </a>
      </footer>
    </article>
  );
}
