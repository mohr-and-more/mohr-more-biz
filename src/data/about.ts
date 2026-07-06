// MOHR & MORE — Human team + history (MMB-474, Sub 6 von 8 aus MMB-468)
// Diese Datei enthält die Platzhalter für die /ueber-uns Seite:
//  - 4 Team-Karten (Avatar, Name, Rolle, Bio)
//  - 6 Timeline-Einträge (Gründung 2009 → heute)
//  - 4 Werte-Punkte
//
// Sobald der Kunde echte Teamfotos + finale Bios liefert, werden hier
// nur die Daten getauscht — die Komponente bleibt unverändert.

import type { Lang } from "@/lib/i18n";

export interface TeamMember {
  /** URL-Slug, verwendet für den Avatar-Pfad /team-human/<slug>.svg */
  slug: string;
  /** Anzeigename */
  name: string;
  /** Rolle / Position in der Firma */
  role: Record<Lang, string>;
  /** 1–2-Satz-Bio */
  bio: Record<Lang, string>;
}

export interface TimelineEntry {
  /** Jahreszahl als String (z.B. "2009", "2018") */
  year: string;
  /** Titel des Meilensteins */
  title: Record<Lang, string>;
  /** Kurze Beschreibung des Ereignisses */
  description: Record<Lang, string>;
}

export interface CompanyValue {
  /** SVG-Icon-Name (siehe <ValueIcon /> in der Page-Komponente) */
  icon: "compass" | "shield" | "zap" | "users";
  /** Titel des Wertes */
  title: Record<Lang, string>;
  /** Beschreibung des Wertes */
  description: Record<Lang, string>;
}

/**
 * 4 Team-Karten (MMB-474 Pflicht).
 * Avatar-Platzhalter werden als monochrome SVG-Initialen gerendert,
 * bis der Kunde echte Teamfotos liefert.
 */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    slug: "gregor-mohr",
    name: "Gregor Mohr",
    role: {
      de: "Geschäftsführung",
      en: "Managing Director",
    },
    bio: {
      de: "Verantwortet Strategie und Kundenbeziehungen. Über 20 Jahre Erfahrung in Handel und E-Commerce — pragmatisch, direkt, ohne Beratergeschwätz.",
      en: "Leads strategy and client relationships. 20+ years in trade and e-commerce — pragmatic, direct, no consultant fluff.",
    },
  },
  {
    slug: "gunnar-mohr",
    name: "Gunnar Mohr",
    role: {
      de: "Technische Leitung",
      en: "Technical Lead",
    },
    bio: {
      de: "Verantwortet Architektur, KI-Agenten und Infrastruktur. Full-Stack mit Fokus auf Cloud, Automatisierung und messbare Resultate.",
      en: "Owns architecture, AI agents and infrastructure. Full-stack with a focus on cloud, automation and measurable outcomes.",
    },
  },
  {
    slug: "anna-keller",
    name: "Anna Keller",
    role: {
      de: "Projektleitung",
      en: "Project Management",
    },
    bio: {
      de: "Steuert Kundenprojekte von Briefing bis Go-Live. Hält Zeitpläne, Budgets und Qualität im Gleichgewicht.",
      en: "Drives customer projects from briefing to go-live. Keeps timelines, budgets and quality in balance.",
    },
  },
  {
    slug: "lukas-fischer",
    name: "Lukas Fischer",
    role: {
      de: "Beratung & Analyse",
      en: "Consulting & Analysis",
    },
    bio: {
      de: "Analysiert Prozesse, deckt Optimierungspotenziale auf und übersetzt sie in konkrete Umsetzungsschritte für das Team.",
      en: "Analyzes processes, uncovers optimization potential and translates it into concrete implementation steps for the team.",
    },
  },
];

/**
 * Timeline: 6 Meilensteine von der Gründung bis heute.
 * (MMB-474 Pflicht: mind. 5 Einträge)
 */
export const TIMELINE: TimelineEntry[] = [
  {
    year: "2009",
    title: {
      de: "Gründung in Köln",
      en: "Founded in Cologne",
    },
    description: {
      de: "MOHR & MORE wird als Beratungs- und Umsetzungspartner für den Mittelstand gegründet.",
      en: "MOHR & MORE is founded as a consulting and implementation partner for SMEs.",
    },
  },
  {
    year: "2014",
    title: {
      de: "Internationales B2B-Sourcing",
      en: "International B2B Sourcing",
    },
    description: {
      de: "Aufbau von Beschaffungsnetzwerken in Asien, UAE und Europa für Textilien, Beauty und Elektronik.",
      en: "Build-out of sourcing networks across Asia, UAE and Europe for textiles, beauty and electronics.",
    },
  },
  {
    year: "2018",
    title: {
      de: "Retouren-Expertise",
      en: "Returns Expertise",
    },
    description: {
      de: "Partnerschaften mit ZigZag Global und BuyBay — Fokusthema Retourenmanagement im E-Commerce.",
      en: "Partnerships with ZigZag Global and BuyBay — returns management becomes a focus topic in e-commerce.",
    },
  },
  {
    year: "2021",
    title: {
      de: "KI-Voicebot & Telefonie",
      en: "AI Voicebot & Telephony",
    },
    description: {
      de: "Launch eigener KI-Telefonassistenten für Terminbuchung, Kunden-Support und Retourenabwicklung — 24/7.",
      en: "Launch of proprietary AI phone assistants for booking, customer support and returns handling — 24/7.",
    },
  },
  {
    year: "2024",
    title: {
      de: "KI-Agenten-Plattform",
      en: "AI Agent Platform",
    },
    description: {
      de: "Aufbau einer internen Multi-Agent-Architektur zur Automatisierung von Vertrieb, Verwaltung und Reporting.",
      en: "Build of an internal multi-agent architecture for automating sales, administration and reporting.",
    },
  },
  {
    year: "2026",
    title: {
      de: "Zero-Human Company",
      en: "Zero-Human Company",
    },
    description: {
      de: "Vollständig autonome KI-Organisation: 273 Agenten, 5 Hierarchie-Ebenen, 24/7-Betrieb mit einem menschlichen Founder.",
      en: "Fully autonomous AI organization: 273 agents, 5 hierarchy levels, 24/7 operation with a single human founder.",
    },
  },
];

/**
 * 4 Werte-Punkte (MMB-474 Pflicht: 3–4 Punkte, Icon je Punkt).
 */
export const VALUES: CompanyValue[] = [
  {
    icon: "compass",
    title: {
      de: "Ergebnis vor Methode",
      en: "Outcome over Method",
    },
    description: {
      de: "Wir messen Erfolg an konkreten Zahlen unserer Kunden — nicht an Folien oder Berater-Jargon.",
      en: "We measure success by the numbers our clients achieve — not by slides or consultant jargon.",
    },
  },
  {
    icon: "shield",
    title: {
      de: "Verlässlichkeit",
      en: "Reliability",
    },
    description: {
      de: "Fristen, Budgets und Zusagen halten wir ein. Wenn etwas schiefgeht, sagen wir es zuerst — nicht zuletzt.",
      en: "We honor deadlines, budgets and commitments. If something goes wrong, we say it first — not last.",
    },
  },
  {
    icon: "zap",
    title: {
      de: "Geschwindigkeit",
      en: "Speed",
    },
    description: {
      de: "Wo andere noch Workshops planen, liefern wir schon die erste lauffähige Lösung. Iteration schlägt Big-Bang.",
      en: "Where others still plan workshops, we already ship the first working solution. Iteration beats big-bang.",
    },
  },
  {
    icon: "users",
    title: {
      de: "Augenhöhe",
      en: "Peer-Level Partnership",
    },
    description: {
      de: "Wir reden mit Kunden auf Augenhöhe — verständlich, ehrlich und ohne Fachchinesisch, das keiner braucht.",
      en: "We talk to clients as peers — clearly, honestly and without the jargon nobody needs.",
    },
  },
];