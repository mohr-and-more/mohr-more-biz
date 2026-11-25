"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { ContactForm, ContactIcon as Icon } from "@/components/contact-form";

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

export function KontaktPage() {
  const { lang } = useLang();
  const t = translations.contactPage;

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

              <ContactForm lang={lang} />

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
