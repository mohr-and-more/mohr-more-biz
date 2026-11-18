"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { CASE_STUDIES, getBranchLabels, type CaseStudy } from "@/data/cases";

/**
 * /referenzen (DE) — MMB-473
 *
 * Case-Studies-Übersicht mit:
 *  1. Hero
 *  2. Branchen-Filter (Input-Search über data-tags der Cards)
 *     — JS-basiert, ohne Tracking, ohne externe Libraries
 *  3. Branchen-Chips (Schnellauswahl)
 *  4. Stats-Block pro Case
 *  5. Klick öffnet /referenzen/[slug]
 *
 * Filter-Logik:
 *  - Such-Query matcht case-insensitive auf Titel + Branch + Tags + Client.
 *  - Branchen-Chips filtern exakt nach data-tags (Branch-Name).
 *  - "Alle Branchen" resettet die Branchen-Auswahl.
 *  - Kombinierter Modus: Search + Branch (UND-Verknüpfung).
 *  - Live-Update der Ergebnis-Anzahl ohne Re-Render der gesamten Liste
 *    (einzelne Cards werden via class="hidden" ausgeblendet, damit der
 *    Fokus erhalten bleibt und Screen-Reader die Filterung verstehen).
 */

export function ReferenzenPage() {
  const { lang } = useLang();
  const t = translations.referencesPage;
  const branches = useMemo(() => getBranchLabels(), []);

  // Filter-State
  const [query, setQuery] = useState("");
  const [activeBranch, setActiveBranch] = useState<string>("all");

  // Refs für einzelne Cards (für Live-DOM-Toggle ohne Re-Render)
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const counterRef = useRef<HTMLSpanElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);

  // Filter anwenden — aktualisiert Klassen direkt im DOM,
  // damit Eingaben ohne Fokus-Verlust flüssig funktionieren.
  useEffect(() => {
    const q = query.trim().toLowerCase();
    let visible = 0;
    for (const c of CASE_STUDIES) {
      const card = cardsRef.current.get(c.slug);
      if (!card) continue;
      const matchesBranch =
        activeBranch === "all" ? true : c.branch === activeBranch;
      const haystack = [
        c.title,
        c.branchLabel,
        c.client,
        ...c.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = q.length === 0 || haystack.includes(q);
      const show = matchesBranch && matchesQuery;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    }
    if (counterRef.current) {
      counterRef.current.textContent = t.filter.resultCount[lang].replace(
        "{count}",
        String(visible)
      );
    }
    if (emptyRef.current) {
      emptyRef.current.style.display = visible === 0 ? "" : "none";
    }
  }, [query, activeBranch, lang, t.filter.resultCount]);

  function resetFilter() {
    setQuery("");
    setActiveBranch("all");
  }

  return (
    <main>
      {/* Skip-Link für Tastatur-Nutzer (Plan-Punkt 14) */}
      <a href="#main" className="mm-skip-link">
        {lang === "en" ? "Skip to content" : "Zum Hauptinhalt springen"}
      </a>

      {/* Hero */}
      <section
        className="mm-hero"
        aria-labelledby="referenzen-hero-title"
      >
        <div className="mm-container" id="main">
          {/* Breadcrumb (visuell, redundant zur JSON-LD) */}
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
              <li
                aria-current="page"
                style={{ color: "var(--mm-color-text)", fontWeight: 600 }}
              >
                {t.pageLabel[lang]}
              </li>
            </ol>
          </nav>

          <div className="mm-hero-text">
            <span className="mm-tag">{t.pageLabel[lang]}</span>
            <h1 id="referenzen-hero-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.hero.title[lang]}
            </h1>
            <p>{t.hero.intro[lang]}</p>
          </div>
        </div>
      </section>

      {/* Filter + Cases */}
      <section
        className="mm-section"
        aria-labelledby="referenzen-filter-title"
      >
        <div className="mm-container">
          <h2 id="referenzen-filter-title" className="sr-only">
            {t.filter.label[lang]}
          </h2>

          {/* Filter-Block: Search + Branchen-Chips + Counter */}
          <div
            role="search"
            aria-label={t.filter.searchLabel[lang]}
            style={{
              display: "grid",
              gap: "var(--mm-space-4)",
              marginBottom: "var(--mm-space-8)",
              padding: "var(--mm-space-5)",
              borderRadius: "var(--mm-radius-lg)",
              border: "1px solid var(--mm-color-border)",
              background: "var(--mm-color-surface)",
            }}
          >
            {/* Suchfeld */}
            <div className="mm-form-row">
              <label htmlFor="case-search">{t.filter.searchLabel[lang]}</label>
              <input
                id="case-search"
                type="search"
                className="mm-form-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.filter.searchPh[lang]}
                autoComplete="off"
                inputMode="search"
                aria-describedby="case-search-help case-counter"
              />
              <p
                id="case-search-help"
                style={{
                  margin: 0,
                  fontSize: "var(--mm-text-xs, 0.8125rem)",
                  color: "var(--mm-color-muted)",
                }}
              >
                {lang === "en"
                  ? "Search runs on title, industry, client and tags."
                  : "Suche läuft über Titel, Branche, Kunde und Tags."}
              </p>
            </div>

            {/* Branchen-Chips */}
            <div
              role="group"
              aria-label={lang === "en" ? "Industry quick filter" : "Branchen-Schnellfilter"}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--mm-space-2)",
              }}
            >
              <ChipButton
                active={activeBranch === "all"}
                onClick={() => setActiveBranch("all")}
                label={t.filter.allLabel[lang]}
              />
              {branches.map((b) => (
                <ChipButton
                  key={b.value}
                  active={activeBranch === b.value}
                  onClick={() => setActiveBranch(b.value)}
                  label={b.label}
                />
              ))}
            </div>

            {/* Footer: Ergebnis-Counter + Reset */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--mm-space-3)",
                flexWrap: "wrap",
              }}
            >
              <span
                id="case-counter"
                ref={counterRef}
                aria-live="polite"
                style={{
                  fontSize: "var(--mm-text-sm)",
                  color: "var(--mm-color-muted)",
                  fontWeight: 600,
                }}
              >
                {t.filter.resultCount[lang].replace(
                  "{count}",
                  String(CASE_STUDIES.length)
                )}
              </span>
              {(query.length > 0 || activeBranch !== "all") && (
                <button
                  type="button"
                  onClick={resetFilter}
                  className="mm-btn mm-btn-ghost"
                  style={{ minHeight: "44px" }}
                >
                  {t.filter.resetLabel[lang]}
                </button>
              )}
            </div>
          </div>

          {/* Cases-Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            {CASE_STUDIES.map((c) => (
              <CaseCard
                key={c.slug}
                caseStudy={c}
                registerRef={(el) => {
                  if (el) cardsRef.current.set(c.slug, el);
                  else cardsRef.current.delete(c.slug);
                }}
                readMoreLabel={t.readMore[lang]}
                statsTitle={t.statsTitle[lang]}
                lang={lang}
              />
            ))}
          </div>

          {/* Empty-State */}
          <div
            ref={emptyRef}
            role="status"
            aria-live="polite"
            style={{ display: "none", marginTop: "var(--mm-space-6)" }}
          >
            <p
              style={{
                margin: 0,
                padding: "var(--mm-space-5)",
                borderRadius: "var(--mm-radius-md)",
                border: "1px dashed var(--mm-color-border)",
                textAlign: "center",
                color: "var(--mm-color-muted)",
              }}
            >
              {t.filter.emptyLabel[lang]}{" "}
              <button
                type="button"
                onClick={resetFilter}
                className="mm-btn mm-btn-ghost"
                style={{ marginLeft: "var(--mm-space-3)" }}
              >
                {t.filter.resetLabel[lang]}
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="mm-section mm-section--dark"
        aria-labelledby="referenzen-cta-title"
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
            <h2 id="referenzen-cta-title" style={{ margin: 0 }}>
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
                href={`/kontakt?betreff=${encodeURIComponent(
                  lang === "en" ? "Reference project" : "Referenz-Projekt"
                )}&quelle=/referenzen`}
                className="mm-btn mm-btn-accent"
              >
                {t.ctaButton[lang]}
              </a>
              <Link href="/leistungen" className="mm-btn mm-btn-ghost">
                {lang === "en" ? "View services" : "Leistungen ansehen"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ----------------------------------------------------------------------------
   Sub-Komponenten
   ---------------------------------------------------------------------------- */

function ChipButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={active ? "mm-tag" : "mm-tag"}
      style={{
        cursor: "pointer",
        border: active
          ? "1px solid var(--mm-color-primary)"
          : "1px solid var(--mm-color-border)",
        background: active ? "var(--mm-color-primary)" : "var(--mm-color-surface)",
        color: active ? "var(--mm-color-surface)" : "var(--mm-color-text)",
        padding: "var(--mm-space-2) var(--mm-space-4)",
        minHeight: "44px",
        borderRadius: "999px",
        font: "inherit",
        fontWeight: 600,
        transition: "background var(--mm-transition), color var(--mm-transition)",
      }}
    >
      {label}
    </button>
  );
}

function CaseCard({
  caseStudy,
  registerRef,
  readMoreLabel,
  statsTitle,
  lang,
}: {
  caseStudy: CaseStudy;
  registerRef: (el: HTMLDivElement | null) => void;
  readMoreLabel: string;
  statsTitle: string;
  lang: "de" | "en";
}) {
  // data-tags kombiniert Branch + Tags für den Filter
  const allTags = [caseStudy.branch, ...caseStudy.tags].join(",");
  return (
    <div ref={registerRef}>
      <article
        className="mm-card mm-case-card"
        data-tags={allTags}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Branch-Tag + Dauer */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--mm-space-3)",
            flexWrap: "wrap",
          }}
        >
          <span className="mm-tag">{caseStudy.branchLabel}</span>
          <span
            style={{
              fontSize: "var(--mm-text-sm)",
              color: "var(--mm-color-muted)",
            }}
          >
            {lang === "en" ? "Duration" : "Laufzeit"}: {caseStudy.duration}
          </span>
        </header>

        <h3 style={{ margin: 0 }}>
          <a
            href={`/referenzen/${caseStudy.slug}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {caseStudy.title}
          </a>
        </h3>

        {/* Stats-Block */}
        <div
          role="group"
          aria-label={statsTitle}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--mm-space-3)",
            padding: "var(--mm-space-4)",
            background: "var(--mm-color-background)",
            borderRadius: "var(--mm-radius-md)",
          }}
        >
          {caseStudy.stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)",
                  fontWeight: 700,
                  color: "var(--mm-color-primary)",
                  lineHeight: 1.1,
                }}
              >
                {s.value}
                {s.suffix ?? ""}
              </div>
              <div
                style={{
                  fontSize: "var(--mm-text-xs, 0.8125rem)",
                  color: "var(--mm-color-muted)",
                  marginTop: "var(--mm-space-1)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Problem-Teaser */}
        <p
          style={{
            margin: 0,
            color: "var(--mm-color-muted)",
            fontSize: "var(--mm-text-sm)",
            lineHeight: 1.55,
            flexGrow: 1,
          }}
        >
          {caseStudy.problem.length > 220
            ? caseStudy.problem.slice(0, 220).trimEnd() + " …"
            : caseStudy.problem}
        </p>

        {/* Optional: Kundenstimme */}
        {caseStudy.quote && (
          <blockquote
            style={{
              margin: 0,
              padding: "var(--mm-space-3) var(--mm-space-4)",
              borderLeft: "3px solid var(--mm-color-accent)",
              fontStyle: "italic",
              fontSize: "var(--mm-text-sm)",
              color: "var(--mm-color-text)",
              background: "var(--mm-color-background)",
              borderRadius: "0 var(--mm-radius-sm) var(--mm-radius-sm) 0",
            }}
          >
            {caseStudy.quote}
          </blockquote>
        )}

        <a
          href={`/referenzen/${caseStudy.slug}`}
          className="mm-btn mm-btn-primary"
          style={{
            alignSelf: "flex-start",
            minHeight: "48px",
            textDecoration: "none",
          }}
        >
          {readMoreLabel}
        </a>
      </article>
    </div>
  );
}