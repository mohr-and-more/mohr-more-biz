import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Aufgaben-Dashboard | MOHR & MORE",
  description:
    "Übersicht aller Paperclip-Aufgaben von MOHR & MORE — Projekt, Zuständige, Status und nächste Schritte.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardView />;
}
