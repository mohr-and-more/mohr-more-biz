import type { Metadata } from "next";
import { EnContactPage } from "@/components/en-contact-page";
import { SITE } from "@/data/services";
import "../../design-system.css";

const PAGE_URL = `${SITE.url}/en/contact`;

/**
 * /en/contact — English contact route (MMB-468 / Sub 8)
 *
 * Server-side: emits LocalBusiness + BreadcrumbList JSON-LD with English
 * address/phone/email. Client-side: the EnContactPage component handles
 * form submission to /api/kontakt (same endpoint as the DE page).
 */
export const metadata: Metadata = {
  title: "Contact — MOHR & MORE",
  description:
    "We respond within 24 hours. Phone, email, booking or form — pick the channel that suits you. GDPR-compliant, personal, no strings attached.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: `${SITE.url}/kontakt`,
      en: PAGE_URL,
      "x-default": `${SITE.url}/kontakt`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Contact — MOHR & MORE",
    description:
      "We respond within 24 hours. Phone, email, booking or form — pick the channel that suits you.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE Contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — MOHR & MORE",
    description:
      "We respond within 24 hours. Phone, email, booking or form — pick the channel that suits you.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: { index: true, follow: true },
};

function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}#business`,
    name: SITE.name,
    url: SITE.url,
    description:
      "We build companies that scale like software — Commerce, Technology, Execution.",
    telephone: "+49-0000-0000000",
    email: "info@mohr-more.biz",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Sample Street",
      postalCode: "12345",
      addressLocality: "Sample City",
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
    areaServed: { "@type": "Country", name: "DE" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+49-0000-0000000",
        email: "info@mohr-more.biz",
        availableLanguage: ["English", "German"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "17:00",
        },
      },
    ],
    inLanguage: "en",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function BreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/en` },
      { "@type": "ListItem", position: 2, name: "Contact", item: PAGE_URL },
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
      <EnContactPage />
    </>
  );
}