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

const lazyCodeMetrics = [
  { value: "12+", label: { de: "Sprachen / Stacks", en: "Languages / Stacks" } },
  { value: "50+", label: { de: "Projekte geliefert", en: "Projects delivered" } },
  { value: "24/7", label: { de: "Support & Deployments", en: "Support & Deployments" } },
];

const lazyCodeStack = [
  { title: "Frontend", meta: { de: "React, Next.js, TypeScript", en: "React, Next.js, TypeScript" }, state: "Modern" },
  { title: "Backend", meta: { de: "Node.js, Python, Rust", en: "Node.js, Python, Rust" }, state: "Robust" },
  { title: "Cloud", meta: { de: "AWS, Cloudflare, Docker", en: "AWS, Cloudflare, Docker" }, state: "Scalable" },
];

export function LazyCodePage() {
  const { lang } = useLang();
  
  return (
    <main>
      {/* Sparte-Context-Banner */}
      <nav
        aria-label={lang === "de" ? "Sparten-Kontext" : "Division context"}
        className="sparte-banner"
        style={{
          position: "relative",
          marginTop: "64px",
          padding: "var(--space-4) var(--space-6)",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
          background: "linear-gradient(180deg, rgba(159,248,242,0.05), transparent)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ color: "var(--accent)" }}>KI Entwicklung</span>
        <span style={{ margin: "0 0.6rem", opacity: 0.6 }}>›</span>
        <span>
          {lang === "de" ? "Sparte 02 · Development · LazyCode⋮Cologne" : "Division 02 · Development · LazyCode⋮Cologne"}
        </span>
        {" · "}
        <a href="/ki-entwicklung" style={{ color: "inherit", textDecoration: "underline" }}>
          {lang === "de" ? "← zur Übersicht" : "← overview"}
        </a>
      </nav>

      {/* Hero */}
      <section className="hero section" id="top">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/SCALE.mp4" />
        </div>
        <div className="container hero-grid">
          <div>
            <span className="eyebrow reveal is-visible">LAZY CODE — COLOGNE</span>
            <h1 className="hero-title reveal is-visible" dangerouslySetInnerHTML={{ 
              __html: lang === "de" 
                ? "Wir bauen <span class='glow'>Unternehmen</span>, die wie Software skalieren." 
                : "We build <span class='glow'>companies</span> that scale like software." 
            }} />
            <p className="hero-copy reveal is-visible">
              {lang === "de"
                ? "LazyCode⋮Cologne: Full-Stack Entwicklung, Cloud-Architektur und Automatisierung aus Köln. MVPs bis Enterprise-Systeme — skalierbar, wartbar, zukunftssicher."
                : "LazyCode⋮Cologne: Full-stack development, cloud architecture and automation from Cologne. MVPs to enterprise systems — scalable, maintainable, future-proof."}
            </p>
            <div className="hero-actions reveal is-visible">
              <a href="#manifest" className="btn btn-primary">
                {lang === "de" ? "Mehr erfahren" : "Learn more"}
              </a>
              <a href="#kontakt" className="btn btn-secondary">
                {lang === "de" ? "Projekt anfragen" : "Request project"}
              </a>
            </div>
            <div className="hero-meta reveal is-visible" aria-label="Kennzahlen">
              {lazyCodeMetrics.map((m, i) => (
                <article className="metric" key={i}>
                  <strong>{m.value}</strong>
                  <span>{m.label[lang]}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className="hero-panel reveal is-visible" aria-label="Stack">
            <div className="panel-grid">
              <div>
                <div className="ascii-caption">
                  <span>LAZY CODE</span>
                  <span>FULL-STACK</span>
                </div>
                <pre className="ascii-block" aria-hidden="true">
{`██████  ██  ██     ██████
██  ██  ██  ██     ██  ██
██████  ██████     ██  ██
██  ██    ██     ██  ██
██  ██   ██     ████████

      ◢▣Ŀ◣™
    ⊙◬⊙  COLOGNE
      ◥▤⫱◤

 SOFTWARE`}
                </pre>
              </div>
              <div className="stack" aria-label="Tech Stack">
                {lazyCodeStack.map((s, i) => (
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

      {/* Manifest */}
      <section className="section" id="manifest">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/THINK.mp4" />
        </div>
        <div className="container manifesto-grid">
          <div className="lead-block reveal is-visible">
            <span className="eyebrow">LAZY CODE MANIFEST</span>
            <RevealDiv>
              <h2 className="section-title">
                {lang === "de" ? "Software, die Probleme vorwegnimmt." : "Software that anticipates problems."}
              </h2>
            </RevealDiv>
            <RevealDiv>
              <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>
                {lang === "de"
                  ? "Wir bauen skalierbare Software-Systeme — von MVP bis Enterprise. Full-Stack Entwicklung, Cloud-Architektur und Automatisierung aus Köln."
                  : "We build scalable software systems — from MVP to enterprise. Full-stack development, cloud architecture, and automation from Cologne."}
              </p>
            </RevealDiv>
          </div>
          <div className="cards-block">
            {[
              {
                tag: lang === "de" ? "Full-Stack" : "Full-Stack",
                title: lang === "de" ? "Frontend bis Backend" : "Frontend to Backend",
                text: lang === "de"
                  ? "React, Next.js, Node.js, Python, Rust — wir entwickeln in modernen Tech-Stacks."
                  : "React, Next.js, Node.js, Python, Rust — we develop with modern tech stacks."
              },
              {
                tag: lang === "de" ? "Cloud-Native" : "Cloud-Native",
                title: lang === "de" ? "Built for Scale" : "Built for Scale",
                text: lang === "de"
                  ? "AWS, Cloudflare, Docker, K8s — skalierbare Architektur von Tag eins."
                  : "AWS, Cloudflare, Docker, K8s — scalable architecture from day one."
              },
              {
                tag: lang === "de" ? "Automation" : "Automation",
                title: lang === "de" ? "CI/CD + DevOps" : "CI/CD + DevOps",
                text: lang === "de"
                  ? "Automatisierte Deployments, Monitoring, Logging — Software für den Betrieb."
                  : "Automated deployments, monitoring, logging — software built for operations."
              },
              {
                tag: lang === "de" ? "Performance" : "Performance",
                title: lang === "de" ? "Schnell & Effizient" : "Fast & Efficient",
                text: lang === "de"
                  ? "Code-Optimierung, Caching, Load-Balancing — Performance built-in."
                  : "Code optimization, caching, load-balancing — performance built-in."
              },
            ].map((c, i) => (
              <article className="vision-card reveal is-visible" key={i}>
                <span className="tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section" id="principles">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/SPEED.mp4" />
        </div>
        <div className="narrow reveal is-visible">
          <span className="eyebrow">
            {lang === "de" ? "PRINZIPIEN" : "PRINCIPLES"}
          </span>
          <RevealDiv>
            <h2 className="section-title" style={{ marginTop: "var(--space-4)", maxWidth: "14ch" }}>
              {lang === "de" ? "Built fast. Built right." : "Built fast. Built right."}
            </h2>
          </RevealDiv>
          <RevealDiv>
            <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>
              {lang === "de"
                ? "Wir optimieren nicht nur für Features — wir bauen für Wartbarkeit, Skalierbarkeit und langfristigen Wert."
                : "We don't just optimize for features — we build for maintainability, scalability, and long-term value."}
            </p>
          </RevealDiv>
        </div>
        <div className="container principles">
          {[
            {
              num: "01",
              title: lang === "de" ? "Modern Stack." : "Modern Stack.",
              text: lang === "de"
                ? "React, Next.js, TypeScript, Rust — bewährte Technologien mit aktiver Community."
                : "React, Next.js, TypeScript, Rust — proven technologies with active communities."
            },
            {
              num: "02",
              title: lang === "de" ? "Clean Code." : "Clean Code.",
              text: lang === "de"
                ? "Lesbar, testbar, wartbar — jeder Commit folgt Best Practices."
                : "Readable, testable, maintainable — every commit follows best practices."
            },
            {
              num: "03",
              title: lang === "de" ? "Ship Fast." : "Ship Fast.",
              text: lang === "de"
                ? "CI/CD, automatisiertes Testing, schneller Feedback-Loop — Features in Tagen, nicht Monaten."
                : "CI/CD, automated testing, fast feedback loops — features in days, not months."
            },
            {
              num: "04",
              title: lang === "de" ? "Scale Smart." : "Scale Smart.",
              text: lang === "de"
                ? "Serverless, Edge Computing, Caching — Performance auf allen Ebenen."
                : "Serverless, edge computing, caching — performance at every level."
            },
            {
              num: "05",
              title: lang === "de" ? "Secure by Default." : "Secure by Default.",
              text: lang === "de"
                ? "Security Reviews, Dependency Scanning, Best Practices — kein Kompromiss."
                : "Security reviews, dependency scanning, best practices — no compromise."
            },
            {
              num: "06",
              title: lang === "de" ? "Customer Focus." : "Customer Focus.",
              text: lang === "de"
                ? "Wir bauen, was Nutzer brauchen — nicht was wir toll finden."
                : "We build what users need — not what we think is cool."
            },
          ].map((item, i) => (
            <article className="ethos-card reveal is-visible" key={i}>
              <span className="tag">{item.num}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="section" id="vision">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/SCALE.mp4" />
        </div>
        <div className="container vision-grid">
          <div className="lead-block reveal is-visible">
            <span className="eyebrow">
              {lang === "de" ? "VISION" : "VISION"}
            </span>
            <RevealDiv>
              <h2 className="section-title">
                {lang === "de"
                  ? "Software, die mitwächst."
                  : "Software that grows with you."}
              </h2>
            </RevealDiv>
            <RevealDiv>
              <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>
                {lang === "de"
                  ? "Lazy Code baut Software, die heute funktioniert und morgen skaliert. Von MVP bis Produktions-Workload — wir bleiben Partner, nicht Lieferant."
                  : "Lazy Code builds software that works today and scales tomorrow. From MVP to production workload — we stay partners, not vendors."}
              </p>
            </RevealDiv>
          </div>
          <div className="cards-block">
            {[
              {
                tag: lang === "de" ? "MVP" : "MVP",
                title: lang === "de" ? "Proof of Concept" : "Proof of Concept",
                text: lang === "de"
                  ? "Ideen validieren, Nutzer-Feedback einholen, iterieren — schnell zum Produkt."
                  : "Validate ideas, gather user feedback, iterate — fast to product."
              },
              {
                tag: lang === "de" ? "Scale" : "Scale",
                title: lang === "de" ? "Enterprise-Ready" : "Enterprise-Ready",
                text: lang === "de"
                  ? "Architektur, Security, Compliance — bereit für Wachstum."
                  : "Architecture, security, compliance — ready for growth."
              },
              {
                tag: lang === "de" ? "Support" : "Support",
                title: lang === "de" ? "Partner, nicht Vendor" : "Partner, not Vendor",
                text: lang === "de"
                  ? "Monitoring, Bug-Fixes, Optimierung — wir bleiben an Bord."
                  : "Monitoring, bug fixes, optimization — we stay on board."
              },
              {
                tag: lang === "de" ? "Future" : "Future",
                title: lang === "de" ? "Next-Gen Features" : "Next-Gen Features",
                text: lang === "de"
                  ? "AI-Integration, Automatisierung, Innovation — Blick nach vorne."
                  : "AI integration, automation, innovation — looking forward."
              },
            ].map((c, i) => (
              <article className="vision-card reveal is-visible" key={i}>
                <span className="tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="closing" id="kontakt">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/SPEED.mp4" />
        </div>
        <div className="container closing-shell reveal is-visible">
          <span className="eyebrow">
            {lang === "de" ? "PROJEKT ANFRAGEN" : "REQUEST PROJECT"}
          </span>
          <RevealDiv>
            <h2>
              {lang === "de"
                ? "Was wir bauen, arbeitet für dich."
                : "What we build, works for you."}
            </h2>
          </RevealDiv>
          <RevealDiv>
            <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>
              {lang === "de"
                ? "Lazy Code — Full-Stack Entwicklung aus Köln. MVPs, Web-Apps, API-Systeme, Cloud-Architektur. Scrum-friendly, transparent, zielgerichtet."
                : "Lazy Code — Full-stack development from Cologne. MVPs, web apps, API systems, cloud architecture. Scrum-friendly, transparent, focused."}
            </p>
          </RevealDiv>
          <RevealDiv>
            <div className="closing-actions">
              <a href="mailto:hallo@lazy-code.de" className="btn btn-primary">
                {lang === "de" ? "Projekt anfragen" : "Request project"}
              </a>
              <a href="/" className="btn btn-secondary">
                {lang === "de" ? "Zurück zur Startseite" : "Back to home"}
              </a>
            </div>
          </RevealDiv>
        </div>
      </section>
    </main>
  );
}
