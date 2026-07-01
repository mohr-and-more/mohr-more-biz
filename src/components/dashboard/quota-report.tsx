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
 * z.ai Quota-Auslastung — animated header panel for the dashboard (MMB-176).
 *
 * Layout (mobile-first, single column):
 *   ┌──────────────────────────────────────────────┐
 *   │  status pills (5h / 7d / cost) + LOWER BOUND  │
 *   ├──────────────────────────────────────────────┤
 *   │  5h window — full-width 21:9 animated LINE   │
 *   ├──────────────────────────────────────────────┤
 *   │  7d window — smaller animated BAR chart      │
 *   └──────────────────────────────────────────────┘
 *
 * Data comes same-origin from /api/quota (Cloudflare Pages Function). The panel
 * degrades gracefully: if quota data is unavailable it renders nothing
 * obstructive so the rest of the dashboard keeps working.
 */

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; data: QuotaData }
  | { kind: "error" }
  | { kind: "hidden" };

export function QuotaReport() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    (async () => {
      try {
        const data = await fetchQuota(controller.signal);
        if (!active) return;
        // Snapshot not yet available upstream (e.g. before first run).
        if (!data.available || !data.latest || data.series.length === 0) {
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
    // Keep the dashboard clean while quota data is unavailable.
    return null;
  }

  const { latest, series, limits } = state.data;
  if (!latest) return null;
  const lvl5 = quotaLevel(latest.pct_5h);
  const lvl7 = quotaLevel(latest.pct_7d);
  const worst: keyof typeof QUOTA_LEVEL_META =
    lvl5 === "red" || lvl7 === "red" ? "red" : lvl5 === "yellow" || lvl7 === "yellow" ? "yellow" : "green";

  return (
    <section className="quota" aria-label="z.ai Quota-Auslastung">
      <header className="quota-head">
        <div className="quota-titles">
          <span className="label">
            <span className="accent-line" />
            z.ai Quota
          </span>
          <h2 className="quota-h">Auslastung</h2>
        </div>
        <div className="quota-pills" role="group" aria-label="Quota-Status">
          <Pill label="5h-Fenster" value={`${latest.combined_5h}/${limits.window_5h}`} level={lvl5} pct={latest.pct_5h} />
          <Pill label="7d-Fenster" value={`${latest.combined_7d}/${limits.window_7d}`} level={lvl7} pct={latest.pct_7d} />
          <span className={`quota-pill quota-pill--${latest.flatrate_ok ? "ok" : "warn"}`} title="z.ai Flatrate — cost_cents muss 0 bleiben">
            cost {latest.cost_cents === 0 ? "0¢ ✓" : `${latest.cost_cents}¢`}
          </span>
        </div>
      </header>

      <div className={`quota-banner quota-banner--${worst}`}>
        <span className="quota-banner-dot" aria-hidden="true" />
        <span>
          Status <strong>{QUOTA_LEVEL_META[worst].label}</strong> · z.ai-Flatrate aktiv · Zahlen sind eine{" "}
          <em>untere Schranke</em> (TradingAgents nicht erfasst).
        </span>
      </div>

      <LineChart5h series={series} limit={limits.window_5h} latest={latest.combined_5h} />
      <BarChart7d series={series} limit={limits.window_7d} latest={latest.combined_7d} />

      <p className="quota-foot">
        Trend der rollierenden 5h- und 7d-Prompt-Fenster (tägl. Snapshot). Grenzen: 1600/5h, 8000/7d.
        {!latest.tradingagents_available ? " Lower Bound: TradingAgents-Usage nicht instrumentiert." : ""}
      </p>
    </section>
  );
}

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

// ---------------------------------------------------------------------------
// 5h window — full-width 21:9 animated LINE chart
// ---------------------------------------------------------------------------

const VB_W = 840;
const VB_H5 = 360; // 21:9
const PAD = { left: 52, right: 24, top: 30, bottom: 34 };

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
              <text x={PAD.left - 10} y={g.y + 4} className="q-axis" textAnchor="end">
                {fmt(g.value)}
              </text>
            </g>
          ))}

          {/* limit reference line */}
          <line
            x1={PAD.left}
            y1={plot.limitY}
            x2={VB_W - PAD.right}
            y2={plot.limitY}
            className="q-limit"
          />
          <text x={VB_W - PAD.right} y={plot.limitY - 8} className="q-limit-label" textAnchor="end">
            Limit {fmt(limit)}
          </text>

          {plot.areaD && <path d={plot.areaD} fill="url(#q5fill)" className="q-area" style={{ opacity: drawn || reduce ? 1 : 0 }} />}

          <path
            d={plot.lineD}
            fill="none"
            className="q-line"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn || reduce ? 0 : 1,
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          {plot.points.map((p, i) => (
            <circle
              key={p.date}
              cx={p.x}
              cy={p.y}
              r={i === plot.points.length - 1 ? 5 : 3}
              className={`q-dot${i === plot.points.length - 1 ? " q-dot--now" : ""}`}
              style={{ opacity: drawn || reduce ? 1 : 0, transition: `opacity .4s ease ${0.6 + i * 0.05}s` }}
            />
          ))}

          {plot.points.map((p, i) => {
            const show = i === 0 || i === plot.points.length - 1 || i === Math.floor(plot.points.length / 2);
            if (!show) return null;
            return (
              <text key={`xl-${p.date}`} x={p.x} y={VB_H5 - PAD.bottom + 22} className="q-axis" textAnchor="middle">
                {shortDate(p.date)}
              </text>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// 7d window — smaller animated BAR chart
// ---------------------------------------------------------------------------

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
  const plotTop = PAD.top;
  const plotBottom = VB_H7 - PAD.bottom;
  const plotH = plotBottom - plotTop;
  const limitY = plotBottom - plotH; // limit at top
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
              <text x={PAD.left - 10} y={g.y + 4} className="q-axis" textAnchor="end">
                {fmt(g.value)}
              </text>
            </g>
          ))}
          <line x1={PAD.left} y1={limitY} x2={VB_W - PAD.right} y2={limitY} className="q-limit" />
          <text x={VB_W - PAD.right} y={limitY - 8} className="q-limit-label" textAnchor="end">
            Limit {fmt(limit)}
          </text>

          {series.map((d, i) => {
            const cx = PAD.left + slot * i + slot / 2;
            const h = Math.max(2, (d.v7d / limit) * plotH);
            const y = plotBottom - h;
            const isLast = i === n - 1;
            return (
              <g key={d.date}>
                <rect
                  x={cx - barW / 2}
                  y={y}
                  width={barW}
                  height={h}
                  className={`q-bar${isLast ? " q-bar--now" : ""}`}
                  style={{
                    transform: grown || reduce ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "center bottom",
                    transformBox: "fill-box",
                    transition: `transform .9s cubic-bezier(0.22,1,0.36,1) ${i * 0.04}s`,
                  }}
                />
                {(i === 0 || isLast || i === Math.floor(n / 2)) && (
                  <text x={cx} y={VB_H7 - PAD.bottom + 22} className="q-axis" textAnchor="middle">
                    {shortDate(d.date)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Plot helpers
// ---------------------------------------------------------------------------

interface PlotPoint extends QuotaPoint {
  x: number;
  y: number;
}

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

  const lineD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaD =
    points.length > 0
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
  // iso = YYYY-MM-DD -> DD.MM.
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
