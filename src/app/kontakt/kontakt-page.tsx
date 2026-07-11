"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";

/**
 * /kontakt (DE) — MMB-472
 *
 * Volle Konversion:
 * 1. Drei Kontakt-Cards oben (Anrufen, E-Mail, Termin)
 * 2. Formular: 4 Felder (Name, Firma, E-Mail, Nachricht) + DSGVO-Checkbox
 * 3. Google Maps eingebettet (lazy, mit title)
 * 4. Adresse + Öffnungszeiten ausgeschrieben
 * 5. Mehrwege-Kontaktblock (Telefon, E-Mail, Adresse als klickbare Links)
 * 6. Erfolgsmeldung + Validierung client- und serverseitig
 * 7. JS: ?betreff= und ?quelle= Parameter vorausfüllen
 *
 * Server-Endpoint: POST /api/kontakt
 * Felder werden als FormData übertragen (kein JSON, damit die Cloudflare-
 * Pages-Function ohne weiteres Framework auskommt).
 */

type IconProps = { name: "phone" | "mail" | "calendar" | "send" | "check" | "alert"; size?: number };

function Icon({ name, size = 22 }: IconProps) {
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

type Status = "idle" | "submitting" | "success" | "error" | "validation";

export function KontaktPage() {
  const { lang } = useLang();
  const t = translations.contactPage;

  // Form-Refs (für direkten DOM-Zugriff ohne Re-Render auf jedem Tastendruck)
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Status-State
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Prefill via ?betreff= und ?quelle=
  // (Plan-Punkt 18: Kontakt-Links tragen diese Parameter)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const betreff = params.get("betreff");
    const quelle = params.get("quelle");
    if (!betreff && !quelle) return;
    const msg = messageRef.current;
    if (!msg) return;
    const subject = betreff ? betreff : (lang === "en" ? "Inquiry" : "Anfrage");
    const source = quelle ? quelle : window.location.pathname;
    const prefix =
      lang === "en"
        ? `Subject: ${subject}\nSource: ${source}\n\n`
        : `Betreff: ${subject}\nQuelle: ${source}\n\n`;
    if (!msg.value.startsWith(prefix.slice(0, 12))) {
      msg.value = prefix + msg.value;
    }
  }, [lang]);

  // Clientseitige Validierung — läuft synchron vor dem Submit.
  // Serverseitig validiert /api/kontakt nochmal (Defense-in-Depth).
  function clientValidate(form: HTMLFormElement): string | null {
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const consent = fd.get("consent");

    if (!name || !email || !message) {
      return t.form.errorRequired[lang];
    }
    // RFC 5322 Light: muss @ und . enthalten, mind. 5 Zeichen lokal + 2 Zeichen Domain
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return t.form.errorEmail[lang];
    }
    if (message.length < 20) {
      return t.form.errorMinLen[lang];
    }
    if (!consent) {
      return t.form.errorConsent[lang];
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const validationError = clientValidate(form);
    if (validationError) {
      setStatus("validation");
      setErrorMsg(validationError);
      // Zum ersten Fehler fokussieren
      const firstInvalid = form.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const fd = new FormData(form);
      // Quelle & Betreff in Datenstrom übernehmen (auch wenn sie nicht im DOM stehen)
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const betreff = params.get("betreff");
        const quelle = params.get("quelle");
        if (betreff) fd.set("betreff", betreff);
        if (quelle) fd.set("quelle", quelle);
        fd.set("page", window.location.pathname);
        fd.set("lang", lang);
      }
      const res = await fetch("/api/kontakt", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const data: { error?: string } = await res
          .json()
          .catch(() => ({ error: "unknown" }));
        setStatus("error");
        setErrorMsg(
          data.error === "network"
            ? t.form.errorNetwork[lang]
            : t.form.errorGeneric[lang]
        );
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg(t.form.errorNetwork[lang]);
    }
  }

  return (
    <main>
      {/* Skip-Link für Tastatur-Nutzer (Plan-Punkt 14) */}
      <a href="#main" className="mm-skip-link">
        {lang === "en" ? "Skip to content" : "Zum Hauptinhalt springen"}
      </a>

      {/* Hero */}
      <section className="mm-hero" aria-labelledby="kontakt-hero-title">
        <div className="mm-container" id="main">
          <div className="mm-hero-text">
            <span className="mm-tag">{t.pageLabel[lang]}</span>
            <h1 id="kontakt-hero-title">{t.hero.title[lang]}</h1>
            <p>{t.hero.intro[lang]}</p>
          </div>
        </div>
      </section>

      {/* Drei Kontakt-Cards oben */}
      <section
        className="mm-section"
        aria-label={lang === "en" ? "Contact channels" : "Kontaktwege"}
      >
        <div className="mm-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--mm-space-5)",
            }}
          >
            {/* Card 1: Anrufen */}
            <article
              className="mm-card"
              style={{ display: "flex", flexDirection: "column", gap: "var(--mm-space-3)" }}
            >
              <header style={{ display: "flex", alignItems: "center", gap: "var(--mm-space-3)" }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-grid",
                    placeItems: "center",
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--mm-radius-md)",
                    background: "var(--mm-color-background)",
                    color: "var(--mm-color-primary)",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="phone" />
                </span>
                <span className="mm-tag">{t.cards.callLabel[lang]}</span>
              </header>
              <h3 style={{ margin: 0 }}>{t.cards.callTitle[lang]}</h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--mm-color-muted)",
                  fontSize: "var(--mm-text-sm)",
                  flexGrow: 1,
                }}
              >
                {t.cards.callText[lang]}
              </p>
              <a
                href={`tel:${t.multiChannel.phone[lang].replace(/\s/g, "")}`}
                className="mm-btn mm-btn-primary"
                style={{
                  minHeight: "48px",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
                aria-label={`${t.cards.callTitle[lang]}: ${t.multiChannel.phone[lang]}`}
              >
                {t.multiChannel.phone[lang]}
              </a>
            </article>

            {/* Card 2: E-Mail */}
            <article
              className="mm-card"
              style={{ display: "flex", flexDirection: "column", gap: "var(--mm-space-3)" }}
            >
              <header style={{ display: "flex", alignItems: "center", gap: "var(--mm-space-3)" }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-grid",
                    placeItems: "center",
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--mm-radius-md)",
                    background: "var(--mm-color-background)",
                    color: "var(--mm-color-primary)",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="mail" />
                </span>
                <span className="mm-tag">{t.cards.emailLabel[lang]}</span>
              </header>
              <h3 style={{ margin: 0 }}>{t.cards.emailTitle[lang]}</h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--mm-color-muted)",
                  fontSize: "var(--mm-text-sm)",
                  flexGrow: 1,
                }}
              >
                {t.cards.emailText[lang]}
              </p>
              <a
                href={`mailto:${t.multiChannel.email[lang]}?betreff=${encodeURIComponent(
                  lang === "en" ? "Inquiry via Contact Page" : "Anfrage via Kontaktseite"
                )}&quelle=kontakt`}
                className="mm-btn mm-btn-primary"
                style={{
                  minHeight: "48px",
                  justifyContent: "center",
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                {t.multiChannel.email[lang]}
              </a>
            </article>

            {/* Card 3: Termin */}
            <article
              className="mm-card"
              style={{ display: "flex", flexDirection: "column", gap: "var(--mm-space-3)" }}
            >
              <header style={{ display: "flex", alignItems: "center", gap: "var(--mm-space-3)" }}>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-grid",
                    placeItems: "center",
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--mm-radius-md)",
                    background: "var(--mm-color-background)",
                    color: "var(--mm-color-primary)",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="calendar" />
                </span>
                <span className="mm-tag">{t.cards.bookLabel[lang]}</span>
              </header>
              <h3 style={{ margin: 0 }}>{t.cards.bookTitle[lang]}</h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--mm-color-muted)",
                  fontSize: "var(--mm-text-sm)",
                  flexGrow: 1,
                }}
              >
                {t.cards.bookText[lang]}
              </p>
              <a
                href="/dashboard?booking=1"
                className="mm-btn mm-btn-secondary"
                style={{ minHeight: "48px", justifyContent: "center", textDecoration: "none" }}
              >
                {t.cards.cta[lang]} →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Formular + Adresse/Map */}
      <section
        className="mm-section mm-section--tight"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="kontakt-form-title"
      >
        <div className="mm-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "var(--mm-space-8)",
            }}
            className="kontakt-grid"
          >
            {/* Formular */}
            <div>
              <header style={{ marginBottom: "var(--mm-space-6)" }}>
                <span className="mm-tag">MMB-472</span>
                <h2 id="kontakt-form-title" style={{ marginTop: "var(--mm-space-3)" }}>
                  {t.form.title[lang]}
                </h2>
                <p style={{ color: "var(--mm-color-muted)", margin: "var(--mm-space-2) 0 0" }}>
                  {t.form.subtitle[lang]}
                </p>
              </header>

              {status === "success" ? (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    padding: "var(--mm-space-6)",
                    borderRadius: "var(--mm-radius-md)",
                    background: "var(--mm-color-surface)",
                    border: "1px solid var(--mm-color-border)",
                    display: "flex",
                    gap: "var(--mm-space-3)",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-grid",
                      placeItems: "center",
                      width: "40px",
                      height: "40px",
                      borderRadius: "999px",
                      background: "var(--mm-color-primary)",
                      color: "var(--mm-color-surface)",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="check" />
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{t.form.success[lang]}</p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mm-btn mm-btn-ghost"
                      style={{ marginTop: "var(--mm-space-3)" }}
                    >
                      {lang === "en" ? "Send another message" : "Weitere Nachricht senden"}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  ref={formRef}
                  className="mm-form"
                  onSubmit={handleSubmit}
                  noValidate
                  aria-describedby="kontakt-form-help"
                >
                  {/* Name */}
                  <div className="mm-form-row">
                    <label htmlFor="k-name">{t.form.name[lang]} *</label>
                    <input
                      id="k-name"
                      className="mm-form-input"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={120}
                      placeholder={t.form.namePh[lang]}
                      aria-required="true"
                    />
                  </div>

                  {/* Firma */}
                  <div className="mm-form-row">
                    <label htmlFor="k-company">{t.form.company[lang]}</label>
                    <input
                      id="k-company"
                      className="mm-form-input"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      maxLength={180}
                      placeholder={t.form.companyPh[lang]}
                    />
                  </div>

                  {/* E-Mail */}
                  <div className="mm-form-row">
                    <label htmlFor="k-email">{t.form.email[lang]} *</label>
                    <input
                      id="k-email"
                      className="mm-form-input"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      maxLength={180}
                      placeholder={t.form.emailPh[lang]}
                      aria-required="true"
                    />
                  </div>

                  {/* Nachricht */}
                  <div className="mm-form-row">
                    <label htmlFor="k-message">{t.form.message[lang]} *</label>
                    <textarea
                      id="k-message"
                      ref={messageRef}
                      className="mm-form-input"
                      name="message"
                      rows={6}
                      required
                      maxLength={4000}
                      placeholder={t.form.messagePh[lang]}
                      aria-required="true"
                      style={{ resize: "vertical", minHeight: "140px" }}
                    />
                  </div>

                  {/* DSGVO-Checkbox */}
                  <div className="mm-form-checkbox">
                    <input
                      id="k-consent"
                      name="consent"
                      type="checkbox"
                      value="1"
                      required
                      aria-required="true"
                    />
                    <label htmlFor="k-consent">
                      {t.form.consent[lang]}{" "}
                      <a
                        href="/datenschutz"
                        style={{ color: "var(--mm-color-primary)", textDecoration: "underline" }}
                      >
                        {t.form.consentLink[lang]}
                      </a>
                    </label>
                  </div>

                  {/* Status- / Fehlermeldungen */}
                  {status === "validation" || status === "error" ? (
                    <div
                      role="alert"
                      style={{
                        display: "flex",
                        gap: "var(--mm-space-3)",
                        padding: "var(--mm-space-3) var(--mm-space-4)",
                        borderRadius: "var(--mm-radius-sm)",
                        background: "rgba(233, 122, 43, 0.08)",
                        border: "1px solid rgba(233, 122, 43, 0.45)",
                        color: "var(--mm-color-text)",
                      }}
                    >
                      <span aria-hidden="true" style={{ color: "var(--mm-color-accent)" }}>
                        <Icon name="alert" />
                      </span>
                      <span>{errorMsg}</span>
                    </div>
                  ) : null}

                  {/* Honeypot — fängt Bots ab, ohne UX zu stören */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    <label>
                      Bitte leer lassen
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        defaultValue=""
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mm-btn mm-btn-primary"
                    disabled={status === "submitting"}
                    style={{ minHeight: "48px", justifyContent: "center" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--mm-space-2)" }}>
                      <Icon name="send" />
                      {status === "submitting"
                        ? t.form.submitting[lang]
                        : t.form.submit[lang]}
                    </span>
                  </button>

                  <p
                    id="kontakt-form-help"
                    style={{
                      fontSize: "var(--mm-text-sm)",
                      color: "var(--mm-color-muted)",
                      margin: 0,
                    }}
                  >
                    *
                    {lang === "en"
                      ? " Required fields. Data sent over HTTPS to /api/kontakt."
                      : " Pflichtfelder. Daten werden verschlüsselt (HTTPS) an /api/kontakt übertragen."}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Adresse + Öffnungszeiten + Google Maps */}
      <section
        className="mm-section"
        aria-labelledby="kontakt-address-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-6)" }}>
            <span className="mm-tag">{t.address.block[lang]}</span>
            <h2 id="kontakt-address-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.address.title[lang]}
            </h2>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(280px, 1fr) 2fr",
              gap: "var(--mm-space-8)",
              alignItems: "start",
            }}
            className="kontakt-map-grid"
          >
            {/* Adress-Block */}
            <address
              style={{
                fontStyle: "normal",
                display: "grid",
                gap: "var(--mm-space-3)",
                fontSize: "var(--mm-text-base)",
              }}
            >
              <div>
                <strong style={{ display: "block", marginBottom: "var(--mm-space-1)" }}>
                  MOHR & MORE
                </strong>
                <div>{t.address.street[lang]}</div>
                <div>{t.address.postalCity[lang]}</div>
              </div>

              <div>
                <strong style={{ display: "block" }}>{t.address.hoursLabel[lang]}</strong>
                <span style={{ color: "var(--mm-color-muted)" }}>
                  {t.address.hoursText[lang]}
                </span>
              </div>

              <div>
                <strong style={{ display: "block" }}>{t.address.phoneLabel[lang]}</strong>
                <a
                  href={`tel:${t.multiChannel.phone[lang].replace(/\s/g, "")}`}
                  style={{
                    color: "var(--mm-color-primary)",
                    textDecoration: "none",
                  }}
                >
                  {t.multiChannel.phone[lang]}
                </a>
              </div>

              <div>
                <strong style={{ display: "block" }}>{t.address.emailLabel[lang]}</strong>
                <a
                  href={`mailto:${t.multiChannel.email[lang]}`}
                  style={{ color: "var(--mm-color-primary)", textDecoration: "none" }}
                >
                  {t.multiChannel.email[lang]}
                </a>
              </div>
            </address>

            {/* Google Maps Embed (lazy, mit title) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: "var(--mm-radius-md)",
                overflow: "hidden",
                background: "var(--mm-color-background)",
                border: "1px solid var(--mm-color-border)",
              }}
            >
              <iframe
                title={t.address.mapTitle[lang]}
                src="https://www.openstreetmap.org/export/embed.html?bbox=6.95%2C50.92%2C7.05%2C51.00&layer=mapnik&marker=50.96%2C7.00"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mehrwege-Kontaktblock (finaler CTA-Strip) */}
      <section
        className="mm-section mm-section--tight"
        style={{
          background: "var(--mm-color-dark-bg)",
          color: "var(--mm-color-surface)",
        }}
        aria-labelledby="kontakt-multichannel-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-5)", textAlign: "center" }}>
            <h2 id="kontakt-multichannel-title" style={{ margin: 0 }}>
              {t.multiChannel.title[lang]}
            </h2>
            <p
              style={{
                color: "var(--mm-color-surface)",
                opacity: 0.85,
                margin: "var(--mm-space-2) auto 0",
                maxWidth: "52ch",
              }}
            >
              {t.multiChannel.desc[lang]}
            </p>
          </header>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "var(--mm-space-4)",
            }}
          >
            <li
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "var(--mm-space-4)",
                borderRadius: "var(--mm-radius-md)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span
                aria-hidden="true"
                style={{ display: "inline-block", color: "var(--mm-color-accent)", marginBottom: "var(--mm-space-2)" }}
              >
                <Icon name="phone" />
              </span>
              <strong style={{ display: "block" }}>{t.address.phoneLabel[lang]}</strong>
              <a
                href={`tel:${t.multiChannel.phone[lang].replace(/\s/g, "")}`}
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {t.multiChannel.phone[lang]}
              </a>
            </li>

            <li
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "var(--mm-space-4)",
                borderRadius: "var(--mm-radius-md)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span
                aria-hidden="true"
                style={{ display: "inline-block", color: "var(--mm-color-accent)", marginBottom: "var(--mm-space-2)" }}
              >
                <Icon name="mail" />
              </span>
              <strong style={{ display: "block" }}>{t.address.emailLabel[lang]}</strong>
              <a
                href={`mailto:${t.multiChannel.email[lang]}`}
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {t.multiChannel.email[lang]}
              </a>
            </li>

            <li
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "var(--mm-space-4)",
                borderRadius: "var(--mm-radius-md)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span
                aria-hidden="true"
                style={{ display: "inline-block", color: "var(--mm-color-accent)", marginBottom: "var(--mm-space-2)" }}
              >
                <Icon name="calendar" />
              </span>
              <strong style={{ display: "block" }}>
                {lang === "en" ? "Booking" : "Termin"}
              </strong>
              <a
                href="/dashboard?booking=1"
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {lang === "en" ? "Book now →" : "Jetzt buchen →"}
              </a>
            </li>

            <li
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "var(--mm-space-4)",
                borderRadius: "var(--mm-radius-md)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span
                aria-hidden="true"
                style={{ display: "inline-block", color: "var(--mm-color-accent)", marginBottom: "var(--mm-space-2)" }}
              >
                <Icon name="send" />
              </span>
              <strong style={{ display: "block" }}>
                {lang === "en" ? "Form" : "Formular"}
              </strong>
              <a
                href="#kontakt-form-title"
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {lang === "en" ? "Go to form →" : "Zum Formular →"}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
