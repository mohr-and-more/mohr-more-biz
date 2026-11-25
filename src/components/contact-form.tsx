"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { translations, type Lang } from "@/lib/i18n";
import { contactEndpoint } from "@/lib/contact-endpoint";

/**
 * Gemeinsames Kontaktformular für /kontakt (DE) und /en/contact (EN).
 *
 * Eine Implementierung für: Validierung, Submit, Endpunkt-Wechsel
 * (siehe `src/lib/contact-endpoint.ts`), Fehler-/Rate-Limit-Meldungen,
 * mailto-Fallback und Prefill aus ?betreff=/?quelle= (bzw. ?subject=/?source=).
 * Alle sichtbaren Texte kommen aus `translations.contactPage.form`.
 *
 * Markup ausschließlich mit den Klassen aus `src/app/design-system.css`
 * (MMB-469): `.mm-form`, `.mm-form-row`, `.mm-form-input`, `.mm-form-checkbox`,
 * `.mm-btn .mm-btn-primary`, `.mm-card`. Keine eigenen Farben — Layout-Ausnahmen
 * nutzen ausschließlich `--mm-*`-Tokens.
 */

export type ContactIconName = "phone" | "mail" | "calendar" | "send" | "check" | "alert";

export function ContactIcon({ name, size = 22 }: { name: ContactIconName; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "phone":
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "send":
      return (
        <svg {...props}>
          <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "alert":
      return (
        <svg {...props}>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
  }
}

type Status = "idle" | "submitting" | "success" | "error";
type Field = "name" | "email" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;

/** 429: Wartezeit aus dem Retry-After-Header in Minuten, Default 10. */
function rateLimitMessage(template: string, retryAfter: string | null): string {
  const seconds = Number(retryAfter);
  const minutes = Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : 10;
  return template.replace("{minutes}", String(minutes));
}

/**
 * Letzter Ausweg, wenn der Server die Anfrage nicht zustellen und nicht
 * archivieren konnte: vorausgefüllter mailto:-Link, damit nichts verloren geht.
 */
function buildFallbackMailto(fd: FormData, lang: Lang): string {
  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const company = String(fd.get("company") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();
  const body = [
    `Name: ${name}`,
    company ? `Firma: ${company}` : "",
    `E-Mail: ${email}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:info@mohr-more.biz?subject=${encodeURIComponent(
    translations.contactPage.form.mailSubject[lang]
  )}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ lang }: { lang: Lang }) {
  const t = translations.contactPage.form;
  const privacyHref = lang === "de" ? "/datenschutz" : "/en/privacy";

  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fallbackHref, setFallbackHref] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  // Prefill aus ?betreff=/?quelle= (DE) bzw. ?subject=/?source= (EN).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const subject = params.get("betreff") ?? params.get("subject");
    const source = params.get("quelle") ?? params.get("source");
    if (!subject && !source) return;
    const msg = messageRef.current;
    if (!msg) return;
    const resolvedSubject = subject ?? (lang === "en" ? "Inquiry" : "Anfrage");
    const resolvedSource = source ?? window.location.pathname;
    const prefix =
      lang === "en"
        ? `Subject: ${resolvedSubject}\nSource: ${resolvedSource}\n\n`
        : `Betreff: ${resolvedSubject}\nQuelle: ${resolvedSource}\n\n`;
    if (!msg.value.startsWith(prefix.slice(0, 12))) {
      msg.value = prefix + msg.value;
    }
  }, [lang]);

  /** Clientseitige Validierung — der Server validiert zusätzlich. */
  function clientValidate(fd: FormData): Errors | null {
    const next: Errors = {};
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const consent = fd.get("consent");

    if (!name) next.name = t.errorRequired[lang];
    if (!email) next.email = t.errorRequired[lang];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = t.errorEmail[lang];
    if (!message) next.message = t.errorRequired[lang];
    else if (message.length < 20) next.message = t.errorMinLen[lang];
    if (!consent) next.consent = t.errorConsent[lang];

    return Object.keys(next).length > 0 ? next : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const validationErrors = clientValidate(fd);
    if (validationErrors) {
      setErrors(validationErrors);
      setStatus("error");
      setErrorMsg(Object.values(validationErrors)[0] ?? t.errorRequired[lang]);
      setFallbackHref("");
      requestAnimationFrame(() => {
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setErrors({});
    setStatus("submitting");
    setErrorMsg("");
    setFallbackHref("");

    // Betreff/Quelle aus der URL in den Datenstrom übernehmen.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const subject = params.get("betreff") ?? params.get("subject");
      const source = params.get("quelle") ?? params.get("source");
      if (subject) fd.set("betreff", subject);
      if (source) fd.set("quelle", source);
      fd.set("page", window.location.pathname);
    }
    fd.set("lang", lang);

    try {
      const res = await fetch(contactEndpoint(), { method: "POST", body: fd });
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({ error: "unknown" }));
        if (data.error === "rate_limit") {
          // Kein mailto-Ausweg: die Anfrage wurde abgewiesen, nicht verloren —
          // ein zweiter Kanal würde sie nur doppelt senden.
          setStatus("error");
          setErrorMsg(rateLimitMessage(t.errorRateLimit[lang], res.headers.get("retry-after")));
          return;
        }
        setStatus("error");
        setErrorMsg(
          data.error === "mail_failed" || data.error === "mail_not_configured"
            ? t.errorDelivery[lang]
            : data.error === "network"
              ? t.errorNetwork[lang]
              : t.errorGeneric[lang]
        );
        setFallbackHref(buildFallbackMailto(new FormData(form), lang));
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg(t.errorNetwork[lang]);
      setFallbackHref(buildFallbackMailto(new FormData(form), lang));
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mm-card"
        style={{
          display: "flex",
          gap: "var(--mm-space-3)",
          alignItems: "flex-start",
          borderColor: "var(--mm-color-success)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: "40px",
            height: "40px",
            borderRadius: "var(--mm-radius-pill)",
            background: "var(--mm-color-success)",
            color: "var(--mm-color-surface)",
            flexShrink: 0,
          }}
        >
          <ContactIcon name="check" />
        </span>
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>{t.success[lang]}</p>
          <button
            type="button"
            className="mm-btn mm-btn-ghost"
            style={{ marginTop: "var(--mm-space-3)" }}
            onClick={() => setStatus("idle")}
          >
            {t.sendAnother[lang]}
          </button>
        </div>
      </div>
    );
  }

  const invalid = (field: Field) => (errors[field] ? true : undefined);

  return (
    <form
      ref={formRef}
      className="mm-form"
      onSubmit={handleSubmit}
      noValidate
      aria-describedby="contact-form-help"
    >
      <div className="mm-form-row">
        <label htmlFor="contact-name">{t.name[lang]} *</label>
        <input
          id="contact-name"
          className="mm-form-input"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          placeholder={t.namePh[lang]}
          aria-required="true"
          aria-invalid={invalid("name")}
        />
      </div>

      <div className="mm-form-row">
        <label htmlFor="contact-company">{t.company[lang]}</label>
        <input
          id="contact-company"
          className="mm-form-input"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={180}
          placeholder={t.companyPh[lang]}
        />
      </div>

      <div className="mm-form-row">
        <label htmlFor="contact-email">{t.email[lang]} *</label>
        <input
          id="contact-email"
          className="mm-form-input"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={180}
          placeholder={t.emailPh[lang]}
          aria-required="true"
          aria-invalid={invalid("email")}
        />
      </div>

      <div className="mm-form-row">
        <label htmlFor="contact-message">{t.message[lang]} *</label>
        <textarea
          id="contact-message"
          ref={messageRef}
          className="mm-form-input"
          name="message"
          rows={6}
          required
          maxLength={4000}
          placeholder={t.messagePh[lang]}
          aria-required="true"
          aria-invalid={invalid("message")}
          style={{ resize: "vertical", minHeight: "140px" }}
        />
      </div>

      <label className="mm-form-checkbox" htmlFor="contact-consent">
        <input
          id="contact-consent"
          name="consent"
          type="checkbox"
          value="1"
          required
          aria-required="true"
          aria-invalid={invalid("consent")}
        />
        <span>
          {t.consent[lang]}{" "}
          <a href={privacyHref} style={{ color: "var(--mm-color-primary)", textDecoration: "underline" }}>
            {t.consentLink[lang]}
          </a>
        </span>
      </label>

      {status === "error" ? (
        <div
          role="alert"
          style={{
            display: "flex",
            gap: "var(--mm-space-3)",
            padding: "var(--mm-space-3) var(--mm-space-4)",
            borderRadius: "var(--mm-radius-sm)",
            background: "var(--mm-color-surface)",
            border: "1px solid var(--mm-color-danger)",
            color: "var(--mm-color-text)",
          }}
        >
          <span aria-hidden="true" style={{ color: "var(--mm-color-danger)" }}>
            <ContactIcon name="alert" />
          </span>
          <span>
            {errorMsg}{" "}
            {fallbackHref ? (
              <a href={fallbackHref} style={{ color: "var(--mm-color-primary)", textDecoration: "underline" }}>
                {t.fallbackMail[lang]}
              </a>
            ) : null}
          </span>
        </div>
      ) : null}

      {/* Honeypot — fängt Bots ab, ohne die Bedienung zu stören */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          {t.honeypot[lang]}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button
        type="submit"
        className="mm-btn mm-btn-primary"
        disabled={status === "submitting"}
        style={{ justifyContent: "center" }}
      >
        <ContactIcon name="send" />
        {status === "submitting" ? t.submitting[lang] : t.submit[lang]}
      </button>

      <p id="contact-form-help" style={{ fontSize: "var(--mm-text-sm)", color: "var(--mm-color-muted)", margin: 0 }}>
        {t.help[lang]}
      </p>
    </form>
  );
}
