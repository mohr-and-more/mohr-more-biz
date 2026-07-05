import type { Metadata } from "next";
import { LeistungenPage } from "./leistungen-page";
import { SITE, SERVICES } from "@/data/services";
import "./../design-system.css";

const PAGE_URL = `${SITE.url}/leistungen`;

/**
 * SEO-Metadaten für /leistungen (MMB-471)
 * - Title ≤ 60 Zeichen
 * - Description ≤ 155 Zeichen
 * - Canonical + hreflang DE/EN/x-default
 * - Open Graph + Twitter Card
 */
export const metadata: Metadata = {
  title: "Leistungen — MOHR & MORE",
  description:
    "Strategie, Umsetzung, Wartung und Automatisierung für den Mittelstand. Messbare Ergebnisse statt Beratergeschwätz — MOHR & MORE.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: PAGE_URL,
      "x-default": PAGE_URL,
      // EN-Spiegelung kommt mit Sub-Issue 8 (MMB-468). Bis dahin ist x-default = DE.
      en: `${SITE.url}/en/services`,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Leistungen — MOHR & MORE",
    description:
      "Strategie, Umsetzung, Wartung und Automatisierung für den Mittelstand. Messbare Ergebnisse statt Beratergeschwätz.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE Leistungen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leistungen — MOHR & MORE",
    description:
      "Strategie, Umsetzung, Wartung und Automatisierung für den Mittelstand.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * BreadcrumbList JSON-LD (MMB-471 Pflicht: BreadcrumbList JSON-LD)
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
        name: "Leistungen",
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
 * ItemList JSON-LD: Liste aller 6 Service-Slugs (für Google Rich Results)
 * Wir nutzen ItemList statt Service-Schema, da jede Karte bereits
 * einen eigenen Detailartikel mit FAQPage-Schema hat.
 */
function ServicesItemListJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MOHR & MORE Leistungen",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${SITE.url}/leistungen/${s.slug}`,
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
      <ServicesItemListJsonLd />
      <LeistungenPage />
    </>
  );
}
