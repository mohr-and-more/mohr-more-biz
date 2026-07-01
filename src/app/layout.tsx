import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";

export const metadata: Metadata = {
  title: "MOHR & MORE BUSINESS — Zero-Human Company",
  description:
    "Wir bauen Unternehmen, die wie Software skalieren. MOHR & MORE Business — das erste vollständig autonome KI-Unternehmen. 273 Agenten, 5 Hierarchie-Ebenen, 24/7.",
  keywords:
    "Zero-Human Company, KI Unternehmen, AI Agents, Automatisierung, Agentic Systems, Mohr & More, Paperclip",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
