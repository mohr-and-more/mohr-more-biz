"use client";

import Link from "next/link";
import type { CaseStudy } from "@/data/cases";

type Props = { caseStudy: CaseStudy };

/**
 * /en/references/[slug] — English case-study detail (MMB-468 / Sub 8)
 *
 * Mirrors the DE `CaseDetailPage` but with hardcoded EN copy and EN routes.
 */
export function EnCaseDetailPage({ caseStudy }: Props) {
  return (
    <main>
      <a href="#main" className="mm-skip-link">Skip to main content</a>

      <section className="mm-hero" aria-labelledby="case-hero-title">
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
                <Link href="/en" style={{ color: "inherit" }}>Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href="/en/references" style={{ color: "inherit" }}>References</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: "var(--mm-color-text)", fontWeight: 600 }}>
                {caseStudy.title}
              </li>
            </ol>
          </nav>

          <div className="mm-hero-text">
            <span className="mm-tag" style={{ textTransform: "capitalize" }}>{caseStudy.branch}</span>
            <h1 id="case-hero-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {caseStudy.title}
            </h1>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "var(--mm-space-4)",
                marginTop: "var(--mm-space-4)",
                padding: "var(--mm-space-4) 0",
                borderTop: "1px solid var(--mm-color-border)",
                borderBottom: "1px solid var(--mm-color-border)",
              }}
            >
              <div>
                <dt style={{ fontSize: "var(--mm-text-xs)", color: "var(--mm-color-faint)", textTransform: "uppercase" }}>Client</dt>
                <dd style={{ margin: "var(--mm-space-1) 0 0", fontWeight: 600 }}>{caseStudy.client}</dd>
              </div>
              <div>
                <dt style={{ fontSize: "var(--mm-text-xs)", color: "var(--mm-color-faint)", textTransform: "uppercase" }}>Duration</dt>
                <dd style={{ margin: "var(--mm-space-1) 0 0", fontWeight: 600 }}>{caseStudy.duration}</dd>
              </div>
              <div>
                <dt style={{ fontSize: "var(--mm-text-xs)", color: "var(--mm-color-faint)", textTransform: "uppercase" }}>Industry</dt>
                <dd style={{ margin: "var(--mm-space-1) 0 0", fontWeight: 600, textTransform: "capitalize" }}>{caseStudy.branchLabel}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mm-section" aria-labelledby="stats-title">
        <div className="mm-container">
          <h2 id="stats-title" className="sr-only">Key metrics</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "var(--mm-space-4)",
            }}
          >
            {caseStudy.stats.map((s, i) => (
              <div
                key={i}
                className="mm-stat"
                style={{
                  borderLeft: "4px solid var(--mm-color-primary)",
                  paddingLeft: "var(--mm-space-4)",
                }}
              >
                <strong style={{ fontSize: "var(--mm-text-3xl)", color: "var(--mm-color-primary)" }}>
                  {s.value}
                  {s.suffix ?? null}
                </strong>
                <span style={{ display: "block", marginTop: "var(--mm-space-1)", color: "var(--mm-color-muted)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mm-section"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="problem-section-title"
      >
        <div className="mm-container" style={{ maxWidth: "800px" }}>
          <h2 id="problem-section-title">Starting point</h2>
          <p style={{ marginTop: "var(--mm-space-4)", color: "var(--mm-color-muted)" }}>
            {caseStudy.problem}
          </p>
        </div>
      </section>

      <section className="mm-section" aria-labelledby="solution-section-title">
        <div className="mm-container" style={{ maxWidth: "800px" }}>
          <h2 id="solution-section-title">Approach</h2>
          <p style={{ marginTop: "var(--mm-space-4)", color: "var(--mm-color-muted)" }}>
            {caseStudy.solution}
          </p>
        </div>
      </section>

      <section
        className="mm-section"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="details-section-title"
      >
        <div className="mm-container" style={{ maxWidth: "800px" }}>
          <h2 id="details-section-title">Results in detail</h2>
          <details
            style={{
              marginTop: "var(--mm-space-4)",
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
              Show all results
            </summary>
            <ul style={{ marginTop: "var(--mm-space-4)", paddingLeft: "var(--mm-space-5)", display: "grid", gap: "var(--mm-space-2)" }}>
              {caseStudy.details.map((d, i) => (
                <li key={i} style={{ color: "var(--mm-color-muted)" }}>{d}</li>
              ))}
            </ul>
          </details>
          {caseStudy.quote ? (
            <blockquote
              style={{
                marginTop: "var(--mm-space-6)",
                paddingLeft: "var(--mm-space-4)",
                borderLeft: "3px solid var(--mm-color-accent)",
                fontStyle: "italic",
                color: "var(--mm-color-muted)",
              }}
            >
              &ldquo;{caseStudy.quote}&rdquo;
            </blockquote>
          ) : null}
        </div>
      </section>

      <section className="mm-section mm-section--dark">
        <div className="mm-container" style={{ textAlign: "center" }}>
          <h2>Similar challenge?</h2>
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
            We&apos;ll discuss your situation in a no-obligation initial consultation and show you
            which steps we would recommend.
          </p>
          <Link
            href={`/en/contact?subject=${encodeURIComponent(caseStudy.title)}&source=/en/references/${caseStudy.slug}`}
            className="mm-btn mm-btn-primary"
            style={{ marginTop: "var(--mm-space-6)" }}
          >
            Request a consultation
          </Link>
        </div>
      </section>
    </main>
  );
}