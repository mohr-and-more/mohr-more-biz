import type { Metadata } from "next";
import { ZeroHumansPage } from "@/components/zero-humans-page";

export const metadata: Metadata = {
  title: "Lazy Code — Die Software-Sparte von Mohr Die Null-Menschen-Firma More | MOHR & MORE",
  description:
    "272 KI-Agenten. 15 Abteilungen. 28+ Projekte. 24/7/365 autonom. Die erste Null-Menschen-Firma der Welt — aufgebaut von Gunnar Mohr.",
  openGraph: {
    title: "Lazy Code — The Software Division of Mohr The Zero-Human Company More | MOHR & MORE",
    description:
      "272 AI agents. 15 departments. 28+ projects. 24/7/365 autonomous. The world's first zero-human company — built by Gunnar Mohr.",
    url: "https://mohr-more.biz/lazy-code",
    siteName: "MOHR & MORE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lazy Code — The Software Division of Mohr The Zero-Human Company More | MOHR & MORE",
    description:
      "272 AI agents. 15 departments. 28+ projects. 24/7/365 autonomous. The world's first zero-human company.",
  },
  robots: "index, follow",
};

export default function Page() {
  return <ZeroHumansPage />;
}
