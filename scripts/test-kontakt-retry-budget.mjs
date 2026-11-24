#!/usr/bin/env node
/**
 * Harness für das Zeitbudget von POST /api/kontakt/retry.
 *
 * Prüft drei Dinge gegen den echten Function-Code (kein Nachbau der Logik):
 *   1. Ein laufender Lauf bricht bei aufgebrauchtem Budget sauber ab
 *      (`stopped: "deadline"`), statt in das Limit der Pages Function zu laufen.
 *   2. Der Eintrag, bei dem die Zeit ausging, bleibt unverändert — kein
 *      Fehlversuch, keine halb geschriebene Aufzeichnung.
 *   3. Einträge pro Lauf sind gedeckelt (`stopped: "max_entries"`), der Rest
 *      bleibt für den nächsten Cron-Lauf liegen.
 *
 * Der Provider wird über globalThis.fetch gestubbt; die Zeitmessung ist echt
 * (der langsame Stub wartet wirklich), nur das Budget wird per
 * KONTAKT_RETRY_BUDGET_MS verkürzt, damit der Test wenige Sekunden dauert.
 *
 *   node scripts/test-kontakt-retry-budget.mjs
 */

import { onRequest } from "../functions/api/kontakt/retry.ts";

const TOKEN = "test-token";
const PREFIX = "kontakt:";
const realFetch = globalThis.fetch;

let failures = 0;

function check(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✓ ${label}`);
    return;
  }
  failures += 1;
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

/** In-Memory-KV mit derselben Oberfläche, die die Function nutzt. */
function makeKv(records) {
  const store = new Map(records.map((r) => [`${PREFIX}${r.createdAt}:${r.id}`, JSON.stringify(r)]));
  return {
    async get(key) {
      return store.get(key) ?? null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async list({ prefix = "", limit = 100, cursor } = {}) {
      const names = [...store.keys()].filter((k) => k.startsWith(prefix)).sort();
      const start = cursor ? Number(cursor) : 0;
      const slice = names.slice(start, start + limit);
      const next = start + slice.length;
      const complete = next >= names.length;
      return {
        keys: slice.map((name) => ({ name })),
        list_complete: complete,
        cursor: complete ? undefined : String(next),
      };
    },
    records() {
      return [...store.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => ({ key, record: JSON.parse(value) }));
    },
  };
}

const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

/** Einträge, die alle fällig sind: alt genug, `failed`, noch Versuche frei. */
function seed(count) {
  return Array.from({ length: count }, (_, i) => ({
    name: `Anfrage ${i}`,
    company: "",
    email: `k${i}@example.com`,
    message: "Bitte um ein Angebot für die neue Website.",
    betreff: "Website",
    quelle: "harness",
    page: "/kontakt",
    lang: "de",
    id: `id-${String(i).padStart(2, "0")}`,
    createdAt: ago(30 + i),
    delivery: "failed",
    retryCount: 0,
  }));
}

function provider({ status, body, delayMs }) {
  globalThis.fetch = (_url, init = {}) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve(new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));
      }, delayMs);
      init.signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          const error = new Error("The operation was aborted.");
          error.name = "AbortError";
          reject(error);
        },
        { once: true }
      );
    });
}

const slowProvider = () =>
  provider({
    status: 503,
    delayMs: 1_500,
    body: { success: false, errors: [{ code: 1001, message: "stub: provider down" }] },
  });

const fastProvider = () =>
  provider({ status: 200, delayMs: 0, body: { success: true, result: { message_id: "stub-id" } } });

async function runRetry({ kv, budgetMs }) {
  const env = {
    KONTAKT_ARCHIVE: kv,
    KONTAKT_RETRY_TOKEN: TOKEN,
    KONTAKT_RETRY_BUDGET_MS: String(budgetMs),
    CF_EMAIL_ACCOUNT_ID: "stub-account",
    CF_EMAIL_API_TOKEN: "stub-token",
  };
  const started = Date.now();
  const res = await onRequest({
    env,
    request: new Request("https://stub.local/api/kontakt/retry", {
      method: "POST",
      headers: { "x-retry-token": TOKEN },
    }),
  });
  const body = await res.json();
  return { status: res.status, body, elapsed: Date.now() - started };
}

async function main() {
  // 1) Langsamer Provider, knappes Budget: ein Eintrag schafft es, der zweite
  //    wird abgebrochen, ohne Spuren zu hinterlassen.
  console.log("Szenario 1 — langsamer Provider, Budget 9 s, 8 Einträge");
  {
    const kv = makeKv(seed(8));
    slowProvider();
    const budgetMs = 9_000;
    const { status, body, elapsed } = await runRetry({ kv, budgetMs });
    const stored = kv.records();

    check("HTTP 200", status === 200, `Status ${status}`);
    check("Lauf meldet stopped=deadline", body.stopped === "deadline", `stopped=${body.stopped}`);
    check("truncated=true", body.truncated === true);
    check(
      "Lauf endet im Budget (plus 2 s Kulanz)",
      elapsed <= budgetMs + 2_000,
      `${elapsed} ms bei Budget ${budgetMs} ms`
    );
    check("duration_ms passt zur Messung", Math.abs(body.duration_ms - elapsed) < 1_000, `${body.duration_ms} vs ${elapsed}`);
    check("genau ein Eintrag wurde versucht", body.retried === 1, `retried=${body.retried}`);
    check("dieser Versuch ist als Fehlschlag verbucht", body.failed === 1, `failed=${body.failed}`);
    check("erster Eintrag hat retryCount 1", stored[0].record.retryCount === 1, JSON.stringify(stored[0].record.retryCount));
    check("zweiter Eintrag ist unverändert", stored[1].record.retryCount === 0 && stored[1].record.delivery === "failed");
    check(
      "kein Eintrag in unklarem Zustand",
      stored.every(({ record }) => ["failed", "sent", "webhook", "not_configured", "pending"].includes(record.delivery))
    );
    check(
      "übrige Einträge warten unangetastet",
      stored.slice(2).every(({ record }) => record.retryCount === 0 && record.delivery === "failed")
    );
  }

  // 2) Derselbe Bestand, schneller Provider: alles wird im Budget zugestellt.
  console.log("Szenario 2 — schneller Provider, Budget 20 s, 8 Einträge");
  {
    const kv = makeKv(seed(8));
    fastProvider();
    const { status, body } = await runRetry({ kv, budgetMs: 20_000 });
    const stored = kv.records();

    check("HTTP 200", status === 200);
    check("kein Abbruch", body.stopped === null, `stopped=${body.stopped}`);
    check("alle 8 zugestellt", body.delivered === 8 && body.failed === 0, JSON.stringify(body));
    check(
      "Einträge stehen auf sent",
      stored.every(({ record }) => record.delivery === "sent" && record.retryCount === 1)
    );
  }

  // 3) Deckel pro Lauf: 60 fällige Einträge, nur 50 werden bearbeitet.
  console.log("Szenario 3 — 60 Einträge, Deckel pro Lauf");
  {
    const kv = makeKv(seed(60));
    fastProvider();
    const { body } = await runRetry({ kv, budgetMs: 20_000 });
    const stored = kv.records();
    const touched = stored.filter(({ record }) => record.retryCount > 0).length;

    check("Lauf meldet stopped=max_entries", body.stopped === "max_entries", `stopped=${body.stopped}`);
    check("50 Einträge bearbeitet", body.scanned === 50 && body.retried === 50, JSON.stringify(body));
    check("genau 50 Datensätze verändert", touched === 50, `${touched} verändert`);
    check("10 Einträge bleiben für den nächsten Lauf", stored.length - touched === 10);
  }

  globalThis.fetch = realFetch;
  console.log(failures === 0 ? "\nAlle Prüfungen grün." : `\n${failures} Prüfung(en) fehlgeschlagen.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  globalThis.fetch = realFetch;
  console.error("Harness abgebrochen:", error);
  process.exit(1);
});
