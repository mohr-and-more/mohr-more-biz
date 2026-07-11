import type { Metadata } from "next";
import { LeistungenPage } from "@/app/leistungen/leistungen-page";
import { SITE, SERVICES } from "@/data/services";
import "../../design-system.css";

const PAGE_URL = `${SITE.url}/en/services`;

/**
 * /en/services — English services overview (MMB-468 / Sub 8)
 *
 * Reuses the fully-i18n DE component (LeistungenPage) and switches lang to "en"
 * via the I18nProvider. Search engines see this as the canonical EN mirror of
 * /leistungen, with hreflang pointing back.
 */
export const metadata: Metadata = {
  title: "Services — MOHR & MORE",
  description:
    "Strategy, implementation, maintenance and automation for SMEs. Measurable results instead of consultant fluff — MOHR & MORE.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: `${SITE.url}/leistungen`,
      en: PAGE_URL,
      "x-default": `${SITE.url}/leistungen`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Services — MOHR & MORE",
    description:
      "Strategy, implementation, maintenance and automation for SMEs. Measurable results.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — MOHR & MORE",
    description: "Strategy, implementation, maintenance and automation for SMEs.",
    images: [`${SITE.url}/og-image.webp`],
  },
  robots: { index: true, follow: true },
};

function BreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/en` },
      { "@type": "ListItem", position: 2, name: "Services", item: PAGE_URL },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function ItemListJsonLd() {
  // ItemList of services (helpful for product cards in SERPs).
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SERVICES.slice(0, 6).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${PAGE_URL}/${s.slug}`,
      name: s.title,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function EnServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd />
      <ItemListJsonLd />
      <LeistungenPage />
    </>
  );
}