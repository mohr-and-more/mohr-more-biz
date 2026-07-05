import type { Metadata } from "next";
import { LazyCodePage } from "@/components/lazy-code-page";

export const metadata: Metadata = {
  title: "Sparte Development — Lazy Code | MOHR & MORE",
  description:
    "Full-Stack Entwicklung aus Köln. MVPs, Web-Apps, API-Systeme, Cloud-Architektur. Scrum-friendly, transparent, zielgerichtet. Sparte Development innerhalb der KI Entwicklung.",
  openGraph: {
    title: "Sparte Development — Lazy Code ⋮ MOHR & MORE",
    description:
      "Full-stack development from Cologne. MVPs, web apps, API systems, cloud architecture — Sparte Development.",
    url: "https://mohr-more.biz/lazy-code",
    siteName: "MOHR & MORE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparte Development — Lazy Code ⋮ MOHR & MORE",
    description:
      "Full-stack development from Cologne. MVPs, web apps, API systems, cloud architecture.",
  },
  robots: "index, follow",
};

export default function Page() {
  return <LazyCodePage />;
}
