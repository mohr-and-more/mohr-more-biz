"use client";

import { useEffect, useState } from "react";
import {
  fetchSlo,
  QUOTA_LEVEL_META,
  sloLevel,
  type SloData,
  type SloWindow,
  type SloFailureMode,
  type SloAgentInError,
  type SloWatchItem,
} from "@/lib/dashboard-api";

/**
 * MMB-505 — Daily Stability-SLO panel.
 *
 * Shows the latest parsed snapshot from `slo-report` (the Paperclip doc
 * driven by the daily-slo routine / MMB-489 + MMB-493). The relay
 * (charlie-dashboard-api :3010) watches the doc's `latestRevisionNumber`
 * and rebuilds its cache on every bump, so as soon as the routine lands a
 * new revision this view is fresh on the next page load (≤ 30 s edge
 * cache, ≤ 5 min worst case).
 *
 * Layout (mobile-first, matches the quota-report card system):
 *   • Headline pill: 24 h success rate with red/yellow/green verdict
 *   • Two windows side-by-side: hermes_local + claude_local 7 d
 *   • Top failure modes (3)
 *   • Agents in error state (up to 5)
 *   • Watch-items (top 4)
 */

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; data: SloData }
  | { kind: "error"; message: string };

const TARGET_SLO = 90;

export function SloReport() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    (async () => {
      try {
        const data = await fetchSlo(controller.signal);
        if (active) setState({ kind: "ready", data });
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Unbekannter Fehler";
        setState({ kind: "error", message });
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <section className="slo-wrap" aria-busy="true">
        <div className="slo-head">
          <span className="slo-h">Stabilitäts-SLO</span>
        </div>
        <p className="slo-loading">SLO-Werte werden geladen …</p>
      </section>
    );
  }

  if (state.kind === "error") {
    return (
      <section className="slo-wrap slo-wrap--error" role="alert">
        <div className="slo-head">
          <span className="slo-h">Stabilitäts-SLO</span>
        </div>
        <p className="slo-error-msg">SLO-Snapshot nicht verfügbar: {state.message}</p>
        <p className="slo-error-hint">
          Wird automatisch erneut versucht, sobald das Daily-Refresh einen neuen
          SLO-Snapshot liefert.
        </p>
      </section>
    );
  }

  return <SloReady data={state.data} />;
}

function SloReady({ data }: { data: SloData }) {
  const pct24h = data.overall24h?.success_pct ?? data.headline?.success_pct ?? null;
  const level = sloLevel(pct24h);
  const levelMeta = QUOTA_LEVEL_META[level];
  const regression = data.regression;

  return (
    <section className="slo-wrap" aria-label="Stabilitäts-SLO Snapshot">
      <header className="slo-head">
        <span className="slo-banner-dot" data-level={level} aria-hidden="true" />
        <div className="slo-titles">
          <h2 className="slo-h">Stabilitäts-SLO</h2>
          <p className="slo-sub">
            Ziel ≥ {TARGET_SLO} % · Snapshot:{" "}
            <span className="slo-sub-mono">{data.snapshot_at ?? "—"}</span> · Rev{" "}
            <span className="slo-sub-mono">#{data.revision}</span>
          </p>
        </div>
        <div className="slo-pills" role="group" aria-label="SLO-Status">
          <span className={`slo-pill slo-pill--${level}`}>
            <span className="slo-pill-k">24 h</span>
            <span className="slo-pill-v">
              {pct24h == null ? "—" : `${pct24h} %`}
            </span>
          </span>
          {regression ? (
            <span className="slo-pill slo-pill--red" aria-label="Regression erkannt">
              <span className="slo-pill-k">Status</span>
              <span className="slo-pill-v">Regression</span>
            </span>
          ) : (
            <span className="slo-pill slo-pill--green">
              <span className="slo-pill-k">Status</span>
              <span className="slo-pill-v">OK</span>
            </span>
          )}
        </div>
      </header>

      {data.headline?.delta ? (
        <p className="slo-headline">
          {data.headline.delta}
          {data.headline.tail ? <span className="slo-headline-tail">{data.headline.tail}</span> : null}
        </p>
      ) : null}

      <div className="slo-grid">
        <WindowsCard windows={data.windows} />
        <FailuresCard failures={data.failureModes} />
        <AgentsInErrorCard agents={data.agentsInError} />
        <WatchItemsCard items={data.watchItems} />
      </div>

      <footer className="slo-foot">
        <span>
          Quelle: <code>slo-report</code>-Doc auf MMB-37 · Daily-Refresh
          (MMB-489 / MMB-493)
        </span>
        <span className="slo-foot-meta">
          Cache {data.cache?.last_fetched_at?.slice(11, 19) ?? "—"} UTC
        </span>
      </footer>
    </section>
  );
}

// ─── Sub-cards ──────────────────────────────────────────────────────────────

function WindowsCard({ windows }: { windows: SloWindow[] }) {
  if (!windows.length) return null;
  return (
    <div className="slo-card">
      <h3 className="slo-card-title">7-Tage-Fenster pro Adapter</h3>
      <ul className="slo-window-list">
        {windows.map((w) => {
          const lv = sloLevel(w.success_pct);
          const meta = QUOTA_LEVEL_META[lv];
          return (
            <li key={w.adapter} className="slo-window-row">
              <span className="slo-window-name">{w.adapter}</span>
              <div className="slo-bar-track" aria-hidden="true">
                <span
                  className="slo-bar-fill"
                  data-level={lv}
                  style={{ width: `${Math.min(100, Math.max(0, w.success_pct))}%` }}
                />
              </div>
              <span className="slo-window-val" style={{ color: meta.color }}>
                {w.success_pct} %
              </span>
              <span className="slo-window-meta">
                {w.succeeded}/{w.runs}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FailuresCard({ failures }: { failures: SloFailureMode[] }) {
  if (!failures.length) return null;
  return (
    <div className="slo-card">
      <h3 className="slo-card-title">Top-Fehlermodi (7 d)</h3>
      <ul className="slo-fail-list">
        {failures.map((f) => (
          <li key={f.code} className="slo-fail-row">
            <code className="slo-fail-code">{f.code}</code>
            <span className="slo-fail-count">{f.count}</span>
            {f.trend ? <span className="slo-fail-trend">{f.trend}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AgentsInErrorCard({ agents }: { agents: SloAgentInError[] }) {
  if (!agents.length) return null;
  return (
    <div className="slo-card slo-card--alert">
      <h3 className="slo-card-title">Agents im Fehlerzustand</h3>
      <ul className="slo-agent-list">
        {agents.map((a) => (
          <li key={a.name} className="slo-agent-row">
            <span className="slo-agent-name">
              {a.name}
              {a.role ? <span className="slo-agent-role"> ({a.role})</span> : null}
            </span>
            <span className="slo-agent-adapter">{a.adapter}</span>
            <span className="slo-agent-hb">HB {a.last_heartbeat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WatchItemsCard({ items }: { items: SloWatchItem[] }) {
  if (!items.length) return null;
  const top = items.slice(0, 4);
  return (
    <div className="slo-card">
      <h3 className="slo-card-title">Watch-Items</h3>
      <ol className="slo-watch-list">
        {top.map((w, i) => (
          <li key={`${i}-${w.title.slice(0, 20)}`} className="slo-watch-row">
            <span className="slo-watch-title">{w.title}</span>
            {w.detail ? <span className="slo-watch-detail">{w.detail}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}