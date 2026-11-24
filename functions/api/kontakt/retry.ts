/**
 * Cloudflare Pages Function — POST /api/kontakt/retry
 *
 * Stellt Anfragen aus dem KV-Archiv erneut zu, deren Mailversand gescheitert
 * ist. Gedacht für einen geplanten Aufruf (GitHub-Actions-Cron, alle 30 Min.)
 * und für manuelle Nacharbeit.
 *
 * Absicherung: Header `x-retry-token` oder `?token=` muss `KONTAKT_RETRY_TOKEN`
 * (oder ersatzweise `KONTAKT_TEST_TOKEN`) entsprechen. Ohne Secret: 503.
 *
 * Regeln:
 *   - nur Einträge mit delivery = failed | not_configured | pending (pending nur,
 *     wenn älter als 10 Minuten — dann ist der ursprüngliche Request abgebrochen)
 *   - junge Einträge (< 2 Minuten) werden übersprungen, damit ein laufender
 *     Request nicht doppelt versendet wird
 *   - maximal 5 Zustellversuche pro Anfrage (retryCount im Archiv)
 *   - pro Lauf höchstens 50 Einträge und ein hartes Zeitbudget von 20 s:
 *     Vor jedem Eintrag wird geprüft, ob noch genug Zeit bleibt; reicht sie
 *     nicht, endet der Lauf mit `stopped: "deadline"`. Der begonnene Eintrag
 *     bleibt dabei unverändert (kein Fehlversuch), der Rest wartet auf den
 *     nächsten Cron-Lauf. So entstehen keine halb geschriebenen Zustände.
 *     Das Budget lässt sich über `KONTAKT_RETRY_BUDGET_MS` (1–25 s) verkürzen,
 *     was der Test in `scripts/test-kontakt-retry-budget.mjs` nutzt.
 *
 * Antwort: { ok, scanned, retried, delivered, failed, skipped, truncated,
 *           stopped, duration_ms, budget_ms }
 */

import {
  buildInquiryMail,
  sendViaCloudflareEmail,
  type MailEnv,
} from "../_mail.ts";

interface KVListResult {
  keys: Array<{ name: string }>;
  list_complete: boolean;
  cursor?: string;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<KVListResult>;
}

type Env = MailEnv & {
  KONTAKT_ARCHIVE?: KVNamespace;
  KONTAKT_RETRY_TOKEN?: string;
  KONTAKT_TEST_TOKEN?: string;
  /** Optionales Zeitbudget pro Lauf in Millisekunden (1.000–25.000). */
  KONTAKT_RETRY_BUDGET_MS?: string;
};

type ArchiveRecord = {
  name: string;
  company: string;
  email: string;
  message: string;
  betreff: string;
  quelle: string;
  page: string;
  lang: string;
  id: string;
  createdAt: string;
  delivery: "pending" | "sent" | "webhook" | "failed" | "not_configured";
  retryCount?: number;
  lastAttemptAt?: string;
  ipHash?: string;
};

const PREFIX = "kontakt:";
const MAX_ATTEMPTS = 5;
const MIN_AGE_MS = 2 * 60 * 1000;
const PENDING_STALE_MS = 10 * 60 * 1000;
const MAX_KEYS_PER_RUN = 50;
/** Harte Obergrenze für einen Lauf — deutlich unter dem Limit einer Pages Function. */
const DEFAULT_RUN_BUDGET_MS = 20_000;
const MAX_RUN_BUDGET_MS = 25_000;
/** Unterhalb dieser Restzeit wird kein Eintrag mehr begonnen. */
const MIN_ENTRY_BUDGET_MS = 2_500;
const ARCHIVE_TTL_SECONDS = 60 * 60 * 24 * 30;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function runBudgetMs(env: Env): number {
  const raw = Number(env.KONTAKT_RETRY_BUDGET_MS);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_RUN_BUDGET_MS;
  return Math.min(Math.max(raw, 1_000), MAX_RUN_BUDGET_MS);
}

function isDue(record: ArchiveRecord, now: number): boolean {
  if (record.delivery === "sent" || record.delivery === "webhook") return false;

  const age = now - new Date(record.createdAt).getTime();
  if (!Number.isFinite(age) || age < MIN_AGE_MS) return false;
  if (record.delivery === "pending" && age < PENDING_STALE_MS) return false;
  if ((record.retryCount ?? 0) >= MAX_ATTEMPTS) return false;
  return true;
}

export const onRequest = async (context: {
  env: Env;
  request: Request;
}): Promise<Response> => {
  const { request } = context;
  const env = context.env ?? {};

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "POST", "content-type": "text/plain; charset=utf-8" },
    });
  }

  const expected = (env.KONTAKT_RETRY_TOKEN || env.KONTAKT_TEST_TOKEN || "").trim();
  if (!expected) return json({ error: "retry_disabled" }, 503);

  const provided = (
    request.headers.get("x-retry-token") ||
    new URL(request.url).searchParams.get("token") ||
    ""
  ).trim();
  if (!provided || !safeEqual(provided, expected)) return json({ error: "unauthorized" }, 401);

  const kv = env.KONTAKT_ARCHIVE;
  if (!kv) return json({ error: "no_archive" }, 503);

  const budgetMs = runBudgetMs(env);
  const now = Date.now();
  const deadline = now + budgetMs;
  let scanned = 0;
  let retried = 0;
  let delivered = 0;
  let failed = 0;
  let skipped = 0;
  let stopped: "deadline" | "max_entries" | null = null;
  let cursor: string | undefined;

  outer: do {
    const page = await kv.list({ prefix: PREFIX, limit: 100, cursor });
    for (const { name } of page.keys) {
      if (scanned >= MAX_KEYS_PER_RUN) {
        stopped = "max_entries";
        break outer;
      }
      // Vor dem Eintrag prüfen, ob ein Versand überhaupt noch starten kann.
      if (deadline - Date.now() < MIN_ENTRY_BUDGET_MS) {
        stopped = "deadline";
        break outer;
      }
      scanned += 1;

      const raw = await kv.get(name);
      if (!raw) continue;

      let record: ArchiveRecord;
      try {
        record = JSON.parse(raw) as ArchiveRecord;
      } catch {
        skipped += 1;
        continue;
      }

      if (!isDue(record, now)) {
        skipped += 1;
        continue;
      }

      const mail = buildInquiryMail(record);
      const result = await sendViaCloudflareEmail(env, mail, fetch, { deadline });

      // Eigenes Zeitbudget aufgebraucht: Eintrag unverändert lassen, damit er
      // nicht als Fehlversuch zählt und der nächste Lauf ihn übernimmt.
      if (!result.ok && result.error === "deadline_exceeded") {
        stopped = "deadline";
        break outer;
      }

      retried += 1;

      // Fehlt die Mail-Konfiguration, ist das kein Zustellversuch — sonst
      // wären Einträge nach fünf Läufen endgültig aufgebraucht.
      const notConfigured = !result.ok && result.error === "not_configured";
      const next: ArchiveRecord = {
        ...record,
        delivery: result.ok ? "sent" : notConfigured ? "not_configured" : "failed",
        retryCount: notConfigured ? record.retryCount ?? 0 : (record.retryCount ?? 0) + 1,
        lastAttemptAt: notConfigured ? record.lastAttemptAt : new Date().toISOString(),
      };
      await kv.put(name, JSON.stringify(next), { expirationTtl: ARCHIVE_TTL_SECONDS });

      if (result.ok) delivered += 1;
      else failed += 1;
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return json(
    {
      ok: true,
      scanned,
      retried,
      delivered,
      failed,
      skipped,
      truncated: stopped !== null,
      stopped,
      duration_ms: Date.now() - now,
      budget_ms: budgetMs,
    },
    200
  );
};
