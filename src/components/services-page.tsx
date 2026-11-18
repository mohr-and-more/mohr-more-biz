"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { SERVICES } from "@/data/services";

type IconProps = { name: string; size?: number };

function Icon({ name, size = 28 }: IconProps) {
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
    case "compass":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...props}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.6-.4-.4-2.6 2.5-2.5Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "zap":
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "graduation":
      return (
        <svg {...props}>
          <path d="M22 10 12 4 2 10l10 6 10-6Z" />
          <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
        </svg>
      );
    case "chess":
      return (
        <svg {...props}>
          <path d="M8 2h8v3l-2 2v3h4l1 4H5l1-4h4V7L8 5V2Z" />
          <path d="M5 18h14v3H5z" />
        </svg>
      );
    default:
      return null;
  }
}

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  const isDetail = ["beratung", "umsetzung", "wartung"].includes(service.slug);
  const href = isDetail
    ? `/leistungen/${service.slug}`
    : "/leistungen";
  return (
    <article className="mm-card mm-service-card">
      <header style={{ display: "flex", alignItems: "center", gap: "var(--mm-space-3)" }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-grid",
            placeItems: "center",
            width: "48px",
            height: "48px",
            borderRadius: "var(--mm-radius-md)",
            background: "var(--mm-color-background)",
            color: "var(--mm-color-primary)",
            flexShrink: 0,
          }}
        >
          <Icon name={service.icon} />
        </span>
        <span className="mm-tag">{service.shortLabel}</span>
      </header>

      <h3 style={{ marginTop: "var(--mm-space-2)" }}>{service.title}</h3>

      <div
        style={{
          display: "grid",
          gap: "var(--mm-space-2)",
          fontSize: "var(--mm-text-sm)",
          color: "var(--mm-color-muted)",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong style={{ color: "var(--mm-color-text)" }}>Problem:</strong>{" "}
          {service.problem}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: "var(--mm-color-text)" }}>Lösung:</strong>{" "}
          {service.solution}
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: "var(--mm-color-text)" }}>Ergebnis:</strong>{" "}
          {service.outcome}
        </p>
      </div>

      <footer style={{ marginTop: "auto", paddingTop: "var(--mm-space-3)" }}>
        <a
          href={href}
          className="mm-btn mm-btn-secondary"
          style={{ minHeight: "44px", padding: "var(--mm-space-2) var(--mm-space-5)" }}
          aria-label={`Mehr zu ${service.title} erfahren`}
        >
          {isDetail ? "Details ansehen →" : "Beratung anfragen →"}
        </a>
      </footer>
    </article>
  );
}

export function LeistungenPage() {
  const { lang } = useLang();
  const t = translations.services;

  return (
    <main>
      {/* Skip-Link für Tastatur-Nutzer (Plan-Punkt 14) */}
      <a href="#main" className="mm-skip-link">Zum Hauptinhalt springen</a>

      {/* Hero / Einleitung */}
      <section
        className="mm-hero"
        aria-labelledby="leistungen-hero-title"
      >
        <div className="mm-container" id="main">
          <div className="mm-hero-text">
            <span className="mm-tag">Leistungen</span>
            <h1 id="leistungen-hero-title">
              {t.hero.title[lang]}
            </h1>
            <p>{t.hero.intro[lang]}</p>
            <div className="mm-hero-actions">
              <a
                href="/kontakt?betreff=Beratung&quelle=/leistungen"
                className="mm-btn mm-btn-primary"
              >
                {t.hero.ctaPrimary[lang]}
              </a>
              <a href="#service-cards" className="mm-btn mm-btn-secondary">
                {t.hero.ctaSecondary[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service-Karten */}
      <section
        id="service-cards"
        className="mm-section"
        aria-labelledby="service-cards-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-10)" }}>
            <span className="mm-tag">MMB-471 · 6 Services</span>
            <h2 id="service-cards-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.cards.title[lang]}
            </h2>
            <p
              style={{
                maxWidth: "60ch",
                color: "var(--mm-color-muted)",
                marginTop: "var(--mm-space-3)",
              }}
            >
              {t.cards.subtitle[lang]}
            </p>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="mm-section mm-section--tight"
        aria-labelledby="leistungen-cta-title"
        style={{
          background: "var(--mm-color-background)",
          textAlign: "center",
        }}
      >
        <div className="mm-container mm-container--narrow">
          <h2 id="leistungen-cta-title">{t.cta.title[lang]}</h2>
          <p
            style={{
              color: "var(--mm-color-muted)",
              maxWidth: "55ch",
              margin: "0 auto var(--mm-space-6)",
            }}
          >
            {t.cta.text[lang]}
          </p>
          <a
            href="/kontakt?betreff=Beratung&quelle=/leistungen"
            className="mm-btn mm-btn-primary"
          >
            {t.cta.button[lang]}
          </a>
        </div>
      </section>
    </main>
  );
}
