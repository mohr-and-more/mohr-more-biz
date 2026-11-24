/**
 * Mailversand für /api/kontakt (Cloudflare Pages Functions).
 *
 * Warum REST statt Binding: Pages Functions unterstützen das `send_email`-
 * Binding der Cloudflare Email Service nicht. Der dokumentierte Weg von einer
 * Pages Function aus ist die REST API:
 *   POST https://api.cloudflare.com/client/v4/accounts/{account_id}/email/sending/send
 *
 * Benötigte Umgebungsvariablen (Cloudflare Pages → Settings → Environment variables):
 *   CF_EMAIL_ACCOUNT_ID        Account-ID (32 Hex-Zeichen)
 *   CF_EMAIL_API_TOKEN         API-Token mit der Berechtigung "Email Sending: Edit"
 *   KONTAKT_TO_EMAIL           Empfänger, Default info@mohr-more.biz
 *   KONTAKT_FROM_EMAIL         Absender auf einer für Email Sending freigeschalteten
 *                              Domain, Default kontakt@mohr-more.biz
 *   KONTAKT_FALLBACK_WEBHOOK   optionaler zweiter Zustellweg (JSON-POST, z. B. n8n/
 *                              Slack-Workflow), falls der Mailversand scheitert
 *   KONTAKT_ALERT_WEBHOOK      optionaler Alarm-Kanal, der bei jeder nicht
 *                              zugestellten Anfrage benachrichtigt
 *
 * Secrets gehören ausschließlich in die Pages-Umgebung, nie in den Code.
 */

export interface MailEnv {
  CF_EMAIL_ACCOUNT_ID?: string;
  CF_EMAIL_API_TOKEN?: string;
  KONTAKT_TO_EMAIL?: string;
  KONTAKT_FROM_EMAIL?: string;
  KONTAKT_FALLBACK_WEBHOOK?: string;
  KONTAKT_ALERT_WEBHOOK?: string;
}

export interface MailMessage {
  subject: string;
  text: string;
  html: string;
  /** Adresse des Anfragenden — Antworten gehen direkt dorthin. */
  replyTo?: string;
}

export interface SendOptions {
  /**
   * Absoluter Zeitpunkt (ms seit Epoch), zu dem der Versand aufgeben muss.
   * Gedacht für Aufrufer mit eigenem Zeitbudget (z. B. den Retry-Lauf), die
   * lieber sauber abbrechen als mitten im Versand abgeschnitten zu werden.
   */
  deadline?: number;
}

export interface MailResult {
  ok: boolean;
  provider: "cloudflare-email" | "webhook";
  id?: string;
  status?: number;
  error?: string;
  detail?: string;
  attempts: number;
}

type FetchLike = typeof fetch;

const CF_API_BASE = "https://api.cloudflare.com/client/v4";
/**
 * Kurze Timeouts: die Summe aus Versuchen und Wartezeiten muss deutlich unter
 * dem Zeitlimit einer Pages Function bleiben. Worst Case hier:
 * 3 × 3,5 s + 0,7 s Wartezeit = 11,2 s (plus optional 3 s Alarm-Webhook).
 */
const REQUEST_TIMEOUT_MS = 3500;
const ALERT_TIMEOUT_MS = 3000;
/** Wartezeiten zwischen den Versuchen (Länge bestimmt die Anzahl der Retries). */
const RETRY_DELAYS_MS = [200, 500];

export const MAIL_TIMINGS = {
  requestTimeoutMs: REQUEST_TIMEOUT_MS,
  retryDelaysMs: RETRY_DELAYS_MS,
  /** Theoretisches Maximum von sendViaCloudflareEmail in Millisekunden. */
  worstCaseMs: REQUEST_TIMEOUT_MS * (RETRY_DELAYS_MS.length + 1) +
    RETRY_DELAYS_MS.reduce((a, b) => a + b, 0),
};

export function mailConfigured(env: MailEnv): boolean {
  return Boolean(
    (env.CF_EMAIL_ACCOUNT_ID || "").trim() && (env.CF_EMAIL_API_TOKEN || "").trim()
  );
}

export function contactRecipient(env: MailEnv): string {
  return (env.KONTAKT_TO_EMAIL || "info@mohr-more.biz").trim();
}

export function contactSender(env: MailEnv): string {
  return (env.KONTAKT_FROM_EMAIL || "kontakt@mohr-more.biz").trim();
}

/** Welche Variablen fehlen für den Mailversand? (für Diagnose im Test-Endpunkt) */
export function missingMailConfig(env: MailEnv): string[] {
  const missing: string[] = [];
  if (!(env.CF_EMAIL_ACCOUNT_ID || "").trim()) missing.push("CF_EMAIL_ACCOUNT_ID");
  if (!(env.CF_EMAIL_API_TOKEN || "").trim()) missing.push("CF_EMAIL_API_TOKEN");
  return missing;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

/** fetch mit hartem Timeout — ein hängender Provider darf die Function nicht blockieren. */
async function fetchWithTimeout(
  fetchImpl: FetchLike,
  url: string,
  init: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function describeCfErrors(body: unknown, status: number): string {
  const data = body as { errors?: Array<{ code?: number; message?: string }> } | null;
  const details = (data?.errors ?? [])
    .map((e) => [e.code, e.message].filter((v) => v !== undefined && v !== null && v !== "").join(" "))
    .filter(Boolean)
    .join("; ");
  return details || `HTTP ${status}`;
}

/**
 * Primärer Zustellweg: Cloudflare Email Sending REST API mit bis zu drei
 * Versuchen. Nur transiente Fehler (429/5xx/Timeout/Netzwerk) werden wiederholt;
 * 4xx-Fehler wie ungültiges Token oder nicht freigeschaltete Domain nicht.
 */
export async function sendViaCloudflareEmail(
  env: MailEnv,
  mail: MailMessage,
  fetchImpl: FetchLike = fetch,
  options: SendOptions = {}
): Promise<MailResult> {
  if (!mailConfigured(env)) {
    return { ok: false, provider: "cloudflare-email", error: "not_configured", attempts: 0 };
  }

  /** Verbleibendes Zeitbudget; ohne Deadline unbegrenzt. */
  const remaining = () =>
    options.deadline === undefined ? Number.POSITIVE_INFINITY : options.deadline - Date.now();
  /** Sauberer Abbruch statt eines vom Lauf abgeschnittenen Requests. */
  const deadlineExceeded = (attempts: number): MailResult => ({
    ok: false,
    provider: "cloudflare-email",
    error: "deadline_exceeded",
    detail: "Zeitbudget des Aufrufers aufgebraucht",
    attempts,
  });

  const accountId = (env.CF_EMAIL_ACCOUNT_ID || "").trim();
  const token = (env.CF_EMAIL_API_TOKEN || "").trim();
  const url = `${CF_API_BASE}/accounts/${accountId}/email/sending/send`;
  const payload: Record<string, unknown> = {
    to: contactRecipient(env),
    from: contactSender(env),
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  };
  if (mail.replyTo) payload.reply_to = mail.replyTo;

  const maxAttempts = RETRY_DELAYS_MS.length + 1;
  let last: MailResult = {
    ok: false,
    provider: "cloudflare-email",
    error: "unknown",
    attempts: 0,
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (remaining() <= 0) return deadlineExceeded(attempt - 1);
    const attemptTimeoutMs = Math.min(REQUEST_TIMEOUT_MS, Math.max(remaining(), 250));
    try {
      const res = await fetchWithTimeout(
        fetchImpl,
        url,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        attemptTimeoutMs
      );

      const raw = await res.text();
      let body: unknown = null;
      try {
        body = raw ? JSON.parse(raw) : null;
      } catch {
        body = null;
      }

      const data = body as {
        success?: boolean;
        result?: { message_id?: string; delivered?: string[]; queued?: string[] };
      } | null;

      if (res.ok && data?.success !== false) {
        return {
          ok: true,
          provider: "cloudflare-email",
          id: data?.result?.message_id,
          status: res.status,
          attempts: attempt,
        };
      }

      last = {
        ok: false,
        provider: "cloudflare-email",
        status: res.status,
        error: "provider_error",
        detail: describeCfErrors(body, res.status),
        attempts: attempt,
      };

      if (!isRetryable(res.status) || attempt === maxAttempts) return last;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      last = {
        ok: false,
        provider: "cloudflare-email",
        error: "network",
        detail,
        attempts: attempt,
      };
      // Der Abbruch kann von der eigenen Deadline stammen (Timeout auf
      // Restzeit) — dann ist das kein Provider-Fehler, sondern ein sauberer
      // Stopp, den der Aufrufer unverändert lassen soll.
      if (remaining() <= 0) return deadlineExceeded(attempt);
      if (attempt === maxAttempts) return last;
    }

    const delay = RETRY_DELAYS_MS[attempt - 1];
    if (remaining() <= delay) return deadlineExceeded(attempt);
    await sleep(delay);
  }

  return last;
}

/**
 * Zweiter Zustellweg: generischer JSON-Webhook (optional). Ein einzelner
 * Versuch mit kurzem Timeout — er ist die Rückfallebene, nicht der Regelweg.
 */
export async function sendViaWebhook(
  env: MailEnv,
  mail: MailMessage,
  fetchImpl: FetchLike = fetch
): Promise<MailResult> {
  const url = (env.KONTAKT_FALLBACK_WEBHOOK || "").trim();
  if (!url) {
    return { ok: false, provider: "webhook", error: "not_configured", attempts: 0 };
  }

  try {
    const res = await fetchWithTimeout(
      fetchImpl,
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "mohr-more.biz/api/kontakt",
          to: contactRecipient(env),
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
          reply_to: mail.replyTo,
        }),
      },
      2500
    );

    if (res.ok) {
      return { ok: true, provider: "webhook", status: res.status, attempts: 1 };
    }

    return {
      ok: false,
      provider: "webhook",
      status: res.status,
      error: "webhook_error",
      detail: `HTTP ${res.status}`,
      attempts: 1,
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, provider: "webhook", error: "network", detail, attempts: 1 };
  }
}

/**
 * Alarm-Kanal: benachrichtigt einen externen Webhook, wenn eine Anfrage nicht
 * zugestellt werden konnte. Damit wird ein Ausfall sichtbar, statt nur im
 * KV-Archiv zu liegen. Fehler hier dürfen den Request nie beeinflussen.
 */
export async function sendAlertWebhook(
  env: MailEnv,
  payload: Record<string, unknown>,
  fetchImpl: FetchLike = fetch
): Promise<boolean> {
  const url = (env.KONTAKT_ALERT_WEBHOOK || "").trim();
  if (!url) return false;
  try {
    const res = await fetchWithTimeout(
      fetchImpl,
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "mohr-more.biz/api/kontakt", ...payload }),
      },
      ALERT_TIMEOUT_MS
    );
    return res.ok;
  } catch {
    return false;
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface InquiryData {
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
}

/** Baut Betreff, Text- und HTML-Fassung der Benachrichtigung. */
export function buildInquiryMail(data: InquiryData): MailMessage {
  const isEnglish = data.lang === "en";
  const subjectCore = data.betreff || (isEnglish ? "Contact inquiry" : "Kontaktanfrage");
  const subject = `${isEnglish ? "Contact form" : "Kontaktformular"}: ${subjectCore} — ${data.name}`;

  const rows: Array<[string, string]> = [
    [isEnglish ? "Name" : "Name", data.name],
    [isEnglish ? "Company" : "Firma", data.company || "—"],
    [isEnglish ? "Email" : "E-Mail", data.email],
    [isEnglish ? "Subject" : "Betreff", data.betreff || "—"],
    [isEnglish ? "Source" : "Quelle", data.quelle || "—"],
    [isEnglish ? "Page" : "Seite", data.page || "—"],
    [isEnglish ? "Language" : "Sprache", data.lang],
    [isEnglish ? "Received" : "Eingegangen", data.createdAt],
    ["ID", data.id],
  ];

  const text = [
    isEnglish ? "New contact form submission" : "Neue Kontaktanfrage über das Formular",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    isEnglish ? "Message:" : "Nachricht:",
    "----------------------------------------",
    data.message,
    "----------------------------------------",
  ].join("\n");

  const html = `<!doctype html>
<html lang="${isEnglish ? "en" : "de"}">
  <body style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.55;color:#111">
    <h2 style="margin:0 0 12px">${isEnglish ? "New contact form submission" : "Neue Kontaktanfrage"}</h2>
    <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><th align="left" style="padding:2px 12px 2px 0;color:#555;font-weight:600">${escapeHtml(
              label
            )}</th><td style="padding:2px 0">${escapeHtml(value)}</td></tr>`
        )
        .join("\n      ")}
    </table>
    <h3 style="margin:20px 0 8px;font-size:15px">${isEnglish ? "Message" : "Nachricht"}</h3>
    <pre style="white-space:pre-wrap;font-family:inherit;background:#f4f4f5;padding:12px;border-radius:8px;margin:0">${escapeHtml(
      data.message
    )}</pre>
  </body>
</html>`;

  return { subject, text, html, replyTo: data.email };
}
