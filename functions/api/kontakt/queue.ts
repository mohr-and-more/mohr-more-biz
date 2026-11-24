/**
 * Cloudflare Pages Function — GET /api/kontakt/queue
 *
 * Macht nicht zugestellte Anfragen aus dem KV-Archiv sichtbar, ohne dass
 * jemand den Cloudflare-Dashboard-Editor öffnen muss. Gedacht für ein
 * Status-Panel oder einen schnellen Blick nach einem Ausfall.
 *
 * Absicherung: Header `x-queue-token` oder `?token=` muss `KONTAKT_RETRY_TOKEN`
 * (oder ersatzweise `KONTAKT_TEST_TOKEN`) entsprechen. Ohne Secret: 503.
 *
 * Antwort:
 *   { ok, total, open, sent, oldestOpenAt, entries: [{ id, createdAt, delivery,
 *     retryCount, lastAttemptAt, name, email, betreff, company }] }
 *   entries sind auf 50 offene Einträge begrenzt, neueste zuerst.
 */

import type { MailEnv } from "../_mail.ts";
import { ARCHIVE_PREFIX, type ArchiveKV, type ArchiveRecord } from "../_archive.ts";

type Env = MailEnv & {
  KONTAKT_ARCHIVE?: ArchiveKV;
  KONTAKT_RETRY_TOKEN?: string;
  KONTAKT_TEST_TOKEN?: string;
};

const MAX_SCAN = 500;
const MAX_ENTRIES = 50;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, private",
    },
  });
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const onRequest = async (context: {
  env: Env;
  request: Request;
}): Promise<Response> => {
  const { request } = context;
  const env = context.env ?? {};

  if (request.method !== "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "GET", "content-type": "text/plain; charset=utf-8" },
    });
  }

  const expected = (env.KONTAKT_RETRY_TOKEN || env.KONTAKT_TEST_TOKEN || "").trim();
  if (!expected) return json({ error: "queue_disabled" }, 503);

  const provided = (
    request.headers.get("x-queue-token") ||
    new URL(request.url).searchParams.get("token") ||
    ""
  ).trim();
  if (!provided || !safeEqual(provided, expected)) return json({ error: "unauthorized" }, 401);

  const kv = env.KONTAKT_ARCHIVE;
  if (!kv) return json({ error: "no_archive" }, 503);

  const open: ArchiveRecord[] = [];
  let total = 0;
  let sent = 0;
  let scanned = 0;
  let cursor: string | undefined;

  do {
    const page = await kv.list({ prefix: ARCHIVE_PREFIX, limit: 100, cursor });
    for (const { name } of page.keys) {
      if (scanned >= MAX_SCAN) break;
      scanned += 1;

      const raw = await kv.get(name);
      if (!raw) continue;
      total += 1;

      let record: ArchiveRecord;
      try {
        record = JSON.parse(raw) as ArchiveRecord;
      } catch {
        continue;
      }

      if (record.delivery === "sent" || record.delivery === "webhook") {
        sent += 1;
        continue;
      }
      open.push(record);
    }
    cursor = page.list_complete ? undefined : page.cursor;
    if (scanned >= MAX_SCAN) break;
  } while (cursor);

  open.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return json(
    {
      ok: true,
      total,
      open: open.length,
      sent,
      oldestOpenAt: open.length ? open[open.length - 1].createdAt : null,
      entries: open.slice(0, MAX_ENTRIES).map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        delivery: r.delivery,
        retryCount: r.retryCount ?? 0,
        lastAttemptAt: r.lastAttemptAt ?? null,
        name: r.name,
        company: r.company,
        email: r.email,
        betreff: r.betreff,
      })),
    },
    200
  );
};
