#!/usr/bin/env node
/**
 * Führt den Retry-Lauf für archivierte Kontakt-Anfragen aus und meldet einen
 * Fehlschlag an KONTAKT_ALERT_WEBHOOK. Wird von
 * .github/workflows/kontakt-retry.yml aufgerufen, lässt sich aber genauso gut
 * lokal fahren:
 *
 *   RETRY_URL=https://mohr-more.biz/api/kontakt/retry \
 *   RETRY_TOKEN=… ALERT_WEBHOOK=… RUN_URL=… \
 *   node scripts/kontakt-retry-run.mjs
 *
 * Fehlschlag heißt hier: Endpunkt nicht erreichbar, HTTP-Status ungleich 200
 * oder `failed > 0` im Ergebnis (HTTP 200 sagt nichts über die Zustellung).
 * Exit-Code 1 bei Fehlschlag, 0 bei sauberem oder übersprungenem Lauf
 * (kein RETRY_TOKEN).
 *
 * Variablen:
 *   RETRY_URL       Default https://mohr-more.biz/api/kontakt/retry
 *   RETRY_TOKEN     Pages-Variable KONTAKT_RETRY_TOKEN (Pflicht)
 *   ALERT_WEBHOOK   Pages-Variable KONTAKT_ALERT_WEBHOOK (für Alarme)
 *   RUN_URL         Link zum Actions-Lauf, landet im Alarm
 */

const retryUrl = process.env.RETRY_URL || "https://mohr-more.biz/api/kontakt/retry";
const token = (process.env.RETRY_TOKEN || "").trim();
const alertWebhook = (process.env.ALERT_WEBHOOK || "").trim();
const runUrl = process.env.RUN_URL || "";

/** Meldet einen Fehlschlag an den Alarm-Kanal (Slack-taugliches `text` + Felder für n8n). */
async function alert(title, detail) {
  if (!alertWebhook) {
    console.log("::warning::KONTAKT_ALERT_WEBHOOK ist nicht gesetzt — kein Alarm gesendet.");
    return;
  }
  const payload = {
    source: "mohr-more.biz/kontakt-retry",
    evt: "kontakt.retry_run_failed",
    level: "error",
    message: title,
    detail,
    run_url: runUrl,
    text: `Kontakt-Retry fehlgeschlagen: ${title}\n\n${detail}\n\n${runUrl}`,
  };
  try {
    const res = await fetch(alertWebhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    console.log(
      res.ok
        ? "Alarm über KONTAKT_ALERT_WEBHOOK gesendet."
        : `::warning::Alarm-Webhook antwortete HTTP ${res.status}.`
    );
  } catch (error) {
    console.log(`::warning::Alarm-Webhook nicht erreichbar: ${error.message}`);
  }
}

if (!token) {
  console.log("KONTAKT_RETRY_TOKEN ist nicht gesetzt — Lauf übersprungen.");
  process.exit(0);
}

let status = 0;
let text = "";
try {
  const res = await fetch(retryUrl, {
    method: "POST",
    headers: { "x-retry-token": token },
    signal: AbortSignal.timeout(60000),
  });
  status = res.status;
  text = await res.text();
} catch (error) {
  console.error(`Retry-Endpunkt nicht erreichbar: ${error.message}`);
  await alert("Retry-Endpunkt nicht erreichbar", `${error.message} gegen ${retryUrl}`);
  process.exit(1);
}

console.log(text || "<keine Antwort>");

if (status !== 200) {
  await alert(`Retry-Endpunkt antwortete HTTP ${status}`, text || "<keine Antwort>");
  process.exit(1);
}

let body = {};
try {
  body = JSON.parse(text);
} catch {
  body = {};
}
const failed = Number(body?.failed ?? 0);
if (Number.isFinite(failed) && failed > 0) {
  await alert(`${failed} Anfrage(n) konnten nicht nachgeliefert werden`, text);
  process.exit(1);
}

console.log("Retry-Lauf ohne Fehlschlag.");
