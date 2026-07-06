import type { Metadata } from "next";
import { DeUeberUnsPage } from "./de-ueber-uns-page";
import { SITE } from "@/data/services";
import "../../design-system.css";

const PAGE_URL = `${SITE.url}/de/ueber-uns`;

/**
 * /de/ueber-uns (MMB-474, Sub 6 von 8 aus MMB-468)
 *
 * SEO-Spec aus MMB-474:
 *  - Title: "Über uns — MOHR & MORE"
 *  - Meta-Description: Erfahrung, Team, Standort (≤ 155 Zeichen)
 *  - Canonical: https://mohr-more.biz/de/ueber-uns
 *  - hreflang: de, en, x-default (= DE bis Sub 8 fertig ist)
 *  - JSON-LD: Organization mit founders, foundingDate, address
 *             + BreadcrumbList (Start > Über uns)
 *  - Open Graph + Twitter Card (og-image.webp 1200x630)
 *
 * Die Komponente selbst (de-ueber-uns-page.tsx) ist client-side und über
 * `useLang()` voll bilingual. JSON-LD wird hier im Server-Component inline
 * gerendert, damit es ohne JS sofort im HTML steht.
 */
export const metadata: Metadata = {
  title: "Über uns — MOHR & MORE",
  description:
    "Vier Köpfe, ein System: Lernen Sie das MOHR & MORE Team kennen — gegründet 2009 in Köln, spezialisiert auf Digitalisierung und Umsetzung für den Mittelstand.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: PAGE_URL,
      "x-default": PAGE_URL,
      // EN-Spiegelung kommt mit Sub-Issue 8 (MMB-468). Bis dahin ist x-default = DE.
      en: `${SITE.url}/en/about`,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Über uns — MOHR & MORE",
    description:
      "Vier Köpfe, ein System: Lernen Sie das MOHR & MORE Team kennen — gegründet 2009 in Köln, spezialisiert auf Digitalisierung für den Mittelstand.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE — Über uns",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns — MOHR & MORE",
    description:
      "Vier Köpfe, ein System. Digitalisierung & Umsetzung für den Mittelstand.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: { index: true, follow: true },
};

/**
 * Organization JSON-LD (MMB-474 Pflicht)
 *  - founders (Gregor Mohr, Gunnar Mohr)
 *  - foundingDate (2009)
 *  - address
 */
function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${PAGE_URL}#organization`,
    name: SITE.name,
    legalName: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/favicon.ico`,
    foundingDate: "2009",
    founders: [
      { "@type": "Person", name: "Gregor Mohr" },
      { "@type": "Person", name: "Gunnar Mohr" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Musterstraße 1",
      postalCode: "12345",
      addressLocality: "Musterstadt",
      addressRegion: "NRW",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+49 0000 0000000",
      email: "[email protected]",
      availableLanguage: ["Deutsch", "English"],
    },
    description: SITE.description,
    sameAs: [
      // Social-Profile-Platzhalter — werden nachgeliefert
      // "https://www.linkedin.com/company/mohr-more",
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
 * BreadcrumbList JSON-LD (Pflicht pro Subpage laut Plan)
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
        item: `${SITE.url}/de`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Über uns",
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

export default function DeUeberUns() {
  return (
    <>
      {/* Strukturierte Daten — werden ohne JS in den HTML-Output gerendert */}
      <OrganizationJsonLd />
      <BreadcrumbJsonLd />

      <DeUeberUnsPage />
    </>
  );
}