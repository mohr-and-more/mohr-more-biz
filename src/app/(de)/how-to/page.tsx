import type { Metadata } from "next";
import { HowToPage } from "@/components/how-to-page";

export const metadata: Metadata = {
  title: "How-To — Paperclip Gebrauchsanleitung | MOHR & MORE",
  description:
    "Schritt-für-Schritt-Anleitung: Wie man mit Paperclip arbeitet. Aufgaben erstellen, Agenten steuern, Projekte verwalten.",
  openGraph: {
    title: "How-To — Paperclip | MOHR & MORE",
    description: "Gebrauchsanleitung für Paperclip — die KI-Agenten-Orchestrierungsplattform",
  },
};

export default function Page() {
  return <HowToPage />;
}
