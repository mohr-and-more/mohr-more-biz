/**
 * MOHR & MORE — Services Data (MMB-471 / Sub 3)
 *
 * Single Source of Truth für alle Leistungs-Inhalte.
 * Wird sowohl von der Übersichtsseite (/leistungen) als auch von den
 * Detailseiten (/leistungen/[slug]) verwendet.
 *
 * Schema:
 *   - slug:        URL-Anker (kebab-case)
 *   - title:       Anzeige-Titel
 *   - shortLabel:  Kurzbezeichnung (für Tags)
 *   - icon:        SVG-Key (siehe IconMap in den Komponenten)
 *   - intro:       Kurztext (für Übersicht + Meta-Description)
 *   - problem:     "Problem"-Block
 *   - solution:    "Lösung"-Block
 *   - outcome:     "Ergebnis"-Block
 *   - bullets:     Aufzählungspunkte (für Detailseite)
 *   - faqs:        FAQ-Einträge (für Detailseite JSON-LD)
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type ServiceSlug =
  | "beratung"
  | "umsetzung"
  | "wartung"
  | "automatisierung"
  | "schulung"
  | "strategie";

export type Service = {
  slug: ServiceSlug;
  title: string;
  shortLabel: string;
  icon: "compass" | "wrench" | "shield" | "zap" | "graduation" | "chess";
  intro: string;
  problem: string;
  solution: string;
  outcome: string;
  bullets: string[];
  faqs: FaqItem[];
};

/**
 * Drei voll ausformulierte Detail-Slugs (MMB-471 Pflicht: beratung, umsetzung, wartung)
 * plus drei zusätzliche Übersichts-Karten (automatisierung, schulung, strategie).
 */
export const SERVICES: Service[] = [
  {
    slug: "beratung",
    title: "Strategieberatung",
    shortLabel: "Beratung",
    icon: "compass",
    intro:
      "Wir analysieren Ihre aktuelle Marktposition, identifizieren die größten Hebel und liefern eine datenbasierte Strategie, die Ihr Team ab Tag 1 umsetzen kann.",
    problem:
      "Unklare Marktposition, fragmentierte Daten und fehlende Entscheidungsgrundlagen führen dazu, dass Budgets wirkungslos verpuffen.",
    solution:
      "Wir verbinden Marktanalyse, Wettbewerbsrecherche und Daten-Audit zu einem klar priorisierten Maßnahmenplan mit Quick-Wins und langfristigen Initiativen.",
    outcome:
      "Klare Wachstumsstrategie, priorisierte Roadmap und ein verbindlicher Business Case, mit dem Sie Investitionen rechtfertigen können.",
    bullets: [
      "Markt- und Wettbewerbsanalyse inkl. SWOT",
      "Customer-Journey-Audit entlang aller Touchpoints",
      "Daten-Audit: Welche Daten haben Sie, welche fehlen?",
      "Quick-Win-Identifikation binnen 2 Wochen",
      "Maßnahmen-Roadmap mit klaren Verantwortlichkeiten",
      "Investitionsplanung und Business Case",
    ],
    faqs: [
      {
        question: "Wie lange dauert ein Beratungsmandat bei MOHR & MORE?",
        answer:
          "Eine klassische Strategieberatung dauert 4 bis 8 Wochen. In den ersten zwei Wochen liefern wir Quick-Wins, danach die vollständige Roadmap. Bei Bedarf können wir auch in kürzeren Intervallen (2-Wochen-Sprints) arbeiten.",
      },
      {
        question: "Was kostet eine Strategieberatung?",
        answer:
          "Die Investition richtet sich nach Umfang und Tiefe. Wir arbeiten mit Festpreis-Paketen, die nach Anzahl der Analysemodule skaliert werden. Ein Erstgespräch und ein unverbindliches Angebot sind kostenlos.",
      },
      {
        question: "Mit welchen Branchen arbeitet MOHR & MORE zusammen?",
        answer:
          "Unser Schwerpunkt liegt auf mittelständischen B2B-Unternehmen in Handel, Logistik, Handwerk und produzierendem Gewerbe. Wir bringen Erfahrung aus über 50 Projekten in diesen Segmenten mit.",
      },
      {
        question: "Erhalte ich am Ende ein schriftliches Strategiedokument?",
        answer:
          "Ja. Sie erhalten einen vollständigen Strategiebericht (PDF + editierbares Markdown), die Roadmap als priorisierte Backlog-Liste und auf Wunsch eine Präsentation für Ihre Geschäftsführung oder Ihren Beirat.",
      },
    ],
  },
  {
    slug: "umsetzung",
    title: "Digitalisierung & Umsetzung",
    shortLabel: "Umsetzung",
    icon: "wrench",
    intro:
      "Wir übersetzen Strategie in funktionierende Lösungen — von der Workflow-Automatisierung bis zur individuellen Software. Schnell, messbar und ohne Reibungsverluste.",
    problem:
      "Manuelle Prozesse, Insellösungen und fehlende Integration kosten täglich Zeit, Geld und Nerven — und bremsen Ihr Wachstum aus.",
    solution:
      "Wir bauen pragmatische Workflow-Automatisierungen, integrieren Ihre Tools und implementieren passgenaue Software, die Ihre Teams sofort produktiver macht.",
    outcome:
      "Bis zu 50 % weniger Verwaltungsaufwand, messbar schnellere Durchlaufzeiten und entlastete Teams, die sich auf wertschöpfende Aufgaben konzentrieren.",
    bullets: [
      "Workflow-Automatisierung (RPA, API-Integrationen, Low-Code)",
      "ERP- und CRM-Integration mit Ihren Bestandssystemen",
      "Individuelle Softwareentwicklung (Web, Mobile, Backend)",
      "Daten-Pipelines und Reporting-Dashboards",
      "Schulung und Enablement Ihres Teams",
      "Begleitende Qualitätssicherung und Erfolgsmessung",
    ],
    faqs: [
      {
        question: "Welche Technologien setzt MOHR & MORE bei der Umsetzung ein?",
        answer:
          "Wir sind technologisch neutral und wählen den Stack nach Anforderung: TypeScript/React im Web, Python für Daten-Pipelines, Node.js für APIs, n8n oder individuelle RPA-Tools für Automatisierung. Bei Standardsoftware empfehlen wir bewährte SaaS-Lösungen statt Eigenentwicklung, wo sinnvoll.",
      },
      {
        question: "Wie läuft ein Umsetzungsprojekt konkret ab?",
        answer:
          "Nach der Strategiephase starten wir mit einem 2-Wochen-Sprint zur Validierung der Architektur. Danach arbeiten wir in 4-Wochen-Inkrementen mit regelmäßigen Reviews. Sie sehen jeden Sprint ein lauffähiges Ergebnis, nicht erst am Projektende.",
      },
      {
        question: "Können wir auch mit unserem eigenen IT-Team zusammenarbeiten?",
        answer:
          "Ja, das ist sogar häufig der Fall. Wir übernehmen die Architektur, die kritischen Integrationspunkte und das Enablement, während Ihr Team Routineaufgaben selbst umsetzt. So bauen Sie nachhaltige Kompetenz auf.",
      },
      {
        question: "Was passiert nach Projektabschluss?",
        answer:
          "Sie erhalten vollständige Dokumentation, Schulungsunterlagen und auf Wunsch einen Wartungsvertrag. Viele Kunden entscheiden sich für die begleitende Optimierung (siehe Wartung), um die Lösung dauerhaft aktuell zu halten.",
      },
    ],
  },
  {
    slug: "wartung",
    title: "Laufende Wartung & Optimierung",
    shortLabel: "Wartung",
    icon: "shield",
    intro:
      "Software lebt. Wir halten Ihre Lösungen aktuell, sicher und performant — und entwickeln sie mit Ihrem Geschäft weiter, statt sie veralten zu lassen.",
    problem:
      "Lösungen, die nicht aktiv gepflegt werden, werden langsam, unsicher und irgendwann unwartbar. Fehlende Updates kosten am Ende mehr als die Wartung es je getan hätte.",
    solution:
      "Wir bieten planbare Wartungspakete mit definierten Reaktionszeiten, regelmäßigen Sicherheits-Updates und kontinuierlicher Optimierung Ihrer Tools.",
    outcome:
      "Planbare Kosten, hohe Verfügbarkeit und kontinuierliche Verbesserung statt böser Überraschungen — Ihre Lösung bleibt eine Investition, kein Risiko.",
    bullets: [
      "Sicherheits-Updates und Dependency-Management",
      "Performance-Monitoring und Bottleneck-Analyse",
      "Backup- und Recovery-Strategie",
      "Inkrementelle Feature-Erweiterungen",
      "Quartalsweise Health-Reports mit Empfehlungen",
      "Definierte SLA-Reaktionszeiten (4h / 24h / 72h)",
    ],
    faqs: [
      {
        question: "Welche SLA-Stufen bietet MOHR & MORE an?",
        answer:
          "Drei Stufen: Bronze (Reaktion binnen 72h, Geschäftszeiten), Silber (Reaktion binnen 24h, Geschäftszeiten) und Gold (Reaktion binnen 4h, 24/7). Jede Stufe enthält ein monatliches Kontingent an Entwicklungsstunden für kleine Erweiterungen.",
      },
      {
        question: "Können wir jederzeit kündigen oder den Umfang anpassen?",
        answer:
          "Ja. Wartungsverträge haben eine Mindestlaufzeit von drei Monaten und sind danach monatlich kündbar. Den Umfang (Stunden, SLA, Leistungsbestandteile) passen wir quartalsweise gemeinsam an.",
      },
      {
        question: "Was ist, wenn unsere bestehende Lösung nicht von MOHR & MORE gebaut wurde?",
        answer:
          "Kein Problem. Wir übernehmen auch die Wartung und Weiterentwicklung von Lösungen anderer Anbieter. Voraussetzung ist ein initialer Health-Check (2–5 Tage), den wir mit einem Festpreis anbieten.",
      },
      {
        question: "Erhalten wir regelmäßig Berichte?",
        answer:
          "Ja. Sie bekommen monatlich einen kurzen Statusbericht und quartalsweise einen ausführlichen Health-Report mit Performance-Daten, Sicherheits-Audit, Empfehlungen und einer Vorschau der nächsten Schritte.",
      },
    ],
  },
  // ===== Drei zusätzliche Service-Karten für die Übersicht (MMB-468 Pflicht: 3-6 Karten) =====
  {
    slug: "automatisierung",
    title: "Workflow-Automatisierung",
    shortLabel: "Automatisierung",
    icon: "zap",
    intro:
      "Wir identifizieren und automatisieren repetitive Prozesse, damit Ihre Teams sich auf wertschöpfende Arbeit konzentrieren können.",
    problem:
      "Manuelle Datenübertragung, Copy-Paste zwischen Tools und zeitraubende Routineaufgaben binden qualifizierte Mitarbeiter:innen, die für strategische Aufgaben gebraucht würden.",
    solution:
      "Wir analysieren Ihre wiederkehrenden Prozesse, identifizieren die größten Hebel und implementieren Automatisierungen — von einfachen E-Mail-Workflows bis zu komplexen API-Integrationen.",
    outcome:
      "Stunden an Routinearbeit pro Woche verschwinden, Fehlerquoten sinken, und Ihre Mitarbeiter:innen gewinnen Kapazität für das, was wirklich zählt.",
    bullets: [
      "Process-Mining und Aufwandsanalyse",
      "Tool-Stack-Audit (Welche Tools, welche Schnittstellen?)",
      "Low-Code- und RPA-Implementierung",
      "API-Integrationen zwischen Bestandssystemen",
      "Monitoring und Fehler-Handling",
    ],
    faqs: [
      {
        question: "Wie schnell sehen wir erste Ergebnisse?",
        answer:
          "Bei klassischen Workflow-Automatisierungen liefern wir innerhalb von 2 Wochen eine erste lauffähige Lösung. Die Wirkung messen wir gemeinsam nach 30 und 90 Tagen.",
      },
      {
        question: "Funktioniert das auch mit unseren alten Systemen?",
        answer:
          "Ja. Wir haben Erfahrung mit der Anbindung älterer ERP-, CRM- und Branchensoftware — auch wenn es keine offiziellen APIs gibt. Wo nötig, nutzen wir bewährte RPA-Tools als Brücke.",
      },
    ],
  },
  {
    slug: "schulung",
    title: "Team-Schulung & Enablement",
    shortLabel: "Schulung",
    icon: "graduation",
    intro:
      "Wir befähigen Ihre Teams, neue Tools und Prozesse sicher zu nutzen — mit passgenauen Schulungen statt generischer Online-Kurse.",
    problem:
      "Neue Software wird eingeführt, aber niemand nutzt sie richtig. Schulungsunterlagen verstauben, und nach sechs Monaten ist man wieder bei Excel und E-Mail.",
    solution:
      "Wir entwickeln Schulungen, die genau auf Ihre Tools, Prozesse und Rollen zugeschnitten sind — als Workshop-Reihe, Video-Tutorial-Bibliothek oder Hands-on-Coaching.",
    outcome:
      "Schnellere Adoption, weniger Support-Anfragen und Teams, die neue Lösungen eigenständig weiterentwickeln können.",
    bullets: [
      "Bedarfsanalyse und Rollen-basiertes Curriculum",
      "Präsenz- und Remote-Workshops",
      "Video-Tutorials und Micro-Learning-Content",
      "Hands-on-Coaching on the job",
      "Wissensdatenbank für nachhaltigen Wissenstransfer",
    ],
    faqs: [
      {
        question: "Wie groß sollten die Schulungsgruppen sein?",
        answer:
          "Optimal sind 4–8 Teilnehmer:innen pro Workshop. Bei größeren Gruppen empfehlen wir mehrere parallel laufende Sessions mit unterschiedlichen Rollen-Foki.",
      },
      {
        question: "Erstellen Sie auch Schulungsmaterial, das wir intern weiter nutzen können?",
        answer:
          "Ja. Alle Schulungen werden dokumentiert, und Sie erhalten editierbare Unterlagen (Markdown, Keynote/PowerPoint, Videomitschnitte), die Sie dauerhaft intern nutzen können.",
      },
    ],
  },
  {
    slug: "strategie",
    title: "Go-to-Market & Wachstum",
    shortLabel: "Strategie",
    icon: "chess",
    intro:
      "Wir entwickeln mit Ihnen eine Go-to-Market-Strategie, die wirklich zu Ihrem Produkt, Ihren Kunden und Ihren Kapazitäten passt — und setzen die ersten Schritte mit um.",
    problem:
      "Viele Unternehmen wissen nicht, wie sie ihr Produkt oder ihre Dienstleistung effizient am Markt platzieren sollen. Marketing und Vertrieb arbeiten nicht zusammen, der Markt wird nicht erreicht.",
    solution:
      "Wir analysieren Ihre Zielsegmente, entwickeln Positionierung und Pricing und konzipieren einen Go-to-Market-Plan, der Vertrieb, Marketing und Produkt zusammenführt.",
    outcome:
      "Klare Marktpositionierung, validierte Zielsegmente und ein konkreter Plan, wie Sie Ihre Pipeline in den nächsten 6 Monaten füllen.",
    bullets: [
      "Zielgruppen- und Segmentanalyse (TAM / SAM / SOM)",
      "Positionierung und Value Proposition Design",
      "Pricing-Strategie und Verpackung",
      "Channel- und Partner-Auswahl",
      "Launch-Plan mit Meilensteinen und KPIs",
    ],
    faqs: [
      {
        question: "Ist das nur für B2B oder auch für B2C geeignet?",
        answer:
          "Unser Schwerpunkt liegt auf B2B. Für B2C vermitteln wir auf Anfrage passende Partner aus unserem Netzwerk. Wir sagen offen, wenn wir nicht die richtigen sind.",
      },
      {
        question: "Wie lange dauert eine Go-to-Market-Entwicklung?",
        answer:
          "Eine vollständige GTM-Entwicklung dauert 6 bis 10 Wochen. Bei Bedarf liefern wir nach 3 Wochen eine validierte Positionierung als ersten Meilenstein, mit der Sie bereits arbeiten können.",
      },
    ],
  },
];

/**
 * Drei Slugs mit ausformulierten FAQ-Sektionen (für Detailseiten).
 * Die anderen Slugs sind in der Übersicht verlinkt, führen aber auf eine
 * schlankere "Bald verfügbar"-Seite oder zurück zur Übersicht.
 */
export const DETAIL_SLUGS: ServiceSlug[] = ["beratung", "umsetzung", "wartung"];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function isDetailSlug(slug: string): slug is ServiceSlug {
  return DETAIL_SLUGS.includes(slug as ServiceSlug);
}

/**
 * Deutsche Locale-Metadaten — wird für JSON-LD und OG-Tags benötigt.
 */
export const SITE = {
  name: "MOHR & MORE",
  url: "https://mohr-more.biz",
  locale: "de_DE",
  description:
    "MOHR & MORE digitalisiert Vertrieb und Verwaltung für den Mittelstand. Strategie, Umsetzung, Wartung und Automatisierung aus einer Hand.",
};
