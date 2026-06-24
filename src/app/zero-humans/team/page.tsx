import type { Metadata } from "next";
import { TeamPage } from "@/components/team-page";

export const metadata: Metadata = {
  title: "Das KI-Team — 272 Agenten | MOHR & MORE",
  description:
    "Alle 272 KI-Agenten von MOHR & MORE als einzigartige Cryptopunks-Pixelporträts. Jeder Kopf klickbar — mit Rolle, Abteilung und Hierarchie-Ebene. Die Null-Menschen-Firma.",
  openGraph: {
    title: "The AI Team — 272 Agents | MOHR & MORE",
    description:
      "All 272 MOHR & MORE AI agents as unique Cryptopunks-style pixel portraits. Click any face for role, department and hierarchy level.",
    url: "https://mohr-more.biz/zero-humans/team",
    siteName: "MOHR & MORE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The AI Team — 272 Agents | MOHR & MORE",
    description:
      "All 272 MOHR & MORE AI agents as unique Cryptopunks-style pixel portraits.",
  },
  robots: "index, follow",
};

export default function Page() {
  return <TeamPage />;
}
