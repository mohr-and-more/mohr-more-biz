import type { Metadata } from "next";
import { LazyCodePage } from "@/components/lazy-code-page";

export const metadata: Metadata = {
  title: "Lazy Code — Die Software-Sparte von MOHR & MORE",
  description:
    "Full-Stack Entwicklung aus Köln. MVPs, Web-Apps, API-Systeme, Cloud-Architektur. Scrum-friendly, transparent, zielgerichtet.",
  openGraph: {
    title: "Lazy Code — The Software Division of MOHR & MORE",
    description:
      "Full-stack development from Cologne. MVPs, web apps, API systems, cloud architecture. Scrum-friendly, transparent, focused.",
    url: "https://mohr-more.biz/lazy-code",
    siteName: "MOHR & MORE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lazy Code — The Software Division of MOHR & MORE",
    description:
      "Full-stack development from Cologne. MVPs, web apps, API systems, cloud architecture.",
  },
  robots: "index, follow",
};

export default function Page() {
  return <LazyCodePage />;
}
