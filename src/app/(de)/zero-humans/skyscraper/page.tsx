import type { Metadata } from "next";
import { SkyscraperPage } from "@/components/skyscraper-page";

export const metadata: Metadata = {
  title: "Skyscraper — Pixel-Art Agenten-Visualisierung | MOHR & MORE",
  description:
    "272 KI-Agenten in einem Pixel-Art-Hochhaus. Frontwand durchsichtig — wer arbeitet, hat Licht an. Die Null-Menschen-Firma als lebendiger Wolkenkratzer.",
  openGraph: {
    title: "Skyscraper — Pixel-Art Agent HQ | MOHR & MORE",
    description:
      "272 AI agents in a pixel-art skyscraper. Transparent front wall — who works has the lights on.",
    url: "https://mohr-more.biz/zero-humans/skyscraper",
    siteName: "MOHR & MORE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skyscraper — Pixel-Art Agent HQ | MOHR & MORE",
    description:
      "272 AI agents in a pixel-art skyscraper. Who works has the lights on.",
  },
  robots: "index, follow",
};

export default function Page() {
  return <SkyscraperPage />;
}
