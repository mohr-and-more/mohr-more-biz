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

  const visible = useMemo(() => {
    if (state.kind !== "ready") return [];
    return applyFilters(state.data.issues, filters);
  }, [state, filters]);

  const total = state.kind === "ready" ? state.data.issues.length : 0;

  return (
    <main className="dash-main">
      <QuotaReport />
      <section className="dash-hero">
        <span className="label">
          <span className="accent-line" />
          Dashboard
        </span>
        <h1>Aufgaben&nbsp;übersicht</h1>
        <p className="dash-intro">
          Alle aktuellen Aufgaben von MOHR &amp; MORE auf einen Blick — Projekt, Zuständige,
          Status und was noch zu erledigen ist.
        </p>
      </section>

      {state.kind === "ready" ? (
        <>
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
            <div className="dash-grid">
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
      <div className="dash-skeleton-grid" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
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
    // Store the access token in a cookie so /api/issues accepts the request,
    // then reload to render the dashboard.
    document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(value)}; path=/; max-age=${
      ACCESS_DAYS * 86400
    }; SameSite=Lax`;
    // Verify it actually wrote (e.g. private mode) before reloading.
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


