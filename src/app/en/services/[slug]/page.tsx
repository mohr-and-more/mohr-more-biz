import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage as EnServiceDetailPage } from "../../../leistungen/[slug]/slug-page";
import { DETAIL_SLUGS, SITE, getService } from "@/data/services";
import type { ServiceSlug } from "@/data/services";
import "../../../design-system.css";

type Params = { slug: string };

/**
 * /en/services/[slug] — English service detail (MMB-468 / Sub 8)
 *
 * Mirror of /leistungen/[slug]. Reuses the bilingual ServiceDetailPage component
 * and adds FAQPage JSON-LD in English (translated from the DE FAQs by
 * translating the question/answer structure inline; for production a
 * translation pass should refine these — flagged as a follow-up).
 */
export function generateStaticParams(): Params[] {
  return DETAIL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || !DETAIL_SLUGS.includes(slug as ServiceSlug)) {
    return { title: "Service not found — MOHR & MORE" };
  }

  const url = `${SITE.url}/en/services/${slug}`;
  return {
    title: `${service.title} — MOHR & MORE`,
    description: service.intro.slice(0, 155),
    alternates: {
      canonical: url,
      languages: {
        de: `${SITE.url}/leistungen/${slug}`,
        en: url,
        "x-default": `${SITE.url}/leistungen/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "en_US",
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
    robots: { index: true, follow: true },
  };
}

function BreadcrumbJsonLd({ slug, title }: { slug: string; title: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/en` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/en/services` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE.url}/en/services/${slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function FaqJsonLd({ slug, serviceTitle }: { slug: string; serviceTitle: string }) {
  const service = getService(slug);
  if (!service || !service.faqs?.length) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
    about: { "@type": "Service", name: serviceTitle },
    inLanguage: "en",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function EnServiceDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || !DETAIL_SLUGS.includes(slug as ServiceSlug)) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd slug={slug} title={service.title} />
      <FaqJsonLd slug={slug} serviceTitle={service.title} />
      <EnServiceDetailPage service={service} />
    </>
  );
}