import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnCaseDetailPage } from "@/components/en-case-detail-page";
import { CASE_SLUGS, getCase } from "@/data/cases";
import type { CaseSlug } from "@/data/cases";
import { SITE } from "@/data/services";
import "../../../design-system.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCase(slug);
  if (!cs || !CASE_SLUGS.includes(slug as CaseSlug)) {
    return { title: "Case not found — MOHR & MORE" };
  }

  const url = `${SITE.url}/en/references/${slug}`;
  return {
    title: `${cs.title} — MOHR & MORE`,
    description: cs.problem.slice(0, 155),
    alternates: {
      canonical: url,
      languages: {
        de: `${SITE.url}/referenzen/${slug}`,
        en: url,
        "x-default": `${SITE.url}/referenzen/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: "en_US",
      url,
      siteName: SITE.name,
      title: `${cs.title} — MOHR & MORE`,
      description: cs.problem.slice(0, 155),
      images: [
        {
          url: `${SITE.url}/og-image.webp`,
          width: 1200,
          height: 630,
          alt: cs.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cs.title} — MOHR & MORE`,
      description: cs.problem.slice(0, 155),
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
      { "@type": "ListItem", position: 2, name: "References", item: `${SITE.url}/en/references` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE.url}/en/references/${slug}` },
    ],
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
  const cs = getCase(slug);
  if (!cs || !CASE_SLUGS.includes(slug as CaseSlug)) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd slug={slug} title={cs.title} />
      <EnCaseDetailPage caseStudy={cs} />
    </>
  );
}