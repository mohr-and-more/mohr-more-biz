"use client";

import { useLang } from "@/components/i18n-provider";
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

const kiMetrics = [
  { value: "272", label: { de: "Agenten im Netzwerk", en: "Agents in Network" } },
  { value: "5", label: { de: "Hierarchie-Ebenen", en: "Hierarchy Levels" } },
  { value: "24/7", label: { de: "Produktion & Deploy", en: "Production & Deploy" } },
];

const kiStack = [
  { title: "AI Agents", meta: { de: "GLM-5.2 · MiniMax M3 · Claude", en: "GLM-5.2 · MiniMax M3 · Claude" }, state: "Operational" },
  { title: "Full-Stack", meta: { de: "Next.js · React · TypeScript · Rust", en: "Next.js · React · TypeScript · Rust" }, state: "Modern" },
  { title: "Cloud", meta: { de: "Cloudflare Pages · AWS · Docker", en: "Cloudflare Pages · AWS · Docker" }, state: "Scalable" },
];

const divisions = [
  {
    name: "LazyCode⋮Cologne",
    role: { de: "Software-Sparte", en: "Software Division" },
    tag: "DEVELOPMENT",
    href: "/lazy-code",
    desc: {
      de: "Full-Stack Entwicklung, Cloud-Architektur und Automation aus Köln. MVPs bis Enterprise-Systeme.",
      en: "Full-stack development, cloud architecture and automation from Cologne. MVPs to enterprise systems.",
    },
  },
  {
    name: "Flowfon / TerminTelefon",
    role: { de: "KI-Telefonie", en: "AI Telephony" },
    tag: "VOICE",
    href: "/#system",
    desc: {
      de: "24/7 KI-Telefonassistenten für Terminbuchung, Kundenservice und Sales — produktiv in Produktion.",
      en: "24/7 AI phone assistants for booking, customer service and sales — live in production.",
    },
  },
  {
    name: "FLIXFOTO™",
    role: { de: "KI-Produktfotografie", en: "AI Product Photography" },
    tag: "VISION",
    href: "/#system",
    desc: {
      de: "Produktfotos im industriellen Maßstab — KI-gestützt, markenkonform, in Sekunden statt Tagen.",
      en: "Product photography at industrial scale — AI-driven, brand-consistent, seconds not days.",
    },
  },
  {
    name: "NODᵉSIM Network",
    role: { de: "eSIM · IoT · Web3", en: "eSIM · IoT · Web3" },
    tag: "INFRA",
    href: "/#system",
    desc: {
      de: "eSIM-NFT, IoT-Konnektivität und Blockchain-Protokoll — eigene Infrastruktur statt Lizenz-Abhängigkeit.",
      en: "eSIM-NFT, IoT connectivity and blockchain protocol — own infrastructure, not license dependency.",
    },
  },
];

export function KiEntwicklungPage() {
  const { lang } = useLang();

  return (
    <main>
      {/* Hero */}
      <section className="hero section" id="top">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/DEEP-TECH.mp4" />
        </div>
        <div className="container hero-grid">
          <div>
            <span className="eyebrow reveal is-visible">KI ENTWICKLUNG // ENGINEERING DIVISION</span>
            <h1
              className="hero-title reveal is-visible"
              dangerouslySetInnerHTML={{
                __html:
                  lang === "de"
                    ? "Wir bauen <span class='glow'>Unternehmen</span>, die wie Software skalieren."
                    : "We build <span class='glow'>companies</span> that scale like software.",
              }}
            />
            <p className="hero-copy reveal is-visible">
              {lang === "de"
                ? "KI Entwicklung ist die Engineering-Sparte von MOHR & MORE Business. AI Agents, Full-Stack Entwicklung, Cloud-Architektur und Automation — vom Konzept bis zur Produktion."
                : "KI Entwicklung is the engineering division of MOHR & MORE Business. AI agents, full-stack development, cloud architecture and automation — from concept to production."}
            </p>
            <div className="hero-actions reveal is-visible">
              <a href="#divisionen" className="btn btn-primary">
                {lang === "de" ? "Sparten ansehen" : "View Divisions"}
              </a>
              <a href="/lazy-code" className="btn btn-secondary">
                {lang === "de" ? "LazyCode⋮Cologne" : "LazyCode⋮Cologne"}
              </a>
            </div>
            <div className="hero-meta reveal is-visible" aria-label="Kennzahlen">
              {kiMetrics.map((m, i) => (
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
                  <span>KI ENTWICKLUNG</span>
                  <span>ENGINEERING</span>
                </div>
                <pre className="ascii-block" aria-hidden="true">
{`██╗  ██╗██╗
██║ ██╔╝██║
█████╔╝ ██║
██╔═██╗ ██║
██║  ██╗██║
╚═╝  ╚═╝╚═╝

   ◢▣Ŀ◣ ENGINEERING
 ⊙◬⊙  COLOGNE
   ◥▤⫱◤

 DEVELOPMENT`}
                </pre>
              </div>
              <div className="stack" aria-label="Tech Stack">
                {kiStack.map((s, i) => (
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
            <span className="eyebrow">MANIFEST</span>
            <RevealDiv>
              <h2 className="section-title">
                {lang === "de"
                  ? "Software, die Probleme vorwegnimmt."
                  : "Software that anticipates problems."}
              </h2>
            </RevealDiv>
            <RevealDiv>
              <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>
                {lang === "de"
                  ? "KI Entwicklung vereint AI-Agenten-Netzwerke, Full-Stack Engineering und Cloud-Infrastruktur. Vier spezialisierte Sparten — eine gemeinsame Plattform für KI-gestützte Geschäftsmodelle."
                  : "KI Entwicklung unites AI agent networks, full-stack engineering and cloud infrastructure. Four specialized divisions — one shared platform for AI-driven business models."}
              </p>
            </RevealDiv>
          </div>
          <div className="cards-block">
            {[
              {
                tag: lang === "de" ? "AI-First" : "AI-First",
                title: lang === "de" ? "Agenten statt Tickets" : "Agents over Tickets",
                text: lang === "de"
                  ? "272 spezialisierte Agenten orchestrieren Entwicklung, Review und Operations — kein klassischer Ticket-Stau."
                  : "272 specialized agents orchestrate development, review and operations — no classic ticket backlog.",
              },
              {
                tag: lang === "de" ? "Zero-Human" : "Zero-Human",
                title: lang === "de" ? "Zero-Human Company" : "Zero-Human Company",
                text: lang === "de"
                  ? "MOHR & MORE ist eine Zero-Human-Company: ein menschlicher Architekt, ein KI-Umsetzer, ein gemeinsames System."
                  : "MOHR & MORE is a zero-human company: one human architect, one AI executor, one shared system.",
              },
              {
                tag: lang === "de" ? "Cloud-Native" : "Cloud-Native",
                title: lang === "de" ? "Built for Scale" : "Built for Scale",
                text: lang === "de"
                  ? "Cloudflare Pages, AWS, Docker — skalierbare Architektur von Tag eins, nicht nachgerüstet."
                  : "Cloudflare Pages, AWS, Docker — scalable architecture from day one, not retrofitted.",
              },
              {
                tag: lang === "de" ? "Production" : "Production",
                title: lang === "de" ? "Live & Operational" : "Live & Operational",
                text: lang === "de"
                  ? "Vier Sparten sind bereits in Produktion — nicht im Pitch-Deck."
                  : "Four divisions are already in production — not in pitch decks.",
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

      {/* Divisions */}
      <section className="section" id="divisionen">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/SCALE.mp4" />
        </div>
        <div className="narrow reveal is-visible">
          <span className="eyebrow">{lang === "de" ? "SPARTEN" : "DIVISIONS"}</span>
          <RevealDiv>
            <h2 className="section-title" style={{ marginTop: "var(--space-4)", maxWidth: "14ch" }}>
              {lang === "de" ? "Vier Sparten. Eine Plattform." : "Four Divisions. One Platform."}
            </h2>
          </RevealDiv>
          <RevealDiv>
            <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>
              {lang === "de"
                ? "Jede Sparte ist eigenständig operativ, aber technologisch und organisatorisch verzahnt — über die gleiche AI-Agenten-Infrastruktur und das gleiche Code-Repository."
                : "Each division operates independently, but is technologically and organizationally interlocked — through the same AI agent infrastructure and the same code repository."}
            </p>
          </RevealDiv>
        </div>
        <div className="container principles">
          {divisions.map((d, i) => (
            <article className="ethos-card reveal is-visible" key={i}>
              <span className="tag">{d.tag}</span>
              <strong>{d.name}</strong>
              <span style={{ color: "var(--text-faint)", fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {d.role[lang]}
              </span>
              <p>{d.desc[lang]}</p>
              <a
                href={d.href}
                style={{
                  marginTop: "var(--space-3)",
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontFamily: "var(--font-mono, monospace)",
                  letterSpacing: "0.04em",
                }}
              >
                {d.name === "LazyCode⋮Cologne" ? (lang === "de" ? "→ Sparte besuchen" : "→ Visit division") : (lang === "de" ? "→ Im System" : "→ In the System")}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="section" id="principles">
        <div className="video-bg" aria-hidden="true">
          <video autoPlay loop muted playsInline src="/videos/SPEED.mp4" />
        </div>
        <div className="narrow reveal is-visible">
          <span className="eyebrow">{lang === "de" ? "PRINZIPIEN" : "PRINCIPLES"}</span>
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
              title: lang === "de" ? "AI-First Architecture." : "AI-First Architecture.",
              text: lang === "de"
                ? "Agenten-Netzwerke statt monolithischer Tools. Modular, auditierbar, beobachtbar."
                : "Agent networks over monolithic tools. Modular, auditable, observable.",
            },
            {
              num: "02",
              title: lang === "de" ? "Clean Code." : "Clean Code.",
              text: lang === "de"
                ? "Lesbar, testbar, wartbar — jeder Commit folgt Best Practices."
                : "Readable, testable, maintainable — every commit follows best practices.",
            },
            {
              num: "03",
              title: lang === "de" ? "Ship Fast." : "Ship Fast.",
              text: lang === "de"
                ? "CI/CD, automatisiertes Testing, schneller Feedback-Loop — Features in Tagen, nicht Monaten."
                : "CI/CD, automated testing, fast feedback loops — features in days, not months.",
            },
            {
              num: "04",
              title: lang === "de" ? "Scale Smart." : "Scale Smart.",
              text: lang === "de"
                ? "Serverless, Edge Computing, Caching — Performance auf allen Ebenen."
                : "Serverless, edge computing, caching — performance at every level.",
            },
            {
              num: "05",
              title: lang === "de" ? "Secure by Default." : "Secure by Default.",
              text: lang === "de"
                ? "Security Reviews, Dependency Scanning, Best Practices — kein Kompromiss."
                : "Security reviews, dependency scanning, best practices — no compromise.",
            },
            {
              num: "06",
              title: lang === "de" ? "Customer Focus." : "Customer Focus.",
              text: lang === "de"
                ? "Wir bauen, was Nutzer brauchen — nicht was wir toll finden."
                : "We build what users need — not what we think is cool.",
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
            <span className="eyebrow">{lang === "de" ? "VISION" : "VISION"}</span>
            <RevealDiv>
              <h2 className="section-title">
                {lang === "de"
                  ? "Engineering, das mitwächst."
                  : "Engineering that grows with you."}
              </h2>
            </RevealDiv>
            <RevealDiv>
              <p className="section-copy" style={{ marginTop: "var(--space-5)" }}>
                {lang === "de"
                  ? "KI Entwicklung baut die technologische Substanz von MOHR & MORE — heute operativ, morgen skaliert. Vom MVP-Prototyp bis zum Produktions-Workload: wir bleiben Partner, nicht Lieferant."
                  : "KI Entwicklung builds the technological substance of MOHR & MORE — operational today, scaled tomorrow. From MVP prototype to production workload: we stay partners, not vendors."}
              </p>
            </RevealDiv>
          </div>
          <div className="cards-block">
            {[
              {
                tag: lang === "de" ? "MVP" : "MVP",
                title: lang === "de" ? "Schnell zum Produkt" : "Fast to Product",
                text: lang === "de"
                  ? "Ideen validieren, iterieren, deployen — in Tagen statt Monaten."
                  : "Validate ideas, iterate, deploy — in days not months.",
              },
              {
                tag: lang === "de" ? "Scale" : "Scale",
                title: lang === "de" ? "Enterprise-Ready" : "Enterprise-Ready",
                text: lang === "de"
                  ? "Architektur, Security, Compliance — bereit für Wachstum."
                  : "Architecture, security, compliance — ready for growth.",
              },
              {
                tag: lang === "de" ? "Support" : "Support",
                title: lang === "de" ? "Partner, nicht Vendor" : "Partner, not Vendor",
                text: lang === "de"
                  ? "Monitoring, Bug-Fixes, Optimierung — wir bleiben an Bord."
                  : "Monitoring, bug fixes, optimization — we stay on board.",
              },
              {
                tag: lang === "de" ? "AI" : "AI",
                title: lang === "de" ? "Next-Gen Automation" : "Next-Gen Automation",
                text: lang === "de"
                  ? "AI-Integration, Agenten-Orchestrierung, autonome Workflows."
                  : "AI integration, agent orchestration, autonomous workflows.",
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
          <span className="eyebrow">{lang === "de" ? "PROJEKT ANFRAGEN" : "REQUEST PROJECT"}</span>
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
                ? "KI Entwicklung — Engineering-Sparte von MOHR & MORE Business. MVPs, Web-Apps, API-Systeme, Cloud-Architektur, AI-Agenten. Scrum-friendly, transparent, zielgerichtet."
                : "KI Entwicklung — engineering division of MOHR & MORE Business. MVPs, web apps, API systems, cloud architecture, AI agents. Scrum-friendly, transparent, focused."}
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