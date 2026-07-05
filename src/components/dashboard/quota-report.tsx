"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchQuota,
  QUOTA_LEVEL_META,
  quotaLevel,
  type QuotaData,
  type QuotaPoint,
} from "@/lib/dashboard-api";

/**
 * MMB-401 — GLM + MiniMax dual-provider quota panel.
 * Shows both providers side-by-side with progress bars and color coding.
 * Data comes from /api/quota (Cloudflare Pages Function) which serves
 * the baked _quota-data.json (updated by bake-quota.mjs).
 */

// ─── Types ──────────────────────────────────────────────────────────────────

type Provider = "glm" | "minimax";

interface ProviderQuota {
  provider: string;
  limits: { window_5h: number; window_7d: number };
  latest: {
    generated_at: string;
    combined_5h: number;
    combined_7d: number;
    pct_5h: number;
    pct_7d: number;
    limit_5h: number;
    limit_7d: number;
    flatrate_ok?: boolean;
    video_bonus?: string;
  };
  series: QuotaPoint[];
}

interface DualQuotaData {
  available: boolean;
  generated_at?: string;
  glm?: ProviderQuota;
  minimax?: ProviderQuota;
  // Legacy fallback
  limits?: { window_5h: number; window_7d: number };
  latest?: {
    combined_5h: number;
    combined_7d: number;
    pct_5h: number;
    pct_7d: number;
    flatrate_ok?: boolean;
  };
  series?: QuotaPoint[];
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; data: DualQuotaData }
  | { kind: "error" }
  | { kind: "hidden" };

// ─── Component ───────────────────────────────────────────────────────────────

export function QuotaReport() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    (async () => {
      try {
        const raw = await fetchQuota(controller.signal);
        if (!active) return;
        const data = raw as unknown as DualQuotaData;
        if (!data.available) {
          setState({ kind: "hidden" });
        } else {
          setState({ kind: "ready", data });
        }
      } catch {
        if (active) setState({ kind: "error" });
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (state.kind === "loading" || state.kind === "hidden" || state.kind === "error") {
    return null;
  }

  const { data } = state;

  // If dual-provider data is available, render side-by-side
  const hasGLM = Boolean(data.glm);
  const hasMiniMax = Boolean(data.minimax);

  if (hasGLM && hasMiniMax) {
    return <DualProviderPanel glm={data.glm!} minimax={data.minimax!} />;
  }

  // Legacy fallback: single-provider (GLM only)
  if (hasGLM) {
    return <SingleProviderPanel provider="glm" quota={data.glm!} />;
  }

  return null;
}

// ─── Dual-provider panel (MMB-401 main deliverable) ───────────────────────

function DualProviderPanel({ glm, minimax }: { glm: ProviderQuota; minimax: ProviderQuota }) {
  const worstGLM = worstLevel(glm.latest.pct_5h, glm.latest.pct_7d);
  const worstMiniMax = worstLevel(minimax.latest.pct_5h, minimax.latest.pct_7d);

  return (
    <section className="quota" aria-label="GLM + MiniMax Quota-Auslastung">
      <header className="quota-head">
        <div className="quota-titles">
          <span className="label">
            <span className="accent-line" />
            Quoten
          </span>
          <h2 className="quota-h">AI-Nutzung</h2>
        </div>
        <div className="quota-pills" role="group" aria-label="Provider-Status">
          <ProviderBadge provider="glm" worst={worstGLM} />
          <ProviderBadge provider="minimax" worst={worstMiniMax} />
        </div>
      </header>

      {/* Side-by-side cards */}
      <div className="quota-dual-grid">
        <ProviderCard provider="glm" quota={glm} />
        <ProviderCard provider="minimax" quota={minimax} />
      </div>

      <p className="quota-foot">
        GLM: 5h- + 7d-Fenster · MiniMax: 5h- + 7d-Fenster · Grenzen: 1600/5h, 8000/7d.
        Lower Bound: Alle Quellen instrumentiert.
      </p>
    </section>
  );
}

function ProviderBadge({ provider, worst }: { provider: Provider; worst: "green" | "yellow" | "red" }) {
  const meta = QUOTA_LEVEL_META[worst];
  const label = provider === "glm" ? "GLM" : "MiniMax";
  return (
    <span
      className="quota-pill"
      style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}
    >
      {label}: {meta.label}
    </span>
  );
}

function ProviderCard({ provider, quota }: { provider: Provider; quota: ProviderQuota }) {
  const { latest, limits } = quota;
  const lvl5h = quotaLevel(latest.pct_5h);
  const lvl7d = quotaLevel(latest.pct_7d);
  const worst = worstLevel(latest.pct_5h, latest.pct_7d);
  const meta = QUOTA_LEVEL_META[worst];

  return (
    <div className="quota-card" style={{ borderTopColor: meta.color }}>
      <div className="quota-card-head">
        <span className="quota-card-title">{provider === "glm" ? "GLM" : "MiniMax"}</span>
        <span className="quota-card-sub">{quota.provider}</span>
      </div>

      {/* 5h bar */}
      <QuotaBar
        label="5h-Fenster"
        used={latest.combined_5h}
        limit={limits.window_5h}
        pct={latest.pct_5h}
        level={lvl5h}
      />

      {/* 7d bar */}
      <QuotaBar
        label="7d-Fenster"
        used={latest.combined_7d}
        limit={limits.window_7d}
        pct={latest.pct_7d}
        level={lvl7d}
      />

      {/* Extra info for MiniMax */}
      {provider === "minimax" && latest.video_bonus && latest.video_bonus !== "N/A" && (
        <p className="quota-card-extra">{latest.video_bonus}</p>
      )}
    </div>
  );
}

function QuotaBar({
  label,
  used,
  limit,
  pct,
  level,
}: {
  label: string;
  used: number;
  limit: number;
  pct: number;
  level: "green" | "yellow" | "red";
}) {
  const meta = QUOTA_LEVEL_META[level];
  const fillPct = Math.min(100, pct);
  return (
    <div className="quota-bar-row">
      <div className="quota-bar-label">
        <span>{label}</span>
        <span className="quota-bar-value" style={{ color: meta.color }}>
          {used}/{limit}
        </span>
      </div>
      <div className="quota-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="quota-bar-fill"
          style={{
            width: `${fillPct}%`,
            background: meta.color,
          }}
        />
      </div>
      <div className="quota-bar-pct" style={{ color: meta.color }}>
        {pct.toFixed(1)}%
      </div>
    </div>
  );
}

// ─── Single-provider legacy fallback ─────────────────────────────────────────

function SingleProviderPanel({ provider, quota }: { provider: Provider; quota: ProviderQuota }) {
  const { latest, limits, series } = quota;
  const lvl5 = quotaLevel(latest.pct_5h);
  const lvl7 = quotaLevel(latest.pct_7d);
  const worst = worstLevel(latest.pct_5h, latest.pct_7d);
  const label = provider === "glm" ? "z.ai Quota" : "MiniMax Quota";

  return (
    <section className="quota" aria-label={`${label} Auslastung`}>
      <header className="quota-head">
        <div className="quota-titles">
          <span className="label">
            <span className="accent-line" />
            {label}
          </span>
          <h2 className="quota-h">Auslastung</h2>
        </div>
        <div className="quota-pills" role="group" aria-label="Quota-Status">
          <Pill label="5h-Fenster" value={`${latest.combined_5h}/${limits.window_5h}`} level={lvl5} pct={latest.pct_5h} />
          <Pill label="7d-Fenster" value={`${latest.combined_7d}/${limits.window_7d}`} level={lvl7} pct={latest.pct_7d} />
        </div>
      </header>

      <div className={`quota-banner quota-banner--${worst}`}>
        <span className="quota-banner-dot" aria-hidden="true" />
        <span>
          Status <strong>{QUOTA_LEVEL_META[worst].label}</strong> ·{" "}
          {provider === "glm" ? "GLM-Flatrate aktiv" : "MiniMax Coding Plan aktiv"}
        </span>
      </div>

      <LineChart5h series={series} limit={limits.window_5h} latest={latest.combined_5h} />
      <BarChart7d series={series} limit={limits.window_7d} latest={latest.combined_7d} />

      <p className="quota-foot">
        Trend der rollierenden 5h- und 7d-Prompt-Fenster (tägl. Snapshot). Grenzen:{" "}
        {limits.window_5h}/{limits.window_7d}.
      </p>
    </section>
  );
}

// ─── Pill (unchanged from original) ──────────────────────────────────────────

function Pill({
  label,
  value,
  level,
  pct,
}: {
  label: string;
  value: string;
  level: "green" | "yellow" | "red";
  pct: number;
}) {
  const meta = QUOTA_LEVEL_META[level];
  return (
    <span
      className="quota-pill"
      style={{ color: meta.color, borderColor: meta.color, background: meta.bg }}
      title={`${label}: ${pct}%`}
    >
      <span className="quota-pill-k">{label}</span>
      <span className="quota-pill-v">{value}</span>
    </span>
  );
}

// ─── Chart helpers (unchanged) ───────────────────────────────────────────────

const VB_W = 840;
const VB_H5 = 360;
const PAD = { left: 52, right: 24, top: 30, bottom: 34 };

function worstLevel(pct5h: number, pct7d: number): "green" | "yellow" | "red" {
  return (["red", "yellow", "green"] as const).find((l) =>
    l === "red" ? (pct5h >= 90 || pct7d >= 90) :
    l === "yellow" ? (pct5h >= 70 || pct7d >= 70) : true
  ) ?? "green";
}

// 5h line chart
function LineChart5h({ series, limit, latest }: { series: QuotaPoint[]; limit: number; latest: number }) {
  const [drawn, setDrawn] = useState(false);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(t);
  }, [reduce]);

  const plot = useMemo(() => buildPlot(series, limit, VB_H5), [series, limit]);

  return (
    <figure className="quota-chart quota-chart--line">
      <figcaption>
        <span>5h-Fenster</span>
        <span className="quota-chart-now">{latest} Prompts</span>
      </figcaption>
      <div className="quota-chart-frame" style={{ aspectRatio: "21 / 9" }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H5}`} role="img" aria-label={`5-Stunden-Fenster: ${latest} von ${limit} Prompts`}>
          <defs>
            <linearGradient id="q5fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {plot.gridY.map((g) => (
            <g key={g.value}>
              <line x1={PAD.left} y1={g.y} x2={VB_W - PAD.right} y2={g.y} className="q-grid" />
              <text x={PAD.left - 10} y={g.y + 4} className="q-axis" textAnchor="end">{fmt(g.value)}</text>
            </g>
          ))}
          <line x1={PAD.left} y1={plot.limitY} x2={VB_W - PAD.right} y2={plot.limitY} className="q-limit" />
          <text x={VB_W - PAD.right} y={plot.limitY - 8} className="q-limit-label" textAnchor="end">Limit {fmt(limit)}</text>
          {plot.areaD && <path d={plot.areaD} fill="url(#q5fill)" className="q-area" style={{ opacity: drawn || reduce ? 1 : 0 }} />}
          <path d={plot.lineD} fill="none" className="q-line" pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: drawn || reduce ? 0 : 1, transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
          {plot.points.map((p, i) => (
            <circle key={p.date} cx={p.x} cy={p.y} r={i === plot.points.length - 1 ? 5 : 3}
              className={`q-dot${i === plot.points.length - 1 ? " q-dot--now" : ""}`}
              style={{ opacity: drawn || reduce ? 1 : 0, transition: `opacity .4s ease ${0.6 + i * 0.05}s` }} />
          ))}
          {plot.points.map((p, i) => {
            const show = i === 0 || i === plot.points.length - 1 || i === Math.floor(plot.points.length / 2);
            if (!show) return null;
            return <text key={`xl-${p.date}`} x={p.x} y={VB_H5 - PAD.bottom + 22} className="q-axis" textAnchor="middle">{shortDate(p.date)}</text>;
          })}
        </svg>
      </div>
    </figure>
  );
}

// 7d bar chart
const VB_H7 = 230;

function BarChart7d({ series, limit, latest }: { series: QuotaPoint[]; limit: number; latest: number }) {
  const [grown, setGrown] = useState(false);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(t);
  }, [reduce]);

  const innerW = VB_W - PAD.left - PAD.right;
  const plotBottom = VB_H7 - PAD.bottom;
  const plotTop = PAD.top;
  const plotH = plotBottom - plotTop;
  const limitY = plotBottom - plotH;
  const n = series.length;
  const slot = innerW / n;
  const barW = Math.min(34, slot * 0.62);

  const gridY = [0, 0.5, 1].map((f) => {
    const value = Math.round(limit * f);
    return { value, y: plotBottom - plotH * f };
  });

  return (
    <figure className="quota-chart quota-chart--bar">
      <figcaption>
        <span>7d-Fenster</span>
        <span className="quota-chart-now">{latest} Prompts</span>
      </figcaption>
      <div className="quota-chart-frame" style={{ aspectRatio: "21 / 5.75" }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H7}`} role="img" aria-label={`7-Tage-Fenster: ${latest} von ${limit} Prompts`}>
          {gridY.map((g) => (
            <g key={g.value}>
              <line x1={PAD.left} y1={g.y} x2={VB_W - PAD.right} y2={g.y} className="q-grid" />
              <text x={PAD.left - 10} y={g.y + 4} className="q-axis" textAnchor="end">{fmt(g.value)}</text>
            </g>
          ))}
          <line x1={PAD.left} y1={limitY} x2={VB_W - PAD.right} y2={limitY} className="q-limit" />
          <text x={VB_W - PAD.right} y={limitY - 8} className="q-limit-label" textAnchor="end">Limit {fmt(limit)}</text>
          {series.map((d, i) => {
            const cx = PAD.left + slot * i + slot / 2;
            const h = Math.max(2, (d.v7d / limit) * plotH);
            const y = plotBottom - h;
            const isLast = i === n - 1;
            return (
              <g key={d.date}>
                <rect x={cx - barW / 2} y={y} width={barW} height={h}
                  className={`q-bar${isLast ? " q-bar--now" : ""}`}
                  style={{ transform: grown || reduce ? "scaleY(1)" : "scaleY(0)", transformOrigin: "center bottom", transformBox: "fill-box",
                    transition: `transform .9s cubic-bezier(0.22,1,0.36,1) ${i * 0.04}s` }} />
                {(i === 0 || isLast || i === Math.floor(n / 2)) && (
                  <text x={cx} y={VB_H7 - PAD.bottom + 22} className="q-axis" textAnchor="middle">{shortDate(d.date)}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

// ─── Plot helpers ────────────────────────────────────────────────────────────

interface PlotPoint extends QuotaPoint { x: number; y: number }

function buildPlot(series: QuotaPoint[], limit: number, vbH: number) {
  const innerW = VB_W - PAD.left - PAD.right;
  const plotTop = PAD.top;
  const plotBottom = vbH - PAD.bottom;
  const plotH = plotBottom - plotTop;
  const limitY = plotBottom - plotH;
  const n = series.length;

  const points: PlotPoint[] = series.map((d, i) => {
    const x = n === 1 ? PAD.left + innerW / 2 : PAD.left + (innerW * i) / (n - 1);
    const ratio = Math.min(1, d.v5h / limit);
    const y = plotBottom - ratio * plotH;
    return { ...d, x, y };
  });

  const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD = points.length > 0
    ? `${lineD} L ${points[points.length - 1].x.toFixed(1)} ${plotBottom} L ${points[0].x.toFixed(1)} ${plotBottom} Z`
    : "";

  const gridY = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    value: Math.round(limit * f),
    y: plotBottom - plotH * f,
  }));

  return { points, lineD, areaD, gridY, limitY };
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}.${m}.`;
}

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  const mq = useRef<MediaQueryList | null>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    mq.current = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.current?.matches ?? false);
    update();
    mq.current.addEventListener?.("change", update);
    return () => mq.current?.removeEventListener?.("change", update);
  }, []);
  return reduce;
}
