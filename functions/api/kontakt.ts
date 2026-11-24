/**
 * Cloudflare Pages Function — /api/kontakt (MMB-472)
 *
 * Empfängt POST-Submissions vom Kontaktformular auf /kontakt und /en/contact.
 *
 * Erwartetes Format:
 *   multipart/form-data ODER application/x-www-form-urlencoded ODER application/json
 *   Felder:
 *     - name     (string, required, 2..120)
 *     - company  (string, optional, max 180)
 *     - email    (string, required, RFC 5322 Light)
 *     - message  (string, required, min 20, max 4000)
 *     - consent  ("1" wenn Checkbox gesetzt, required)
 *     - betreff  (optional, max 200)  — aus ?betreff= / ?subject= URL-Param
 *     - quelle   (optional, max 200)  — aus ?quelle= / ?source= URL-Param
 *     - page     (optional, max 200)  — window.location.pathname
 *     - lang     ("de" | "en")       — UI-Sprache
 *     - website  (Honeypot, muss leer sein)
 *
 * Zustellung (in dieser Reihenfolge):
 *   1. Vor dem Versand wird die Anfrage — wenn der KV-Bucket `KONTAKT_ARCHIVE`
 *      gebunden ist — 30 Tage lang archiviert. Damit ist sie unabhängig vom
 *      Ausgang des Mailversands gespeichert.
 *   2. Primär: Cloudflare Email Sending (REST, bis zu 3 Versuche).
 *   3. Falls das scheitert: optionaler `KONTAKT_FALLBACK_WEBHOOK`.
 *   4. Scheitert beides, wird ein Alarm über `KONTAKT_ALERT_WEBHOOK` ausgelöst
 *      und der Eintrag bleibt als `failed` im Archiv. Der geplante Lauf von
 *      POST /api/kontakt/retry stellt ihn danach erneut zu; GET
 *      /api/kontakt/queue macht ihn sichtbar.
 *   5. Erst wenn weder Mail noch Webhook zustellen und nichts archiviert werden
 *      konnte, antwortet der Endpunkt mit 502/503 — das Formular bietet dann
 *      einen vorausgefüllten mailto:-Link als letzten Ausweg an.
 *
 * Antworten:
 *   200 OK            — { ok: true, id, delivery: "sent" | "webhook" | "queued", archived }
 *   400 Bad Request   — { error: "validation", fields: { ... } }
 *   405 / OPTIONS     — Preflight bzw. Method Not Allowed
 *   429 Too Many Req  — { error: "rate_limit" } + Retry-After (3 gültige / 10min per IP,
 *                       nur mit KONTAKT_RATE_KV)
 *   502 Bad Gateway   — { error: "mail_failed", retained: false, id }
 *   503 Unavailable   — { error: "mail_not_configured", retained: false, id }
 *
 * DSGVO:
 *   - Zugestellt wird per E-Mail an MOHR & MORE; optionale Archivierung im KV
 *     ist auf 30 Tage begrenzt (Archiv-Eintrag enthält die Anfrage, nicht die IP;
 *     die IP wird nur als 12-stelliger SHA-256-Hash geloggt).
 *   - Server-Logs enthalten ID, Fehler, Zeitpunkt und höchstens die Domain der
 *     Absenderadresse — keinen Namen, keine Adresse, keine Nachricht.
 *     Der Alarm-Webhook bekommt nur ID, Fehler, Zeitpunkt und Zähler; E-Mails
 *     in Fehlertexten werden vorher durch `[email]` ersetzt.
 *   - Der optionale `KONTAKT_FALLBACK_WEBHOOK` ist ein bewusster zweiter
 *     Zustellweg und überträgt den vollen Anfrageinhalt an das dort
 *     konfigurierte Ziel — er gehört deshalb in die Datenschutzerklärung.
 */

import {
  buildInquiryMail,
  mailConfigured,
  missingMailConfig,
  sendAlertWebhook,
  sendViaCloudflareEmail,
  sendViaWebhook,
  type MailEnv,
  type MailResult,
} from "./_mail.ts";
import {
  ARCHIVE_TTL_SECONDS,
  archiveKey,
  type ArchiveKV,
  type ArchiveRecord,
} from "./_archive.ts";

type Env = MailEnv & {
  KONTAKT_RATE_KV?: ArchiveKV;
  /** Optionales KV-Archiv (Binding-Name: KONTAKT_ARCHIVE). */
  KONTAKT_ARCHIVE?: ArchiveKV;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Inquiry = {
  name: string;
  company: string;
  email: string;
  message: string;
  betreff: string;
  quelle: string;
  page: string;
  lang: string;
};

type Validation = {
  ok: boolean;
  fields: Partial<Record<string, string>>;
  data?: Inquiry;
  honeypot?: boolean;
};

function validate(body: FormData | URLSearchParams): Validation {
  const get = (k: string) => (body.get(k) == null ? "" : String(body.get(k)).trim());

  if (get("website")) {
    // Honeypot ausgelöst — Bot vermutet, aber wir antworten trotzdem 200,
    // damit das Script keinen Hinweis bekommt.
    return { ok: true, fields: {}, honeypot: true };
  }

  const fields: Record<string, string> = {};

  const name = get("name");
  if (name.length < 2 || name.length > 120) fields.name = "invalid";

  const email = get("email");
  if (!EMAIL_RE.test(email) || email.length > 180) fields.email = "invalid";

  const message = get("message");
  if (message.length < 20 || message.length > 4000) fields.message = "invalid";

  const consent = get("consent");
  if (consent !== "1") fields.consent = "missing";

  if (Object.keys(fields).length > 0) return { ok: false, fields };

  return {
    ok: true,
    fields: {},
    data: {
      name,
      company: get("company").slice(0, 180),
      email,
      message,
      betreff: get("betreff").slice(0, 200),
      quelle: get("quelle").slice(0, 200),
      page: get("page").slice(0, 200),
      lang: ["de", "en"].includes(get("lang")) ? get("lang") : "de",
    },
  };
}

function jsonResponse(body: unknown, status: number, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(headers ?? {}),
    },
  });
}

/** Drei echte Einreichungen pro 10 Minuten pro IP — nur wenn KV gebunden ist. */
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_SECONDS = 600;

const rateKey = (ip: string) => `kontakt:${ip}`;

/** Nur lesen: Müll-Payloads und Honeypot-Treffer dürfen das Kontingent nicht aufbrauchen. */
async function rateLimitCount(env: Env, ip: string): Promise<number> {
  if (!env.KONTAKT_RATE_KV) return 0;
  return Number((await env.KONTAKT_RATE_KV.get(rateKey(ip))) ?? "0");
}

/** Erst zählen, wenn die Einreichung gültig ist (nach Validierung und Honeypot). */
async function countSubmission(env: Env, ip: string): Promise<void> {
  if (!env.KONTAKT_RATE_KV) return;
  const next = (await rateLimitCount(env, ip)) + 1;
  await env.KONTAKT_RATE_KV.put(rateKey(ip), String(next), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });
}

/**
 * Schreibt die Anfrage vor dem Versand in den KV-Bucket. Gibt zurück, ob sie
 * tatsächlich gespeichert werden konnte — davon hängt ab, ob der Client bei
 * einem Zustellfehler beruhigt werden darf.
 */
async function archiveInquiry(
  env: Env,
  record: ArchiveRecord
): Promise<{ stored: boolean; kv?: ArchiveKV; key: string }> {
  const kv = env.KONTAKT_ARCHIVE;
  const key = archiveKey(record);
  if (!kv) return { stored: false, key };
  try {
    await kv.put(key, JSON.stringify(record), { expirationTtl: ARCHIVE_TTL_SECONDS });
    return { stored: true, kv, key };
  } catch {
    return { stored: false, key };
  }
}

async function markArchive(
  archive: { stored: boolean; kv?: ArchiveKV; key: string },
  record: ArchiveRecord
): Promise<void> {
  if (!archive.stored || !archive.kv) return;
  try {
    await archive.kv.put(archive.key, JSON.stringify(record), {
      expirationTtl: ARCHIVE_TTL_SECONDS,
    });
  } catch {
    // Ein fehlgeschlagenes Update darf die Zustellung nicht kippen.
  }
}

export const onRequest = async (context: {
  env: Env;
  request: Request;
  waitUntil?: (promise: Promise<unknown>) => void;
}) => {
  const request = context.request;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
      },
    });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "POST, OPTIONS", "content-type": "text/plain; charset=utf-8" },
    });
  }
  return handlePost(context.env ?? {}, request, context.waitUntil);
};

async function handlePost(
  env: Env,
  req: Request,
  waitUntil?: (promise: Promise<unknown>) => void
): Promise<Response> {
  // IP aus Headers lesen (Cloudflare setzt CF-Connecting-IP)
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0";

  if ((await rateLimitCount(env, ip)) >= RATE_LIMIT_MAX) {
    return jsonResponse({ error: "rate_limit" }, 429, {
      "retry-after": String(RATE_LIMIT_WINDOW_SECONDS),
    });
  }

  // Body parsen
  let body: FormData | URLSearchParams;
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  try {
    if (ct.includes("application/x-www-form-urlencoded")) {
      body = new URLSearchParams(await req.text());
    } else if (ct.includes("multipart/form-data")) {
      body = await req.formData();
    } else if (ct.includes("application/json")) {
      const obj = JSON.parse(await req.text()) as Record<string, unknown>;
      const usp = new URLSearchParams();
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "string") usp.append(k, v);
        else if (v != null) usp.append(k, String(v));
      }
      body = usp;
    } else {
      body = new URLSearchParams(await req.text());
    }
  } catch {
    return jsonResponse({ error: "validation", fields: { _: "parse" } }, 400);
  }

  const v = validate(body);
  if (!v.ok) return jsonResponse({ error: "validation", fields: v.fields }, 400);
  if (v.honeypot || !v.data) {
    return jsonResponse({ ok: true, id: "silently-dropped" }, 200);
  }

  // Jetzt erst zählen: eine gültige Einreichung, nicht jeder Request davor.
  await countSubmission(env, ip);

  const inquiry = v.data;
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const record: ArchiveRecord = {
    ...inquiry,
    id,
    createdAt,
    delivery: "pending",
    retryCount: 0,
    ipHash: await hashIp(ip),
  };

  // 1. Archivieren, bevor irgendetwas versendet wird.
  const archive = await archiveInquiry(env, record);

  // 2. Mail bauen und zustellen.
  const mail = buildInquiryMail({ ...inquiry, id, createdAt });
  let result: MailResult = await sendViaCloudflareEmail(env, mail);
  let delivery: ArchiveRecord["delivery"] = result.ok
    ? "sent"
    : result.error === "not_configured"
      ? "not_configured"
      : "failed";

  // 3. Zweiter Zustellweg, falls der Mailversand scheitert (opt-in).
  if (!result.ok && (env.KONTAKT_FALLBACK_WEBHOOK || "").trim()) {
    const fallback = await sendViaWebhook(env, mail);
    if (fallback.ok) {
      delivery = "webhook";
      result = fallback;
    }
  }

  record.delivery = delivery;
  record.lastAttemptAt = new Date().toISOString();
  await markArchive(archive, record);

  // 4. Diagnose-Log: nur Metadaten, keine Klartext-Personendaten.
  const log = {
    evt: result.ok ? "kontakt.delivered" : "kontakt.delivery_failed",
    id,
    delivery,
    archived: archive.stored,
    provider: result.provider,
    attempts: result.attempts,
    status: result.status,
    error: result.error,
    detail: redactEmails(result.detail),
    lang: inquiry.lang,
    // Kein Name, keine Adresse, keine Nachricht: davon steht nichts im Log.
    // Die Domain bleibt als einzige Zuordnung — sie zeigt eine Spam-Welle oder
    // einen Kunden mit kaputtem MX, ohne einen Menschen zu identifizieren.
    email_domain: emailDomain(inquiry.email),
    missing_config: mailConfigured(env) ? undefined : missingMailConfig(env),
  };
  if (result.ok) console.log(JSON.stringify(log));
  else console.error(JSON.stringify(log));

  if (!result.ok) {
    // 5. Alarm: eine nicht zugestellte Anfrage darf nicht nur im Archiv liegen.
    const alert = sendAlertWebhook(env, {
      evt: "kontakt.delivery_failed",
      id,
      createdAt,
      delivery,
      archived: archive.stored,
      error: result.error ?? "unknown",
      // Provider-Fehler können eine Adresse im Klartext mitsenden.
      detail: redactEmails(result.detail),
      attempts: result.attempts,
      lang: inquiry.lang,
      // Bewusst ohne Name, Adresse und Nachricht: der Alarm geht an einen
      // externen Kanal (Slack/n8n). Inhalt und Kontaktdaten stehen im Archiv
      // und sind über `GET /api/kontakt/queue` mit Token abrufbar.
      retry_hint: archive.stored ? "POST /api/kontakt/retry stellt die Anfrage erneut zu." : undefined,
      queue_hint: archive.stored ? "Details: GET /api/kontakt/queue mit Token." : undefined,
    }).catch(() => false);
    if (waitUntil) waitUntil(alert);
    else await alert;
  }

  const headers = { "access-control-allow-origin": "*" };

  if (result.ok) {
    return jsonResponse(
      { ok: true, id, delivery, archived: archive.stored },
      200,
      headers
    );
  }

  // Zustellung gescheitert — aber die Anfrage ist gespeichert.
  if (archive.stored) {
    return jsonResponse({ ok: true, id, delivery: "queued", archived: true }, 200, headers);
  }

  // Nichts hat funktioniert: der Client bekommt einen mailto:-Ausweg angeboten.
  const status = delivery === "not_configured" ? 503 : 502;
  return jsonResponse(
    {
      error: delivery === "not_configured" ? "mail_not_configured" : "mail_failed",
      retained: false,
      id,
    },
    status,
    headers
  );
}

/**
 * Ersetzt E-Mail-Adressen in Fehlertexten durch `[email]`. Cloudflare-Fehler
 * können die Empfängeradresse im Klartext mitsenden; die darf weder ins Log
 * noch an den Alarm-Webhook gehen.
 */
function redactEmails(text?: string): string | undefined {
  return text?.replace(/[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+/g, "[email]");
}

/** Nur die Domain der Absenderadresse — Zuordnung ohne Kontaktdaten. */
function emailDomain(email: string): string | undefined {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  return domain || undefined;
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);
}
