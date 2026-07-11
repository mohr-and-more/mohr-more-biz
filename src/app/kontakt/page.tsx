import type { Metadata } from "next";
import { KontaktPage } from "./kontakt-page";
import { SITE } from "@/data/services";
import "../design-system.css";

const PAGE_URL = `${SITE.url}/kontakt`;

/**
 * SEO-Metadaten für /kontakt (MMB-472)
 * - Title ≤ 60 Zeichen
 * - Description mit konkretem Versprechen ("Antwort binnen 24 h")
 * - Canonical + hreflang DE/EN/x-default
 * - Open Graph + Twitter Card
 */
export const metadata: Metadata = {
  title: "Kontakt — MOHR & MORE",
  description:
    "Antwort binnen 24 Stunden. Telefon, E-Mail, Termin-Buchung oder Formular — Sie wählen den Weg. DSGVO-konform, persönlich, unverbindlich.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: PAGE_URL,
      "x-default": PAGE_URL,
      // EN-Spiegelung kommt mit Sub-Issue 8 (MMB-468). Bis dahin ist x-default = DE.
      en: `${SITE.url}/en/contact`,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Kontakt — MOHR & MORE",
    description:
      "Antwort binnen 24 Stunden. Telefon, E-Mail, Termin oder Formular — Sie wählen den Weg.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE Kontakt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt — MOHR & MORE",
    description:
      "Antwort binnen 24 Stunden. Telefon, E-Mail, Termin oder Formular — Sie wählen den Weg.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * LocalBusiness JSON-LD (MMB-472 Pflicht)
 * - address, telephone, openingHours auf /kontakt zusätzlich
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
      addressRegion: "DE",
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
    areaServed: {
      "@type": "Country",
      name: "DE",
    },
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
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * BreadcrumbList JSON-LD (MMB-468 Plan-Punkt 19)
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
        name: "Kontakt",
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

export default function Page() {
  return (
    <>
      <LocalBusinessJsonLd />
      <BreadcrumbJsonLd />
      <KontaktPage />
    </>
  );
}
