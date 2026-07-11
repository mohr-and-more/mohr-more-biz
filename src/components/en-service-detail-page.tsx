"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import type { Service } from "@/data/services";

type Props = { service: Service };

/**
 * English service detail page client component (MMB-468 / Sub 8).
 * Mirrors the DE `ServiceDetailPage` (`src/app/leistungen/[slug]/slug-page.tsx`)
 * but uses /en/services/[slug] routes and EN breadcrumb copy. Content text
 * comes from the same `service` data object (titles are bilingual by design).
 */
export function EnServiceDetailPage({ service }: Props) {
  const { lang } = useLang();
  // Force-EN rendering: even if the user toggles DE while on /en/services/...,
  // we still show EN text + EN routes. The I18nProvider detects /en/* as "en".
  const t = translations.serviceDetail;

  return (
    <main>
      <a href="#main" className="mm-skip-link">Skip to main content</a>

      <section className="mm-hero" aria-labelledby="service-hero-title">
        <div className="mm-container" id="main">
          <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--mm-space-4)" }}>
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
                <a href="/en" style={{ color: "inherit" }}>Home</a>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <a href="/en/services" style={{ color: "inherit" }}>Services</a>
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
                href={`/en/contact?subject=${encodeURIComponent(service.title)}&source=/en/services/${service.slug}`}
                className="mm-btn mm-btn-primary"
              >
                {t.ctaButton.en}
              </a>
              <a href="/en/services" className="mm-btn mm-btn-ghost">
                {t.back.en}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mm-section"
        aria-labelledby="problem-section-title"
      >
        <div className="mm-container">
          <h2 id="problem-section-title">{t.problemTitle.en}</h2>
          <p style={{ marginTop: "var(--mm-space-4)", maxWidth: "65ch", color: "var(--mm-color-muted)" }}>
            {service.problem}
          </p>
        </div>
      </section>

      <section
        className="mm-section"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="solution-section-title"
      >
        <div className="mm-container">
          <h2 id="solution-section-title">{t.solutionTitle.en}</h2>
          <p style={{ marginTop: "var(--mm-space-4)", maxWidth: "65ch", color: "var(--mm-color-muted)" }}>
            {service.solution}
          </p>
          {service.bullets?.length ? (
            <ul style={{ marginTop: "var(--mm-space-6)", display: "grid", gap: "var(--mm-space-3)", paddingLeft: "var(--mm-space-5)" }}>
              {service.bullets.map((b, i) => (
                <li key={i} style={{ color: "var(--mm-color-text)" }}>{b}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section
        className="mm-section"
        aria-labelledby="outcome-section-title"
      >
        <div className="mm-container">
          <h2 id="outcome-section-title">{t.outcomeTitle.en}</h2>
          <p style={{ marginTop: "var(--mm-space-4)", maxWidth: "65ch", color: "var(--mm-color-muted)" }}>
            {service.outcome}
          </p>
        </div>
      </section>

      {service.faqs?.length ? (
        <section
          className="mm-section"
          style={{ background: "var(--mm-color-background)" }}
          aria-labelledby="faq-title"
        >
          <div className="mm-container">
            <h2 id="faq-title">{t.faqTitle.en}</h2>
            <div
              style={{
                marginTop: "var(--mm-space-6)",
                display: "grid",
                gap: "var(--mm-space-4)",
                maxWidth: "800px",
              }}
            >
              {service.faqs.map((f, i) => (
                <details
                  key={i}
                  style={{
                    background: "var(--mm-color-surface)",
                    border: "1px solid var(--mm-color-border)",
                    borderRadius: "var(--mm-radius-md)",
                    padding: "var(--mm-space-4)",
                  }}
                >
                  <summary
                    style={{
                      fontWeight: 600,
                      color: "var(--mm-color-text)",
                      cursor: "pointer",
                      listStyle: "none",
                    }}
                  >
                    {f.question}
                  </summary>
                  <p
                    style={{
                      marginTop: "var(--mm-space-3)",
                      color: "var(--mm-color-muted)",
                    }}
                  >
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mm-section mm-section--dark">
        <div className="mm-container" style={{ textAlign: "center" }}>
          <h2>{t.ctaTitle.en}</h2>
          <p
            style={{
              marginTop: "var(--mm-space-3)",
              maxWidth: "60ch",
              marginLeft: "auto",
              marginRight: "auto",
              color: "var(--mm-color-dark-fg)",
              opacity: 0.85,
            }}
          >
            {t.ctaText.en}
          </p>
          <a
            href={`/en/contact?subject=${encodeURIComponent(service.title)}&source=/en/services/${service.slug}`}
            className="mm-btn mm-btn-primary"
            style={{ marginTop: "var(--mm-space-6)" }}
          >
            {t.ctaButton.en}
          </a>
        </div>
      </section>
    </main>
  );
}