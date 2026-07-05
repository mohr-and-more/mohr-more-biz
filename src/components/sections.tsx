"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { useEffect, useRef } from "react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function Hero() {
  const { lang } = useLang();
  const t = translations.hero;
  return (
    <section className="hero relative flex min-h-[90vh] flex-col justify-center overflow-hidden pt-16">
      <div className="video-bg" aria-hidden="true">
        <video autoPlay loop muted playsInline src="/videos/SCALE.mp4" />
      </div>
      <div className="hero-glow pointer-events-none absolute -right-[10%] -top-[20%] h-[600px] w-[600px] blur-[60px]" />
      <div className="container hero-grid">
        <div>
          <span className="label mb-4 block reveal is-visible">
            <span className="accent-line" />
            {t.label[lang]}
          </span>
          <h1
            className="hero-title reveal is-visible"
            dangerouslySetInnerHTML={{ __html: t.title[lang] }}
          />
          <p
            className="hero-copy reveal is-visible"
            dangerouslySetInnerHTML={{ __html: t.subtitle[lang] }}
          />
          <div className="hero-actions reveal is-visible">
            <a href="#kontakt" className="btn btn-primary">
              {t.ctaPrimary[lang]}
            </a>
            <a href="#system" className="btn btn-secondary">
              {t.ctaSecondary[lang]}
            </a>
          </div>
          <div className="hero-meta reveal is-visible" aria-label="Kennzahlen">
            {[
              { value: "272", label: { de: "Agenten", en: "Agents" } },
              { value: "5", label: { de: "Ebenen", en: "Levels" } },
              { value: "24/7", label: { de: "Operativ", en: "Operative" } },
            ].map((m, i) => (
              <article className="metric" key={i}>
                <strong>{m.value}</strong>
                <span>{m.label[lang]}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-panel reveal is-visible" aria-label="Sparten-Übersicht">
          <div className="panel-grid">
            <div>
              <div className="ascii-caption">
                <span>MOHR &amp; MORE</span>
                <span>ZERO-HUMAN</span>
              </div>
              <pre className="ascii-block" aria-hidden="true">
{`██   ██  ██████  ██   ██  ██████
██   ██  ██  ██  ███  ██    ██
███████  ██████  ██ █ ██    ██
██   ██  ██  ██  ██  ███    ██
██   ██  ██  ██  ██   ██  ██████

       ◢▣Ŀ◣ COMPANY
    ⊙◬⊙  COLOGNE™
       ◥▤⫱◤

    ONE · HUMAN · ONE · AI`}
              </pre>
            </div>
            <div className="stack" aria-label="Sparten">
              {[
                { title: lang === "de" ? "Commerce" : "Commerce", meta: lang === "de" ? "Gregor Mohr · Module 01" : "Gregor Mohr · Module 01", state: lang === "de" ? "Aktiv" : "Active" },
                { title: lang === "de" ? "Technology" : "Technology", meta: lang === "de" ? "Gunnar Mohr · Module 02" : "Gunnar Mohr · Module 02", state: lang === "de" ? "Aktiv" : "Active" },
                { title: lang === "de" ? "KI Entwicklung" : "AI Development", meta: lang === "de" ? "Sparte Development →" : "Development Division →", state: "—", href: "/ki-entwicklung" },
              ].map((s, i) => (
                s.href ? (
                  <a key={i} href={s.href} className="stack-card" style={{ textDecoration: "none", color: "inherit" }}>
                    <span className="stack-dot" aria-hidden="true" />
                    <div>
                      <strong>{s.title}</strong>
                      <span className="meta">{s.meta}</span>
                    </div>
                    <em>{s.state}</em>
                  </a>
                ) : (
                  <article className="stack-card" key={i}>
                    <span className="stack-dot" aria-hidden="true" />
                    <div>
                      <strong>{s.title}</strong>
                      <span className="meta">{s.meta}</span>
                    </div>
                    <em>{s.state}</em>
                  </article>
                )
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function Manifest() {
  const { lang } = useLang();
  const t = translations.manifest;
  return (
    <section id="manifest" className="section">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="label mb-4 block">
          <span className="accent-line" />
          {t.label[lang]}
        </span>
        <RevealDiv>
          <h2 dangerouslySetInnerHTML={{ __html: t.title[lang] }} />
        </RevealDiv>
        <RevealDiv>
          <p className="manifest-text mt-6" dangerouslySetInnerHTML={{ __html: t.text[lang] }} />
        </RevealDiv>
      </div>
    </section>
  );
}

export function SystemArchitecture() {
  const { lang } = useLang();
  const t = translations.system;
  return (
    <section id="system" className="section">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="label mb-4 block">
          <span className="accent-line" />
          {t.label[lang]}
        </span>
        <RevealDiv>
          <h2 dangerouslySetInnerHTML={{ __html: t.title[lang] }} />
        </RevealDiv>

        <div className="system-grid mt-12 grid max-w-[720px] grid-cols-1 gap-6 sm:grid-cols-2">
          {[t.module01, t.module02].map((mod, i) => (
            <RevealDiv key={i}>
              <article className="sys-card">
                <div className="module-badge">{mod.badge}</div>
                <div className="role">{mod.role[lang]}</div>
                <h3 className="mb-4 mt-2 text-accent">{mod.title[lang]}</h3>
                <ul className="flex flex-col gap-2.5">
                  {mod.items.map((item, j) => (
                    <li key={j} className="relative pl-4 text-sm text-[#888]">
                      <span className="absolute left-0 text-[var(--text-secondary)]">—</span>
                      {item[lang]}
                    </li>
                  ))}
                </ul>
              </article>
            </RevealDiv>
          ))}
        </div>

        <RevealDiv className="mt-8">
          {/* ═══ Responsive System Integration Map ═══
              Replaces the fixed-width ASCII <pre> (63 cols, overflow on mobile).
              Desktop ≥640px: two modules side-by-side with sync connector.
              Mobile <640px: vertical stack with downward connectors.
              Preserves terminal/brutalist aesthetic (monospace, design tokens). */}
          <div
            className="sysmap mx-auto w-full max-w-[640px] overflow-hidden border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            {/* ── Header bar ── */}
            <div
              className="sysmap-header border-b px-4 py-3 text-center"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="font-mono text-[0.6rem] uppercase tracking-[0.2em] sm:text-xs"
                style={{ color: "var(--text)" }}
              >
                M&nbsp;O&nbsp;H&nbsp;R&nbsp;&nbsp;&amp;&nbsp;&nbsp;M&nbsp;O&nbsp;R&nbsp;E&nbsp;&nbsp;B&nbsp;U&nbsp;S&nbsp;I&nbsp;N&nbsp;E&nbsp;S&nbsp;S
              </div>
              <div
                className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.15em] sm:text-[0.65rem]"
                style={{ color: "var(--text-secondary)" }}
              >
                System Integration Map
              </div>
            </div>

            {/* ── Body ── */}
            <div className="sysmap-body p-4 sm:p-6">
              {/* Top row: two modules — side-by-side on ≥640px, stacked on mobile */}
              <div className="sysmap-modules grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                <div
                  className="sysmap-module min-w-0 border p-3 sm:p-4"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div
                    className="font-mono text-[0.55rem] uppercase tracking-wider sm:text-[0.65rem]"
                    style={{ color: "var(--accent)" }}
                  >
                    COMMERCE MODULE
                  </div>
                  <ul className="mt-2 flex flex-col gap-1">
                    {["trabusco", "alles10euro", "TENIOS", "ZigZag/BuyBay"].map((item) => (
                      <li
                        key={item}
                        className="font-mono text-[0.6rem] leading-relaxed sm:text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span style={{ color: "var(--accent)" }}>&gt;</span> {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="mt-2 font-mono text-[0.55rem] sm:text-[0.65rem]"
                    style={{ color: "var(--text)" }}
                  >
                    Gregor Mohr
                  </div>
                </div>

                <div
                  className="sysmap-module min-w-0 border p-3 sm:p-4"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div
                    className="font-mono text-[0.55rem] uppercase tracking-wider sm:text-[0.65rem]"
                    style={{ color: "var(--accent)" }}
                  >
                    TECHNOLOGY MODULE
                  </div>
                  <ul className="mt-2 flex flex-col gap-1">
                    {["TerminTelefon", "Flowfon", "KI Berater", "Full-Stack"].map((item) => (
                      <li
                        key={item}
                        className="font-mono text-[0.6rem] leading-relaxed sm:text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span style={{ color: "var(--accent)" }}>&gt;</span> {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="mt-2 font-mono text-[0.55rem] sm:text-[0.65rem]"
                    style={{ color: "var(--text)" }}
                  >
                    Gunnar Mohr
                  </div>
                </div>
              </div>

              {/* Sync connector — bidirectional arrows on desktop, vertical on mobile */}
              <div className="sysmap-connector flex items-center justify-center py-2 sm:py-3">
                <span
                  className="font-mono text-[0.55rem] uppercase tracking-wider sm:text-[0.65rem]"
                  style={{ color: "var(--accent)" }}
                >
                  {"↗"} sync {"↗"}
                </span>
              </div>

              {/* Execution Layer */}
              <div
                className="sysmap-exec min-w-0 border p-3 sm:p-4"
                style={{ borderColor: "var(--accent)", background: "var(--surface)" }}
              >
                <div
                  className="text-center font-mono text-[0.55rem] uppercase tracking-[0.15em] sm:text-[0.65rem]"
                  style={{ color: "var(--accent)" }}
                >
                  Execution Layer
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
                  {["KI-Agenten", "Automatisierung", "SaaS Plattform", "Full-Stack Dev"].map((item) => (
                    <div
                      key={item}
                      className="text-center font-mono text-[0.6rem] leading-relaxed sm:text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Down arrow */}
              <div className="flex items-center justify-center py-1 sm:py-2">
                <span className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                  {"↓"}
                </span>
              </div>

              {/* Output */}
              <div
                className="sysmap-output min-w-0 border p-3 text-center sm:p-4"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              >
                <div
                  className="font-mono text-[0.55rem] uppercase tracking-[0.15em] sm:text-[0.65rem]"
                  style={{ color: "var(--text)" }}
                >
                  Output
                </div>
                <div
                  className="mt-1 font-mono text-[0.6rem] sm:text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Commerce {"×"} Tech = Value
                </div>
              </div>
            </div>

            {/* ── Status bar ── */}
            <div
              className="sysmap-status flex items-center justify-center gap-4 border-t px-4 py-2 sm:gap-8"
              style={{ borderColor: "var(--border)" }}
            >
              {[
                ["STATUS", "ONLINE"],
                ["SYNC", "ACTIVE"],
                ["UPTIME", "99.9%"],
              ].map(([label, value]) => (
                <div key={label} className="text-center">
                  <span
                    className="font-mono text-[0.5rem] uppercase tracking-wider sm:text-[0.6rem]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}:
                  </span>{" "}
                  <span
                    className="font-mono text-[0.5rem] uppercase sm:text-[0.6rem]"
                    style={{ color: "var(--accent)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

export function Principles() {
  const { lang } = useLang();
  const t = translations.principles;
  return (
    <section id="principles" className="section">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="label mb-4 block">
          <span className="accent-line" />
          {t.label[lang]}
        </span>
        <RevealDiv>
          <h2 dangerouslySetInnerHTML={{ __html: t.title[lang] }} />
        </RevealDiv>
        <div className="principles-grid mt-12 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--border)" }}>
          {t.items.map((item) => (
            <div key={item.num} className="principle-cell flex flex-col" style={{ background: "var(--bg)" }}>
              <span className="font-mono text-xs text-[var(--text-secondary)]">{item.num}</span>
              <h4 className="my-3 text-lg font-bold uppercase tracking-tight text-text">{item.title[lang]}</h4>
              <p className="mb-0 flex-1 text-sm text-[#777]">{item.text[lang]}</p>
              <video
                className="mt-8 h-[180px] w-full rounded border object-cover opacity-80"
                style={{ borderColor: "#333" }}
                autoPlay
                loop
                muted
                playsInline
                src={item.video}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Vision() {
  const { lang } = useLang();
  const t = translations.vision;
  return (
    <section id="vision" className="section">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="vision-block border-l pl-6 sm:pl-8 lg:pl-12" style={{ borderColor: "var(--border)" }}>
          <RevealDiv>
            <span className="label mb-4 block">
              <span className="accent-line" />
              {t.label[lang]}
            </span>
            <h2 className="mb-6" dangerouslySetInnerHTML={{ __html: t.title[lang] }} />
          </RevealDiv>
          <RevealDiv>
            <p className="max-w-[65ch] text-lg text-[#999]">{t.text[lang]}</p>
          </RevealDiv>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { lang } = useLang();
  const t = translations.contact;
  return (
    <section id="kontakt" className="section flex flex-col items-center text-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="label mb-4 block">
          <span className="accent-line" />
          {t.label[lang]}
        </span>
        <RevealDiv>
          <h2 className="mb-4" dangerouslySetInnerHTML={{ __html: t.title[lang] }} />
        </RevealDiv>
        <RevealDiv>
          <p className="mx-auto mb-8 max-w-[600px] text-[#777]">{t.text[lang]}</p>
        </RevealDiv>
        <RevealDiv>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:info@mohr-more.biz" className="btn btn-primary">
              {t.ctaPrimary[lang]}
            </a>
            <a href="https://linkedin.com/in/gregormohr" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              {t.linkedinGregor}
            </a>
            <a href="https://linkedin.com/in/gunmo" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              {t.linkedinGunnar}
            </a>
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}

export function Footer() {
  const { lang } = useLang();
  const t = translations.footer;
  return (
    <footer className="border-t py-8" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-[#444]">{t.copyright[lang]}</p>
        <div className="flex gap-6">
          <a href="#" className="font-mono text-[0.7rem] text-[#555] no-underline hover:text-[var(--text-secondary)]">
            {t.impressum[lang]}
          </a>
          <a href="#" className="font-mono text-[0.7rem] text-[#555] no-underline hover:text-[var(--text-secondary)]">
            {t.privacy[lang]}
          </a>
        </div>
      </div>
    </footer>
  );
}
