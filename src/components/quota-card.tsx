"use client";

import * as React from "react";

/**
 * QuotaCard
 * ---------
 * MiniMax-style quota/usage widget adopted for the mohr-more.biz design
 * system. Renders a vertical stack of quota rows (label + reset timer,
 * progress bar, "Total quota 100% / Used X%" or "X / Y used" on the right).
 *
 * Each row uses the brand tokens (--color-primary, --color-accent,
 * --border, --text-secondary) so it sits naturally inside either the DE
 * light theme or the default dark theme.
 *
 * Originally built for MMB-504 (Dashboard MiniMax Quota) — adopted from the
 * MiniMax dashboard's "My usage" panel into mohr-and-more-biz.
 */

export type QuotaRow = {
  /** Short label, e.g. "5h limit" / "Weekly limit" / "Video bonus" */
  label: string;
  /** Sub-label shown under the label, e.g. "Resets in 2 hr 17 min" */
  sub?: string;
  /** 0..100 — drives the progress bar width. Ignored when `used`/`max` are set. */
  percent?: number;
  /** Optional explicit numerator (e.g. 0 for "0 / 3 used"). Overrides percent label. */
  used?: number;
  /** Optional explicit denominator (e.g. 3 for "0 / 3 used"). */
  max?: number;
  /** Override the "Total quota 100%" line on the right. Defaults to "Total quota 100%". */
  totalLabel?: string;
  /** Aria label for accessibility. */
  ariaLabel?: string;
};

export function QuotaCard({
  title = "My usage",
  rows,
  className,
}: {
  title?: string;
  rows: QuotaRow[];
  className?: string;
}) {
  return (
    <div className={`quota-card-wrapper ${className ?? ""}`.trim()}>
      <div className="quota-card-header">
        <h3 className="quota-card-title">{title}</h3>
      </div>
      <article className="quota-card" aria-label={title}>
        {rows.map((row, i) => {
          const hasExplicitCount =
            typeof row.used === "number" && typeof row.max === "number" && row.max > 0;
          const computedPct = hasExplicitCount
            ? clampPercent((row.used! / row.max!) * 100)
            : null;
          const pct = computedPct !== null ? computedPct : clampPercent(row.percent);
          const rightPrimary = hasExplicitCount
            ? `${row.used} / ${row.max}`
            : `${row.totalLabel ?? "Total quota 100%"}`;
          const rightSecondary = hasExplicitCount
            ? `Used ${Math.round(pct)}%`
            : (
                <span>
                  Used <span>{pct}%</span>
                </span>
              );
          return (
            <div
              key={`${row.label}-${i}`}
              className="quota-row"
              aria-label={row.ariaLabel ?? `${row.label} ${pct}%`}
            >
              <div className="quota-row-label">
                <div className="quota-row-label-text">{row.label}</div>
                {row.sub ? (
                  <div className="quota-row-label-sub">{row.sub}</div>
                ) : null}
              </div>
              <div
                className="quota-row-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-label={row.label}
              >
                <div
                  className="quota-row-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="quota-row-value">
                <div className="quota-row-value-primary">{rightPrimary}</div>
                <div className="quota-row-value-secondary">{rightSecondary}</div>
              </div>
            </div>
          );
        })}
      </article>
    </div>
  );
}

function clampPercent(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}