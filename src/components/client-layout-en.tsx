"use client";

import { I18nProvider } from "@/components/i18n-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections";

/**
 * /en/* client wrapper (MMB-468 / Sub 8)
 *
 * Renders the same shell as the DE ClientLayout, but pins the language to
 * English for this root layout. The URL decides the language — no detection,
 * no stored preference.
 */
export function ClientLayoutEn({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider initial="en">
      <Navbar />
      {children}
      <Footer />
    </I18nProvider>
  );
}
