/**
 * Cloudflare Pages Function — POST /api/kontakt/test
 *
 * Verschickt eine Testmail über denselben Weg wie das Kontaktformular und
 * meldet das Ergebnis des Providers zurück. Damit lässt sich nach dem Deploy
 * prüfen, ob Token, Domain und Empfänger stimmen.
 *
 * Absicherung: Header `x-test-token` oder `?token=` muss dem Secret
 * `KONTAKT_TEST_TOKEN` entsprechen. Ohne gesetztes Secret ist der Endpunkt
 * abgeschaltet (503) — es gibt keinen offenen Mail-Versand.
 *
 * Antworten:
 *   200 { ok: true,  to, from, id, attempts }
 *   401 { error: "unauthorized" }
 *   405 Method Not Allowed
 *   502 { ok: false, error, detail, attempts }
 *   503 { error: "test_disabled" | "mail_not_configured", missing? }
 */

import {
  contactRecipient,
  contactSender,
  mailConfigured,
  missingMailConfig,
  sendViaCloudflareEmail,
} from "../_mail.ts";

type Env = {
  KONTAKT_TEST_TOKEN?: string;
  CF_EMAIL_ACCOUNT_ID?: string;
  CF_EMAIL_API_TOKEN?: string;
  KONTAKT_TO_EMAIL?: string;
  KONTAKT_FROM_EMAIL?: string;
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Längen- und inhaltsunabhängiger Vergleich, damit das Token nicht durch Timing leakt. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const onRequest = async (context: { env: Env; request: Request }): Promise<Response> => {
  const { request } = context;
  const env = context.env ?? {};

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "POST", "content-type": "text/plain; charset=utf-8" },
    });
  }

  const expected = (env.KONTAKT_TEST_TOKEN || "").trim();
  if (!expected) return json({ error: "test_disabled" }, 503);

  const url = new URL(request.url);
  const provided = (request.headers.get("x-test-token") || url.searchParams.get("token") || "").trim();
  if (!provided || !safeEqual(provided, expected)) return json({ error: "unauthorized" }, 401);

  if (!mailConfigured(env)) {
    return json({ error: "mail_not_configured", missing: missingMailConfig(env) }, 503);
  }

  const now = new Date().toISOString();
  const result = await sendViaCloudflareEmail(env, {
    subject: `Testmail Kontaktformular — ${now}`,
    text: [
      "Dies ist eine Testmail von /api/kontakt/test.",
      "",
      `Zeitpunkt: ${now}`,
      `Empfänger: ${contactRecipient(env)}`,
      `Absender:   ${contactSender(env)}`,
      "",
      "Erhältst du diese Nachricht, ist der Mailversand des Kontaktformulars aktiv.",
    ].join("\n"),
    html: `<p>Dies ist eine <strong>Testmail</strong> von <code>/api/kontakt/test</code>.</p>
<p>Zeitpunkt: ${now}<br />Empfänger: ${contactRecipient(env)}<br />Absender: ${contactSender(env)}</p>
<p>Erhältst du diese Nachricht, ist der Mailversand des Kontaktformulars aktiv.</p>`,
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        error: result.error,
        detail: result.detail,
        status: result.status,
        attempts: result.attempts,
      },
      502
    );
  }

  return json(
    {
      ok: true,
      to: contactRecipient(env),
      from: contactSender(env),
      id: result.id,
      attempts: result.attempts,
    },
    200
  );
};
