import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "./slug-page";
import { DETAIL_SLUGS, SITE, getService } from "@/data/services";
import type { ServiceSlug } from "@/data/services";
import "./../../design-system.css";

type Params = { slug: string };

/**
 * Statische Routen für den Export (MMB-471 Pflicht: beratung, umsetzung, wartung).
 * Andere Slugs (automatisierung, schulung, strategie) werden mit notFound() abgefangen.
 */
export function generateStaticParams(): Params[] {
  return DETAIL_SLUGS.map((slug) => ({ slug }));
}

/**
 * Per-Slug-Metadaten: Title, Description, Canonical, hreflang, OG, Twitter.
 * Wird zur Build-Zeit einmal pro statischer Route ausgeführt.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || !DETAIL_SLUGS.includes(slug as ServiceSlug)) {
    return { title: "Leistung nicht gefunden — MOHR & MORE" };
  }

  const url = `${SITE.url}/leistungen/${slug}`;
  return {
    title: `${service.title} — MOHR & MORE`,
    description: service.intro.slice(0, 155),
    alternates: {
      canonical: url,
      languages: {
        de: url,
        "x-default": url,
        en: `${SITE.url}/en/services/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: `${service.title} — MOHR & MORE`,
      description: service.intro.slice(0, 155),
      images: [
        {
          url: `${SITE.url}/og-image.webp`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} — MOHR & MORE`,
      description: service.intro.slice(0, 155),
      images: [`${SITE.url}/og-image.webp`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * BreadcrumbList JSON-LD: Start > Leistungen > [Slug]
 */
function BreadcrumbJsonLd({ slug, title }: { slug: string; title: string }) {
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
        item: `${SITE.url}/leistungen`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE.url}/leistungen/${slug}`,
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
 * FAQPage JSON-LD (MMB-471 Pflicht: "JSON-LD FAQPage pro Unterseite").
 * Validierungs-Referenz: https://developers.google.com/search/docs/appearance/structured-data/faq
 */
function FAQPageJsonLd({ service }: { service: ReturnType<typeof getService> }) {
  if (!service) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Service JSON-LD (Bonus: zusätzlich zum FAQPage-Schema, damit Google
 * die Detailseite auch als einzelnes Service-Angebot versteht).
 */
function ServiceJsonLd({ service, slug }: { service: NonNullable<ReturnType<typeof getService>>; slug: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.intro,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: {
      "@type": "Country",
      name: "Deutschland",
    },
    url: `${SITE.url}/leistungen/${slug}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        valueAddedTaxIncluded: false,
        description: "Festpreis nach Angebot — Erstgespräch kostenlos.",
      },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getService(slug);

  // Nicht-Detail-Slugs → 404 (statisches Export-Verhalten: next build erzeugt
  // automatisch 404.html in /out/).
  if (!service || !DETAIL_SLUGS.includes(slug as ServiceSlug)) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd slug={slug} title={service.title} />
      <FAQPageJsonLd service={service} />
      <ServiceJsonLd service={service} slug={slug} />
      <ServiceDetailPage service={service} />
    </>
  );
}
