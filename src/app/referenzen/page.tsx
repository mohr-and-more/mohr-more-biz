import type { Metadata } from "next";
import { ReferenzenPage } from "./referenzen-page";
import { SITE } from "@/data/services";
import { CASE_STUDIES } from "@/data/cases";
import "../design-system.css";

const PAGE_URL = `${SITE.url}/referenzen`;

/**
 * SEO-Metadaten für /referenzen (MMB-473)
 * - Title ≤ 60 Zeichen
 * - Description mit konkreten Versprechen (messbare Ergebnisse)
 * - Canonical + hreflang DE/EN/x-default
 * - Open Graph + Twitter Card
 */
export const metadata: Metadata = {
  title: "Referenzen & Case Studies — MOHR & MORE",
  description:
    "Drei Case Studies aus Mittelstand, Handwerk und Logistik mit messbaren Ergebnissen. Filtern nach Branche und Stichwort, Details und Vorgehen pro Projekt.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: PAGE_URL,
      "x-default": PAGE_URL,
      // EN-Spiegelung kommt mit Sub-Issue 8 (MMB-468). Bis dahin ist x-default = DE.
      en: `${SITE.url}/en/references`,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Referenzen & Case Studies — MOHR & MORE",
    description:
      "Drei Case Studies aus Mittelstand, Handwerk und Logistik mit messbaren Ergebnissen.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE Referenzen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Referenzen & Case Studies — MOHR & MORE",
    description:
      "Drei Case Studies aus Mittelstand, Handwerk und Logistik mit messbaren Ergebnissen.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * BreadcrumbList JSON-LD (MMB-468 Plan-Punkt 19 + MMB-473 Pflicht)
 */
function BreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: SITE.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Referenzen",
        item: PAGE_URL,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * ItemList JSON-LD: Liste aller Case Studies (für Google Rich Results).
 * Wir nutzen ItemList, weil jeder Case eine eigene Detailseite hat.
 */
function CaseStudiesItemListJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MOHR & MORE Referenzen",
    itemListElement: CASE_STUDIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${SITE.url}/referenzen/${c.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd />
      <CaseStudiesItemListJsonLd />
      <ReferenzenPage />
    </>
  );
}