"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  applyFilters,
  EMPTY_FILTERS,
  fetchDashboard,
  type DashboardData,
  type DashboardFilters,
} from "@/lib/dashboard-api";
import { IssueCard } from "./issue-card";
import { FilterBar } from "./filter-bar";
import { StatusTabs } from "./status-tabs";
import { QuotaReport } from "./quota-report";

type State =
  | { kind: "loading" }
  | { kind: "ready"; data: DashboardData }
  | { kind: "gated" }
  | { kind: "error"; message: string };

const ACCESS_COOKIE = "mmb_dash";
const ACCESS_DAYS = 30;

export function DashboardView() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    (async () => {
      try {
        const data = await fetchDashboard(controller.signal);
        if (active) setState({ kind: "ready", data });
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Unbekannter Fehler";
        if (/status 401/i.test(message)) {
          setState({ kind: "gated" });
        } else {
          setState({ kind: "error", message });
        }
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const options = useMemo(() => {
    if (state.kind !== "ready") return { projects: [], requesters: [], assignees: [], statuses: [] };
    return {
      projects: state.data.projects,
      requesters: state.data.requesters,
      assignees: state.data.assignees,
      statuses: state.data.statuses,
    };
  }, [state]);

  // Status counts from the FULL dataset (not filtered), for tab badges.
  const statusCounts = useMemo(() => {
    if (state.kind !== "ready") return {};
    const m: Record<string, number> = {};
    for (const it of state.data.issues) {
      m[it.status] = (m[it.status] ?? 0) + 1;
    }
    return m;
  }, [state]);

  const total = state.kind === "ready" ? state.data.issues.length : 0;

  // Quick-stat counters for the header.
  const quickStats = useMemo(() => {
    return {
      open: (statusCounts["todo"] ?? 0) + (statusCounts["backlog"] ?? 0),
      inProgress: statusCounts["in_progress"] ?? 0,
      blocked: statusCounts["blocked"] ?? 0,
    };
  }, [statusCounts]);

  const visible = useMemo(() => {
    if (state.kind !== "ready") return [];
    return applyFilters(state.data.issues, filters);
  }, [state, filters]);

  const setStatusTab = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  return (
    <main className="dash-main">
      <QuotaReport />
      <section className="dash-hero">
        <span className="label">
          <span className="accent-line" />
          Dashboard
        </span>
        <h1 className="dash-h1">MOHR &amp; MORE Board</h1>
        <p className="dash-intro">
          Gunnar und Gregor müssen sich entscheiden und die Quoten und Preise für den
          jeweiligen Kunden wandeln. Zum Beispiel wartet ein Kunde seit heute Morgen auf
          sein finales Angebot — jetzt ist Entscheidung gefragt.
        </p>
        {state.kind === "ready" ? (
          <div className="dash-quickstats">
            <div className="dash-quickstat">
              <span className="dash-quickstat-num">{total}</span>
              <span className="dash-quickstat-label">Offene Aufgaben</span>
            </div>
            <div className="dash-quickstat">
              <span className="dash-quickstat-num dash-quickstat--blue">{quickStats.inProgress}</span>
              <span className="dash-quickstat-label">In Arbeit</span>
            </div>
            <div className="dash-quickstat">
              <span className="dash-quickstat-num dash-quickstat--red">{quickStats.blocked}</span>
              <span className="dash-quickstat-label">Blockiert</span>
            </div>
          </div>
        ) : null}
      </section>

      {state.kind === "ready" ? (
        <>
          <StatusTabs
            statuses={state.data.statuses}
            counts={statusCounts}
            total={total}
            active={filters.status}
            onChange={setStatusTab}
          />
          <FilterBar
            options={options}
            filters={filters}
            onChange={setFilters}
            resultCount={visible.length}
            totalCount={total}
          />
          {visible.length === 0 ? (
            <EmptyState filtered={total > 0} />
          ) : (
            <div className="dash-list">
              {visible.map((issue) => (
                <IssueCard key={issue.identifier} issue={issue} />
              ))}
            </div>
          )}
        </>
      ) : null}

      {state.kind === "loading" ? <LoadingState /> : null}
      {state.kind === "gated" ? <GatedState /> : null}
      {state.kind === "error" ? <ErrorState message={state.message} /> : null}
    </main>
  );
}

function LoadingState() {
  return (
    <div className="dash-state">
      <p className="dash-state-title">Aufgaben werden geladen …</p>
      <div className="dash-skeleton-list" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="dash-skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="dash-state">
      <p className="dash-state-title">
        {filtered ? "Keine Aufgaben für diese Filter." : "Derzeit sind keine Aufgaben vorhanden."}
      </p>
      <p className="dash-state-sub">
        {filtered ? "Passe die Filter an oder setze sie zurück." : "Schau später wieder vorbei."}
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="dash-state dash-state-error">
      <p className="dash-state-title">Aufgaben konnten nicht geladen werden.</p>
      <p className="dash-state-sub">{message}</p>
      <button type="button" className="btn btn-secondary" onClick={() => location.reload()}>
        Seite neu laden
      </button>
    </div>
  );
}

function GatedState() {
  const [pass, setPass] = useState("");
  const [wrong, setWrong] = useState(false);

  const unlock = (e: FormEvent) => {
    e.preventDefault();
    const value = pass.trim();
    if (!value) return;
    document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${
      ACCESS_DAYS * 86400
    }; SameSite=Lax`;
    if (document.cookie.includes(ACCESS_COOKIE)) {
      location.reload();
    } else {
      setWrong(true);
    }
  };

  return (
    <div className="dash-state dash-state-gated">
      <p className="dash-state-title">Zugriff geschützt</p>
      <p className="dash-state-sub">
        Dieses Dashboard ist nur für autorisierte MOHR &amp; MORE-Nutzer:innen sichtbar.
        Bitte Zugriffsschlüssel eingeben.
      </p>
      <form className="dash-unlock" onSubmit={unlock}>
        <input
          type="password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setWrong(false);
          }}
          placeholder="Zugriffsschlüssel"
          aria-label="Zugriffsschlüssel"
          autoComplete="current-password"
        />
        <button type="submit" className="btn btn-primary">
          Entsperren
        </button>
      </form>
      {wrong ? (
        <p className="dash-state-sub dash-state-warn">
          Zugriff konnte nicht gespeichert werden (Cookies blockiert?).
        </p>
      ) : null}
    </div>
  );
}
