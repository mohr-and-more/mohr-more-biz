"use client";

import { StatusBadge } from "./status-badge";
import type { DashboardIssue } from "@/lib/dashboard-api";

/**
 * Horizontal issue card. Header carries project, id + title, requester,
 * assignee, 4-word subject and status badge. Body is a plain-language summary
 * of what's needed to finish. Action button deep-links into Paperclip.
 */
export function IssueCard({ issue }: { issue: DashboardIssue }) {
  return (
    <article className="dash-card">
      <header className="dash-card-head">
        <div className="dash-card-meta">
          <span className="dash-project">{issue.project}</span>
          <span className="dash-id">{issue.identifier}</span>
        </div>
        <StatusBadge status={issue.status} />
      </header>

      <h3 className="dash-title" title={issue.title}>
        {issue.title}
      </h3>

      {issue.subject ? <p className="dash-subject">{issue.subject}</p> : null}

      <dl className="dash-people">
        <div className="dash-people-row">
          <dt>Auftraggeber</dt>
          <dd>{issue.requester}</dd>
        </div>
        <div className="dash-people-row">
          <dt>Verantwortlich</dt>
          <dd>{issue.assignee}</dd>
        </div>
      </dl>

      {issue.summary ? <p className="dash-body">{issue.summary}</p> : null}

      <footer className="dash-card-foot">
        <a
          className="dash-open"
          href={issue.paperclipUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Aufgabe öffnen
          <span aria-hidden="true"> ↗</span>
        </a>
      </footer>
    </article>
  );
}
