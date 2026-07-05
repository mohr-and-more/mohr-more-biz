"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import type { Service } from "@/data/services";

type Props = { service: Service };

/**
 * Detail-Komponente für eine einzelne Leistungsseite.
 * Server-Komponente (page.tsx) liefert JSON-LD und Props,
 * diese Client-Komponente rendert das visuelle Markup.
 */
export function ServiceDetailPage({ service }: Props) {
  const { lang } = useLang();
  const t = translations.serviceDetail;

  return (
    <main>
      <a href="#main" className="mm-skip-link">Zum Hauptinhalt springen</a>

      <section className="mm-hero" aria-labelledby="service-hero-title">
        <div className="mm-container" id="main">
          <nav aria-label="Brotkrumen" style={{ marginBottom: "var(--mm-space-4)" }}>
            <ol
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--mm-space-2)",
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "var(--mm-text-sm)",
                color: "var(--mm-color-muted)",
              }}
            >
              <li>
                <a href="/" style={{ color: "inherit" }}>Start</a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href="/leistungen" style={{ color: "inherit" }}>Leistungen</a>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: "var(--mm-color-text)", fontWeight: 600 }}>
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="mm-hero-text">
            <span className="mm-tag">{service.shortLabel}</span>
            <h1 id="service-hero-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {service.title}
            </h1>
            <p>{service.intro}</p>
            <div className="mm-hero-actions">
              <a
                href={`/kontakt?betreff=${encodeURIComponent(service.title)}&quelle=/leistungen/${service.slug}`}
                className="mm-btn mm-btn-primary"
              >
                {t.ctaButton[lang]}
              </a>
              <a href="/leistungen" className="mm-btn mm-btn-ghost">
                {t.back[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Lösung / Ergebnis Drei-Spalten */}
      <section className="mm-section" aria-labelledby="ple-title">
        <div className="mm-container">
          <h2 id="ple-title" className="sr-only">
            Problem · Lösung · Ergebnis
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            <article
              className="mm-card"
              style={{ borderLeft: "4px solid var(--mm-color-danger)" }}
            >
              <h3 style={{ color: "var(--mm-color-danger)", marginTop: 0 }}>
                {t.problemTitle[lang]}
              </h3>
              <p style={{ color: "var(--mm-color-muted)", margin: 0 }}>
                {service.problem}
              </p>
            </article>
            <article
              className="mm-card"
              style={{ borderLeft: "4px solid var(--mm-color-primary)" }}
            >
              <h3 style={{ color: "var(--mm-color-primary)", marginTop: 0 }}>
                {t.solutionTitle[lang]}
              </h3>
              <p style={{ color: "var(--mm-color-muted)", margin: 0 }}>
                {service.solution}
              </p>
            </article>
            <article
              className="mm-card"
              style={{ borderLeft: "4px solid var(--mm-color-accent)" }}
            >
              <h3 style={{ color: "var(--mm-color-accent)", marginTop: 0 }}>
                {t.outcomeTitle[lang]}
              </h3>
              <p style={{ color: "var(--mm-color-muted)", margin: 0 }}>
                {service.outcome}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Was Sie konkret bekommen */}
      {service.bullets.length > 0 && (
        <section className="mm-section" aria-labelledby="benefits-title">
          <div className="mm-container mm-container--narrow">
            <h2 id="benefits-title">{t.benefitsTitle[lang]}</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: "var(--mm-space-3)",
              }}
            >
              {service.bullets.map((bullet, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "var(--mm-space-3)",
                    alignItems: "flex-start",
                    padding: "var(--mm-space-3) var(--mm-space-4)",
                    background: "var(--mm-color-surface)",
                    border: "1px solid var(--mm-color-border)",
                    borderRadius: "var(--mm-radius-md)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      display: "inline-grid",
                      placeItems: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "var(--mm-radius-pill)",
                      background: "var(--mm-color-primary)",
                      color: "var(--mm-color-surface)",
                      fontSize: "var(--mm-text-xs)",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--mm-color-text)" }}>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {service.faqs.length > 0 && (
        <section
          className="mm-section"
          aria-labelledby="faq-title"
          style={{ background: "var(--mm-color-background)" }}
        >
          <div className="mm-container mm-container--narrow">
            <h2 id="faq-title">{t.faqTitle[lang]}</h2>
            <div
              style={{
                display: "grid",
                gap: "var(--mm-space-4)",
                marginTop: "var(--mm-space-6)",
              }}
            >
              {service.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="mm-card"
                  style={{ padding: "var(--mm-space-4) var(--mm-space-5)" }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "var(--mm-color-text)",
                      fontSize: "var(--mm-text-lg)",
                      listStyle: "none",
                    }}
                  >
                    {faq.question}
                  </summary>
                  <p
                    style={{
                      marginTop: "var(--mm-space-3)",
                      marginBottom: 0,
                      color: "var(--mm-color-muted)",
                    }}
                  >
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="mm-section mm-section--tight"
        aria-labelledby="detail-cta-title"
        style={{ textAlign: "center" }}
      >
        <div className="mm-container mm-container--narrow">
          <h2 id="detail-cta-title">{t.ctaTitle[lang]}</h2>
          <p
            style={{
              color: "var(--mm-color-muted)",
              maxWidth: "55ch",
              margin: "0 auto var(--mm-space-6)",
            }}
          >
            {t.ctaText[lang]}
          </p>
          <a
            href={`/kontakt?betreff=${encodeURIComponent(service.title)}&quelle=/leistungen/${service.slug}`}
            className="mm-btn mm-btn-primary"
          >
            {t.ctaButton[lang]}
          </a>
        </div>
      </section>
    </main>
  );
}
