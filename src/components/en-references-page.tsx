"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { CASE_STUDIES, type CaseStudy } from "@/data/cases";

/**
 * /en/references — English references overview (MMB-468 / Sub 8)
 *
 * Same JS-based branch-filter logic as the DE ReferenzenPage, with hardcoded
 * EN copy. Keeps the markup minimal and avoids client-state-dependence for
 * SEO-critical content.
 */
export function EnReferencesPage() {
  const branches = useMemo(() => {
    const set = new Set<string>();
    CASE_STUDIES.forEach((c) => set.add(c.branch));
    return Array.from(set);
  }, []);

  const [query, setQuery] = useState("");
  const [activeBranch, setActiveBranch] = useState<string>("all");

  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const counterRef = useRef<HTMLSpanElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    let visible = 0;
    for (const c of CASE_STUDIES) {
      const card = cardsRef.current.get(c.slug);
      if (!card) continue;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q) ||
        c.client.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      const matchesBranch = activeBranch === "all" || c.branch === activeBranch;
      const show = matchesQuery && matchesBranch;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    }
    if (counterRef.current) counterRef.current.textContent = String(visible);
    if (emptyRef.current) emptyRef.current.classList.toggle("hidden", visible !== 0);
  }, [query, activeBranch]);

  return (
    <main>
      <a href="#main" className="mm-skip-link">Skip to main content</a>

      <section className="mm-hero" aria-labelledby="ref-hero-title">
        <div className="mm-container" id="main">
          <div className="mm-hero-text">
            <span className="mm-tag">References</span>
            <h1 id="ref-hero-title">Case studies with measurable outcomes.</h1>
            <p>
              Three examples from the last 18 months — anonymized, with real numbers. Filter by
              industry and read how we turn challenges into measurable results.
            </p>
          </div>
        </div>
      </section>

      <section
        className="mm-section"
        aria-labelledby="ref-filter-title"
      >
        <div className="mm-container">
          <h2 id="ref-filter-title" className="sr-only">Filter case studies</h2>
          <div
            style={{
              display: "grid",
              gap: "var(--mm-space-4)",
              gridTemplateColumns: "1fr",
              alignItems: "center",
            }}
          >
            <label
              htmlFor="ref-search"
              style={{ display: "grid", gap: "var(--mm-space-2)", maxWidth: "480px" }}
            >
              <span style={{ fontWeight: 600 }}>Filter by industry or keyword</span>
              <input
                id="ref-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. SME, crafts, workflow …"
                style={{
                  width: "100%",
                  minHeight: "44px",
                  padding: "var(--mm-space-3)",
                  background: "var(--mm-color-surface)",
                  border: "1px solid var(--mm-color-border)",
                  borderRadius: "var(--mm-radius-sm)",
                  color: "var(--mm-color-text)",
                  fontSize: "var(--mm-text-base)",
                }}
                aria-label="Filter case studies by keyword"
              />
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--mm-space-2)" }}>
              <button
                type="button"
                onClick={() => setActiveBranch("all")}
                className={`mm-tag ${activeBranch === "all" ? "" : ""}`}
                style={{
                  cursor: "pointer",
                  background: activeBranch === "all" ? "var(--mm-color-primary)" : "var(--mm-color-surface)",
                  color: activeBranch === "all" ? "var(--mm-color-surface)" : "var(--mm-color-text)",
                  borderColor: "var(--mm-color-border)",
                  border: "1px solid",
                  minHeight: "44px",
                  padding: "0 var(--mm-space-4)",
                  borderRadius: "var(--mm-radius-pill)",
                }}
              >
                All industries
              </button>
              {branches.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setActiveBranch(b)}
                  style={{
                    cursor: "pointer",
                    background: activeBranch === b ? "var(--mm-color-primary)" : "var(--mm-color-surface)",
                    color: activeBranch === b ? "var(--mm-color-surface)" : "var(--mm-color-text)",
                    borderColor: "var(--mm-color-border)",
                    border: "1px solid",
                    minHeight: "44px",
                    padding: "0 var(--mm-space-4)",
                    borderRadius: "var(--mm-radius-pill)",
                    textTransform: "capitalize",
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
            <p style={{ color: "var(--mm-color-muted)", margin: 0 }}>
              <strong ref={counterRef}>{CASE_STUDIES.length}</strong> case{CASE_STUDIES.length === 1 ? "" : "s"}
            </p>
          </div>

          <div
            ref={emptyRef}
            className="hidden"
            role="status"
            style={{
              marginTop: "var(--mm-space-6)",
              padding: "var(--mm-space-6)",
              textAlign: "center",
              background: "var(--mm-color-background)",
              borderRadius: "var(--mm-radius-md)",
              color: "var(--mm-color-muted)",
            }}
          >
            No cases found. Please adjust your filter.{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveBranch("all");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--mm-color-primary)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Reset filter
            </button>
          </div>

          <div
            style={{
              marginTop: "var(--mm-space-8)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            {CASE_STUDIES.map((c) => (
              <CaseCard
                key={c.slug}
                caseStudy={c}
                refSetter={(el) => {
                  if (el) cardsRef.current.set(c.slug, el);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mm-section mm-section--dark">
        <div className="mm-container" style={{ textAlign: "center" }}>
          <h2>Your project could be the next case study.</h2>
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
            Book a no-obligation initial consultation. We discuss your situation and outline the
            first steps.
          </p>
          <Link
            href="/en/contact?subject=Consultation&source=/en/references"
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

function CaseCard({
  caseStudy,
  refSetter,
}: {
  caseStudy: CaseStudy;
  refSetter: (el: HTMLDivElement | null) => void;
}) {
  return (
    <article
      ref={refSetter}
      data-tags={[caseStudy.branch, ...caseStudy.tags].join(",")}
      className="mm-case-card mm-card"
      style={{ display: "flex", flexDirection: "column", gap: "var(--mm-space-4)" }}
    >
      <span className="mm-tag" style={{ alignSelf: "flex-start", textTransform: "capitalize" }}>
        {caseStudy.branch}
      </span>
      <h3 style={{ margin: 0 }}>{caseStudy.title}</h3>
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--mm-space-3)",
          margin: 0,
          padding: "var(--mm-space-3) 0",
          borderTop: "1px solid var(--mm-color-border)",
          borderBottom: "1px solid var(--mm-color-border)",
        }}
      >
        {caseStudy.stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <dt style={{ fontSize: "var(--mm-text-xs)", color: "var(--mm-color-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s.label}
            </dt>
            <dd style={{ margin: "var(--mm-space-1) 0 0", fontSize: "var(--mm-text-2xl)", fontWeight: 700, color: "var(--mm-color-primary)" }}>
              {s.value}
              {s.suffix ?? null}
            </dd>
          </div>
        ))}
      </dl>
      <p style={{ margin: 0, color: "var(--mm-color-muted)" }}>{caseStudy.problem}</p>
      <Link
        href={`/en/references/${caseStudy.slug}`}
        className="mm-btn mm-btn-secondary"
        style={{ marginTop: "auto", alignSelf: "flex-start", minHeight: "44px" }}
      >
        Read case →
      </Link>
    </article>
  );
}