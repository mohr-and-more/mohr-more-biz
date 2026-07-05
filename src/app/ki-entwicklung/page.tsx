import type { Metadata } from "next";
import { KiEntwicklungPage } from "@/components/ki-entwicklung-page";

export const metadata: Metadata = {
  title: "KI Entwicklung — Sparten & Engineering | MOHR & MORE",
  description:
    "Die technologische Entwicklung von MOHR & MORE Business: AI Agents, Full-Stack Entwicklung, Cloud-Architektur und Automation. LazyCode⋮Cologne ist die Software-Sparte.",
  openGraph: {
    title: "KI Entwicklung — MOHR & MORE",
    description:
      "Engineering, AI Agents, Cloud-native Software. Von der Idee bis zur Produktion — aus Köln.",
    url: "https://mohr-more.biz/ki-entwicklung",
    siteName: "MOHR & MORE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KI Entwicklung — MOHR & MORE",
    description:
      "Engineering, AI Agents, Cloud-native Software. Von der Idee bis zur Produktion.",
  },
  robots: "index, follow",
};

export default function Page() {
  return <KiEntwicklungPage />;
}
