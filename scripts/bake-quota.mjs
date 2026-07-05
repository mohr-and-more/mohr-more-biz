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
 * Schema (MMB-401 dual-provider):
 *   available, generated_at, note,
 *   glm{limits, latest, series},
 *   minimax{limits, latest, series}   ← MMB-401
 *
 * Both providers baked independently. Series: one data point per calendar day,
 * using the LAST snapshot of that day (closest to midnight UTC).
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
 * Handles dual-provider snapshots (top-level combined_5h/7d for GLM,
 * nested glm+minimax objects for MMB-401 dual display).
 */
function buildSeriesGLM(snapshots) {
  const byDay = new Map(); // "YYYY-MM-DD" → { v5h, v7d, ts }

  for (const { data } of snapshots) {
    const ts = data.generated_at;
    if (!ts) continue;
    const day = ts.slice(0, 10); // YYYY-MM-DD

    // MMB-401: data may be the full dual-provider snapshot from quota-monitor.py
    // or the legacy zai-quota-report.py format (top-level combined_5h/7d)
    let combined5h, combined7d;
    if (data.glm) {
      // Dual-provider format (quota-monitor.py)
      combined5h = data.glm.usage?.combined_5h ?? 0;
      combined7d = data.glm.usage?.combined_7d ?? 0;
    } else {
      // Legacy format
      combined5h = data.combined_5h ?? 0;
      combined7d = data.combined_7d ?? 0;
    }

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
  return series.slice(-MAX_SERIES_DAYS);
}

function buildSeriesMiniMax(snapshots) {
  const byDay = new Map();

  for (const { data } of snapshots) {
    const ts = data.timestamp ?? data.generated_at;
    if (!ts) continue;
    const day = ts.slice(0, 10);

    let combined5h = 0, combined7d = 0;
    if (data.minimax) {
      combined5h = data.minimax.usage?.combined_5h ?? 0;
      combined7d = data.minimax.usage?.combined_7d ?? 0;
    }

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
  return series.slice(-MAX_SERIES_DAYS);
}

function buildLatestGLM(latestSnap) {
  const d = latestSnap.data;
  let combined5h, combined7d, limit5h, limit7d;

  if (d.glm) {
    combined5h = d.glm.usage?.combined_5h ?? 0;
    combined7d = d.glm.usage?.combined_7d ?? 0;
    limit5h = d.glm.limits?.window_5h ?? 1600;
    limit7d = d.glm.limits?.window_7d ?? 8000;
  } else {
    combined5h = d.combined_5h ?? 0;
    combined7d = d.combined_7d ?? 0;
    limit5h = d.limits?.window_5h_prompts ?? 1600;
    limit7d = d.limits?.window_7d_prompts ?? 8000;
  }

  return {
    generated_at: d.generated_at ?? d.timestamp,
    combined_5h: combined5h,
    combined_7d: combined7d,
    pct_5h: Math.round((combined5h / limit5h) * 1000) / 10,
    pct_7d: Math.round((combined7d / limit7d) * 1000) / 10,
    limit_5h: limit5h,
    limit_7d: limit7d,
    flatrate_ok: true,
  };
}

function buildLatestMiniMax(latestSnap) {
  const d = latestSnap.data;

  if (!d.minimax) {
    return {
      generated_at: d.timestamp ?? d.generated_at ?? new Date().toISOString(),
      combined_5h: 0,
      combined_7d: 0,
      pct_5h: 0,
      pct_7d: 0,
      limit_5h: 1600,
      limit_7d: 8000,
      note: "No MiniMax data in snapshot",
    };
  }

  const combined5h = d.minimax.usage?.combined_5h ?? 0;
  const combined7d = d.minimax.usage?.combined_7d ?? 0;
  const limit5h = d.minimax.limits?.window_5h_estimated ?? 1600;
  const limit7d = d.minimax.limits?.window_7d_estimated ?? 8000;

  return {
    generated_at: d.timestamp ?? d.generated_at,
    combined_5h: combined5h,
    combined_7d: combined7d,
    pct_5h: Math.round((combined5h / limit5h) * 1000) / 10,
    pct_7d: Math.round((combined7d / limit7d) * 1000) / 10,
    limit_5h: limit5h,
    limit_7d: limit7d,
    video_bonus: d.minimax.video_bonus ?? "N/A",
  };
}

function bake() {
  const snapshots = loadSnapshots();
  if (snapshots.length === 0) {
    console.error("ERROR: No quota snapshots found in", SNAP_DIR);
    process.exit(1);
  }

  const latestSnap = snapshots[snapshots.length - 1];
  const latestGLM = buildLatestGLM(latestSnap);
  const seriesGLM = buildSeriesGLM(snapshots);
  const latestMiniMax = buildLatestMiniMax(latestSnap);
  const seriesMiniMax = buildSeriesMiniMax(snapshots);

  // Backwards-compatible top-level fields (legacy consumers)
  const baked = {
    available: true,
    generated_at: latestGLM.generated_at,
    note: "MMB-401 dual-provider: GLM + MiniMax quotas baked at build time. See glm.* and minimax.* sub-objects.",
    // Legacy shape (kept for backward compat)
    limits: {
      window_5h: latestGLM.limit_5h,
      window_7d: latestGLM.limit_7d,
    },
    latest: {
      generated_at: latestGLM.generated_at,
      combined_5h: latestGLM.combined_5h,
      combined_7d: latestGLM.combined_7d,
      pct_5h: latestGLM.pct_5h,
      pct_7d: latestGLM.pct_7d,
      cost_cents: 0,
      flatrate_ok: latestGLM.flatrate_ok,
      coverage_note: "Phase 2 (full) + MMB-401 dual-provider",
      tradingagents_available: false,
      hermes_5h: latestGLM.combined_5h,
      hermes_7d: latestGLM.combined_7d,
      pi_local_7d: 0,
      claude_local_7d: 0,
    },
    series: seriesGLM,
    // MMB-401: dual-provider objects
    glm: {
      provider: "z.ai (GLM Coding Plan)",
      limits: { window_5h: latestGLM.limit_5h, window_7d: latestGLM.limit_7d },
      latest: latestGLM,
      series: seriesGLM,
    },
    minimax: {
      provider: "MiniMax (Coding Plan)",
      limits: { window_5h: latestMiniMax.limit_5h, window_7d: latestMiniMax.limit_7d },
      latest: latestMiniMax,
      series: seriesMiniMax,
    },
  };

  writeFileSync(OUT_FILE, JSON.stringify(baked, null, 0) + "\n", "utf8");

  console.log(`✓ Baked ${snapshots.length} snapshots → ${basename(OUT_FILE.pathname)}`);
  console.log(`  GLM:  5h ${latestGLM.combined_5h}/${latestGLM.limit_5h} (${latestGLM.pct_5h}%) | 7d ${latestGLM.combined_7d}/${latestGLM.limit_7d} (${latestGLM.pct_7d}%)`);
  console.log(`  MiniMax: 5h ${latestMiniMax.combined_5h}/${latestMiniMax.limit_5h} (${latestMiniMax.pct_5h}%) | 7d ${latestMiniMax.combined_7d}/${latestMiniMax.limit_7d} (${latestMiniMax.pct_7d}%)`);
  console.log(`  GLM series: ${seriesGLM.length} pts | MiniMax series: ${seriesMiniMax.length} pts`);
}

bake();
