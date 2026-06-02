"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

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

export function Navbar() {
  const { lang, toggleLang } = useLang();
  const t = translations;
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

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
    { href: "/#manifest", label: t.nav.position[lang] },
    { href: "/#system", label: t.nav.system[lang] },
    { href: "/#principles", label: t.nav.principles[lang] },
    { href: "/#vision", label: t.nav.vision[lang] },
  ];

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
        <a href="#" className="flex items-center gap-3 font-heading text-lg font-bold tracking-wider text-text no-underline" aria-label="MOHR Startseite">
          <LogoIcon />
          MOHR
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link text-sm text-muted hover:text-text">
              {l.label}
            </a>
          ))}
          <a href="/#kontakt" className="nav-cta">
            {t.nav.contact[lang]}
          </a>
          <a href="https://app.mohr-more.biz/login" className="nav-cta" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
            {t.nav.login[lang]}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLang}
            className="font-mono text-xs tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            {lang === "de" ? "DE | EN" : "EN | DE"}
          </Button>

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
                <a href="/#kontakt" onClick={() => setOpen(false)} className="nav-cta mt-2 block text-center">
                  {t.nav.contact[lang]}
                </a>
                <a href="https://app.mohr-more.biz/login" onClick={() => setOpen(false)} className="nav-cta mt-2 block text-center" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {t.nav.login[lang]}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
