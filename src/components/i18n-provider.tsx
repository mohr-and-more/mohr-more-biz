"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { type Lang } from "@/lib/i18n";

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType>({ lang: "de", toggleLang: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("de");
  const toggleLang = useCallback(() => setLang((l) => (l === "de" ? "en" : "de")), []);
  return <I18nContext.Provider value={{ lang, toggleLang }}>{children}</I18nContext.Provider>;
}

export function useLang() {
  return useContext(I18nContext);
}
