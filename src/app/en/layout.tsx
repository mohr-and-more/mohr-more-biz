import type { Metadata } from "next";
import { ClientLayoutEn } from "@/components/client-layout-en";
import { SITE } from "@/data/services";
import "../globals.css";

/**
 * /en/* — English route layout (MMB-468 / Sub 8)
 *
 * - Sets <html lang="en"> for EN-only routes.
 * - Provides hreflang + canonical metadata pointing at the DE root.
 * - Hydrates the DE/EN language provider with lang="en" initial state
 *   (ClientLayoutEn wraps the same I18nProvider with `initial="en"`).
 */
export const metadata: Metadata = {
  title: {
    default: "MOHR & MORE — Commerce. Technology. Execution.",
    template: "%s | MOHR & MORE",
  },
  description:
    "Commerce. Technology. Execution. We build companies that scale like software — Gregor Mohr brings trade reality, Gunnar Mohr brings AI-driven execution. Cologne, Germany.",
  alternates: {
    canonical: SITE.url,
    languages: {
      de: SITE.url,
      en: `${SITE.url}/en`,
      "x-default": SITE.url,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: "MOHR & MORE — Commerce. Technology. Execution.",
    description:
      "Commerce. Technology. Execution. We build companies that scale like software.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOHR & MORE — Commerce. Technology. Execution.",
    description:
      "Commerce. Technology. Execution. We build companies that scale like software.",
  },
  robots: { index: true, follow: true },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ClientLayoutEn>{children}</ClientLayoutEn>
      </body>
    </html>
  );
}