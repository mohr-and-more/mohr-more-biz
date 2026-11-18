"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { TEAM_MEMBERS, TIMELINE, VALUES } from "@/data/about";

/* -------------------------------------------------------------------------- */
/*  SVG-Icons (inline, monochrom, currentColor)                               */
/* -------------------------------------------------------------------------- */

type IconProps = { size?: number; className?: string };

function CompassIcon({ size = 28, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function ShieldIcon({ size = 28, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ZapIcon({ size = 28, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function UsersIcon({ size = 28, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ValueIcon({ name }: { name: "compass" | "shield" | "zap" | "users" }) {
  switch (name) {
    case "compass":
      return <CompassIcon />;
    case "shield":
      return <ShieldIcon />;
    case "zap":
      return <ZapIcon />;
    case "users":
      return <UsersIcon />;
  }
}

/* -------------------------------------------------------------------------- */
/*  Avatar-Platzhalter: monochrome SVG mit Initialen                          */
/*  Sobald echte Fotos vorliegen, einfach <img src=... /> ersetzen.          */
/* -------------------------------------------------------------------------- */

function AvatarPlaceholder({ name, size = 96 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label={`Avatar-Platzhalter für ${name}`}
      style={{ display: "block" }}
    >
      <rect
        x={0}
        y={0}
        width={96}
        height={96}
        rx={48}
        fill="var(--mm-color-background)"
        stroke="var(--mm-color-border)"
        strokeWidth={2}
      />
      <text
        x={48}
        y={48}
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="var(--mm-font-display, system-ui)"
        fontWeight={700}
        fontSize={32}
        fill="var(--mm-color-primary)"
      >
        {initials}
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Team-Karte                                                                */
/* -------------------------------------------------------------------------- */

function TeamCard({
  member,
}: {
  member: (typeof TEAM_MEMBERS)[number];
}) {
  return (
    <article className="mm-card mm-team-card">
      <AvatarPlaceholder name={member.name} size={96} />
      <h3 style={{ marginTop: "var(--mm-space-4)" }}>{member.name}</h3>
      <p
        className="mm-tag"
        style={{
          marginTop: "var(--mm-space-2)",
          // mm-tag ist eher ein Block; für Avatar-Karten zentriert
        }}
      >
        <span lang="de">{member.role.de}</span>
        <span lang="en" hidden>
          {member.role.en}
        </span>
      </p>
      <p
        style={{
          color: "var(--mm-color-muted)",
          fontSize: "var(--mm-text-sm)",
          marginTop: "var(--mm-space-3)",
          maxWidth: "32ch",
        }}
      >
        <span lang="de">{member.bio.de}</span>
        <span lang="en" hidden>
          {member.bio.en}
        </span>
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Haupt-Komponente                                                          */
/* -------------------------------------------------------------------------- */

export function DeUeberUnsPage() {
  const { lang } = useLang();
  const t = translations.about;

  return (
    <main>
      {/* Skip-Link für Tastatur-Nutzer (Plan-Punkt 14) */}
      <a href="#main" className="mm-skip-link">
        {lang === "de" ? "Zum Hauptinhalt springen" : "Skip to main content"}
      </a>

      {/* ── HERO ── */}
      <section className="mm-hero" aria-labelledby="ueber-uns-hero-title">
        <div className="mm-container" id="main">
          <nav
            aria-label="Breadcrumb"
            style={{
              fontSize: "var(--mm-text-sm)",
              color: "var(--mm-color-muted)",
              marginBottom: "var(--mm-space-6)",
            }}
          >
            <a
              href="/de"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {lang === "de" ? "Startseite" : "Home"}
            </a>
            <span aria-hidden="true" style={{ margin: "0 8px" }}>
              /
            </span>
            <span style={{ color: "var(--mm-color-text)" }}>
              {t.hero.label[lang]}
            </span>
          </nav>

          <div className="mm-hero-text">
            <span className="mm-tag">{t.hero.label[lang]}</span>
            <h1 id="ueber-uns-hero-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.hero.title[lang]}
            </h1>
            <p>{t.hero.intro[lang]}</p>
            <div className="mm-hero-actions">
              <a
                href="/kontakt?betreff=Beratung&quelle=/ueber-uns"
                className="mm-btn mm-btn-primary"
              >
                {t.hero.ctaPrimary[lang]}
              </a>
              <a href="/leistungen" className="mm-btn mm-btn-secondary">
                {t.hero.ctaSecondary[lang]}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION / INTRO ── */}
      <section
        className="mm-section"
        aria-labelledby="mission-title"
      >
        <div className="mm-container mm-container--narrow">
          <span className="mm-tag">{t.intro.label[lang]}</span>
          <h2 id="mission-title" style={{ marginTop: "var(--mm-space-3)" }}>
            {t.intro.title[lang]}
          </h2>
          <p
            style={{
              color: "var(--mm-color-muted)",
              fontSize: "var(--mm-text-base)",
              marginTop: "var(--mm-space-4)",
            }}
          >
            {t.intro.text[lang]}
          </p>

          {/* Meta-Fakten-Block (Standort / Gegründet / Fokus) */}
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "var(--mm-space-4)",
              marginTop: "var(--mm-space-8)",
              padding: "var(--mm-space-5)",
              border: "1px solid var(--mm-color-border)",
              borderRadius: "var(--mm-radius-md)",
              background: "var(--mm-color-surface)",
            }}
          >
            <div>
              <dt
                style={{
                  fontFamily: "var(--mm-font-mono)",
                  fontSize: "var(--mm-text-xs)",
                  color: "var(--mm-color-faint)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t.intro.meta.location[lang]}
              </dt>
              <dd
                style={{
                  marginTop: "var(--mm-space-1)",
                  fontWeight: 600,
                  color: "var(--mm-color-text)",
                }}
              >
                {t.intro.meta.locationValue[lang]}
              </dd>
            </div>
            <div>
              <dt
                style={{
                  fontFamily: "var(--mm-font-mono)",
                  fontSize: "var(--mm-text-xs)",
                  color: "var(--mm-color-faint)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t.intro.meta.founded[lang]}
              </dt>
              <dd
                style={{
                  marginTop: "var(--mm-space-1)",
                  fontWeight: 600,
                  color: "var(--mm-color-text)",
                }}
              >
                {t.intro.meta.foundedValue[lang]}
              </dd>
            </div>
            <div>
              <dt
                style={{
                  fontFamily: "var(--mm-font-mono)",
                  fontSize: "var(--mm-text-xs)",
                  color: "var(--mm-color-faint)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t.intro.meta.focus[lang]}
              </dt>
              <dd
                style={{
                  marginTop: "var(--mm-space-1)",
                  fontWeight: 600,
                  color: "var(--mm-color-text)",
                }}
              >
                {t.intro.meta.focusValue[lang]}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section
        id="team"
        className="mm-section"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="team-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-10)" }}>
            <span className="mm-tag">{t.team.label[lang]}</span>
            <h2 id="team-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.team.title[lang]}
            </h2>
            <p
              style={{
                maxWidth: "60ch",
                color: "var(--mm-color-muted)",
                marginTop: "var(--mm-space-3)",
              }}
            >
              {t.team.subtitle[lang]}
            </p>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            {TEAM_MEMBERS.map((m) => (
              <TeamCard key={m.slug} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section
        id="timeline"
        className="mm-section"
        aria-labelledby="timeline-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-10)" }}>
            <span className="mm-tag">{t.timeline.label[lang]}</span>
            <h2 id="timeline-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.timeline.title[lang]}
            </h2>
            <p
              style={{
                maxWidth: "60ch",
                color: "var(--mm-color-muted)",
                marginTop: "var(--mm-space-3)",
              }}
            >
              {t.timeline.subtitle[lang]}
            </p>
          </header>

          <div className="mm-timeline" role="list">
            {TIMELINE.map((entry) => (
              <article key={entry.year} className="mm-tl-item" role="listitem">
                <span className="mm-tl-year">{entry.year}</span>
                <h3
                  style={{
                    margin: 0,
                    color: "var(--mm-color-text)",
                  }}
                >
                  <span lang="de">{entry.title.de}</span>
                  <span lang="en" hidden>
                    {entry.title.en}
                  </span>
                </h3>
                <p style={{ marginTop: "var(--mm-space-2)" }}>
                  <span lang="de">{entry.description.de}</span>
                  <span lang="en" hidden>
                    {entry.description.en}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section
        id="values"
        className="mm-section"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="values-title"
      >
        <div className="mm-container">
          <header style={{ marginBottom: "var(--mm-space-10)" }}>
            <span className="mm-tag">{t.values.label[lang]}</span>
            <h2 id="values-title" style={{ marginTop: "var(--mm-space-3)" }}>
              {t.values.title[lang]}
            </h2>
            <p
              style={{
                maxWidth: "60ch",
                color: "var(--mm-color-muted)",
                marginTop: "var(--mm-space-3)",
              }}
            >
              {t.values.subtitle[lang]}
            </p>
          </header>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            {VALUES.map((v) => (
              <li key={v.icon} className="mm-card">
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-grid",
                    placeItems: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--mm-radius-md)",
                    background: "var(--mm-color-surface)",
                    color: "var(--mm-color-primary)",
                    border: "1px solid var(--mm-color-border)",
                  }}
                >
                  <ValueIcon name={v.icon} />
                </span>
                <h3 style={{ marginTop: "var(--mm-space-3)" }}>
                  <span lang="de">{v.title.de}</span>
                  <span lang="en" hidden>
                    {v.title.en}
                  </span>
                </h3>
                <p
                  style={{
                    marginTop: "var(--mm-space-2)",
                    color: "var(--mm-color-muted)",
                    fontSize: "var(--mm-text-sm)",
                  }}
                >
                  <span lang="de">{v.description.de}</span>
                  <span lang="en" hidden>
                    {v.description.en}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="mm-section mm-section--tight"
        aria-labelledby="ueber-uns-cta-title"
        style={{
          background: "var(--mm-color-background)",
          textAlign: "center",
        }}
      >
        <div className="mm-container mm-container--narrow">
          <h2 id="ueber-uns-cta-title">{t.cta.title[lang]}</h2>
          <p
            style={{
              color: "var(--mm-color-muted)",
              maxWidth: "55ch",
              margin: "0 auto var(--mm-space-6)",
            }}
          >
            {t.cta.text[lang]}
          </p>
          <div
            className="mm-hero-actions"
            style={{ justifyContent: "center" }}
          >
            <a
              href="/kontakt?betreff=Beratung&quelle=/ueber-uns"
              className="mm-btn mm-btn-primary"
            >
              {t.cta.primary[lang]}
            </a>
            <a href="/leistungen" className="mm-btn mm-btn-secondary">
              {t.cta.secondary[lang]}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}