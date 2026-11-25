"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { ContactForm, ContactIcon as Icon } from "@/components/contact-form";

/**
 * /en/contact — englische Kontaktseite (MMB-468 / Sub 8)
 *
 * Gleiche Struktur und Design-System-Klassen wie die DE-Seite; alle Texte
 * kommen aus `translations.contactPage`, das Formular ist die gemeinsame
 * Komponente `ContactForm` (Endpunkt, Validierung und Fehlermeldungen nur
 * einmal gepflegt).
 */
export function EnContactPage() {
  const { lang } = useLang();
  const t = translations.contactPage;
  const l: "de" | "en" = "en";

  return (
    <main>
      <a href="#main" className="mm-skip-link">
        {lang === "de" ? "Zum Hauptinhalt springen" : "Skip to content"}
      </a>

      <section className="mm-hero" aria-labelledby="contact-hero-title">
        <div className="mm-container" id="main">
          <div className="mm-hero-text">
            <span className="mm-tag">{t.pageLabel[l]}</span>
            <h1 id="contact-hero-title">{t.hero.title[l]}</h1>
            <p>{t.hero.intro[l]}</p>
          </div>
        </div>
      </section>

      <section className="mm-section" aria-label="Contact channels">
        <div className="mm-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--mm-space-5)",
            }}
          >
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
                <span className="mm-tag">{t.cards.callLabel[l]}</span>
              </header>
              <h3 style={{ margin: 0 }}>{t.cards.callTitle[l]}</h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--mm-color-muted)",
                  fontSize: "var(--mm-text-sm)",
                  flexGrow: 1,
                }}
              >
                {t.cards.callText[l]}
              </p>
              <a
                href={`tel:${t.multiChannel.phone[l].replace(/\s/g, "")}`}
                className="mm-btn mm-btn-primary"
                style={{ justifyContent: "center", textDecoration: "none" }}
                aria-label={`${t.cards.callTitle[l]}: ${t.multiChannel.phone[l]}`}
              >
                {t.multiChannel.phone[l]}
              </a>
            </article>

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
                <span className="mm-tag">{t.cards.emailLabel[l]}</span>
              </header>
              <h3 style={{ margin: 0 }}>{t.cards.emailTitle[l]}</h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--mm-color-muted)",
                  fontSize: "var(--mm-text-sm)",
                  flexGrow: 1,
                }}
              >
                {t.cards.emailText[l]}
              </p>
              <a
                href={`mailto:${t.multiChannel.email[l]}?subject=${encodeURIComponent(
                  "Inquiry via Contact Page"
                )}&source=contact`}
                className="mm-btn mm-btn-primary"
                style={{ justifyContent: "center", textDecoration: "none", wordBreak: "break-all" }}
              >
                {t.multiChannel.email[l]}
              </a>
            </article>

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
                <span className="mm-tag">{t.cards.bookLabel[l]}</span>
              </header>
              <h3 style={{ margin: 0 }}>{t.cards.bookTitle[l]}</h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--mm-color-muted)",
                  fontSize: "var(--mm-text-sm)",
                  flexGrow: 1,
                }}
              >
                {t.cards.bookText[l]}
              </p>
              <a
                href="/dashboard?booking=1"
                className="mm-btn mm-btn-secondary"
                style={{ justifyContent: "center", textDecoration: "none" }}
              >
                {t.cards.cta[l]} →
              </a>
            </article>
          </div>
        </div>
      </section>

      <section
        className="mm-section mm-section--tight"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="contact-form-title"
      >
        <div className="mm-container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--mm-space-8)" }}>
            <div>
              <header style={{ marginBottom: "var(--mm-space-6)" }}>
                <span className="mm-tag">MMB-472</span>
                <h2 id="contact-form-title" style={{ marginTop: "var(--mm-space-3)" }}>
                  {t.form.title[l]}
                </h2>
                <p style={{ color: "var(--mm-color-muted)", margin: "var(--mm-space-2) 0 0" }}>
                  {t.form.subtitle[l]}
                </p>
              </header>

              <ContactForm lang={l} />
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section" aria-labelledby="contact-address-title">
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-6)" }}>
            <span className="mm-tag">{t.address.block[l]}</span>
            <h2 id="contact-address-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.address.title[l]}
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
                  MOHR &amp; MORE
                </strong>
                <div>{t.address.street[l]}</div>
                <div>{t.address.postalCity[l]}</div>
              </div>

              <div>
                <strong style={{ display: "block" }}>{t.address.hoursLabel[l]}</strong>
                <span style={{ color: "var(--mm-color-muted)" }}>{t.address.hoursText[l]}</span>
              </div>

              <div>
                <strong style={{ display: "block" }}>{t.address.phoneLabel[l]}</strong>
                <a
                  href={`tel:${t.multiChannel.phone[l].replace(/\s/g, "")}`}
                  style={{ color: "var(--mm-color-primary)", textDecoration: "none" }}
                >
                  {t.multiChannel.phone[l]}
                </a>
              </div>

              <div>
                <strong style={{ display: "block" }}>{t.address.emailLabel[l]}</strong>
                <a
                  href={`mailto:${t.multiChannel.email[l]}`}
                  style={{ color: "var(--mm-color-primary)", textDecoration: "none" }}
                >
                  {t.multiChannel.email[l]}
                </a>
              </div>
            </address>

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
                title={t.address.mapTitle[l]}
                src="https://www.openstreetmap.org/export/embed.html?bbox=6.95%2C50.92%2C7.05%2C51.00&layer=mapnik&marker=50.96%2C7.00"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="mm-section mm-section--tight"
        style={{ background: "var(--mm-color-dark-bg)", color: "var(--mm-color-surface)" }}
        aria-labelledby="contact-multichannel-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-5)", textAlign: "center" }}>
            <h2 id="contact-multichannel-title" style={{ margin: 0 }}>
              {t.multiChannel.title[l]}
            </h2>
            <p
              style={{
                color: "var(--mm-color-surface)",
                opacity: 0.85,
                margin: "var(--mm-space-2) auto 0",
                maxWidth: "52ch",
              }}
            >
              {t.multiChannel.desc[l]}
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
              <strong style={{ display: "block" }}>{t.address.phoneLabel[l]}</strong>
              <a
                href={`tel:${t.multiChannel.phone[l].replace(/\s/g, "")}`}
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {t.multiChannel.phone[l]}
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
              <strong style={{ display: "block" }}>{t.address.emailLabel[l]}</strong>
              <a
                href={`mailto:${t.multiChannel.email[l]}`}
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {t.multiChannel.email[l]}
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
              <strong style={{ display: "block" }}>{t.cards.bookLabel[l]}</strong>
              <a
                href="/dashboard?booking=1"
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {t.cards.cta[l]} →
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
              <strong style={{ display: "block" }}>{t.form.title[l]}</strong>
              <a
                href="#contact-form"
                style={{ color: "var(--mm-color-surface)", opacity: 0.92, textDecoration: "none" }}
              >
                {t.form.submit[l]} →
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
