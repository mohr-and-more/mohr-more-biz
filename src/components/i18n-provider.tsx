"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { type Lang } from "@/lib/i18n";

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType>({ lang: "de", toggleLang: () => {} });

/**
 * Language state is derived from the route, not from a stored preference:
 * each root layout passes its own language as `initial`, so the server-rendered
 * HTML and the first client render always agree with the URL.
 */
export function I18nProvider({
  children,
  initial = "de",
}: {
  children: React.ReactNode;
  initial?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initial);
  const toggleLang = useCallback(() => setLang((l) => (l === "de" ? "en" : "de")), []);
  return <I18nContext.Provider value={{ lang, toggleLang }}>{children}</I18nContext.Provider>;
}

export function useLang() {
  return useContext(I18nContext);
}
