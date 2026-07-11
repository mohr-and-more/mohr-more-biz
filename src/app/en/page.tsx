import type { Metadata } from "next";
import { Hero, Manifest, SystemArchitecture, Principles, Vision, Contact } from "@/components/sections";
import { SITE } from "@/data/services";

const PAGE_URL = `${SITE.url}/en`;

/**
 * /en — English home page (MMB-468 / Sub 8)
 *
 * Re-uses the same client components as /, which are fully bilingual via
 * `useLang()`. The I18nProvider auto-detects the URL prefix on mount and
 * switches every section to English without a hard reload.
 *
 * SEO: EN-only hreflang + canonical + OG/Twitter with en_US locale.
 */
export const metadata: Metadata = {
  title: "MOHR & MORE — Commerce. Technology. Execution.",
  description:
    "Gregor Mohr and Gunnar Mohr combine trade reality with AI-driven execution. Two complementary profiles. One shared system for modern business models at the intersection of market and infrastructure.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: SITE.url,
      en: PAGE_URL,
      "x-default": SITE.url,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PAGE_URL,
    siteName: SITE.name,
    title: "MOHR & MORE — Commerce. Technology. Execution.",
    description:
      "We build companies that scale like software. Commerce. Technology. Execution. Cologne, Germany.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE — Commerce. Technology. Execution.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOHR & MORE — Commerce. Technology. Execution.",
    description: "We build companies that scale like software.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: { index: true, follow: true },
};

/**
 * Organization + WebSite JSON-LD for the EN home.
 * Mirrors the Organization schema with @id reused across locales so search
 * engines can merge DE/EN entities.
 */
function OrganizationJsonLdEn() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}#organization`,
        name: "MOHR & MORE",
        url: SITE.url,
        logo: `${SITE.url}/og-image.webp`,
        description:
          "We build companies that scale like software — Commerce, Technology, Execution.",
        foundingDate: "2002",
        founder: [
          { "@type": "Person", name: "Gregor Mohr" },
          { "@type": "Person", name: "Gunnar Mohr" },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "1 Sample Street",
          postalCode: "12345",
          addressLocality: "Sample City",
          addressRegion: "DE",
          addressCountry: "DE",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+49-0000-0000000",
            email: "info@mohr-more.biz",
            availableLanguage: ["English", "German"],
          },
        ],
        sameAs: [
          "https://linkedin.com/in/gregormohr",
          "https://linkedin.com/in/gunmo",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: ["de-DE", "en-US"],
        publisher: { "@id": `${SITE.url}#organization` },
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
 * BreadcrumbList JSON-LD (en home — single-item root breadcrumb).
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

export default function EnHome() {
  return (
    <>
      <OrganizationJsonLdEn />
      <BreadcrumbJsonLd />
      <main>
        <Hero />
        <div className="divider" />
        <Manifest />
        <div className="divider" />
        <SystemArchitecture />
        <div className="divider" />
        <Principles />
        <div className="divider" />
        <Vision />
        <div className="divider" />
        <Contact />
      </main>
    </>
  );
}