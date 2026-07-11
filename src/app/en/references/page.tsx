import type { Metadata } from "next";
import { EnReferencesPage } from "@/components/en-references-page";
import { SITE } from "@/data/services";
import "../../design-system.css";

const PAGE_URL = `${SITE.url}/en/references`;

/**
 * /en/references — English case-studies route (MMB-468 / Sub 8)
 */
export const metadata: Metadata = {
  title: "References & Case Studies — MOHR & MORE",
  description:
    "Three case studies from SME, crafts and logistics with measurable outcomes. Filter by industry and keyword, full details and approach per project.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: `${SITE.url}/referenzen`,
      en: PAGE_URL,
      "x-default": `${SITE.url}/referenzen`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PAGE_URL,
    siteName: SITE.name,
    title: "References & Case Studies — MOHR & MORE",
    description:
      "Three case studies from SME, crafts and logistics with measurable outcomes.",
    images: [
      {
        url: `${SITE.url}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "MOHR & MORE References",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "References & Case Studies — MOHR & MORE",
    description:
      "Three case studies from SME, crafts and logistics with measurable outcomes.",
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
      { "@type": "ListItem", position: 2, name: "References", item: PAGE_URL },
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
      <BreadcrumbJsonLd />
      <EnReferencesPage />
    </>
  );
}