import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/blog-post-page";
import { BLOG_SLUGS, getPost } from "@/data/blog";
import { getArticle } from "@/data/blog-articles";
import { SITE } from "@/data/services";
import "../../../design-system.css";

type Params = { slug: string };

/**
 * Statische Artikelrouten für den Export.
 * Unbekannte Slugs werden nicht vorgerendert und laufen ins 404 des Hostings.
 */
export function generateStaticParams(): Params[] {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return { title: "Artikel nicht gefunden — MOHR & MORE" };
  }

  const url = `${SITE.url}/blog/${slug}`;
  const enUrl = `${SITE.url}/en/blog/${slug}`;
  const { title, excerpt } = post.locales.de;

  return {
    title: `${title} — MOHR & MORE`,
    description: excerpt,
    alternates: {
      canonical: url,
      languages: {
        de: url,
        en: enUrl,
        "x-default": url,
      },
    },
    openGraph: {
      type: "article",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: `${title} — MOHR & MORE`,
      description: excerpt,
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: `${SITE.url}/og-image.webp`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — MOHR & MORE`,
      description: excerpt,
      images: [`${SITE.url}/og-image.webp`],
    },
    robots: { index: true, follow: true },
  };
}

function ArticleJsonLd({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) return null;
  const url = `${SITE.url}/blog/${slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.locales.de.title,
    description: post.locales.de.excerpt,
    inLanguage: "de-DE",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    image: `${SITE.url}/og-image.webp`,
    articleSection: post.tags.de,
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
  const post = getPost(slug);
  const article = getArticle(slug, "de");

  if (!post || !article) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd slug={slug} />
      <BlogPostPage post={post} article={article} lang="de" />
    </>
  );
}
