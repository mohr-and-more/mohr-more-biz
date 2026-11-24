#!/usr/bin/env node
/**
 * Live-Check für das Kontaktformular gegen die deployte Site.
 *
 * Prüft in einem Lauf, ob Mailversand, Archiv (KV) und Retry greifen:
 *
 *   1. GET  /api/kontakt/queue      — Token gültig? KV-Binding vorhanden?
 *   2. POST /api/kontakt/test       — optional, wenn ein Test-Token vorliegt:
 *                                     schickt eine Testmail über denselben Weg
 *   3. POST /api/kontakt            — schickt eine echte, als „Live-Check"
 *                                     markierte Anfrage durch das Formular
 *   4. GET  /api/kontakt/queue      — taucht die Anfrage im Archiv auf?
 *   5. POST /api/kontakt/retry      — läuft der Nachstell-Lauf, und wird eine
 *                                     nur archivierte Anfrage nachgeliefert?
 *
 * Aufruf:
 *   KONTAKT_RETRY_TOKEN=<TOKEN> npm run kontakt:check
 *   node scripts/check-kontakt-live.mjs --token=<TOKEN> --url=https://mohr-more.biz
 *   node scripts/check-kontakt-live.mjs --token=… --test-token=…
 *
 * Variablen (alternativ per --token= / --test-token= / --url=):
 *   KONTAKT_RETRY_TOKEN   Pages-Variable, schützt retry und queue (Pflicht)
 *   KONTAKT_TEST_TOKEN    optional, schaltet die Testmail mit frei
 *   KONTAKT_URL           Basis-URL, Default https://mohr-more.biz
 *
 * Exit-Code 0 nur wenn Mailversand, Archiv und Retry belegt sind, sonst 1.
 * Hinweis: Schritt 3 erzeugt eine echte Anfrage im Postfach (Betreff
 * „Live-Check") und einen Eintrag im Archiv. Das ist der Preis dafür, dass
 * der Check die ganze Kette beweist statt nur Erreichbarkeit.
 */

const args = new Map(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [key, ...rest] = a.replace(/^--/, "").split("=");
      return [key, rest.join("=")];
    })
);

const baseUrl = (args.get("url") || process.env.KONTAKT_URL || "https://mohr-more.biz").replace(/\/$/, "");
const token = (args.get("token") || process.env.KONTAKT_RETRY_TOKEN || "").trim();
const testToken = (args.get("test-token") || process.env.KONTAKT_TEST_TOKEN || "").trim();

const TIMEOUT_MS = 20000;
const DOC = "kontaktformular-setup.md";

if (!token) {
  console.error(
    [
      "Fehlendes Token: KONTAKT_RETRY_TOKEN setzen oder --token=<TOKEN> übergeben.",
      "Der Wert ist die Pages-Variable KONTAKT_RETRY_TOKEN (identisch zum GitHub-Secret).",
      `Einrichtung: ${DOC}, Schritt 3 und 5.`,
    ].join("\n")
  );
  console.error(
    "\nStatus: Secrets fehlen — ohne KONTAKT_RETRY_TOKEN sind retry und queue nicht prüfbar; KV-Binding und Mailversand bleiben ungeprüft."
  );
  process.exit(1);
}

const results = [];
const q = (value) => encodeURIComponent(value);

function report(name, ok, detail, hint) {
  results.push({ name, ok, detail, hint, warn: false });
  console.log(`${ok ? "✓" : "✗"} ${name} — ${detail}`);
  if (!ok && hint) console.log(`   ↳ ${hint}`);
}

/** Eine bereits gemeldete Prüfung nachträglich entschärfen (z. B. wenn der Retry nachliefert). */
function markWarn(name, detail) {
  const item = results.find((r) => r.name === name);
  if (!item) return;
  item.warn = true;
  item.detail = detail;
  item.hint = null;
  console.log(`⚠ ${name} — ${detail}`);
}

async function call(path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: res.status, json, text };
}

/** Ordnet Statuscodes der geschützten Endpunkte einer Ursache in der Anleitung zu. */
function hintFor(status, json) {
  const error = json?.error;
  if (status === 401) return "Token stimmt nicht mit der Pages-Variable KONTAKT_RETRY_TOKEN überein.";
  if (status === 503 && error === "retry_disabled") return `KONTAKT_RETRY_TOKEN fehlt in den Pages-Variablen (${DOC}, Schritt 3) — danach neu deployen.`;
  if (status === 503 && error === "queue_disabled") return `KONTAKT_RETRY_TOKEN fehlt in den Pages-Variablen (${DOC}, Schritt 3) — danach neu deployen.`;
  if (status === 503 && error === "no_archive") return `KV-Binding KONTAKT_ARCHIVE fehlt (${DOC}, Schritt 4) — danach neu deployen.`;
  if (status === 503 && error === "mail_not_configured") return `CF_EMAIL_ACCOUNT_ID / CF_EMAIL_API_TOKEN fehlen (${DOC}, Schritt 3) — danach neu deployen.`;
  if (status === 502) return `Mailversand scheitert beim Provider (${DOC}, Schritt 1 und 2, Logs im Pages-Dashboard).`;
  if (status === 404) return "Endpunkt nicht gefunden — ist der letzte Stand von main deployt?";
  return null;
}

function short(json, text) {
  if (json) return JSON.stringify(json);
  return (text || "").slice(0, 120);
}

console.log(`Live-Check Kontaktformular gegen ${baseUrl}`);
console.log('Schickt eine echte, als „Live-Check“ markierte Anfrage.\n');

const auth = { "x-retry-token": token };
let archiveUsable = true;
let before = null;
let submitted = null;
let mailWorked = false;

// 1) Archiv + Token
try {
  const res = await call(`/api/kontakt/queue?token=${q(token)}`);
  if (res.status === 200 && res.json?.ok) {
    before = res.json;
    report(
      "Archiv erreichbar",
      true,
      `HTTP 200, ${res.json.total} Einträge (${res.json.open} offen, ${res.json.sent} zugestellt)`
    );
  } else {
    archiveUsable = false;
    report("Archiv erreichbar", false, `HTTP ${res.status} ${short(res.json, res.text)}`, hintFor(res.status, res.json));
  }
} catch (error) {
  archiveUsable = false;
  report("Archiv erreichbar", false, `Netzwerkfehler: ${error.message}`, "Basis-URL prüfen (--url=…).");
}

// 2) Testmail (optional)
if (testToken) {
  try {
    const res = await call("/api/kontakt/test", { method: "POST", headers: { "x-test-token": testToken } });
    if (res.status === 200 && res.json?.ok) {
      mailWorked = true;
      report("Testmail", true, `zugestellt an ${res.json.to} (${res.json.attempts} Versuch(e), id ${res.json.id ?? "–"})`);
    } else {
      report("Testmail", false, `HTTP ${res.status} ${short(res.json, res.text)}`, hintFor(res.status, res.json));
    }
  } catch (error) {
    report("Testmail", false, `Netzwerkfehler: ${error.message}`, null);
  }
} else {
  console.log("· Testmail übersprungen (kein KONTAKT_TEST_TOKEN / --test-token)");
}

// 3) Echte Anfrage durch das Formular
const stamp = new Date().toISOString();
const payload = new URLSearchParams({
  name: "Live-Check (npm run kontakt:check)",
  company: "",
  email: "live-check@mohr-more.biz",
  message: `Automatischer Live-Check des Kontaktformulars am ${stamp}. Diese Anfrage wird vom Prüfskript erzeugt und darf ignoriert werden.`,
  consent: "1",
  betreff: "Live-Check",
  quelle: "live-check",
  page: "/kontakt",
  lang: "de",
});

try {
  const res = await call("/api/kontakt", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  });
  const body = res.json;
  if (res.status === 200 && body?.ok && body.id !== "silently-dropped") {
    submitted = body;
    if (body.delivery === "sent" || body.delivery === "webhook") {
      mailWorked = true;
      report("Mailversand", true, `Anfrage ${body.id} zugestellt (delivery: ${body.delivery})`);
    } else if (body.delivery === "queued") {
      report(
        "Mailversand",
        false,
        `Anfrage ${body.id} nur archiviert (delivery: queued)`,
        `Mailversand scheitert — Details im Pages-Log (${DOC}, Schritt 1 und 2). Der Retry-Lauf unten prüft die Nachlieferung.`
      );
    } else {
      report("Mailversand", false, `unerwartete Antwort ${short(body, res.text)}`, null);
    }
  } else {
    report(
      "Mailversand",
      false,
      `HTTP ${res.status} ${short(body, res.text)}`,
      hintFor(res.status, body) ?? "Antwort des Formular-Endpunkts prüfen."
    );
  }
} catch (error) {
  report("Mailversand", false, `Netzwerkfehler: ${error.message}`, null);
}

// 4) Anfrage im Archiv wiederfinden
if (archiveUsable && submitted) {
  try {
    const res = await call(`/api/kontakt/queue?token=${q(token)}`);
    if (res.status === 200 && res.json?.ok) {
      const after = res.json;
      const inOpen = (after.entries || []).some((e) => e.id === submitted.id);
      const sentGrew = typeof before?.sent === "number" && after.sent > before.sent;
      if (inOpen || sentGrew) {
        report(
          "Archiv",
          true,
          inOpen
            ? `Anfrage ${submitted.id} liegt offen im Archiv (retryCount ${(after.entries.find((e) => e.id === submitted.id) || {}).retryCount ?? 0})`
            : `Anfrage ${submitted.id} ist als zugestellt archiviert (${after.sent} zugestellt)`
        );
      } else {
        report(
          "Archiv",
          false,
          `Anfrage ${submitted.id} nicht im Archiv gefunden (total ${before?.total ?? "?"} → ${after.total})`,
          `KV-Binding KONTAKT_ARCHIVE prüfen (${DOC}, Schritt 4) und neu deployen.`
        );
      }
    } else {
      report("Archiv", false, `HTTP ${res.status} ${short(res.json, res.text)}`, hintFor(res.status, res.json));
    }
  } catch (error) {
    report("Archiv", false, `Netzwerkfehler: ${error.message}`, null);
  }
} else {
  report("Archiv", false, "nicht prüfbar ohne erreichbares Archiv und eingereichte Anfrage", hintFor(503, { error: "no_archive" }));
}

// 5) Retry-Lauf
try {
  const res = await call("/api/kontakt/retry", { method: "POST", headers: auth });
  const body = res.json;
  if (res.status === 200 && body?.ok) {
    const counters = `scanned ${body.scanned}, retried ${body.retried}, delivered ${body.delivered}, failed ${body.failed}, skipped ${body.skipped}`;
    if (submitted && submitted.delivery === "queued") {
      if (body.delivered >= 1) {
        mailWorked = true;
        report("Retry", true, `${counters} — archivierte Anfrage wurde nachgeliefert`);
        markWarn("Mailversand", "erste Zustellung scheiterte, per Retry nachgeliefert — Zustellkette greift, Provider aber instabil");
      } else {
        report("Retry", false, `${counters} — keine Nachlieferung`, `Mailversand weiterhin gestört (${DOC}, Schritt 1 und 2), Logs im Pages-Dashboard.`);
      }
    } else {
      report("Retry", true, counters);
    }
  } else {
    report("Retry", false, `HTTP ${res.status} ${short(body, res.text)}`, hintFor(res.status, body));
  }
} catch (error) {
  report("Retry", false, `Netzwerkfehler: ${error.message}`, null);
}

// Zusammenfassung
const okCount = results.filter((r) => r.ok).length;
const warnCount = results.filter((r) => !r.ok && r.warn).length;
console.log(
  `\nErgebnis: ${okCount}/${results.length} Prüfungen bestanden${warnCount ? `, ${warnCount} Hinweis(e)` : ""}.`
);

// Ampel: greifen Secrets, KV-Binding und Mailversand schon?
const secretsResult = results.find((r) => r.name === "Archiv erreichbar");
const archiveResult = results.find((r) => r.name === "Archiv");
const capabilities = [
  {
    label: "Secrets (KONTAKT_RETRY_TOKEN für retry/queue)",
    ok: secretsResult?.ok === true,
    detail: secretsResult?.detail ?? "nicht geprüft",
  },
  {
    label: "KV-Binding KONTAKT_ARCHIVE",
    ok: archiveResult?.ok === true,
    detail: archiveResult?.detail ?? "nicht geprüft",
  },
  {
    label: "Mailversand",
    ok: mailWorked,
    detail: "keine Zustellung belegt (Mailversand/Retry oben)",
  },
];

console.log("\nStatus:");
for (const item of capabilities) {
  console.log(`  ${item.ok ? "✓" : "✗"} ${item.label}${item.ok ? "" : ` — ${item.detail}`}`);
}
const warned = results.filter((r) => !r.ok && r.warn);
const failed = results.filter((r) => !r.ok && !r.warn);

if (warned.length > 0) {
  console.log(`Hinweise: ${warned.map((item) => item.name).join(", ")}`);
}

if (failed.length === 0) {
  console.log("Mailversand, Archiv und Retry greifen.");
  process.exit(0);
}

console.log(`Offene Punkte: ${failed.map((item) => item.name).join(", ")}`);
process.exit(1);
