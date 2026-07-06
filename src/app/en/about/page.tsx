import type { Metadata } from "next";
import { DeUeberUnsPage } from "@/app/de/ueber-uns/de-ueber-uns-page";
import { SITE } from "@/data/services";
import "../../design-system.css";

const PAGE_URL = `${SITE.url}/en/about`;

/**
 * /en/about — English About page (MMB-468 / Sub 8)
 *
 * Reuses the fully-bilingual DeUeberUnsPage component, which switches
 * content via the I18nProvider's `useLang()` hook. The server component
 * only ships the EN metadata + JSON-LD.
 *
 * EN-Copy is the rough first-pass translation of the DE placeholder copy.
 * A redaktioneller EN-Pass (Sub 8 follow-up) will polish it once the DE
 * texts are finalized by the client.
 */
export const metadata: Metadata = {
  title: "About us — MOHR & MORE",
  description:
    "Four people, one system: meet the MOHR & MORE team — founded in 2009 in Cologne, focused on digitalization and implementation for SMEs.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: `${SITE.url}/de/ueber-uns`,
      en: PAGE_URL,
      "x-default": `${SITE.url}/de/ueber-uns`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PAGE_URL,
    siteName: SITE.name,
    title: "About us — MOHR & MORE",
    description:
      "Four people, one system. Digitalization & implementation for SMEs.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE — About us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About us — MOHR & MORE",
    description: "Four people, one system. Digitalization for SMEs.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: { index: true, follow: true },
};

/**
 * Organization JSON-LD (EN) — same founding data as DE, English description.
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
    description:
      "MOHR & MORE digitalizes sales and administration for SMEs. Strategy, implementation, maintenance and automation from a single source.",
    sameAs: [],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * BreadcrumbList JSON-LD (EN) — Home > About.
 */
function BreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE.url}/en`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About us",
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

export default function EnAbout() {
  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd />
      <DeUeberUnsPage />
    </>
  );
}