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
      <div className="hero-glow pointer-events-none absolute -right-[10%] -top-[20%] h-[600px] w-[600px] blur-[60px]" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="label mb-4 block">
          <span className="accent-line" />
          {t.label[lang]}
        </span>
        <h1 className="mb-6" dangerouslySetInnerHTML={{ __html: t.title[lang] }} />
        <p className="mb-10 max-w-[60ch] text-lg text-[#999]">{t.subtitle[lang]}</p>
        <div className="flex flex-wrap gap-4">
          <a href="#kontakt" className="btn btn-primary">
            {t.ctaPrimary[lang]}
          </a>
          <a href="#system" className="btn btn-secondary">
            {t.ctaSecondary[lang]}
          </a>
        </div>
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

        <div className="system-grid mt-12 grid max-w-[720px] gap-6">
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
          <div className="ascii-panel mx-auto w-fit overflow-x-auto border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <pre className="whitespace-pre text-center font-mono text-[clamp(0.55rem,1vw,0.8rem)] leading-tight text-[var(--text-secondary)]">
{`+-------------------------------------------------------------+
|                                                          |
|  M O H R   &   M O R E   B U S I N E S S                |
|                                                          |
+-------------------------------------------------------------+
|                                                          |
|  SYSTEM INTEGRATION MAP                                  |
|                                                          |
+-------------------------------------------------------------+
|                                                          |
|  +------------------+          +------------------+       |
|  |                  |          |                  |       |
|  | COMMERCE         |  sync    | TECHNOLOGY       |       |
|  | MODULE           |<-------->| MODULE           |       |
|  |                  |          |                  |       |
|  | * trabusco       |          | * TerminTelefon  |       |
|  | * alles10euro    |          | * Flowfon        |       |
|  | * TENIOS         |          | * LazyCode       |       |
|  | * ZigZag/BuyBay  |          | * KI Berater     |       |
|  |                  |          |                  |       |
|  | Gregor Mohr      |          | Gunnar Mohr      |       |
|  |                  |          |                  |       |
|  +--------+---------+          +--------+---------+       |
|           |                             |                 |
|           |    +-------------------+    |                 |
|           +--->|    EXECUTION      |<---+                 |
|                |      LAYER        |                      |
|                |                   |                      |
|                |  * KI-Agenten     |                      |
|                |  * Automatisierung|                      |
|                |  * SaaS Plattform |                      |
|                |  * Full-Stack Dev |                      |
|                |                   |                      |
|                +---------+---------+                      |
|                          |                                |
|                +---------v---------+                      |
|                |                   |                      |
|                |      OUTPUT       |                      |
|                |                   |                      |
|                |  Commerce x Tech  |                      |
|                |     = Value       |                      |
|                |                   |                      |
|                +-------------------+                      |
|                                                          |
|  STATUS: ONLINE     SYNC: ACTIVE     UPTIME: 99.9%       |
|                                                          |
+-------------------------------------------------------------+`}
            </pre>
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
