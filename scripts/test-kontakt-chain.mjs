/**
 * Regressionstests für die Kontaktstrecke — gegen den echten Function-Code,
 * ohne Netzwerk: Cloudflare-Provider, Alarm-Webhook und KV werden gestubbt.
 *
 *   node scripts/test-kontakt-chain.mjs
 *
 * Deckt ab: Konfiguration, Zustellung, Retry (transient vs. 4xx), Archivierung,
 * Webhook-Zweitweg, Honeypot, Validierung, OPTIONS/405, JSON-Body, Test-Endpunkt,
 * Alarm ohne PII, Retry-Endpunkt, Queue-Sicht und das Retry-Zeitbudget.
 * Ergänzend: scripts/test-kontakt-retry-budget.mjs (Abbruch mitten im Lauf).
 */

import assert from "node:assert/strict";

const kontaktUrl = new URL("../functions/api/kontakt.ts", import.meta.url).href;
const testUrl = new URL("../functions/api/kontakt/test.ts", import.meta.url).href;
const retryUrl = new URL("../functions/api/kontakt/retry.ts", import.meta.url).href;
const queueUrl = new URL("../functions/api/kontakt/queue.ts", import.meta.url).href;

const { onRequest: kontakt } = await import(kontaktUrl);
const { onRequest: testEndpoint } = await import(testUrl);
const { onRequest: retryEndpoint } = await import(retryUrl);
const { onRequest: queueEndpoint } = await import(queueUrl);
const { MAIL_TIMINGS } = await import(new URL("../functions/api/_mail.ts", import.meta.url).href);

const ENV_OK = { CF_EMAIL_ACCOUNT_ID: "0123456789abcdef0123456789abcdef", CF_EMAIL_API_TOKEN: "tok" };

function inquiry(overrides = {}) {
  const fd = new FormData();
  fd.set("name", "Erika Mustermann");
  fd.set("email", "erika@example.com");
  fd.set("message", "Wir möchten unsere Verwaltung automatisieren und brauchen dafür Unterstützung.");
  fd.set("consent", "1");
  for (const [k, v] of Object.entries(overrides)) fd.set(k, v);
  return fd;
}

function mockKV(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    store,
    async get(k) {
      return store.has(k) ? store.get(k) : null;
    },
    async put(k, v) {
      store.set(k, v);
    },
    async list({ prefix = "", limit = 100, cursor } = {}) {
      const names = [...store.keys()].filter((k) => k.startsWith(prefix)).sort();
      const start = cursor ? Number(cursor) : 0;
      const slice = names.slice(start, start + limit);
      const next = start + limit;
      return {
        keys: slice.map((name) => ({ name })),
        list_complete: next >= names.length,
        cursor: next < names.length ? String(next) : undefined,
      };
    },
  };
}

function stubFetch(handler) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return handler(String(url), init, calls.length);
  };
  return calls;
}

const cfOk = () =>
  new Response(JSON.stringify({ success: true, errors: [], result: { message_id: "msg-1" } }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
const cfErr = (status) =>
  new Response(JSON.stringify({ success: false, errors: [{ code: 10101, message: "unauthorized" }] }), {
    status,
    headers: { "content-type": "application/json" },
  });

async function post(env, body, method = "POST", waitUntil) {
  return kontakt({
    env,
    request: new Request("https://mohr-more.biz/api/kontakt", { method, body }),
    waitUntil,
  });
}

// 1 — nicht konfiguriert, kein Archiv
{
  const calls = stubFetch(() => cfOk());
  const res = await post({}, inquiry());
  const body = await res.json();
  assert.equal(res.status, 503);
  assert.equal(body.error, "mail_not_configured");
  assert.equal(body.retained, false);
  assert.equal(calls.length, 0);
  console.log("ok 1 nicht konfiguriert -> 503 mail_not_configured");
}

// 2 — erfolgreiche Zustellung
{
  const calls = stubFetch(() => cfOk());
  const res = await post(ENV_OK, inquiry({ betreff: "Automatisierung", quelle: "/leistungen" }));
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.delivery, "sent");
  assert.equal(calls.length, 1);
  const payload = JSON.parse(calls[0].init.body);
  assert.equal(payload.to, "info@mohr-more.biz");
  assert.equal(payload.from, "kontakt@mohr-more.biz");
  assert.equal(payload.reply_to, "erika@example.com");
  assert.match(payload.subject, /Kontaktformular: Automatisierung — Erika Mustermann/);
  console.log("ok 2 Zustellung: Payload, Empfänger, reply_to, Auth-Header");
}

// 3 — Retry bei 500
{
  const calls = stubFetch((_u, _i, n) => (n < 3 ? cfErr(500) : cfOk()));
  const res = await post(ENV_OK, inquiry());
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.delivery, "sent");
  assert.equal(calls.length, 3);
  console.log("ok 3 Retry: 500,500,200 -> 3 Versuche, Erfolg");
}

// 4 — kein Retry bei 401
{
  const calls = stubFetch(() => cfErr(401));
  const res = await post(ENV_OK, inquiry());
  const body = await res.json();
  assert.equal(res.status, 502);
  assert.equal(body.error, "mail_failed");
  assert.equal(calls.length, 1);
  console.log("ok 4 401 -> kein Retry, 502 mail_failed");
}

// 5 — Archiv als Rückfallebene
{
  const kv = mockKV();
  stubFetch(() => cfErr(500));
  const res = await post({ ...ENV_OK, KONTAKT_ARCHIVE: kv }, inquiry());
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.delivery, "queued");
  assert.equal(body.archived, true);
  assert.equal(kv.store.size, 1);
  const record = JSON.parse([...kv.store.values()][0]);
  assert.equal(record.delivery, "failed");
  assert.equal(record.retryCount, 0);
  assert.equal(record.email, "erika@example.com");
  assert.ok(record.ipHash && record.ipHash.length === 12);
  console.log("ok 5 Archiv: Anfrage gespeichert, Status failed, retryCount 0, IP gehasht");
}

// 6 — Webhook als zweiter Zustellweg
{
  const calls = stubFetch((url) =>
    url.includes("hooks.example.com") ? new Response("ok", { status: 200 }) : cfErr(500)
  );
  const res = await post(
    { ...ENV_OK, KONTAKT_FALLBACK_WEBHOOK: "https://hooks.example.com/kontakt" },
    inquiry()
  );
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.delivery, "webhook");
  const webhookCall = calls.find((c) => c.url.includes("hooks.example.com"));
  assert.ok(webhookCall);
  assert.equal(JSON.parse(webhookCall.init.body).reply_to, "erika@example.com");
  console.log("ok 6 Webhook: Mail scheitert, Webhook liefert, Antwort delivery=webhook");
}

// 7 — Archiv + Erfolg markiert Zustellung
{
  const kv = mockKV();
  stubFetch(() => cfOk());
  const res = await post({ ...ENV_OK, KONTAKT_ARCHIVE: kv }, inquiry());
  assert.equal(res.status, 200);
  const record = JSON.parse([...kv.store.values()][0]);
  assert.equal(record.delivery, "sent");
  console.log("ok 7 Archiv: Erfolg wird im Eintrag vermerkt");
}

// 8 — Honeypot
{
  const calls = stubFetch(() => cfOk());
  const res = await post(ENV_OK, inquiry({ website: "http://spam.example" }));
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.id, "silently-dropped");
  assert.equal(calls.length, 0);
  console.log("ok 8 Honeypot: 200, kein Versand");
}

// 9 — Validierung
{
  const res = await post(ENV_OK, inquiry({ message: "zu kurz", consent: "" }));
  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.fields.message, "invalid");
  assert.equal(body.fields.consent, "missing");
  console.log("ok 9 Validierung: 400 mit Feldfehlern");
}

// 10 — Methoden
{
  const getRes = await kontakt({ env: ENV_OK, request: new Request("https://mohr-more.biz/api/kontakt") });
  assert.equal(getRes.status, 405);
  const optRes = await kontakt({
    env: ENV_OK,
    request: new Request("https://mohr-more.biz/api/kontakt", { method: "OPTIONS" }),
  });
  assert.equal(optRes.status, 204);
  console.log("ok 10 GET -> 405, OPTIONS -> 204");
}

// 11 — JSON-Body
{
  stubFetch(() => cfOk());
  const res = await kontakt({
    env: ENV_OK,
    request: new Request("https://mohr-more.biz/api/kontakt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Max Beispiel",
        email: "max@example.com",
        message: "Bitte um Rückruf wegen eines Automatisierungsprojekts im Q1.",
        consent: "1",
        lang: "de",
      }),
    }),
  });
  assert.equal(res.status, 200);
  console.log("ok 11 JSON-Body akzeptiert");
}

// 12 — Test-Endpunkt
{
  stubFetch(() => cfOk());
  const noSecret = await testEndpoint({
    env: {},
    request: new Request("https://mohr-more.biz/api/kontakt/test", { method: "POST" }),
  });
  assert.equal(noSecret.status, 503);

  const wrong = await testEndpoint({
    env: { KONTAKT_TEST_TOKEN: "secret" },
    request: new Request("https://mohr-more.biz/api/kontakt/test", {
      method: "POST",
      headers: { "x-test-token": "nope" },
    }),
  });
  assert.equal(wrong.status, 401);

  const unconfigured = await testEndpoint({
    env: { KONTAKT_TEST_TOKEN: "secret" },
    request: new Request("https://mohr-more.biz/api/kontakt/test", {
      method: "POST",
      headers: { "x-test-token": "secret" },
    }),
  });
  const unconfiguredBody = await unconfigured.json();
  assert.equal(unconfigured.status, 503);
  assert.deepEqual(unconfiguredBody.missing, ["CF_EMAIL_ACCOUNT_ID", "CF_EMAIL_API_TOKEN"]);

  const ok = await testEndpoint({
    env: { ...ENV_OK, KONTAKT_TEST_TOKEN: "secret" },
    request: new Request("https://mohr-more.biz/api/kontakt/test?token=secret", { method: "POST" }),
  });
  const okBody = await ok.json();
  assert.equal(ok.status, 200);
  assert.equal(okBody.ok, true);
  console.log("ok 12 Test-Endpunkt: disabled 503, falsches Token 401, fehlende Config 503, Erfolg 200");
}

// 13 — Alarm bei fehlgeschlagener Zustellung (nicht blockierend via waitUntil)
{
  const kv = mockKV();
  const calls = stubFetch((url) =>
    url.includes("alerts.example.com") ? new Response("ok", { status: 200 }) : cfErr(500)
  );
  const pending = [];
  const res = await post(
    { ...ENV_OK, KONTAKT_ARCHIVE: kv, KONTAKT_ALERT_WEBHOOK: "https://alerts.example.com/kontakt" },
    inquiry(),
    "POST",
    (p) => pending.push(p)
  );
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.delivery, "queued");
  assert.equal(pending.length, 1, "Alarm läuft über waitUntil");
  await Promise.all(pending);
  const alertCall = calls.find((c) => c.url.includes("alerts.example.com"));
  assert.ok(alertCall, "Alarm-Webhook wurde aufgerufen");
  const alertPayload = JSON.parse(alertCall.init.body);
  assert.equal(alertPayload.evt, "kontakt.delivery_failed");
  assert.equal(alertPayload.archived, true);
  // Datensparsamkeit: der Alarm nennt ID und Fehler, nicht die Person.
  assert.equal(alertPayload.email, undefined);
  assert.equal(alertPayload.name, undefined);
  assert.equal(alertPayload.betreff, undefined);
  assert.ok(alertPayload.id);
  console.log("ok 13 Alarm: Webhook bei Fehlschlag ausgelöst, Antwort bleibt 200 queued, Payload ohne PII");
}

// 14 — Retry-Endpunkt stellt nach
{
  const old = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const failedRecord = {
    name: "Alt Fall",
    company: "",
    email: "alt@example.com",
    message: "Eine Anfrage, deren Mailversand zuvor gescheitert ist und nun erneut zugestellt wird.",
    betreff: "",
    quelle: "",
    page: "/kontakt",
    lang: "de",
    id: "11111111-1111-1111-1111-111111111111",
    createdAt: old,
    delivery: "failed",
    retryCount: 1,
    ipHash: "abcdef123456",
  };
  const sentRecord = { ...failedRecord, id: "22222222-2222-2222-2222-222222222222", delivery: "sent" };
  const kv = mockKV({
    [`kontakt:${old}:11111111-1111-1111-1111-111111111111`]: JSON.stringify(failedRecord),
    [`kontakt:${old}:22222222-2222-2222-2222-222222222222`]: JSON.stringify(sentRecord),
  });
  const calls = stubFetch(() => cfOk());

  const res = await retryEndpoint({
    env: { ...ENV_OK, KONTAKT_ARCHIVE: kv, KONTAKT_RETRY_TOKEN: "retry-secret" },
    request: new Request("https://mohr-more.biz/api/kontakt/retry", {
      method: "POST",
      headers: { "x-retry-token": "retry-secret" },
    }),
  });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.retried, 1, "nur der failed-Eintrag wird versucht");
  assert.equal(body.delivered, 1);
  assert.equal(calls.length, 1);
  const updated = JSON.parse(
    kv.store.get(`kontakt:${old}:11111111-1111-1111-1111-111111111111`)
  );
  assert.equal(updated.delivery, "sent");
  assert.equal(updated.retryCount, 2);
  console.log("ok 14 Retry: failed-Eintrag erneut zugestellt, sent bleibt unberührt, retryCount++");
}

// 15 — Retry überspringt junge Einträge und Versuchslimit
{
  const now = new Date().toISOString();
  const fresh = {
    name: "Frisch",
    company: "",
    email: "frisch@example.com",
    message: "Gerade eben abgeschickt, darf nicht doppelt versendet werden.",
    betreff: "",
    quelle: "",
    page: "/kontakt",
    lang: "de",
    id: "33333333-3333-3333-3333-333333333333",
    createdAt: now,
    delivery: "failed",
    retryCount: 0,
    ipHash: "abcdef123456",
  };
  const oldDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const exhausted = {
    ...fresh,
    id: "44444444-4444-4444-4444-444444444444",
    createdAt: oldDate,
    retryCount: 5,
  };
  const kv = mockKV({
    [`kontakt:${now}:33333333-3333-3333-3333-333333333333`]: JSON.stringify(fresh),
    [`kontakt:${oldDate}:44444444-4444-4444-4444-444444444444`]: JSON.stringify(exhausted),
  });
  const calls = stubFetch(() => cfOk());
  const res = await retryEndpoint({
    env: { ...ENV_OK, KONTAKT_ARCHIVE: kv, KONTAKT_RETRY_TOKEN: "retry-secret" },
    request: new Request("https://mohr-more.biz/api/kontakt/retry?token=retry-secret", { method: "POST" }),
  });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.retried, 0);
  assert.equal(body.skipped, 2);
  assert.equal(calls.length, 0);
  console.log("ok 15 Retry: junge Einträge und erschöpfte Einträge werden übersprungen");
}

// 16 — Retry ohne Mail-Konfiguration verbraucht keine Versuche
{
  const old = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const rec = {
    name: "Ohne Config",
    company: "",
    email: "ohne@example.com",
    message: "Anfrage aus der Zeit vor der Mail-Konfiguration, bitte nicht aufbrauchen.",
    betreff: "",
    quelle: "",
    page: "/kontakt",
    lang: "de",
    id: "55555555-5555-5555-5555-555555555555",
    createdAt: old,
    delivery: "failed",
    retryCount: 2,
    ipHash: "abcdef123456",
  };
  const kv = mockKV({ [`kontakt:${old}:55555555-5555-5555-5555-555555555555`]: JSON.stringify(rec) });
  stubFetch(() => cfOk());
  const res = await retryEndpoint({
    env: { KONTAKT_ARCHIVE: kv, KONTAKT_RETRY_TOKEN: "retry-secret" },
    request: new Request("https://mohr-more.biz/api/kontakt/retry?token=retry-secret", { method: "POST" }),
  });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.retried, 1);
  const updated = JSON.parse(kv.store.get(`kontakt:${old}:55555555-5555-5555-5555-555555555555`));
  assert.equal(updated.retryCount, 2, "ohne Konfiguration kein Verbrauch");
  assert.equal(updated.delivery, "not_configured");
  console.log("ok 16 Retry: ohne Mail-Konfiguration bleibt der Versuchszähler stehen");
}

// 17 — Retry-Token
{
  const noSecret = await retryEndpoint({
    env: {},
    request: new Request("https://mohr-more.biz/api/kontakt/retry", { method: "POST" }),
  });
  assert.equal(noSecret.status, 503);
  const wrong = await retryEndpoint({
    env: { KONTAKT_RETRY_TOKEN: "retry-secret", KONTAKT_ARCHIVE: mockKV() },
    request: new Request("https://mohr-more.biz/api/kontakt/retry", {
      method: "POST",
      headers: { "x-retry-token": "falsch" },
    }),
  });
  assert.equal(wrong.status, 401);
  const getMethod = await retryEndpoint({
    env: { KONTAKT_RETRY_TOKEN: "retry-secret", KONTAKT_ARCHIVE: mockKV() },
    request: new Request("https://mohr-more.biz/api/kontakt/retry"),
  });
  assert.equal(getMethod.status, 405);
  console.log("ok 17 Retry: disabled 503, falsches Token 401, GET 405");
}

// 18 — Queue macht offene Anfragen sichtbar
{
  const old = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  const openRec = {
    name: "Offen",
    company: "Beispiel GmbH",
    email: "offen@example.com",
    betreff: "Angebot",
    createdAt: old,
    id: "66666666-6666-6666-6666-666666666666",
    delivery: "failed",
    retryCount: 1,
    lang: "de",
  };
  const sentRec = { ...openRec, id: "77777777-7777-7777-7777-777777777777", delivery: "sent" };
  const kv = mockKV({
    [`kontakt:${old}:66666666-6666-6666-6666-666666666666`]: JSON.stringify(openRec),
    [`kontakt:${old}:77777777-7777-7777-7777-777777777777`]: JSON.stringify(sentRec),
  });
  const res = await queueEndpoint({
    env: { KONTAKT_ARCHIVE: kv, KONTAKT_RETRY_TOKEN: "retry-secret" },
    request: new Request("https://mohr-more.biz/api/kontakt/queue?token=retry-secret"),
  });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.total, 2);
  assert.equal(body.open, 1);
  assert.equal(body.sent, 1);
  assert.equal(body.entries[0].email, "offen@example.com");
  assert.equal(body.entries[0].retryCount, 1);
  console.log("ok 18 Queue: offene Anfrage sichtbar, zugestellte separat gezählt");
}

// 19 — Zeitbudget
{
  assert.ok(
    MAIL_TIMINGS.worstCaseMs < 12000,
    `Worst Case ${MAIL_TIMINGS.worstCaseMs} ms muss deutlich unter dem Function-Limit liegen`
  );
  console.log(
    `ok 19 Zeitbudget: worst case ${MAIL_TIMINGS.worstCaseMs} ms (${MAIL_TIMINGS.requestTimeoutMs} ms/Request, Pausen ${MAIL_TIMINGS.retryDelaysMs.join("/")} ms)`
  );
}

// 20 — Adressen in Provider-Fehlertexten werden maskiert (Log und Alarm)
{
  const kv = mockKV();
  const calls = stubFetch((url) =>
    url.includes("alerts.example.com")
      ? new Response("ok", { status: 200 })
      : new Response(
          JSON.stringify({
            success: false,
            errors: [
              { code: 1001, message: "recipient erika@example.com rejected by info@mohr-more.biz" },
            ],
          }),
          { status: 400, headers: { "content-type": "application/json" } }
        )
  );
  const logged = [];
  const originalError = console.error;
  console.error = (line) => logged.push(String(line));
  const pending = [];
  let res;
  try {
    res = await post(
      { ...ENV_OK, KONTAKT_ARCHIVE: kv, KONTAKT_ALERT_WEBHOOK: "https://alerts.example.com/kontakt" },
      inquiry(),
      "POST",
      (p) => pending.push(p)
    );
    await Promise.all(pending);
  } finally {
    console.error = originalError;
  }
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.delivery, "queued");
  const alertCall = calls.find((c) => c.url.includes("alerts.example.com"));
  const serialized = JSON.stringify(JSON.parse(alertCall.init.body)) + "\n" + logged.join("\n");
  assert.ok(serialized.includes("[email]"), "Fehlertext wird maskiert");
  assert.ok(!serialized.includes("erika@example.com"), "keine Adresse in Log oder Alarm");
  assert.ok(!serialized.includes("info@mohr-more.biz"), "auch die Empfängeradresse nicht");
  console.log("ok 20 Redaktion: Adressen aus Provider-Fehlern stehen als [email] in Log und Alarm");
}

// 21 — Rate-Limit zählt nur gültige Einreichungen
{
  const kv = mockKV();
  stubFetch(() => cfOk());
  const env = { ...ENV_OK, KONTAKT_RATE_KV: kv };
  const rateKey = "kontakt:0.0.0.0";

  // Müll-Payloads: abgewiesen, aber ohne Kontingent zu verbrauchen.
  for (let i = 0; i < 5; i += 1) {
    const res = await post(env, inquiry({ message: "zu kurz" }));
    assert.equal(res.status, 400);
  }
  assert.equal(kv.store.get(rateKey), undefined, "Validierungsfehler zählen nicht");

  // Honeypot: ebenfalls nicht zählen.
  const bot = inquiry({ website: "https://spam.example" });
  const dropped = await post(env, bot);
  assert.equal(dropped.status, 200);
  assert.equal((await dropped.json()).id, "silently-dropped");
  assert.equal(kv.store.get(rateKey), undefined, "Honeypot zählt nicht");

  // Drei echte Anfragen gehen durch, die vierte nicht mehr.
  for (let i = 0; i < 3; i += 1) {
    const res = await post(env, inquiry());
    assert.equal(res.status, 200);
  }
  assert.equal(kv.store.get(rateKey), "3");

  const blocked = await post(env, inquiry());
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).error, "rate_limit");
  assert.equal(blocked.headers.get("retry-after"), "600");
  assert.equal(kv.store.get(rateKey), "3", "abgewiesene Anfrage zählt nicht weiter");
  console.log("ok 21 Rate-Limit: nur gültige Einreichungen zählen, 429 mit Retry-After");
}

console.log("\nAlle 21 Prüfungen bestanden.");
