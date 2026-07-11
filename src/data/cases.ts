/**
 * MOHR & MORE — Case Studies Data (MMB-473 / Sub 5)
 *
 * Single Source of Truth für alle Referenzen / Case Studies.
 * Wird sowohl von der Übersichtsseite (/referenzen) als auch von den
 * Detailseiten (/referenzen/[slug]) verwendet.
 *
 * Schema:
 *   - slug:        URL-Anker (kebab-case)
 *   - title:       Anzeige-Titel des Cases
 *   - branch:      Branche als Tag (für Branchen-Filter)
 *   - branchLabel: Anzeige-Name der Branche
 *   - client:      Anonymisierter Kundenname (z.B. "Mittelständischer Bauteilehersteller")
 *   - duration:    Projektdauer (z.B. "6 Monate")
 *   - stats:       Drei Kennzahlen mit Label + Wert + Suffix (z.B. +38 %, 6 Mon.)
 *   - problem:     "Problem"-Block (Fließtext)
 *   - solution:    "Lösung"-Block (Fließtext)
 *   - details:     Detail-Ergebnisse als Liste (für Spoiler "Ergebnisse im Detail")
 *   - tags:        Zusatz-Tags (z.B. ["B2B", "Workflow", "Reporting"]) — werden mit branch kombiniert
 *                  für den data-tags Filter auf der Karte.
 *   - quote:       Optional: Testimonial-Zitat
 */

export type CaseStat = {
  label: string;
  value: string;
  suffix?: string;
};

export type CaseSlug = "mittelstand" | "handwerk" | "logistik";

export type CaseStudy = {
  slug: CaseSlug;
  title: string;
  branch: string;
  branchLabel: string;
  client: string;
  duration: string;
  stats: [CaseStat, CaseStat, CaseStat];
  problem: string;
  solution: string;
  details: string[];
  tags: string[];
  quote?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "mittelstand",
    title: "Strategieberatung für einen mittelständischen Bauteilehersteller",
    branch: "mittelstand",
    branchLabel: "Mittelstand",
    client: "Mittelständischer Bauteilehersteller, 240 Mitarbeiter:innen, NRW",
    duration: "6 Monate",
    stats: [
      { label: "Conversion Website", value: "+38", suffix: "%" },
      { label: "Projektdauer", value: "6", suffix: " Mon." },
      { label: "Pipeline-Wert generiert", value: "2,1", suffix: " Mio. €" },
    ],
    problem:
      "Der Kunde verfügte über ein solides Produktportfolio, hatte aber keine klare Marktpositionierung. Die Marketing- und Vertriebsaktivitäten liefen nebeneinander her, ohne dass klar wurde, welche Kanäle tatsächlich qualifizierte Anfragen liefern. Der Umsatz stagnierte seit zwei Jahren, die Geschäftsführung suchte dringend nach einem Hebel, um das Wachstum wieder in Gang zu bringen.",
    solution:
      "Wir haben in einem 6-Wochen-Sprint Marktanalyse, Wettbewerbsrecherche und Kundeninterviews durchgeführt. Daraus entstand eine klar priorisierte Go-to-Market-Strategie mit definierten Zielsegmenten, neuer Positionierung und einem abgestimmten Vertriebsprozess. Im Anschluss haben wir die ersten drei Quartale operativ begleitet — vom Pitch-Deck bis zur CRM-Pipeline.",
    details: [
      "Markt- und Wettbewerbsanalyse mit SWOT-Profil",
      "Customer-Journey-Audit entlang aller Touchpoints",
      "Neue Positionierung gegen drei Hauptwettbewerber",
      "Überarbeitetes Pitch-Deck für die Geschäftsführung",
      "Einführung eines strukturierten CRM-Workflows",
      "Vertriebs-Enablement: 4 Workshops mit dem Innen- und Außendienst",
      "Quartalsweise Steering-Board-Meetings für 6 Monate",
    ],
    tags: ["B2B", "Mittelstand", "Vertrieb", "Reporting", "Workflow"],
    quote:
      "MOHR & MORE hat uns geholfen, unseren Markt endlich klar zu adressieren. Die neue Strategie zahlt direkt auf unseren Umsatz ein.",
  },
  {
    slug: "handwerk",
    title: "Digitalisierung im Handwerk — vom Auftrag bis zur Rechnung",
    branch: "handwerk",
    branchLabel: "Handwerk",
    client: "SHK-Betriebsverbund, 5 Standorte, Süddeutschland",
    duration: "9 Monate",
    stats: [
      { label: "Verwaltungsaufwand", value: "-52", suffix: "%" },
      { label: "Projektdauer", value: "9", suffix: " Mon." },
      { label: "Fehlerquote Angebote", value: "-71", suffix: "%" },
    ],
    problem:
      "Ein Handwerksbetrieb mit fünf Standorten arbeitete komplett auf Papier. Angebote wurden handschriftlich erstellt, Materialbestellungen telefonisch aufgegeben, und die Rechnungsstellung dauerte regelmäßig 4 bis 6 Wochen. Die Inhaberfamilie verbrachte mehr Zeit mit Verwaltung als mit Kunden — und das Geschäft wuchs schneller als die Prozesse es vertrugen.",
    solution:
      "Wir haben eine schlanke, mobile-first Workflow-Lösung eingeführt: Digitale Auftragsannahme im Service-Wagen, automatische Materialbestellung über eine API-Schnittstelle zum Großhändler, und ein durchgängiger Workflow vom Erstgespräch bis zur Rechnung. Parallel haben wir die fünf Standorte an ein einheitliches CRM angeschlossen.",
    details: [
      "Mobile Auftragsannahme direkt im Service-Wagen (Tablet)",
      "API-Integration zum Großhandel für automatische Materialbestellung",
      "Durchgängiger Workflow: Angebot → Auftrag → Material → Rechnung",
      "Einheitliches CRM für alle 5 Standorte mit rollenbasiertem Zugriff",
      "Schulung der 28 Monteure in 3 Wellen",
      "Quartalsweise Optimierung der Engpässe anhand echter Daten",
    ],
    tags: ["Handwerk", "Mobile", "Workflow", "API", "Schulung"],
    quote:
      "Wir haben in den ersten drei Monaten 30 Stunden Verwaltung pro Woche eingespart. Das hat uns komplett verändert.",
  },
  {
    slug: "logistik",
    title: "Prozessoptimierung in der Logistik — Liefertreue auf 98 %",
    branch: "logistik",
    branchLabel: "Logistik",
    client: "Mittelständischer Logistikdienstleister, 80 Fahrzeuge, DACH-Region",
    duration: "12 Monate",
    stats: [
      { label: "Liefertreue", value: "+18", suffix: " PP" },
      { label: "Projektdauer", value: "12", suffix: " Mon." },
      { label: "Kraftstoffkosten", value: "-12", suffix: "%" },
    ],
    problem:
      "Die Liefertreue eines Logistikdienstleisters mit 80 Fahrzeugen lag bei 82 %, deutlich unter dem Branchendurchschnitt. Die Disposition arbeitete mit drei parallelen Tools und Excel-Listen, was zu Doppelbuchungen, falschen Routen und überlasteten Fahrern führte. Die Kunden drohten mit Vertragsstrafen.",
    solution:
      "Wir haben die Disposition auf eine zentrale Plattform konsolidiert und die drei Bestandssysteme über eine Middleware angebunden. Echtzeit-Routing, automatische Tourenplanung und ein Live-Dashboard für die Disponenten reduzierten die Reaktionszeit von Minuten auf Sekunden. Den Roll-out haben wir in 4 Phasen über 12 Monate begleitet.",
    details: [
      "Middleware zwischen 3 Bestandssystemen (TMS, Fuhrpark, CRM)",
      "Echtzeit-Routing mit Verkehrsdaten und Zeitfenster-Optimierung",
      "Automatisierte Tourenplanung auf Basis historischer Daten",
      "Live-Disposition-Dashboard für 8 Disponenten",
      "Schulungs-Programm für 35 Mitarbeiter:innen über 3 Monate",
      "Quartalsweise KPI-Reviews und inkrementelle Optimierung",
    ],
    tags: ["Logistik", "API", "Workflow", "Reporting", "Schulung"],
  },
];

export const CASE_SLUGS: CaseSlug[] = ["mittelstand", "handwerk", "logistik"];

export function getCase(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function isCaseSlug(slug: string): slug is CaseSlug {
  return CASE_SLUGS.includes(slug as CaseSlug);
}

/**
 * Liste aller Branchen-Labels (für Anzeige im Filter).
 * Wird abgeleitet aus den Case-Daten, damit neue Cases
 * automatisch im Filter auftauchen.
 */
export function getBranchLabels(): { value: string; label: string }[] {
  const seen = new Set<string>();
  const labels: { value: string; label: string }[] = [];
  for (const c of CASE_STUDIES) {
    if (seen.has(c.branch)) continue;
    seen.add(c.branch);
    labels.push({ value: c.branch, label: c.branchLabel });
  }
  return labels;
}