"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import type { CaseStudy } from "@/data/cases";
import Link from "next/link";

type Props = { caseStudy: CaseStudy };

/**
 * Detail-Komponente für einen einzelnen Case Study.
 * Server-Komponente (page.tsx) liefert JSON-LD und Props,
 * diese Client-Komponente rendert das visuelle Markup.
 *
 * Layout:
 *  - Hero: Breadcrumb + Branch-Tag + Titel + Meta-Zeile (Branche, Kunde, Laufzeit)
 *  - Stats-Block (3 Kennzahlen prominent)
 *  - Problem + Lösung (zwei Spalten)
 *  - Details als <details>/<summary> Spoiler
 *  - Optional: Kundenstimme
 *  - CTA
 */
export function CaseDetailPage({ caseStudy }: Props) {
  const { lang } = useLang();
  const t = translations.caseDetail;

  return (
    <main>
      <a href="#main" className="mm-skip-link">
        {lang === "en" ? "Skip to content" : "Zum Hauptinhalt springen"}
      </a>

      <section className="mm-hero" aria-labelledby="case-hero-title">
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
                <Link href="/" style={{ color: "inherit" }}>
                  {lang === "en" ? "Home" : "Start"}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href="/referenzen" style={{ color: "inherit" }}>
                  {lang === "en" ? "References" : "Referenzen"}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li
                aria-current="page"
                style={{ color: "var(--mm-color-text)", fontWeight: 600 }}
              >
                {caseStudy.branchLabel}
              </li>
            </ol>
          </nav>

          <div className="mm-hero-text">
            <span className="mm-tag">{caseStudy.branchLabel}</span>
            <h1
              id="case-hero-title"
              style={{ marginTop: "var(--mm-space-3)" }}
            >
              {caseStudy.title}
            </h1>

            {/* Meta-Zeile */}
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "var(--mm-space-3)",
                margin: "var(--mm-space-5) 0 0",
                padding: "var(--mm-space-4)",
                background: "var(--mm-color-surface)",
                borderRadius: "var(--mm-radius-md)",
                border: "1px solid var(--mm-color-border)",
              }}
            >
              <div>
                <dt
                  style={{
                    fontSize: "var(--mm-text-xs, 0.8125rem)",
                    color: "var(--mm-color-muted)",
                    fontWeight: 600,
                  }}
                >
                  {t.branchLabel[lang]}
                </dt>
                <dd style={{ margin: 0, fontWeight: 600 }}>{caseStudy.branchLabel}</dd>
              </div>
              <div>
                <dt
                  style={{
                    fontSize: "var(--mm-text-xs, 0.8125rem)",
                    color: "var(--mm-color-muted)",
                    fontWeight: 600,
                  }}
                >
                  {t.clientLabel[lang]}
                </dt>
                <dd style={{ margin: 0 }}>{caseStudy.client}</dd>
              </div>
              <div>
                <dt
                  style={{
                    fontSize: "var(--mm-text-xs, 0.8125rem)",
                    color: "var(--mm-color-muted)",
                    fontWeight: 600,
                  }}
                >
                  {t.durationLabel[lang]}
                </dt>
                <dd style={{ margin: 0 }}>{caseStudy.duration}</dd>
              </div>
            </dl>

            <div className="mm-hero-actions">
              <a
                href={`/kontakt?betreff=${encodeURIComponent(caseStudy.title)}&quelle=/referenzen/${caseStudy.slug}`}
                className="mm-btn mm-btn-primary"
              >
                {t.ctaButton[lang]}
              </a>
              <Link href="/referenzen" className="mm-btn mm-btn-ghost">
                {t.back[lang]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats prominent */}
      <section className="mm-section" aria-labelledby="case-stats-title">
        <div className="mm-container">
          <h2
            id="case-stats-title"
            style={{ textAlign: "center", marginBottom: "var(--mm-space-6)" }}
          >
            {t.statsTitle[lang]}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "var(--mm-space-5)",
            }}
          >
            {caseStudy.stats.map((s, i) => (
              <div
                key={i}
                className="mm-card"
                style={{
                  textAlign: "center",
                  padding: "var(--mm-space-6) var(--mm-space-4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--mm-space-2)",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(2.25rem, 5vw, 3rem)",
                    fontWeight: 700,
                    color: "var(--mm-color-primary)",
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  {s.value}
                  {s.suffix ?? ""}
                </span>
                <span
                  style={{
                    fontSize: "var(--mm-text-sm)",
                    color: "var(--mm-color-muted)",
                  }}
                >
                  {s.label}
                </span>
                {/* für Screen-Reader: kompletter Wert inkl. Suffix als Text */}
                <span className="sr-only">
                  {s.label}: {s.value}
                  {s.suffix ?? ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Lösung */}
      <section
        className="mm-section mm-section--tight"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="case-psl-title"
      >
        <div className="mm-container">
          <h2 id="case-psl-title" className="sr-only">
            {t.problemTitle[lang]} · {t.solutionTitle[lang]}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            <article
              className="mm-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--mm-space-3)",
              }}
            >
              <span className="mm-tag">{t.problemTitle[lang]}</span>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  color: "var(--mm-color-text)",
                }}
              >
                {caseStudy.problem}
              </p>
            </article>

            <article
              className="mm-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--mm-space-3)",
              }}
            >
              <span className="mm-tag">{t.solutionTitle[lang]}</span>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  color: "var(--mm-color-text)",
                }}
              >
                {caseStudy.solution}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Optional: Kundenstimme */}
      {caseStudy.quote && (
        <section
          className="mm-section"
          aria-labelledby="case-quote-title"
        >
          <div className="mm-container">
            <div
              style={{
                maxWidth: "760px",
                margin: "0 auto",
                padding: "var(--mm-space-6)",
                borderLeft: "4px solid var(--mm-color-accent)",
                background: "var(--mm-color-surface)",
                borderRadius: "0 var(--mm-radius-md) var(--mm-radius-md) 0",
              }}
            >
              <h2 id="case-quote-title" className="sr-only">
                {lang === "en" ? "Customer voice" : "Kundenstimme"}
              </h2>
              <blockquote
                style={{
                  margin: 0,
                  fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  color: "var(--mm-color-text)",
                }}
              >
                &bdquo;{caseStudy.quote}&ldquo;
              </blockquote>
              <p
                style={{
                  margin: "var(--mm-space-3) 0 0",
                  fontSize: "var(--mm-text-sm)",
                  color: "var(--mm-color-muted)",
                }}
              >
                — {caseStudy.client}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Details als Spoiler */}
      <section
        className="mm-section mm-section--tight"
        aria-labelledby="case-details-title"
      >
        <div className="mm-container">
          <h2
            id="case-details-title"
            style={{ marginBottom: "var(--mm-space-4)" }}
          >
            {t.detailsTitle[lang]}
          </h2>
          <details
            className="mm-card"
            style={{
              padding: 0,
              overflow: "hidden",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                padding: "var(--mm-space-4) var(--mm-space-5)",
                fontWeight: 600,
                listStyle: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--mm-space-3)",
              }}
            >
              <span>{t.detailsSummary[lang]}</span>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s",
                }}
                className="details-chevron"
              >
                ▾
              </span>
            </summary>
            <ul
              style={{
                margin: 0,
                padding: "0 var(--mm-space-5) var(--mm-space-5) var(--mm-space-7)",
                display: "grid",
                gap: "var(--mm-space-2)",
                listStyle: "disc",
                lineHeight: 1.55,
                color: "var(--mm-color-text)",
              }}
            >
              {caseStudy.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section
        className="mm-section mm-section--dark"
        aria-labelledby="case-cta-title"
      >
        <div className="mm-container">
          <div
            style={{
              display: "grid",
              gap: "var(--mm-space-4)",
              textAlign: "center",
              maxWidth: "720px",
              margin: "0 auto",
            }}
          >
            <h2 id="case-cta-title" style={{ margin: 0 }}>
              {t.ctaTitle[lang]}
            </h2>
            <p style={{ margin: 0 }}>{t.ctaText[lang]}</p>
            <div
              style={{
                display: "flex",
                gap: "var(--mm-space-3)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={`/kontakt?betreff=${encodeURIComponent(caseStudy.title)}&quelle=/referenzen/${caseStudy.slug}`}
                className="mm-btn mm-btn-accent"
              >
                {t.ctaButton[lang]}
              </a>
              <Link
                href="/referenzen"
                className="mm-btn mm-btn-ghost"
                style={{ color: "var(--mm-color-surface)" }}
              >
                {t.back[lang]}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}