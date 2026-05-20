"use client";

import { I18nProvider } from "@/components/i18n-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Navbar />
      {children}
      <Footer />
    </I18nProvider>
  );
}
