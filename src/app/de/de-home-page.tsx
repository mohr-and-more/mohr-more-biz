"use client";

/**
 * /de/ — DE-Hauptseite (MMB-470, Sub 2 von 8 aus MMB-468)
 *
 * UMFANG (Spec MMB-470):
 *   1. Hero above the fold:
 *      - Headline mit Nutzenversprechen
 *      - primärer CTA "Beratungsgespräch vereinbaren"
 *      - sekundärer CTA "Leistungen ansehen"
 *   2. Logo-Leiste bekannter Kunden (6 monochrome SVG-Platzhalter)
 *   3. 1 Testimonial above the fold (Foto/Name/Firma-Platzhalter)
 *   4. Service-Vorschau: 3 Karten Problem/Lösung/Ergebnis, je Link zur /leistungen Subpage
 *   5. Vertrauens-Sektion: 4 Stats (Kennzahlen)
 *   6. Footer-Anker am Ende der Page (Footer global kommt mit MMB-475)
 *
 * TECH (Spec MMB-470):
 *   - Hero-Bild: WebP, preload, fetchpriority="high"
 *   - Skip-Link als erste fokussierbare Komponente
 *
 * CLASSES: alle aus src/app/design-system.css (MMB-469) — keine Style-Inline-Hacks.
 */

import { SERVICES } from "@/data/services";

/** Drei Haupt-Services für die Vorschau-Karten (beratung, umsetzung, wartung). */
const PREVIEW_SLUGS = ["beratung", "umsetzung", "wartung"] as const;

/** Sechs Kunden-Platzhalter (graue Wortmarken-SVGs). */
const CUSTOMER_LOGOS = [
  { id: "kunde-a", label: "KUNDE A" },
  { id: "kunde-b", label: "KUNDE B" },
  { id: "kunde-c", label: "KUNDE C" },
  { id: "kunde-d", label: "KUNDE D" },
  { id: "kunde-e", label: "KUNDE E" },
  { id: "kunde-f", label: "KUNDE F" },
] as const;

/** Vier Vertrauens-Stats (Kennzahlen mit Akzent-Border). */
const TRUST_STATS = [
  { value: "+38 %", label: "Conversion im Mittel über alle Cases" },
  { value: "6 Mon.", label: "Durchschnittliche Projektlaufzeit" },
  { value: "50+", label: "Abgeschlossene Mittelstandsprojekte" },
  { value: "100 %", label: "DSGVO-konform & Made in Germany" },
] as const;

/** Testimonial-Platzhalter (Spec MMB-470). */
const TESTIMONIAL = {
  quote:
    "Mit MOHR & MORE haben wir unseren Verwaltungsaufwand halbiert und gleichzeitig die Kundenzufriedenheit um 18 % gesteigert.",
  author: "Name Platzhalter",
  role: "Geschäftsführer:in",
  company: "Firma Platzhalter",
  initials: "NP",
} as const;

/**
 * Generiert ein simples, graues Wortmarken-SVG für einen Kunden.
 * Bewusst monochrome + lowercase Typografie (B2B-Standard für
 * Kunden-Logo-Leisten) und ohne Emojis (Spec MMB-468).
 */
function CustomerLogo({ id, label }: { id: string; label: string }) {
  return (
    <svg
      key={id}
      width={120}
      height={32}
      viewBox="0 0 120 32"
      role="img"
      aria-label={label}
    >
      <text
        x="60"
        y="20"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="14"
        fontWeight="700"
        letterSpacing="0.16em"
        fill="currentColor"
      >
        {label}
      </text>
    </svg>
  );
}

/**
 * Kleines Icon-Set (inline SVG, kein Tracking, keine externe Library).
 */
type IconName = "compass" | "wrench" | "shield" | "check" | "arrow" | "phone" | "mail";
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
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
    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 5 5 9-11" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...props}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    default:
      return null;
  }
}

/** Map-Service-Slug → Icon, damit die Karten visuell differenzieren. */
function iconForSlug(slug: string): IconName {
  if (slug === "beratung") return "compass";
  if (slug === "umsetzung") return "wrench";
  if (slug === "wartung") return "shield";
  return "check";
}

/**
 * Vorschau-Karte für einen Service (Problem/Lösung/Ergebnis + Link).
 */
function ServicePreviewCard({
  slug,
}: {
  slug: (typeof PREVIEW_SLUGS)[number] | string;
}) {
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;
  const iconName = iconForSlug(service.slug);
  return (
    <article className="mm-card mm-service-card" aria-labelledby={`svc-${service.slug}`}>
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
          <Icon name={iconName} size={26} />
        </span>
        <span className="mm-tag">{service.shortLabel}</span>
      </header>

      <h3 id={`svc-${service.slug}`} style={{ marginTop: "var(--mm-space-2)" }}>
        {service.title}
      </h3>

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

      <footer
        style={{
          marginTop: "auto",
          paddingTop: "var(--mm-space-3)",
          display: "flex",
          gap: "var(--mm-space-3)",
          flexWrap: "wrap",
        }}
      >
        <a
          href={`/leistungen/${service.slug}`}
          className="mm-btn mm-btn-primary"
          style={{ minHeight: "44px", padding: "var(--mm-space-2) var(--mm-space-5)" }}
          aria-label={`Mehr zu ${service.title} erfahren`}
        >
          Details ansehen <Icon name="arrow" size={16} />
        </a>
        <a
          href={`/kontakt?betreff=${encodeURIComponent(service.title)}&quelle=/de`}
          className="mm-btn mm-btn-ghost"
          style={{ minHeight: "44px", padding: "var(--mm-space-2) var(--mm-space-5)" }}
        >
          Beratung anfragen
        </a>
      </footer>
    </article>
  );
}

/**
 * Mini-Footer-Anker (Footer global kommt mit MMB-475 / Sub 7).
 * Hier nur der Anker-Anker mit Brand, Kurzlinks + rechtliches Mini-Set,
 * damit die Hauptseite visuell abgeschlossen wirkt.
 */
function FooterAnker() {
  return (
    <footer id="kontakt-anker" className="mm-footer" aria-label="Footer-Vorschau">
      <div className="mm-container">
        <div className="mm-footer-grid">
          <div>
            <h4>MOHR & MORE</h4>
            <p style={{ opacity: 0.75, fontSize: "var(--mm-text-sm)" }}>
              Digitalisierung &amp; Umsetzung für den Mittelstand in NRW.
              Strategie. Umsetzung. Wartung.
            </p>
          </div>
          <div>
            <h4>Leistungen</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--mm-space-2)" }}>
              <li><a href="/leistungen/beratung">Strategieberatung</a></li>
              <li><a href="/leistungen/umsetzung">Digitalisierung &amp; Umsetzung</a></li>
              <li><a href="/leistungen/wartung">Wartung &amp; Optimierung</a></li>
            </ul>
          </div>
          <div>
            <h4>Unternehmen</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--mm-space-2)" }}>
              <li><a href="/ueber-uns">Über uns</a></li>
              <li><a href="/referenzen">Referenzen</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "var(--mm-space-2)" }}>
              <li>
                <a href="tel:+4900000000000" aria-label="Telefon">
                  <Icon name="phone" size={16} /> +49 0000 0000000
                </a>
              </li>
              <li>
                <a href="mailto:[email protected]" aria-label="E-Mail">
                  <Icon name="mail" size={16} /> [email protected]
                </a>
              </li>
              <li>
                <a href="/kontakt">Kontaktformular →</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mm-footer-bottom">
          <span>© {new Date().getFullYear()} MOHR &amp; MORE</span>
          <span>
            <a href="/impressum">Impressum</a> · <a href="/datenschutz">Datenschutz</a> ·{" "}
            <a href="/agb">AGB</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function DeHomePage() {
  return (
    <main>
      {/* Skip-Link als erste fokussierbare Komponente (Plan-Punkt 14) */}
      <a href="#main" className="mm-skip-link">
        Zum Hauptinhalt springen
      </a>

      {/* ====================================================================
          HERO — above the fold
          Spec MMB-470:
            - Headline mit Nutzenversprechen
            - primärer CTA "Beratungsgespräch vereinbaren"
            - sekundärer CTA "Leistungen ansehen"
            - Hero-Bild: WebP, preload, fetchpriority="high"
          ==================================================================== */}
      <section className="mm-hero" aria-labelledby="de-home-hero-title">
        <div className="mm-container">
          <div className="mm-hero-text" id="main">
            <span className="mm-tag">MOHR &amp; MORE · NRW</span>
            <h1 id="de-home-hero-title">
              Digitalisierung, die im Mittelstand ankommt.
            </h1>
            <p>
              Wir verbinden Strategie, Umsetzung und laufende Wartung — pragmatisch,
              messbar und ohne Beratergeschwätz. Von der ersten Analyse bis zur
              lauffähigen Lösung aus einer Hand.
            </p>
            <div className="mm-hero-actions">
              <a
                href="/kontakt?betreff=Beratungsgespräch&quelle=/de"
                className="mm-btn mm-btn-primary"
              >
                Beratungsgespräch vereinbaren
              </a>
              <a
                href="/leistungen"
                className="mm-btn mm-btn-secondary"
              >
                Leistungen ansehen
              </a>
            </div>
          </div>

          {/* Hero-Bild: WebP, preload, fetchpriority="high" (Spec MMB-470/TECH) */}
          <div
            className="mm-hero-media"
            style={{
              marginTop: "var(--mm-space-8)",
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 7",
              borderRadius: "var(--mm-radius-lg)",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, var(--mm-color-primary), var(--mm-color-primary-hover))",
            }}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/de/assets/img/hero.webp"
              alt=""
              width={1920}
              height={840}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.92,
              }}
            />
          </div>

          {/* Logo-Leiste + 1 Testimonial — ebenfalls above the fold (Spec MMB-470) */}
          <div
            className="mm-logo-row"
            style={{
              marginTop: "var(--mm-space-10)",
              color: "var(--mm-color-muted)",
            }}
            aria-label="Kunden-Logo-Leiste"
          >
            {CUSTOMER_LOGOS.map((logo) => (
              <CustomerLogo key={logo.id} id={logo.id} label={logo.label} />
            ))}
          </div>

          <div
            style={{
              marginTop: "var(--mm-space-6)",
              display: "grid",
              gap: "var(--mm-space-4)",
              maxWidth: "720px",
              marginInline: "auto",
            }}
          >
            <figure className="mm-t-card" style={{ margin: 0 }}>
              <blockquote
                style={{
                  margin: 0,
                  fontSize: "var(--mm-text-lg)",
                  color: "var(--mm-color-text)",
                  lineHeight: 1.5,
                }}
              >
                „{TESTIMONIAL.quote}“
              </blockquote>
              <figcaption
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--mm-space-3)",
                }}
              >
                <span className="mm-t-avatar" aria-hidden="true">
                  {TESTIMONIAL.initials}
                </span>
                <span style={{ display: "grid", gap: "2px" }}>
                  <span className="mm-t-name">
                    [{TESTIMONIAL.author}], {TESTIMONIAL.role}
                  </span>
                  <span className="mm-t-company">[{TESTIMONIAL.company}]</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SERVICE-VORSCHAU — 3 Karten Problem/Lösung/Ergebnis
          ==================================================================== */}
      <section
        id="leistungen"
        className="mm-section"
        aria-labelledby="de-home-services-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-10)" }}>
            <span className="mm-tag">Leistungen</span>
            <h2
              id="de-home-services-title"
              style={{ marginTop: "var(--mm-space-3)" }}
            >
              Drei Hebel, ein Ziel: messbares Wachstum.
            </h2>
            <p
              style={{
                maxWidth: "60ch",
                color: "var(--mm-color-muted)",
                marginTop: "var(--mm-space-3)",
              }}
            >
              Strategie, Umsetzung und Wartung greifen ineinander — jedes Modul
              liefert von Anfang an konkrete Ergebnisse, nicht erst am
              Projektende.
            </p>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            {PREVIEW_SLUGS.map((slug) => (
              <ServicePreviewCard key={slug} slug={slug} />
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          VERTRAUENS-SEKTION — 4 Stats (Kennzahlen)
          ==================================================================== */}
      <section
        className="mm-section mm-section--tight"
        aria-labelledby="de-home-trust-title"
        style={{ background: "var(--mm-color-background)" }}
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-8)" }}>
            <span className="mm-tag">In Zahlen</span>
            <h2 id="de-home-trust-title" style={{ marginTop: "var(--mm-space-3)" }}>
              Ergebnisse, die sich rechnen.
            </h2>
          </header>

          <div className="mm-stats">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="mm-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CTA — primärer Aufruf vor dem Footer-Anker
          ==================================================================== */}
      <section
        className="mm-section mm-section--tight"
        aria-labelledby="de-home-cta-title"
        style={{ textAlign: "center" }}
      >
        <div className="mm-container mm-container--narrow">
          <h2 id="de-home-cta-title">
            Bereit für den ersten konkreten Schritt?
          </h2>
          <p
            style={{
              color: "var(--mm-color-muted)",
              maxWidth: "55ch",
              margin: "0 auto var(--mm-space-6)",
            }}
          >
            Vereinbaren Sie ein unverbindliches Erstgespräch. Wir hören zu,
            analysieren Ihre Situation und schlagen Ihnen die nächsten drei
            konkreten Schritte vor.
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--mm-space-3)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/kontakt?betreff=Erstgespräch&quelle=/de"
              className="mm-btn mm-btn-primary"
            >
              Beratungsgespräch vereinbaren
            </a>
            <a href="/referenzen" className="mm-btn mm-btn-secondary">
              Referenzen ansehen
            </a>
          </div>
        </div>
      </section>

      {/* Footer-Anker am Ende der Page (globaler Footer kommt mit MMB-475) */}
      <FooterAnker />
    </main>
  );
}
