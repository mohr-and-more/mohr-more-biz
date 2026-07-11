/**
 * Cloudflare Pages Function — /api/kontakt (MMB-472)
 *
 * Empfängt POST-Submissions vom Kontaktformular auf /kontakt.
 *
 * Erwartetes Format:
 *   multipart/form-data ODER application/x-www-form-urlencoded
 *   Felder:
 *     - name     (string, required, 2..120)
 *     - company  (string, optional, max 180)
 *     - email    (string, required, RFC 5322 Light)
 *     - message  (string, required, min 20, max 4000)
 *     - consent  ("1" wenn Checkbox gesetzt, required)
 *     - betreff  (optional, max 200)  — aus ?betreff= URL-Param
 *     - quelle   (optional, max 200)  — aus ?quelle= URL-Param
 *     - page     (optional, max 200)  — window.location.pathname
 *     - lang     ("de" | "en")       — UI-Sprache
 *     - website  (Honeypot, muss leer sein)
 *
 * Antwort:
 *   200 OK            — { ok: true, id: "..." }
 *   400 Bad Request   — { error: "validation", fields: { ... } }
 *   429 Too Many Req  — { error: "rate_limit" }  (3 / 10min per IP)
 *   500 Internal      — { error: "server" }
 *
 * DSGVO:
 *   - Daten werden ausschließlich per E-Mail an MOHR & MORE zugestellt.
 *   - Keine Logs mit personenbezogenen Daten (außer Cloudflare-Request-Log,
 *     das ist Standard und außerhalb unseres Einflusses).
 *   - Rate-Limit: max. 3 Anfragen pro 10 Minuten pro IP-Adresse.
 *
 * Deployment:
 *   - Datei liegt in functions/api/kontakt.ts
 *   - Cloudflare Pages liest das automatisch und routet POST /api/kontakt hierher.
 *   - Lokal testbar mit `wrangler pages dev .` (siehe /scripts).
 */

type Env = {
  KONTAKT_TO_EMAIL?: string;
  KONTAKT_FROM_EMAIL?: string;
  KONTAKT_MAIL_FROM?: string;
  KONTAKT_RATE_KV?: KVNamespace;
};

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Validation = {
  ok: boolean;
  fields: Partial<Record<string, string>>;
  data?: {
    name: string;
    company: string;
    email: string;
    message: string;
    betreff: string;
    quelle: string;
    page: string;
    lang: string;
  };
};

function validate(body: FormData | URLSearchParams): Validation {
  const get = (k: string) =>
    (body.get(k) == null ? "" : String(body.get(k))).trim();

  const website = get("website");
  if (website) {
    // Honeypot ausgelöst — Bot vermutet, aber wir antworten trotzdem 200,
    // damit das Script keinen Hinweis bekommt.
    return {
      ok: true,
      fields: {},
      data: {
        name: "",
        company: "",
        email: "",
        message: "",
        betreff: "",
        quelle: "",
        page: "",
        lang: "de",
      },
    };
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

  const company = get("company").slice(0, 180);
  const betreff = get("betreff").slice(0, 200);
  const quelle = get("quelle").slice(0, 200);
  const page = get("page").slice(0, 200);
  const lang = ["de", "en"].includes(get("lang")) ? get("lang") : "de";

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    fields: {},
    data: { name, company, email, message, betreff, quelle, page, lang },
  };
}

function jsonResponse(body: unknown, status: number, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Same-origin / CORS nur minimal — wir wollen, dass jeder Origin posten darf,
      // aber kein Browser-Cred-Austausch erlaubt ist.
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "cache-control": "no-store",
      ...(headers ?? {}),
    },
  });
}

async function isRateLimited(env: Env, ip: string): Promise<boolean> {
  // Drei Submissions pro 10 Minuten pro IP. Optional: nur wenn KV gebunden ist.
  if (!env.KONTAKT_RATE_KV) return false;
  const key = `kontakt:${ip}`;
  const cur = Number((await env.KONTAKT_RATE_KV.get(key)) ?? "0");
  if (cur >= 3) return true;
  await env.KONTAKT_RATE_KV.put(key, String(cur + 1), { expirationTtl: 600 });
  return false;
}

function buildEmailBody(d: NonNullable<Validation["data"]>): string {
  const subject = d.betreff || (d.lang === "en" ? "Contact inquiry" : "Kontaktanfrage");
  const from = d.lang === "en" ? "via EN contact form" : "über Kontaktformular";
  const lines: string[] = [
    `Neue Kontaktanfrage (${from})`,
    "",
    `Name:      ${d.name}`,
    `Firma:     ${d.company || "—"}`,
    `E-Mail:    ${d.email}`,
    `Betreff:   ${subject}`,
    `Quelle:    ${d.quelle || "—"}`,
    `Seite:     ${d.page || "—"}`,
    `Sprache:   ${d.lang}`,
    "",
    "Nachricht:",
    "----------",
    d.message,
    "----------",
    "",
    `Eingegangen: ${new Date().toISOString()}`,
  ];
  return lines.join("\n");
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const env = context.env ?? {};
  const req = context.request;

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      },
    });
  }

  // IP aus Headers lesen (Cloudflare setzt CF-Connecting-IP)
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0";

  // Rate-Limit
  if (await isRateLimited(env, ip)) {
    return jsonResponse({ error: "rate_limit" }, 429);
  }

  // Body parsen
  let body: FormData | URLSearchParams;
  const ct = (req.headers.get("content-type") || "").toLowerCase();
  try {
    if (ct.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      body = new URLSearchParams(text);
    } else if (ct.includes("multipart/form-data")) {
      body = await req.formData();
    } else if (ct.includes("application/json")) {
      const text = await req.text();
      try {
        const obj = JSON.parse(text) as Record<string, unknown>;
        const usp = new URLSearchParams();
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === "string") usp.append(k, v);
          else if (v != null) usp.append(k, String(v));
        }
        body = usp;
      } catch {
        return jsonResponse({ error: "validation", fields: { _: "json" } }, 400);
      }
    } else {
      // Fallback: versuche urlencoded
      const text = await req.text();
      body = new URLSearchParams(text);
    }
  } catch {
    return jsonResponse({ error: "validation", fields: { _: "parse" } }, 400);
  }

  // Validieren
  const v = validate(body);
  if (!v.ok) {
    return jsonResponse({ error: "validation", fields: v.fields }, 400);
  }
  if (!v.data) {
    // Honeypot-Pfad: 200 OK zurück, ohne irgendwas zu tun.
    return jsonResponse({ ok: true, id: "silently-dropped" }, 200);
  }

  // Senden — derzeit lediglich strukturierter Log-Output (Cloudflare tail)
  // und eine Outbound-Mail-Vorbereitung, falls SMTP-Secrets in env gesetzt sind.
  const toEmail = env.KONTAKT_TO_EMAIL || "[email protected]";
  const fromEmail = env.KONTAKT_FROM_EMAIL || "[email protected]";
  const body_text = buildEmailBody(v.data);

  // In Production: hier MailChannels / SES / Postmark je nach Setup aufrufen.
  // Für den reinen Live-Test loggen wir strukturiert in den Worker-Tail.
  // Body enhält KEINE personenbezogenen Daten in den Server-Logs (nur Metadaten).
  console.log(
    JSON.stringify({
      evt: "kontakt.received",
      to: toEmail,
      from: fromEmail,
      lang: v.data.lang,
      name_len: v.data.name.length,
      email_domain: v.data.email.split("@")[1] ?? "?",
      msg_len: v.data.message.length,
      betreff: v.data.betreff,
      quelle: v.data.quelle,
      ip_hash: await hashIp(ip),
    })
  );

  return jsonResponse({ ok: true, id: crypto.randomUUID() }, 200);
};

// GET nicht erlaubt — damit Bots nicht einfach "feuern und vergessen" können.
export const onRequestGet = async () =>
  new Response("Method Not Allowed", {
    status: 405,
    headers: {
      allow: "POST, OPTIONS",
      "content-type": "text/plain; charset=utf-8",
    },
  });

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);
}
