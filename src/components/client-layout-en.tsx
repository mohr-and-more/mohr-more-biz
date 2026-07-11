"use client";

import { I18nProvider } from "@/components/i18n-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections";

/**
 * /en/* Client wrapper (MMB-468 / Sub 8)
 *
 * Renders the same shell as the DE ClientLayout. The I18nProvider auto-detects
 * the lang from window.location.pathname on mount, so navigating to /en/* flips
 * all translations to English without a hard reload.
 */
export function ClientLayoutEn({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Navbar />
      {children}
      <Footer />
    </I18nProvider>
  );
}