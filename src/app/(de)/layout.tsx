import type { Metadata } from "next";
import "../globals.css";
import { ClientLayout } from "@/components/client-layout";
import { FontStylesheets } from "@/components/font-stylesheets";

/**
 * German root layout.
 *
 * Since the app uses two independent documents (DE and EN), this layout is a
 * root layout: it is the only place that defines `<html>` and `<body>` for the
 * German tree. The English tree has its own root layout in `src/app/en/layout.tsx`.
 */
export const metadata: Metadata = {
  title: "MOHR & MORE BUSINESS — Zero-Human Company",
  description:
    "Wir bauen Unternehmen, die wie Software skalieren. MOHR & MORE Business — das erste vollständig autonome KI-Unternehmen. 273 Agenten, 5 Hierarchie-Ebenen, 24/7.",
  keywords:
    "Zero-Human Company, KI Unternehmen, AI Agents, Automatisierung, Agentic Systems, Mohr & More",
  openGraph: {
    title: "MOHR & MORE BUSINESS — Zero-Human Company",
    description: "Wir bauen Unternehmen, die wie Software skalieren. Ein Mensch. Eine KI. Ein Unternehmen.",
    locale: "de_DE",
    type: "website",
    url: "https://mohr-more.biz",
    siteName: "MOHR & MORE BUSINESS",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOHR & MORE BUSINESS — Zero-Human Company",
    description: "Wir bauen Unternehmen, die wie Software skalieren.",
  },
  robots: "index, follow",
  icons: { icon: "/favicon.ico" },
};

export default function DeRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <FontStylesheets />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
