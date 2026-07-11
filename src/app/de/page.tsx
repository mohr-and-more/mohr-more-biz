import type { Metadata } from "next";
import { SITE, SERVICES } from "@/data/services";
import { DeHomePage } from "./de-home-page";
import "../design-system.css";

const PAGE_URL = `${SITE.url}/de`;

/**
 * DE-Hauptseite /de/ (MMB-470, Sub 2 von 8 aus MMB-468)
 *
 * SEO-Spec aus MMB-470:
 *  - Title: "MOHR & MORE — [Leistung] in [Region]" (≤ 60 Zeichen)
 *  - Meta-Description: ≤ 155 Zeichen, Nutzen + Ort + CTA
 *  - Canonical: https://mohr-more.biz/de/
 *  - hreflang: de, en, x-default
 *  - JSON-LD: LocalBusiness + Organization + WebSite (mit SearchAction)
 *  - Open Graph + Twitter Card, og-image.webp 1200x630
 *
 * Die Komponente selbst (de-home-page.tsx) ist client-side, damit
 * Scroll-Trigger, Mobile-Menü und Pre-fills (z. B. Testimonial-Bilder)
 * interaktiv bleiben können. JSON-LD wird hier im Server-Component
 * inline gerendert, damit es ohne JS sofort im HTML steht.
 */

/** Leistungs-Highlight für den Title-Tag (kompakt, Region bleibt generisch) */
const PRIMARY_SERVICE = "Digitalisierung & Umsetzung";
const REGION = "NRW";

export const metadata: Metadata = {
  title: `MOHR & MORE — ${PRIMARY_SERVICE} in ${REGION}`,
  description:
    "MOHR & MORE digitalisiert Vertrieb und Verwaltung für den Mittelstand in NRW. Strategie, Umsetzung und Wartung aus einer Hand — messbar, pragmatisch, ohne Beratergeschwätz.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: PAGE_URL,
      "x-default": PAGE_URL,
      // EN-Spiegelung kommt mit Sub-Issue 8 (MMB-468). Bis dahin ist x-default = DE.
      en: `${SITE.url}/en/`,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: PAGE_URL,
    siteName: SITE.name,
    title: "MOHR & MORE — Digitalisierung & Umsetzung in NRW",
    description:
      "Strategie, Umsetzung und Wartung für den Mittelstand in NRW. Messbare Ergebnisse statt Beratergeschwätz.",
    images: [
      {
        url: `${SITE.url}/de/assets/img/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE — Digitalisierung für den Mittelstand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOHR & MORE — Digitalisierung & Umsetzung in NRW",
    description:
      "Strategie, Umsetzung und Wartung für den Mittelstand in NRW.",
    images: [`${SITE.url}/de/assets/img/og-image.webp`],
  },
  robots: { index: true, follow: true },
};

/**
 * Drei JSON-LD-Blöcke (MMB-470 Pflicht):
 *  1. LocalBusiness — Adresse, Telefon, Öffnungszeiten, areaServed
 *  2. Organization — Founders, foundingDate, contactPoint, sameAs
 *  3. WebSite       — Inkl. SearchAction (Sitelinks-Search-Box)
 */
function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${PAGE_URL}#business`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    telephone: "+49 0000 0000000",
    email: "[email protected]",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Musterstraße 1",
      postalCode: "12345",
      addressLocality: "Musterstadt",
      addressRegion: "NRW",
      addressCountry: "DE",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    areaServed: [
      { "@type": "Country", name: "DE" },
      { "@type": "AdministrativeArea", name: "Nordrhein-Westfalen" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+49 0000 0000000",
        email: "[email protected]",
        availableLanguage: ["Deutsch", "English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "17:00",
        },
      },
    ],
    priceRange: "€€",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

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
    sameAs: [
      // Social-Profile-Platzhalter — werden nachgeliefert
      // "https://www.linkedin.com/company/mohr-more",
      // "https://www.xing.com/companies/mohr-more",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${PAGE_URL}#website`,
    name: SITE.name,
    url: PAGE_URL,
    inLanguage: "de-DE",
    publisher: { "@id": `${PAGE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/suche?q={search_term_string}`,
      },
      // `query-input` muss als String übergeben werden, damit der
      // Google Rich-Results-Test die Search-Box korrekt erkennt.
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * ItemList der drei Haupt-Services auf der Hauptseite (für Service-Snippets).
 */
function ServicesItemListJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MOHR & MORE Kernleistungen",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${SITE.url}/leistungen${s.slug ? `/${s.slug}` : ""}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function DeHome() {
  return (
    <>
      {/* Strukturierte Daten — werden ohne JS in den HTML-Output gerendert */}
      <LocalBusinessJsonLd />
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <ServicesItemListJsonLd />

      <DeHomePage />
    </>
  );
}
