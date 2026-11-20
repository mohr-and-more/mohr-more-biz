import type { Metadata } from "next";
import { Hero, Manifest, SystemArchitecture, Principles, Vision, Contact } from "@/components/sections";
import { SITE } from "@/data/services";

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE.url}/`,
    languages: {
      de: `${SITE.url}/`,
      en: `${SITE.url}/en`,
      "x-default": `${SITE.url}/`,
    },
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="divider" />
      <Manifest />
      <div className="divider" />
      <SystemArchitecture />
      <div className="divider" />
      <Principles />
      <div className="divider" />
      <Vision />
      <div className="divider" />
      <Contact />
    </main>
  );
}
