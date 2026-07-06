"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="5" x2="17" y2="5" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="15" x2="17" y2="15" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="10" width="10" height="12" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="20" y="6" width="10" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="12" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Route-mirroring map between DE and EN URLs (MMB-468 / Sub 8).
 * Each entry maps a DE path → its EN counterpart.
 * The home "/" maps to "/en", and a section like "/leistungen/beratung"
 * maps to "/en/services/beratung".
 */
type MirrorRule = { match: RegExp; en: (m: RegExpMatchArray) => string };

const DE_TO_EN: MirrorRule[] = [
  { match: /^\/$/, en: () => "/en" },
  { match: /^\/leistungen\/([^/]+)\/?$/, en: (m) => `/en/services/${m[1]}` },
  { match: /^\/leistungen\/?$/, en: () => "/en/services" },
  { match: /^\/kontakt\/?$/, en: () => "/en/contact" },
  { match: /^\/referenzen\/([^/]+)\/?$/, en: (m) => `/en/references/${m[1]}` },
  { match: /^\/referenzen\/?$/, en: () => "/en/references" },
  { match: /^\/ueber-uns\/?$/, en: () => "/en/about" },
  { match: /^\/de\/ueber-uns\/?$/, en: () => "/en/about" },
  // Pages that intentionally stay DE-only fall back to EN home.
  { match: /^\/(dashboard|how-to|ki-entwicklung|ki-entwicklung\/.*|lazy-code|lazy-code\/.*|zero-humans(?:\/.*)?|design-system)\/?$/, en: () => "/en" },
];

const EN_TO_DE: MirrorRule[] = [
  { match: /^\/en\/?$/, en: () => "/" },
  { match: /^\/en\/services\/([^/]+)\/?$/, en: (m) => `/leistungen/${m[1]}` },
  { match: /^\/en\/services\/?$/, en: () => "/leistungen" },
  { match: /^\/en\/contact\/?$/, en: () => "/kontakt" },
  { match: /^\/en\/references\/([^/]+)\/?$/, en: (m) => `/referenzen/${m[1]}` },
  { match: /^\/en\/references\/?$/, en: () => "/referenzen" },
  { match: /^\/en\/about\/?$/, en: () => "/ueber-uns" },
];

/**
 * Return the canonical counterpart of the current pathname in the other
 * language, falling back to home if no mirror exists.
 */
function counterpart(pathname: string, targetLang: "de" | "en"): string {
  const rules = targetLang === "en" ? DE_TO_EN : EN_TO_DE;
  for (const { match, en } of rules) {
    const m = pathname.match(match);
    if (m) return en(m);
  }
  return targetLang === "en" ? "/en" : "/";
}

export function Navbar() {
  const { lang } = useLang();
  const t = translations;
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const pathname = usePathname() || "/";

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll && current > 80);
      setLastScroll(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  const links = [
    { href: "/how-to", label: "How-To" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/ki-entwicklung", label: t.nav.kiEntwicklung[lang] },
    { href: "/zero-humans", label: t.nav.zeroHumans[lang] },
    { href: "/zero-humans/team", label: t.nav.team[lang] },
    { href: lang === "en" ? "/en#manifest" : "/#manifest", label: t.nav.position[lang] },
    { href: lang === "en" ? "/en#system" : "/#system", label: t.nav.system[lang] },
    { href: lang === "en" ? "/en#principles" : "/#principles", label: t.nav.principles[lang] },
    { href: lang === "en" ? "/en#vision" : "/#vision", label: t.nav.vision[lang] },
  ];

  const otherLang: "de" | "en" = lang === "de" ? "en" : "de";
  const toggleHref = useMemo(() => counterpart(pathname, otherLang), [pathname, otherLang]);
  const toggleLabel = lang === "de" ? "EN" : "DE";
  const toggleTitle = lang === "de" ? "Switch to English" : "Auf Deutsch wechseln";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b transition-transform duration-300"
      style={{
        background: "rgba(3,3,3,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href={lang === "en" ? "/en" : "/"}
          className="flex items-center gap-3 no-underline"
          aria-label="MOHR & MORE Startseite"
        >
          <LogoIcon />
          <span className="flex flex-col leading-tight">
            <strong className="font-heading text-sm font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              MOHR &amp; MORE
            </strong>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em]" style={{ color: "var(--text-faint)" }}>
              One Human. One AI. One Company.
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link text-sm text-muted hover:text-text">
              {l.label}
            </a>
          ))}
          <a href={lang === "en" ? "/en#kontakt" : "/#kontakt"} className="nav-cta">
            {t.nav.contact[lang]}
          </a>
          <a href="https://app.mohr-more.biz/login" className="nav-cta" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
            {t.nav.login[lang]}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/*
            Language switcher (MMB-468 / Sub 8):
            Real route-link to the canonical counterpart page in the other language.
            Renders as <a> so it works without JS (graceful, no flash).
          */}
          <a
            href={toggleHref}
            title={toggleTitle}
            aria-label={toggleTitle}
            rel="alternate"
            hrefLang={otherLang}
            className="group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 font-mono text-xs tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            {toggleLabel}
          </a>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden" render={<Button variant="ghost" size="icon" className="text-text" />}>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="top" className="border-b bg-[rgba(3,3,3,0.97)] p-4" style={{ borderColor: "var(--border)" }}>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col gap-0">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="border-b py-3 text-sm text-muted"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {l.label}
                  </a>
                ))}
                <a href={lang === "en" ? "/en#kontakt" : "/#kontakt"} onClick={() => setOpen(false)} className="nav-cta mt-2 block text-center">
                  {t.nav.contact[lang]}
                </a>
                <a href="https://app.mohr-more.biz/login" onClick={() => setOpen(false)} className="nav-cta mt-2 block text-center" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {t.nav.login[lang]}
                </a>
                <a
                  href={toggleHref}
                  onClick={() => setOpen(false)}
                  className="nav-cta mt-2 block text-center"
                  rel="alternate"
                  hrefLang={otherLang}
                >
                  {toggleLabel === "EN" ? "English" : "Deutsch"}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}