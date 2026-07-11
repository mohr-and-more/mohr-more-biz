import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseDetailPage } from "./slug-page";
import { CASE_SLUGS, getCase } from "@/data/cases";
import type { CaseSlug } from "@/data/cases";
import { SITE } from "@/data/services";
import "./../../design-system.css";

type Params = { slug: string };

/**
 * Statische Routen für den Export (MMB-473 Pflicht: mind. 3 Cases).
 */
export function generateStaticParams(): Params[] {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

/**
 * Per-Case-Metadaten: Title, Description, Canonical, hreflang, OG, Twitter.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCase(slug);
  if (!caseStudy || !CASE_SLUGS.includes(slug as CaseSlug)) {
    return { title: "Case Study nicht gefunden — MOHR & MORE" };
  }

  const url = `${SITE.url}/referenzen/${slug}`;
  const description = caseStudy.problem.slice(0, 155);
  return {
    title: `${caseStudy.title} — MOHR & MORE`,
    description,
    alternates: {
      canonical: url,
      languages: {
        de: url,
        "x-default": url,
        en: `${SITE.url}/en/references/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: `${caseStudy.title} — MOHR & MORE`,
      description,
      images: [
        {
          url: `${SITE.url}/og-image.webp`,
          width: 1200,
          height: 630,
          alt: caseStudy.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${caseStudy.title} — MOHR & MORE`,
      description,
      images: [`${SITE.url}/og-image.webp`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * BreadcrumbList JSON-LD: Start > Referenzen > [Slug]
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
        name: "Referenzen",
        item: `${SITE.url}/referenzen`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE.url}/referenzen/${slug}`,
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
 * Article JSON-LD: jeder Case als eigenständiger Artikel, damit Google
 * die Detailseite auch einzeln in den Suchergebnissen anzeigen kann.
 */
function ArticleJsonLd({
  caseStudy,
  slug,
}: {
  caseStudy: NonNullable<ReturnType<typeof getCase>>;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: caseStudy.title,
    description: caseStudy.problem.slice(0, 160),
    articleSection: caseStudy.branchLabel,
    keywords: caseStudy.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/referenzen/${slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    about: {
      "@type": "Service",
      serviceType: "Beratung und Umsetzung",
      provider: {
        "@type": "Organization",
        name: SITE.name,
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
  const caseStudy = getCase(slug);

  if (!caseStudy || !CASE_SLUGS.includes(slug as CaseSlug)) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd slug={slug} title={caseStudy.title} />
      <ArticleJsonLd caseStudy={caseStudy} slug={slug} />
      <CaseDetailPage caseStudy={caseStudy} />
    </>
  );
}