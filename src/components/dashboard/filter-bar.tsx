"use client";

import { useEffect, useRef, useState } from "react";
import { STATUS_META, type DashboardFilters, type DashboardStatus } from "@/lib/dashboard-api";

interface FilterBarProps {
  options: {
    projects: string[];
    requesters: string[];
    assignees: string[];
    statuses: DashboardStatus[];
  };
  filters: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
  resultCount: number;
  totalCount: number;
}

const STATUS_ORDER: DashboardStatus[] = [
  "blocked",
  "in_progress",
  "in_review",
  "todo",
  "backlog",
  "done",
  "cancelled",
];

export function FilterBar({ options, filters, onChange, resultCount, totalCount }: FilterBarProps) {
  // Local search box with debounce so typing stays responsive.
  const [q, setQ] = useState(filters.search);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (q !== filters.search) onChange({ ...filters, search: q });
    }, 220);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const reset = () => {
    setQ("");
    onChange({ search: "", project: "", requester: "", assignee: "", status: "" });
  };

  const orderedStatuses = options.statuses.length
    ? STATUS_ORDER.filter((s) => options.statuses.includes(s))
    : [];

  const anyFilter =
    filters.search || filters.project || filters.requester || filters.assignee || filters.status;

  return (
    <div className="dash-filters">
      <div className="dash-search">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Aufgaben durchsuchen …"
          aria-label="Aufgaben durchsuchen"
        />
      </div>

      <div className="dash-selects">
        <Select
          label="Projekt"
          value={filters.project}
          options={options.projects}
          onChange={(v) => onChange({ ...filters, project: v })}
        />
        <Select
          label="Auftraggeber"
          value={filters.requester}
          options={options.requesters}
          onChange={(v) => onChange({ ...filters, requester: v })}
        />
        <Select
          label="Verantwortlich"
          value={filters.assignee}
          options={options.assignees}
          onChange={(v) => onChange({ ...filters, assignee: v })}
        />
        <Select
          label="Status"
          value={filters.status}
          options={orderedStatuses.map((s) => STATUS_META[s].label)}
          valueToKey={(label) => orderedStatuses.find((s) => STATUS_META[s].label === label) ?? ""}
          onChange={(v) => onChange({ ...filters, status: v })}
        />
      </div>

      <div className="dash-meta">
        <span className="dash-count">
          {resultCount} von {totalCount} Aufgaben
        </span>
        {anyFilter ? (
          <button type="button" className="dash-reset" onClick={reset}>
            Filter zurücksetzen
          </button>
        ) : null}
      </div>
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  valueToKey?: (label: string) => string;
  onChange: (value: string) => void;
}

function Select({ label, value, options, valueToKey, onChange }: SelectProps) {
  return (
    <label className="dash-select">
      <span className="dash-select-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        <option value="">Alle</option>
        {options.map((opt) => {
          const key = valueToKey ? valueToKey(opt) : opt;
          return (
            <option key={key || opt} value={key}>
              {opt}
            </option>
          );
        })}
      </select>
    </label>
  );
}
