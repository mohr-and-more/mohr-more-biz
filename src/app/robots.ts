import type { MetadataRoute } from "next";
import { SITE } from "@/data/services";

/**
 * /robots.txt — Robots Exclusion Protocol for mohr-more.biz (MMB-468 / Sub 8)
 *
 * - Allows everything except /api/* (backend, no value to indexers).
 * - Disallows the design-system preview (noindex already set in metadata,
 *   this is belt-and-braces).
 * - Points crawlers at /sitemap.xml and the EN mirror.
 *
 * Submission:
 *   - Verify by GETting /robots.txt from production.
 *   - Google Search Console picks this up automatically; no separate submit
 *     needed for robots.txt (only for the sitemap).
 */
// Force-static for output: export (Next 16)
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/design-system", "/dashboard"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}