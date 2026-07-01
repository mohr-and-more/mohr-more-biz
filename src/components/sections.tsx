"use client";

import { useLang } from "@/components/i18n-provider";
import { translations, hierarchyLevels, mermaidMindmap, mermaidFlow } from "@/lib/i18n";
import { Mermaid } from "@/components/mermaid";
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

/* ASCII art block for the hero panel — KALI orchestrator */
const KALI_ASCII = `██████  ██  ██     ██████
██  ██  ██  ██     ██  ██
██████  ██████     ██  ██
██  ██    ██     ██  ██
██  ██   ██     ████████

      ◢▣Ŀ◣™
    ⊙◬⊙  KALI
      ◥▤⫱◤

 MASTERMIND
      │
      ├── DIRECTION
      ├── ORCHESTRATION
      ├── EXECUTION
      ├── SECURITY
      ├── RESEARCH
      └── GROWTH`;

export function Hero() {
  const { lang } = useLang();
  const t = translations.hero;
  return (
    <section className="hero section" id="top">
      <div className="video-bg" aria-hidden="true">
        <video autoPlay loop muted playsInline src="/videos/SCALE.mp4" />
      </div>
      <div className="container hero-grid">
        <div>
          <span className="eyebrow reveal is-visible">{t.label[lang]}</span>
          <h1 className="hero-title reveal is-visible" dangerouslySetInnerHTML={{ __html: t.title[lang] }} />
          <p className="hero-copy reveal is-visible">{t.subtitle[lang]}</p>
          <div className="hero-actions reveal is-visible">
            <a href="#system" className="btn btn-primary">{t.ctaPrimary[lang]}</a>
            <a href="/zero-humans" className="btn btn-secondary">{t.ctaSecondary[lang]}</a>
          </div>
          <div className="hero-meta reveal is-visible" aria-label="Kennzahlen">
            {t.metrics.map((m, i) => (
              <article className="metric" key={i}>
                <strong>{m.value}</strong>
                <span>{m.label[lang]}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-panel reveal is-visible" aria-label="System status">
          <div className="panel-grid">
            <div>
              <div className="ascii-caption">
                <span>{t.panelCaptionLeft}</span>
                <span>{t.panelCaptionRight}</span>
              </div>
              <pre className="ascii-block" aria-hidden="true">{KALI_ASCII}</pre>
            </div>
            <div className="stack" aria-label="System layers">
              {t.stack.map((s, i) => (
                <article className="stack-card" key={i}>
                  <span className="stack-dot" aria-hidden="true" />
                  <div>
                    <strong>{s.title}</strong>
                    <span className="meta">{s.meta[lang]}</span>
                  </div>
                  <em>{s.state}</em>
                </article>
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
    <section className="section" id="manifest">
      <div className="video-bg" aria-hidden="true">
        <video autoPlay loop muted playsInline src="/videos/THINK.mp4" />
      </div>
      <div className="container manifesto-grid">
        <div className="lead-block reveal is-visible">
          <span className="eyebrow">{t.label[lang]}</span>
          <RevealDiv>
            <h2 className="section-title">{t.title[lang]}</h2>
          </RevealDiv>
          <RevealDiv>
            <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>{t.text[lang]}</p>
          </RevealDiv>
        </div>
        <div className="cards-block">
          {t.cards.map((c, i) => (
            <article className="vision-card reveal is-visible" key={i}>
              <span className="tag">{c.tag[lang]}</span>
              <h3>{c.title[lang]}</h3>
              <p>{c.text[lang]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SystemArchitecture() {
  const { lang } = useLang();
  const t = translations.system;
  return (
    <section className="section" id="system">
      <div className="video-bg" aria-hidden="true">
        <video autoPlay loop muted playsInline src="/videos/DEEP-TECH.mp4" />
      </div>
      <div className="container systems-grid">
        <article className="quote-panel reveal is-visible">
          <div>
            <span className="tag">{t.label[lang]}</span>
            <blockquote>{t.quote[lang]}</blockquote>
            <p>{t.quoteSub[lang]}</p>
          </div>
          <div className="ascii-caption">
            <span>MOHR &amp; MORE</span>
            <span>COLOGNE / DE</span>
          </div>
        </article>

        <div className="systems-panel reveal is-visible">
          <div className="system-top">
            <div>
              <span className="eyebrow">{t.hierarchyLabel[lang]}</span>
              <RevealDiv>
                <h2 className="section-title" style={{ marginTop: "var(--space-4)" }}>{t.title[lang]}</h2>
              </RevealDiv>
            </div>
            <div className="nav-cta" aria-hidden="true">CEO × KALI</div>
          </div>

          <div className="hierarchy-board">
            {hierarchyLevels.map((lvl, i) => (
              <article className={`level-card${lvl.exec ? " is-exec" : ""}`} key={i}>
                <div className="lvl-num">{lvl.level[lang]}</div>
                <div className="lvl-count">{lvl.count}</div>
                <div className="lvl-role">{lvl.role[lang]}</div>
                <div className="lvl-fn">{lvl.fn[lang]}</div>
              </article>
            ))}
          </div>

          {/* MMB-122 — Mermaid Mindmap */}
          <div style={{ marginTop: "var(--space-20)" }}>
            <span className="eyebrow">{t.mindmapLabel[lang]}</span>
            <RevealDiv>
              <div className="diagram-frame">
                <Mermaid chart={mermaidMindmap} ariaLabel="Mindmap Gesamtsystem Mohr & More Business" />
              </div>
            </RevealDiv>
          </div>

          {/* MMB-122 — Mermaid Auftrags- & Kommunikationsweg */}
          <div style={{ marginTop: "var(--space-12)" }}>
            <span className="eyebrow">{t.flowLabel[lang]}</span>
            <RevealDiv>
              <div className="diagram-frame">
                <Mermaid chart={mermaidFlow} ariaLabel="Auftrags- und Kommunikationsweg" />
              </div>
            </RevealDiv>
          </div>

          {/* MMB-122 — Interactive org chart */}
          <div style={{ marginTop: "var(--space-12)" }}>
            <span className="eyebrow">{t.orgchartLabel[lang]}</span>
            <RevealDiv>
              <div className="orgchart-shell">
                <iframe
                  src="/organigramm/"
                  title="MOHR & MORE — Interaktives Organigramm"
                  loading="lazy"
                />
              </div>
              <p className="section-copy" style={{ marginTop: "var(--space-3)" }}>{t.orgchartNote[lang]}</p>
            </RevealDiv>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Principles() {
  const { lang } = useLang();
  const t = translations.principles;
  return (
    <section className="section" id="principles">
      <div className="video-bg" aria-hidden="true">
        <video autoPlay loop muted playsInline src="/videos/SPEED.mp4" />
      </div>
      <div className="narrow reveal is-visible">
        <span className="eyebrow">{t.label[lang]}</span>
        <RevealDiv>
          <h2 className="section-title" style={{ marginTop: "var(--space-4)", maxWidth: "14ch" }}>{t.title[lang]}</h2>
        </RevealDiv>
        <RevealDiv>
          <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>{t.text[lang]}</p>
        </RevealDiv>
      </div>
      <div className="container principles">
        {t.items.map((item, i) => (
          <article className="ethos-card reveal is-visible" key={i}>
            <span className="tag">{item.num}</span>
            <strong>{item.title[lang]}</strong>
            <p>{item.text[lang]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Vision() {
  const { lang } = useLang();
  const t = translations.vision;
  return (
    <section className="section" id="vision">
      <div className="video-bg" aria-hidden="true">
        <video autoPlay loop muted playsInline src="/videos/SCALE.mp4" />
      </div>
      <div className="container vision-grid">
        <div className="lead-block reveal is-visible">
          <span className="eyebrow">{t.label[lang]}</span>
          <RevealDiv>
            <h2 className="section-title">{t.title[lang]}</h2>
          </RevealDiv>
          <RevealDiv>
            <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>{t.text[lang]}</p>
          </RevealDiv>
        </div>
        <div className="cards-block">
          {t.cards.map((c, i) => (
            <article className="vision-card reveal is-visible" key={i}>
              <span className="tag">{c.tag[lang]}</span>
              <h3>{c.title[lang]}</h3>
              <p>{c.text[lang]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { lang } = useLang();
  const t = translations.contact;
  return (
    <section className="closing" id="kontakt">
      <div className="video-bg" aria-hidden="true">
        <video autoPlay loop muted playsInline src="/videos/SPEED.mp4" />
      </div>
      <div className="container closing-shell reveal is-visible">
        <span className="eyebrow">{t.label[lang]}</span>
        <RevealDiv>
          <h2>{t.title[lang]}</h2>
        </RevealDiv>
        <RevealDiv>
          <p>{t.text[lang]}</p>
        </RevealDiv>
        <div className="closing-bar">
          <a href="mailto:info@mohr-more.biz" className="btn btn-primary">{t.ctaPrimary[lang]}</a>
          <div className="footer-note">
            MOHR &amp; MORE BUSINESS — Intelligent Automation / Software Solutions / Agentic Agent Systems
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { lang } = useLang();
  const t = translations.footer;
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <p className="footer-note">Built in monochrome. Accented with signal-light. Structured for the next era.</p>
        </div>
        <div>
          <p className="footer-note">{t.copyright[lang]}</p>
        </div>
      </div>
    </footer>
  );
}
