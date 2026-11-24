import type { MetadataRoute } from "next";
import { SITE } from "@/data/services";
import { BLOG_POSTS } from "@/data/blog";

/**
 * /sitemap.xml — XML sitemap for mohr-more.biz (MMB-468 / Sub 8)
 *
 * - Includes every public, indexierbare Route in both DE and EN.
 * - Seiten mit `robots: noindex` (Dashboard, Design-System, Impressum,
 *   Datenschutz, Legal, Privacy) bleiben draußen; `robots.txt` sperrt sie
 *   zusätzlich. Eine noindex-URL in der Sitemap ist ein Widerspruch.
 * - Per-page priority & changeFrequency roughly match the actual update cadence:
 *   DE root = 1.0 (weekly), subpages = 0.8 / monthly, legal = 0.3 / yearly.
 *   EN mirrors inherit the same priority (Google canonicalizes via hreflang).
 *
 * Submission:
 *   1. curl the rendered /sitemap.xml from production and verify it parses.
 *   2. Submit https://mohr-more.biz/sitemap.xml in Google Search Console
 *      (Search Console → Sitemaps → Add new sitemap → /sitemap.xml).
 */
// Force-static for output: export (Next 16)
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const monthly = (priority: number) => ({
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  });
  const yearly = (priority: number) => ({
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority,
  });
  const weekly = (priority: number) => ({
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  });

  return [
    // DE — root paths
    { url: `${SITE.url}/`, ...weekly(1.0) },
    { url: `${SITE.url}/leistungen`, ...monthly(0.9) },
    { url: `${SITE.url}/leistungen/beratung`, ...monthly(0.8) },
    { url: `${SITE.url}/leistungen/umsetzung`, ...monthly(0.8) },
    { url: `${SITE.url}/leistungen/wartung`, ...monthly(0.8) },
    { url: `${SITE.url}/kontakt`, ...monthly(0.9) },
    { url: `${SITE.url}/referenzen`, ...monthly(0.9) },
    { url: `${SITE.url}/referenzen/mittelstand`, ...monthly(0.7) },
    { url: `${SITE.url}/referenzen/handwerk`, ...monthly(0.7) },
    { url: `${SITE.url}/referenzen/logistik`, ...monthly(0.7) },

    // DE — Über-uns und Design-Rollout (MMB-470, Sub 2), eigene Canonicals
    { url: `${SITE.url}/de`, ...weekly(0.8) },
    { url: `${SITE.url}/de/ueber-uns`, ...monthly(0.6) },

    // EN — mirrors
    { url: `${SITE.url}/en`, ...weekly(1.0) },
    { url: `${SITE.url}/en/about`, ...monthly(0.6) },
    { url: `${SITE.url}/en/services`, ...monthly(0.9) },
    { url: `${SITE.url}/en/services/beratung`, ...monthly(0.8) },
    { url: `${SITE.url}/en/services/umsetzung`, ...monthly(0.8) },
    { url: `${SITE.url}/en/services/wartung`, ...monthly(0.8) },
    { url: `${SITE.url}/en/contact`, ...monthly(0.9) },
    { url: `${SITE.url}/en/references`, ...monthly(0.9) },
    { url: `${SITE.url}/en/references/mittelstand`, ...monthly(0.7) },
    { url: `${SITE.url}/en/references/handwerk`, ...monthly(0.7) },
    { url: `${SITE.url}/en/references/logistik`, ...monthly(0.7) },

    // Blog — Übersichten
    { url: `${SITE.url}/blog`, ...monthly(0.8) },
    { url: `${SITE.url}/en/blog`, ...monthly(0.8) },

    // Blog — Artikel (DE + EN, mit wechselseitigen Sprachversionen)
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          de: `${SITE.url}/blog/${post.slug}`,
          en: `${SITE.url}/en/blog/${post.slug}`,
        },
      },
    })),
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE.url}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          de: `${SITE.url}/blog/${post.slug}`,
          en: `${SITE.url}/en/blog/${post.slug}`,
        },
      },
    })),

    // Brand pages (DE-only — no EN mirror yet)
    { url: `${SITE.url}/zero-humans`, ...monthly(0.6) },
    { url: `${SITE.url}/zero-humans/team`, ...monthly(0.5) },
    { url: `${SITE.url}/ki-entwicklung`, ...monthly(0.6) },
    { url: `${SITE.url}/zero-humans/skyscraper`, ...monthly(0.5) },
    { url: `${SITE.url}/lazy-code`, ...monthly(0.5) },
    { url: `${SITE.url}/how-to`, ...monthly(0.5) },
  ];
}
