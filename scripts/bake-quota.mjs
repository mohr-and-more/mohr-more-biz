#!/usr/bin/env node
/**
 * bake-quota.mjs — Regenerates functions/api/_quota-data.json from local
 * quota snapshot files.
 *
 * Run BEFORE `next build` / before committing for deploy. The baked file is a
 * committed static asset (NOT gitignored) so the CI pipeline picks it up
 * automatically — no runtime upstream dependency.
 *
 * Input:  /home/admin01/ops/reports/quota-snapshot-*.json
 * Output: functions/api/_quota-data.json  (overwritten in-place)
 *
 * Schema (must stay stable — consumed by quota.ts + dashboard-api.ts):
 *   available, generated_at, note,
 *   limits{window_5h, window_7d},
 *   latest{generated_at, combined_5h, combined_7d, pct_5h, pct_7d,
 *          cost_cents, flatrate_ok, coverage_note,
 *          tradingagents_available, hermes_5h, hermes_7d,
 *          pi_local_7d, claude_local_7d},
 *   series[{date, v5h, v7d}]
 *
 * Series: one data point per calendar day, using the LAST snapshot of that day
 * (closest to midnight UTC = most complete picture).
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const SNAP_DIR = "/home/admin01/ops/reports";
const OUT_FILE = new URL("../functions/api/_quota-data.json", import.meta.url);
const MAX_SERIES_DAYS = 30; // cap series to last N days

function loadSnapshots() {
  const files = readdirSync(SNAP_DIR)
    .filter((f) => /^quota-snapshot-.*\.json$/.test(f))
    .sort();
  return files.map((f) => {
    const raw = readFileSync(join(SNAP_DIR, f), "utf8");
    return { filename: f, data: JSON.parse(raw) };
  });
}

/**
 * Collapse multiple snapshots per day → one point per day (the last snapshot
 * of each UTC day, which has the most complete 5h/7d window).
 */
function buildSeries(snapshots) {
  const byDay = new Map(); // "YYYY-MM-DD" → { v5h, v7d, ts }

  for (const { data } of snapshots) {
    const ts = data.generated_at;
    if (!ts) continue;
    const day = ts.slice(0, 10); // YYYY-MM-DD

    const combined5h = data.combined_5h ?? 0;
    const combined7d = data.combined_7d ?? 0;

    // Keep the latest snapshot per day (lexicographic ts compare works for ISO)
    const existing = byDay.get(day);
    if (!existing || ts > existing.ts) {
      byDay.set(day, { v5h: combined5h, v7d: combined7d, ts });
    }
  }

  const series = [];
  for (const [date, { v5h, v7d }] of byDay) {
    series.push({ date, v5h, v7d });
  }
  series.sort((a, b) => a.date.localeCompare(b.date));

  // Cap to last N days
  return series.slice(-MAX_SERIES_DAYS);
}

function buildLatest(latestSnap) {
  const d = latestSnap.data;
  const combined5h = d.combined_5h ?? 0;
  const combined7d = d.combined_7d ?? 0;
  const limit5h = d.limits?.window_5h_prompts ?? 1600;
  const limit7d = d.limits?.window_7d_prompts ?? 8000;

  const hermes5h = d.hermes?.calls_5h ?? combined5h;
  const hermes7d = d.hermes?.calls_7d ?? combined7d;
  const piLocal7d = d.pi_local?.in_7d ?? 0;
  const claudeLocal7d = d.claude_local?.in_7d ?? 0;

  const costCents = d.paperclip_cost?.total_cost_cents_seen ?? 0;
  const flatrateOk = d.paperclip_cost?.flatrate_ok ?? true;

  return {
    generated_at: d.generated_at,
    combined_5h: combined5h,
    combined_7d: combined7d,
    pct_5h: Math.round((combined5h / limit5h) * 1000) / 10,
    pct_7d: Math.round((combined7d / limit7d) * 1000) / 10,
    cost_cents: costCents,
    flatrate_ok: flatrateOk,
    coverage_note:
      d.coverage_note ??
      "Phase 2 (full): All major sources instrumented. TradingAgents logs exist but not yet parsed.",
    tradingagents_available: d.tradingagents?.available ?? false,
    hermes_5h: hermes5h,
    hermes_7d: hermes7d,
    pi_local_7d: piLocal7d,
    claude_local_7d: claudeLocal7d,
  };
}

function bake() {
  const snapshots = loadSnapshots();
  if (snapshots.length === 0) {
    console.error("ERROR: No quota snapshots found in", SNAP_DIR);
    process.exit(1);
  }

  const latestSnap = snapshots[snapshots.length - 1];
  const latest = buildLatest(latestSnap);
  const series = buildSeries(snapshots);

  const baked = {
    available: true,
    generated_at: latest.generated_at,
    note: "Baked at build time from /home/admin01/ops/reports snapshots (build-time embed → no runtime upstream).",
    limits: {
      window_5h: latestSnap.data.limits?.window_5h_prompts ?? 1600,
      window_7d: latestSnap.data.limits?.window_7d_prompts ?? 8000,
    },
    latest,
    series,
  };

  writeFileSync(OUT_FILE, JSON.stringify(baked, null, 0) + "\n", "utf8");

  console.log(`✓ Baked ${snapshots.length} snapshots → ${basename(OUT_FILE.pathname)}`);
  console.log(`  Latest: ${latest.generated_at} | 5h: ${latest.combined_5h} (${latest.pct_5h}%) | 7d: ${latest.combined_7d} (${latest.pct_7d}%)`);
  console.log(`  Series: ${series.length} data points (${series[0].date} → ${series[series.length - 1].date})`);
}

bake();
