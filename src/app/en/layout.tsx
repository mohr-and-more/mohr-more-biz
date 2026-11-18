import type { Metadata } from "next";
import { ClientLayoutEn } from "@/components/client-layout-en";
import { FontStylesheets } from "@/components/font-stylesheets";
import { SITE } from "@/data/services";
import "../globals.css";

/**
 * /en/* — English root layout (MMB-468 / Sub 8)
 *
 * This is a root layout: no layout sits above it, so it alone defines
 * `<html lang="en">` and `<body>` for the English tree. The German tree has its
 * own root layout in `src/app/(de)/layout.tsx`; navigating between the two
 * triggers a full page load, which is expected and keeps the document language
 * correct in the static export.
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

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <FontStylesheets />
      </head>
      <body className="antialiased">
        <ClientLayoutEn>{children}</ClientLayoutEn>
      </body>
    </html>
  );
}
