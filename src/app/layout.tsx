import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";

export const metadata: Metadata = {
  title: "MOHR — AI Agent Orchestration",
  description:
    "Ein auf Open Source Agenten-Framework eigens erstelltes KI Unternehmen. MOHR & MORE Business.",
  keywords: "AI Agenten, Orchestration, Open Source, KI Unternehmen, Automatisierung",
  openGraph: {
    title: "MOHR & MORE | AI Agent Orchestration",
    description: "Ein auf Open Source Agenten-Framework eigens erstelltes KI Unternehmen",
    locale: "de_DE",
    type: "website",
    url: "https://mohr-more.biz",
    siteName: "MOHR & MORE",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOHR & MORE | AI Agent Orchestration",
    description: "Ein auf Open Source Agenten-Framework eigens erstelltes KI Unternehmen",
  },
  robots: "index, follow",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
