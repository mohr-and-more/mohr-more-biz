import type { Lang } from "@/lib/i18n";

/**
 * Vollständige Artikeltexte für den MOHR & MORE Blog — Deutsch und Englisch.
 *
 * Inhaltliche Grundlage sind die veröffentlichten Angaben des Unternehmens
 * (Historie 2009–2026, interner Multi-Agenten-Betrieb, veröffentlichte
 * Projektkennzahlen aus `cases.ts`) sowie die Unternehmenswerte aus `about.ts`.
 */

export interface BlogArticleSection {
  heading: string;
  /** Absätze in Reihenfolge; Aufzählungen beginnen mit "• ". */
  paragraphs: string[];
}

export interface BlogArticleCta {
  text: string;
  label: string;
  href: string;
}

export interface BlogArticle {
  intro: string[];
  sections: BlogArticleSection[];
  conclusion: string;
  cta: BlogArticleCta;
}

export const BLOG_ARTICLES: Record<string, Record<Lang, BlogArticle>> = {
  "zero-human-company-2026": {
    de: {
      intro: [
        "Zero-Human Company — der Begriff klingt nach einer Zukunftsvision, nach einem Unternehmen ohne Menschen. So ist er nicht gemeint. Gemeint ist eine Organisation, in der die operative Arbeit von KI-Agenten getragen wird: Recherche, Reporting, Angebotsvorbereitung, Kundenkommunikation, Monitoring. Ein Mensch setzt die Ziele, prüft die Ergebnisse und trägt die Verantwortung.",
        "Wir beschreiben diesen Weg nicht als Gedankenexperiment. 2009 in Köln als Beratungs- und Umsetzungspartner für den Mittelstand gegründet, arbeiten wir seit 2024 mit einer internen Multi-Agent-Architektur. 2026 halten 273 Agenten auf fünf Hierarchie-Ebenen den Betrieb rund um die Uhr aufrecht — mit einem menschlichen Founder.",
      ],
      sections: [
        {
          heading: "Was eine Zero-Human Company wirklich ist",
          paragraphs: [
            "Der Name führt in die Irre, wenn man ihn als Versprechen liest, Menschen überflüssig zu machen. In der Praxis beschreibt er ein Betriebsmodell mit drei Merkmalen. Erstens: Aufgaben sind explizit definiert und haben messbare Ergebnisse. Zweitens: Die Ausführung ist automatisiert, einschließlich der Übergaben zwischen den Schritten. Drittens: Es gibt eine menschliche Instanz, die Prioritäten setzt und Freigaben erteilt.",
            "Alles andere — Recherche, Entwürfe, Auswertungen, Routinekommunikation — übernehmen Agenten. Das ist kein Selbstzweck. Es verändert, wie schnell ein Unternehmen auf Anfragen reagiert, wie vollständig Dokumentation ist und wie viel Zeit für Entscheidungen bleibt, die tatsächlich Menschen brauchen.",
          ],
        },
        {
          heading: "Sechs Stationen auf dem Weg dorthin",
          paragraphs: [
            "Der Weg dahin war nicht linear, sondern eine Kette von Spezialisierungen, die am Ende zusammengewachsen sind.",
            "• 2009: Gründung in Köln als Beratungs- und Umsetzungspartner für den Mittelstand.",
            "• 2014: Internationales B2B-Sourcing mit Beschaffungsnetzwerken in Asien, UAE und Europa für Textilien, Beauty und Elektronik.",
            "• 2018: Retouren-Expertise durch Partnerschaften mit ZigZag Global und BuyBay.",
            "• 2021: Start eigener KI-Telefonassistenten für Terminbuchung, Support und Retourenabwicklung, 24/7 im Einsatz.",
            "• 2024: Aufbau einer internen Multi-Agent-Architektur für Vertrieb, Verwaltung und Reporting.",
            "• 2026: Vollständig autonome KI-Organisation mit 273 Agenten, fünf Hierarchie-Ebenen und 24/7-Betrieb.",
            "Jede Station hat dieselbe Frage beantwortet: Welcher Teil der Arbeit ist so klar beschrieben, dass er zuverlässig ohne menschliche Begleitung läuft? Diese Frage ist bis heute der eigentliche Engpass — nicht die Technik.",
          ],
        },
        {
          heading: "Was das für den Mittelstand bedeutet",
          paragraphs: [
            "Für die meisten Unternehmen ist nicht entscheidend, ob sie eines Tages 273 Agenten betreiben. Entscheidend ist, ob ein einzelner Prozess so aufgesetzt wird, dass er messbar besser läuft. Drei Projekte aus den letzten 18 Monaten zeigen, wie unterschiedlich der Hebel aussieht.",
            "Ein mittelständischer Bauteilehersteller mit 240 Mitarbeitenden hatte ein solides Produktportfolio, aber keine klare Marktpositionierung. In sechs Monaten entstand eine priorisierte Go-to-Market-Strategie mit CRM-Workflow und Vertriebs-Enablement. Ergebnis: 38 % mehr Conversion auf der Website und 2,1 Millionen Euro generierte Pipeline.",
            "Ein SHK-Betriebsverbund mit fünf Standorten arbeitete komplett auf Papier. Digitale Auftragsannahme im Service-Wagen, automatische Materialbestellung über eine API-Schnittstelle und ein durchgängiger Workflow vom Angebot bis zur Rechnung reduzierten den Verwaltungsaufwand um 52 % und die Fehlerquote bei Angeboten um 71 % — in neun Monaten.",
            "Ein Logistikdienstleister mit 80 Fahrzeugen fuhr mit drei parallelen Tools und Excel-Listen eine Liefertreue von 82 %. Nach der Konsolidierung auf eine zentrale Plattform, Echtzeit-Routing und einem Live-Dashboard für die Disposition lag die Liefertreue bei 98 %, die Kraftstoffkosten sanken um 12 %. Die Einführung lief in vier Phasen über zwölf Monate.",
          ],
        },
        {
          heading: "Wo die Grenzen liegen",
          paragraphs: [
            "Automatisierung endet dort, wo Verantwortung beginnt. Preise, Personalentscheidungen, rechtliche Bewertungen und alles, was Verhandlung erfordert, bleiben beim Menschen. Intern arbeiten wir nach vier Prinzipien, die genau das absichern: Ergebnis vor Methode, Verlässlichkeit, Geschwindigkeit und Augenhöhe. Ein Agent, der schnell liefert, aber unzuverlässig ist, ist kein Fortschritt — er verlagert nur Arbeit in die Prüfung.",
            "Technisch heißt das: Jeder Agent braucht klare Eingaben, definierte Ausgaben und einen Eskalationspunkt. Fehlt einer dieser drei Teile, entsteht keine Entlastung, sondern eine neue Baustelle.",
          ],
        },
        {
          heading: "Was Sie 2026 konkret tun können",
          paragraphs: [
            "Der Einstieg ist unspektakulär und dauert keine zwölf Monate. Wählen Sie einen Prozess mit hohem Volumen und klaren Regeln — Angebotsvorbereitung, Statusmeldungen, Reporting. Messen Sie den Ist-Zustand vier Wochen lang. Automatisieren Sie einen Teilabschnitt, nicht den gesamten Ablauf. Definieren Sie vorher, wer eingreift, wenn etwas nicht passt. Und messen Sie nach acht Wochen dieselben Kennzahlen wie vorher.",
            "Wenn sich die Zahl nicht verbessert, war nicht die Technik das Problem, sondern der Zuschnitt.",
          ],
        },
      ],
      conclusion:
        "Zero-Human Company ist 2026 kein Zukunftsszenario, sondern eine Beschreibung dessen, was möglich ist, wenn Aufgaben, Daten und Verantwortlichkeiten sauber getrennt sind. Für den Mittelstand heißt das nicht weniger Menschen. Es heißt weniger Reibung zwischen den Menschen, die Entscheidungen treffen.",
      cta: {
        text: "Sie wollen prüfen, welcher Prozess in Ihrem Unternehmen zuerst dran ist? Wir schauen uns das gemeinsam an — konkret, mit Zahlen.",
        label: "Erstgespräch vereinbaren",
        href: "/kontakt",
      },
    },
    en: {
      intro: [
        "Zero-Human Company — the term sounds like a future vision, like a company without people. That is not what it means. It describes an organisation in which operational work is carried by AI agents: research, reporting, proposal preparation, customer communication, monitoring. A human sets the goals, reviews the results and carries the responsibility.",
        "We are not describing this path as a thought experiment. Founded in Cologne in 2009 as a consulting and implementation partner for SMEs, we have been working with an internal multi-agent architecture since 2024. In 2026, 273 agents across five hierarchy levels keep operations running around the clock — with one human founder.",
      ],
      sections: [
        {
          heading: "What a Zero-Human Company actually is",
          paragraphs: [
            "The name is misleading if you read it as a promise to make people redundant. In practice it describes an operating model with three characteristics. First: tasks are explicitly defined and have measurable outcomes. Second: execution is automated, including the handovers between steps. Third: there is a human instance that sets priorities and grants approvals.",
            "Everything else — research, drafts, analyses, routine communication — is handled by agents. That is not an end in itself. It changes how quickly a company responds to enquiries, how complete its documentation is, and how much time is left for the decisions that genuinely need people.",
          ],
        },
        {
          heading: "Six stations on the way there",
          paragraphs: [
            "The path was not linear. It was a chain of specialisations that eventually grew together.",
            "• 2009: founded in Cologne as a consulting and implementation partner for SMEs.",
            "• 2014: international B2B sourcing with procurement networks in Asia, the UAE and Europe for textiles, beauty and electronics.",
            "• 2018: returns expertise through partnerships with ZigZag Global and BuyBay.",
            "• 2021: launch of our own AI phone assistants for appointment booking, support and returns handling, running 24/7.",
            "• 2024: build-out of an internal multi-agent architecture for sales, administration and reporting.",
            "• 2026: a fully autonomous AI organisation with 273 agents, five hierarchy levels and 24/7 operation.",
            "Every station answered the same question: which part of the work is described clearly enough to run reliably without human supervision? That question is still the real bottleneck — not the technology.",
          ],
        },
        {
          heading: "What this means for SMEs",
          paragraphs: [
            "For most companies, the decisive question is not whether they will one day run 273 agents. It is whether a single process is set up in a way that makes it measurably better. Three projects from the last 18 months show how different the lever can look.",
            "A mid-sized components manufacturer with 240 employees had a solid product portfolio but no clear market positioning. Over six months we built a prioritised go-to-market strategy with a CRM workflow and sales enablement. The result: 38% more website conversion and EUR 2.1 million in generated pipeline.",
            "An HVAC group with five locations was working entirely on paper. Digital order capture in the service van, automatic material ordering via an API connection and an end-to-end workflow from quote to invoice cut administrative effort by 52% and the error rate in quotes by 71% — within nine months.",
            "A logistics provider with 80 vehicles was running on three parallel tools and Excel lists, with on-time delivery at 82%. After consolidating onto one central platform, adding real-time routing and a live dispatch dashboard, on-time delivery reached 98% and fuel costs fell by 12%. The rollout ran in four phases over twelve months.",
          ],
        },
        {
          heading: "Where the limits are",
          paragraphs: [
            "Automation ends where responsibility begins. Pricing, hiring decisions, legal assessments and anything that requires negotiation stay with people. Internally we work by four principles that safeguard exactly that: outcome over method, reliability, speed and peer-level partnership. An agent that delivers quickly but unreliably is not progress — it just moves work into review.",
            "In technical terms: every agent needs clear inputs, defined outputs and an escalation point. If one of those three is missing, you do not get relief — you get a new construction site.",
          ],
        },
        {
          heading: "What you can do in 2026",
          paragraphs: [
            "Getting started is unspectacular and does not take twelve months. Pick a high-volume process with clear rules — proposal preparation, status updates, reporting. Measure the current state for four weeks. Automate one sub-step, not the whole process. Define up front who intervenes when something does not fit. Then measure the same metrics after eight weeks.",
            "If the number has not improved, the technology was not the problem — the scope was.",
          ],
        },
      ],
      conclusion:
        "In 2026, Zero-Human Company is not a future scenario. It is a description of what becomes possible when tasks, data and responsibilities are cleanly separated. For SMEs that does not mean fewer people. It means less friction between the people who make the decisions.",
      cta: {
        text: "Want to find out which process in your company should come first? We will look at it with you — concretely, with numbers.",
        label: "Book an initial call",
        href: "/en/contact",
      },
    },
  },

  "ki-agenten-im-mittelstand": {
    de: {
      intro: [
        "Seit 2024 betreiben wir unsere eigene Firma als Testfeld für KI-Agenten. Nicht als Pilotprojekt neben dem Tagesgeschäft, sondern als Teil davon. Was als Architektur für Vertrieb, Verwaltung und Reporting begann, ist 2026 eine Organisation mit 273 Agenten auf fünf Hierarchie-Ebenen, die rund um die Uhr läuft — mit einem menschlichen Founder, der Prioritäten setzt und Freigaben erteilt.",
        "Dieser Artikel beschreibt, was in diesen zwei Jahren funktioniert hat, was nicht, und was Mittelständler daraus für den eigenen Einstieg mitnehmen können.",
      ],
      sections: [
        {
          heading: "Warum wir intern angefangen haben",
          paragraphs: [
            "Der naheliegende Weg wäre gewesen, Agenten zuerst bei Kunden einzuführen. Wir haben es umgekehrt gemacht. Intern gab es drei Vorteile: Wir kannten die Prozesse bis ins Detail, wir konnten Fehler selbst ausbaden, und wir mussten niemandem erklären, warum ein Zwischenschritt zwei Wochen länger dauert.",
            "Die erste Ausbaustufe 2024 war bewusst unspektakulär: wiederkehrende Aufgaben aus Vertrieb, Verwaltung und Reporting. Angebotsentwürfe, Statusabfragen, Wochenreports, Dokumentation. Alles Aufgaben, bei denen ein Mensch vorher nach demselben Muster vorgegangen ist.",
          ],
        },
        {
          heading: "Der Aufbau: fünf Ebenen, ein Mensch",
          paragraphs: [
            "Die Hierarchie ist keine Analogie, sondern eine technische Struktur. Auf der obersten Ebene liegen Strategie und Zielvorgaben, darunter Abteilungsverantwortliche, danach Spezialisten für einzelne Aufgaben, eine Qualitätssicherung und eine operative Ebene, die Ausführungen überwacht.",
            "Der Betrieb läuft über Heartbeats: Ein Agent wacht auf, prüft seine Aufgabe, führt sie aus und liefert ab. Was fehlt, wird eskaliert — nicht geraten. Diese Regel ist der wichtigste Teil des ganzen Systems. Ein Agent, der bei unklarer Lage improvisiert, produziert Arbeit statt sie zu erledigen.",
            "Der menschliche Anteil ist kleiner, als man vermuten würde, aber nicht verschwunden: Prioritäten setzen, Freigaben erteilen, Ergebnisse prüfen. 24/7-Betrieb heißt nicht, dass niemand mehr hinschaut. Es heißt, dass die Firma nicht stillsteht, während niemand hinschaut.",
          ],
        },
        {
          heading: "Was funktioniert hat",
          paragraphs: [
            "Bewährt haben sich Aufgaben mit klaren Ein- und Ausgaben und einem wiederholbaren Ablauf:",
            "• Reporting: Daten zusammenführen, Abweichungen markieren, eine Zusammenfassung schreiben.",
            "• Dokumentation: Gesprächsnotizen, Entscheidungslog, Übergaben zwischen Beteiligten.",
            "• Monitoring: Auffälligkeiten früh melden, bevor sie zum Problem werden.",
            "• Angebots- und Textentwürfe: Vorlagen füllen, Varianten erzeugen, zur Freigabe vorlegen.",
            "Der gemeinsame Nenner: Die Aufgabe war vorher schon so klar, dass ein neuer Mitarbeiter sie nach einer Einweisung erledigen konnte.",
          ],
        },
        {
          heading: "Was nicht funktioniert hat",
          paragraphs: [
            "Die größten Enttäuschungen kamen nicht von fehlenden Modellen, sondern von unklaren Aufträgen.",
            "• Ziele wie „mach das besser“ führen zu Ausgaben, die plausibel klingen und nichts messen.",
            "• Fehlende Datenqualität wird durch Agenten nicht besser, sondern sichtbarer.",
            "• Ohne Eskalationspunkt entstehen Endlosschleifen, die im Dashboard wie Aktivität aussehen.",
            "• Zu viel Automatisierung bei Bewertungen: Ein Agent kann Optionen vorbereiten, aber keine Verantwortung übernehmen.",
            "Der Lernaufwand lag entsprechend nicht in der Modellauswahl, sondern im Zuschnitt der Aufgaben und in der Frage, wann ein Mensch übernehmen muss.",
          ],
        },
        {
          heading: "Was Kundenprojekte davon unterscheidet",
          paragraphs: [
            "Bei Kunden kommt eine zusätzliche Bedingung hinzu: Der Eingriff muss sich in Monaten rechnen, nicht in Jahren, und er darf den Betrieb nicht anhalten. Deshalb starten wir dort fast immer mit einem Ausschnitt statt mit dem großen Umbau.",
            "Ein SHK-Betriebsverbund mit fünf Standorten reduzierte den Verwaltungsaufwand um 52 % und die Fehlerquote bei Angeboten um 71 % — über neun Monate, mit 28 geschulten Monteuren und einem Workflow vom Erstgespräch bis zur Rechnung.",
            "Ein Logistikdienstleister mit 80 Fahrzeugen hob die Liefertreue von 82 % auf 98 % und senkte die Kraftstoffkosten um 12 %, begleitet über zwölf Monate in vier Roll-out-Phasen mit 35 geschulten Mitarbeitenden.",
            "Ein Bauteilehersteller mit 240 Mitarbeitenden erzielte in sechs Monaten 38 % mehr Conversion und 2,1 Millionen Euro Pipeline — über Positionierung, CRM-Workflow und Vertriebs-Enablement.",
            "Das Muster ist in allen drei Fällen gleich: ein klarer Prozess, eine messbare Kennzahl, ein definierter Zeitraum.",
          ],
        },
        {
          heading: "Was wir heute anders machen",
          paragraphs: [
            "Vier Regeln haben sich aus dem internen Betrieb ergeben und gelten in Kundenprojekten unverändert:",
            "• Erst messen, dann automatisieren. Ohne Ausgangswert ist jede Verbesserung eine Behauptung.",
            "• Jeden Agenten mit Eskalationspunkt bauen. Die Frage „wer übernimmt, wenn es nicht passt?“ gehört ins Design, nicht in den Notfallplan.",
            "• Qualitätssicherung als eigene Ebene behandeln, nicht als letzte Prüfung vor dem Versand.",
            "• Den Menschen nicht aus der Verantwortung entlassen, sondern aus der Routine.",
          ],
        },
      ],
      conclusion:
        "KI-Agenten im Mittelstand sind 2026 kein Zukunftsthema mehr, sondern eine Frage des Zuschnitts. Wer einen Prozess sauber beschreibt und eine Kennzahl definiert, bekommt in Wochen ein Ergebnis. Wer „die KI“ einführt, bekommt eine Baustelle.",
      cta: {
        text: "Sie möchten wissen, welche Aufgaben in Ihrem Betrieb zuerst automatisierbar sind? Wir analysieren das mit Ihnen — und nennen die Kennzahl, an der wir messen.",
        label: "Erstgespräch vereinbaren",
        href: "/kontakt",
      },
    },
    en: {
      intro: [
        "Since 2024 we have been running our own company as a test bed for AI agents. Not as a pilot project on the side of daily business, but as part of it. What started as an architecture for sales, administration and reporting is, in 2026, an organisation with 273 agents across five hierarchy levels running around the clock — with one human founder who sets priorities and grants approvals.",
        "This article describes what worked over those two years, what did not, and what SMEs can take away for their own start.",
      ],
      sections: [
        {
          heading: "Why we started internally",
          paragraphs: [
            "The obvious path would have been to introduce agents at a client first. We did the opposite. Internally there were three advantages: we knew the processes down to the detail, we had to live with our own mistakes, and we did not have to explain to anyone why an intermediate step took two weeks longer.",
            "The first stage in 2024 was deliberately unspectacular: recurring tasks from sales, administration and reporting. Proposal drafts, status enquiries, weekly reports, documentation. All tasks where a person had previously followed the same pattern.",
          ],
        },
        {
          heading: "The setup: five levels, one human",
          paragraphs: [
            "The hierarchy is not an analogy, it is a technical structure. At the top sit strategy and targets, below that department owners, then specialists for individual tasks, a quality assurance layer, and an operational layer that monitors execution.",
            "Operations run on heartbeats: an agent wakes up, checks its task, executes it and delivers. Anything missing gets escalated — not guessed. That rule is the most important part of the whole system. An agent that improvises when the situation is unclear produces work instead of completing it.",
            "The human share is smaller than you might assume, but it has not disappeared: setting priorities, granting approvals, reviewing results. 24/7 operation does not mean nobody is watching. It means the company does not stand still while nobody is watching.",
          ],
        },
        {
          heading: "What worked",
          paragraphs: [
            "Tasks with clear inputs and outputs and a repeatable sequence proved reliable:",
            "• Reporting: merge data, flag deviations, write a summary.",
            "• Documentation: meeting notes, decision logs, handovers between participants.",
            "• Monitoring: surface anomalies early, before they become a problem.",
            "• Proposal and copy drafts: fill templates, generate variants, submit for approval.",
            "The common denominator: the task had already been clear enough that a new employee could complete it after a briefing.",
          ],
        },
        {
          heading: "What did not work",
          paragraphs: [
            "The biggest disappointments did not come from missing models. They came from vague briefs.",
            "• Goals like “make it better” produce output that sounds plausible and measures nothing.",
            "• Poor data quality does not improve with agents — it becomes more visible.",
            "• Without an escalation point you get loops that look like activity on the dashboard.",
            "• Too much automation in judgement: an agent can prepare options, but it cannot take responsibility.",
            "The learning effort therefore sat in scoping tasks and in deciding when a human has to take over — not in model selection.",
          ],
        },
        {
          heading: "What makes client projects different",
          paragraphs: [
            "With clients there is an additional constraint: the intervention has to pay off in months, not years, and it must not stop operations. That is why we almost always start with a slice rather than a full rebuild.",
            "An HVAC group with five locations cut administrative effort by 52% and the error rate in quotes by 71% — over nine months, with 28 trained technicians and a workflow from first visit to invoice.",
            "A logistics provider with 80 vehicles raised on-time delivery from 82% to 98% and reduced fuel costs by 12%, supported over twelve months in four rollout phases with 35 trained employees.",
            "A components manufacturer with 240 employees achieved 38% more conversion and EUR 2.1 million in pipeline within six months — through positioning, a CRM workflow and sales enablement.",
            "The pattern is the same in all three cases: one clear process, one measurable metric, one defined period.",
          ],
        },
        {
          heading: "What we do differently today",
          paragraphs: [
            "Four rules emerged from internal operations, and they apply unchanged in client projects:",
            "• Measure first, then automate. Without a baseline, every improvement is a claim.",
            "• Build every agent with an escalation point. The question “who takes over when it does not fit?” belongs in the design, not in the contingency plan.",
            "• Treat quality assurance as its own layer, not as a final check before shipping.",
            "• Take the human out of the routine, not out of the responsibility.",
          ],
        },
      ],
      conclusion:
        "In 2026, AI agents for SMEs are no longer a future topic. They are a question of scope. Anyone who describes a process cleanly and defines a metric gets a result in weeks. Anyone who “introduces AI” gets a construction site.",
      cta: {
        text: "Want to know which tasks in your business can be automated first? We will analyse it with you — and name the metric we will measure.",
        label: "Book an initial call",
        href: "/en/contact",
      },
    },
  },

  "automatisierung-ohne-jobverlust": {
    de: {
      intro: [
        "Die Angst vor Arbeitsplatzverlust durch Automatisierung ist real — und sie ist nicht unbegründet. Routineaufgaben verschwinden. Was dabei oft übersehen wird: Sie verschwinden aus Stellen, nicht zusammen mit ihnen. Zwischen „eine Aufgabe fällt weg“ und „ein Mensch verliert seinen Job“ liegt eine Entscheidung, die Unternehmen treffen — bewusst oder unbewusst.",
      ],
      sections: [
        {
          heading: "Was Automatisierung tatsächlich ersetzt",
          paragraphs: [
            "Automatisiert werden Aufgaben, nicht Berufe. Konkret sind das Tätigkeiten mit klaren Regeln und wiederholbarem Ablauf: Terminbuchung, Statusabfragen, Angebotsentwürfe, Reporting, Dokumentation. 2021 haben wir eigene KI-Telefonassistenten für Terminbuchung, Support und Retourenabwicklung gestartet — 24/7. Übernommen haben sie Schichten, nicht Stellen: Anrufe, die vorher niemand angenommen hat, weil abends niemand im Büro war.",
            "Nicht ersetzt werden Verhandlung, Konflikt, Bewertung und Verantwortung. Ein Agent kann ein Angebot vorbereiten. Er kann nicht entscheiden, welchen Preis ein Kunde wert ist.",
            "Entscheidend ist die Granularität. „Vertrieb automatisieren“ ist keine Aufgabe, sondern ein Sammelbegriff. „Angebotsentwürfe aus einem standardisierten Produktkatalog vorbereiten“ ist eine Aufgabe mit Anfang, Ende und prüfbarem Ergebnis. Nur die zweite Formulierung lässt sich automatisieren — und nur sie lässt sich später messen.",
          ],
        },
        {
          heading: "Drei Beispiele, in denen niemand ersetzt wurde",
          paragraphs: [
            "SHK-Betriebsverbund, fünf Standorte: Papierangebote, telefonische Materialbestellungen, Rechnungen nach vier bis sechs Wochen. Nach der Einführung von mobiler Auftragsannahme, automatischer Materialbestellung und einem durchgängigen Workflow sank der Verwaltungsaufwand um 52 %, die Fehlerquote bei Angeboten um 71 %. Die 28 Monteure wurden in drei Wellen geschult — keiner wurde ersetzt. Die Inhaberfamilie arbeitete wieder am Geschäft statt in der Verwaltung.",
            "Logistikdienstleister, 80 Fahrzeuge: drei parallele Tools, Excel-Listen, Liefertreue 82 %. Nach der Konsolidierung, Echtzeit-Routing und einem Live-Dashboard: 98 % Liefertreue, 12 % weniger Kraftstoffkosten. 35 Mitarbeitende wurden über drei Monate geschult; die Disposition arbeitet heute mit einem System statt mit dreien.",
            "Bauteilehersteller, 240 Mitarbeitende: sechs Monate Strategie- und Vertriebsarbeit, 38 % mehr Conversion, 2,1 Millionen Euro Pipeline. Das Vertriebsteam ist nicht kleiner geworden — es hat aufgehört, Anfragen ohne Struktur zu bearbeiten.",
          ],
        },
        {
          heading: "Was mit der gewonnenen Zeit passiert",
          paragraphs: [
            "Der Effekt einer Automatisierung ist nicht automatisch eine Einsparung. Er ist zunächst freie Kapazität. Ob daraus Entlastung, Wachstum oder Abbau wird, entscheidet die Planung danach. Im SHK-Projekt floss ein Teil der gewonnenen Zeit in die Dokumentation, die vorher liegen blieb, ein anderer in zusätzliche Kundentermine. Beim Logistikdienstleister ging die Zeit in die Disposition und in die Einarbeitung neuer Fahrer. In beiden Fällen stand vorher fest, an welcher Kennzahl die Veränderung gemessen wird.",
            "Ohne diese Festlegung passiert das Gegenteil: Die gesparte Zeit füllt sich mit neuen Routinetätigkeiten, und nach sechs Monaten ist niemand mehr sicher, ob die Automatisierung überhaupt etwas gebracht hat.",
          ],
        },
        {
          heading: "Der Engpass ist die Rolle, nicht die Technik",
          paragraphs: [
            "Wenn eine Aufgabe wegfällt, bleibt eine Lücke in der Rolle. Wer sie schließt, entscheidet, ob Automatisierung als Entlastung oder als Bedrohung erlebt wird. Drei Dinge zählen:",
            "• Transparenz: vorher sagen, welche Aufgaben wegfallen und welche bleiben.",
            "• Qualifizierung: die eingesparte Zeit nicht sofort neu verplanen, sondern in neue Fähigkeiten investieren.",
            "• Verantwortung: klare Zuständigkeit für die Ergebnisse, die der Agent liefert.",
            "Unser Prinzip „Augenhöhe“ ist hier kein Marketing: Wer Automatisierung erklärt, statt sie anzuordnen, bekommt Hinweise, die kein Audit liefert.",
            "Intern zeigt sich das deutlich: Von 273 Agenten auf fünf Hierarchie-Ebenen bleibt die Freigabe bei einem Menschen. Die Rolle hat sich verschoben — weg von der Ausführung, hin zur Prüfung und Zielsetzung. Genau diese Verschiebung muss man Mitarbeitenden erklären, bevor der erste Agent läuft, nicht danach.",
          ],
        },
        {
          heading: "Wie ein Einstieg ohne Jobverlust aussieht",
          paragraphs: [
            "Vier Schritte haben sich in den letzten 18 Monaten bewährt: Aufgaben inventarisieren statt Stellen streichen; mit einer Kennzahl starten, die Zeit oder Fehler misst; einen Eskalationspunkt definieren, bevor der erste Agent läuft; nach acht Wochen prüfen, was tatsächlich gespart wurde, und die Zeit neu zuordnen.",
            "Wichtig ist die Reihenfolge. Wer zuerst über Stellen spricht, bekommt Angst. Wer zuerst über Aufgaben spricht, bekommt Vorschläge.",
            "Ein praktikabler Rahmen für die ersten 90 Tage: In den ersten zwei Wochen werden Aufgaben und Zeitanteile erfasst. Danach wird ein Prozess ausgewählt, der mindestens zwei Stunden pro Woche kostet und klare Regeln hat. In den Wochen drei bis acht läuft die Automatisierung parallel zum bestehenden Ablauf. Ab Woche neun wird verglichen: Zeit, Fehlerquote, Durchlaufzeit. Erst dann fällt die Entscheidung über den nächsten Schritt.",
            "Dieser Rahmen hat einen Nebeneffekt, der oft wichtiger ist als die Technik: Er macht sichtbar, wo Arbeit tatsächlich gebunden ist. In mehreren Projekten war der größte Zeitfresser nicht der Prozess, den alle vermutet hatten.",
          ],
        },
      ],
      conclusion:
        "Automatisierung ohne Jobverlust ist kein Widerspruch — aber auch kein Automatismus. Sie ist das Ergebnis einer Entscheidung: Aufgaben automatisieren, Menschen qualifizieren, Verantwortung klären. Wo diese Entscheidung nicht getroffen wird, entsteht Verdrängung. Wo sie getroffen wird, entsteht Kapazität.",
      cta: {
        text: "Sie wollen Automatisierung einführen, ohne Ihr Team zu verlieren? Wir zeigen Ihnen, wo der Einstieg am wenigsten Reibung erzeugt.",
        label: "Erstgespräch vereinbaren",
        href: "/kontakt",
      },
    },
    en: {
      intro: [
        "The fear of job loss through automation is real — and it is not unfounded. Routine tasks do disappear. What is often overlooked: they disappear from roles, not together with them. Between “a task goes away” and “a person loses their job” sits a decision that companies make — consciously or not.",
      ],
      sections: [
        {
          heading: "What automation actually replaces",
          paragraphs: [
            "Tasks get automated, not professions. Specifically, activities with clear rules and a repeatable sequence: appointment booking, status enquiries, proposal drafts, reporting, documentation. In 2021 we launched our own AI phone assistants for booking, support and returns handling — 24/7. They took over shifts, not jobs: calls that nobody had answered before because no one was in the office in the evening.",
            "What is not replaced is negotiation, conflict, judgement and responsibility. An agent can prepare a quote. It cannot decide what price a customer is worth.",
            "Granularity is what matters. “Automate sales” is not a task, it is a collective term. “Prepare proposal drafts from a standardised product catalogue” is a task with a beginning, an end and a checkable result. Only the second formulation can be automated — and only it can be measured later.",
          ],
        },
        {
          heading: "Three examples where nobody was replaced",
          paragraphs: [
            "HVAC group, five locations: paper quotes, material ordered by phone, invoices after four to six weeks. After introducing mobile order capture, automatic material ordering and an end-to-end workflow, administrative effort fell by 52% and the quote error rate by 71%. The 28 technicians were trained in three waves — none were replaced. The owning family went back to working on the business instead of in administration.",
            "Logistics provider, 80 vehicles: three parallel tools, Excel lists, 82% on-time delivery. After consolidation, real-time routing and a live dashboard: 98% on-time delivery, 12% lower fuel costs. 35 employees were trained over three months; dispatch now works with one system instead of three.",
            "Components manufacturer, 240 employees: six months of strategy and sales work, 38% more conversion, EUR 2.1 million in pipeline. The sales team did not get smaller — it stopped processing enquiries without structure.",
          ],
        },
        {
          heading: "What happens to the time you gain",
          paragraphs: [
            "The effect of automation is not automatically a saving. It is free capacity first. Whether it turns into relief, growth or reduction is decided by the planning that follows. In the HVAC project, part of the gained time went into documentation that had previously been left behind, another part into additional customer appointments. At the logistics provider, the time went into dispatch and into onboarding new drivers. In both cases it had been defined beforehand which metric the change would be measured against.",
            "Without that definition the opposite happens: the saved time fills up with new routine work, and six months later nobody is sure whether the automation achieved anything at all.",
          ],
        },
        {
          heading: "The bottleneck is the role, not the technology",
          paragraphs: [
            "When a task disappears, a gap remains in the role. Whoever fills that gap decides whether automation is experienced as relief or as a threat. Three things matter:",
            "• Transparency: say up front which tasks go away and which stay.",
            "• Qualification: do not immediately rebook the saved time — invest it in new skills.",
            "• Responsibility: clear ownership for the results the agent delivers.",
            "Our principle of peer-level partnership is not marketing here: explaining automation instead of ordering it produces input that no audit will give you.",
            "Internally this is very visible: with 273 agents across five hierarchy levels, approval stays with one human. The role has shifted — away from execution, towards review and goal-setting. That shift has to be explained to people before the first agent runs, not afterwards.",
          ],
        },
        {
          heading: "What a start without job loss looks like",
          paragraphs: [
            "Four steps have proven themselves over the last 18 months: inventory tasks instead of cutting positions; start with one metric that measures time or errors; define an escalation point before the first agent runs; after eight weeks, check what was actually saved and reassign the time.",
            "The order matters. Whoever talks about positions first gets fear. Whoever talks about tasks first gets suggestions.",
            "A workable framework for the first 90 days: in the first two weeks, record tasks and time shares. Then pick a process that costs at least two hours per week and has clear rules. In weeks three to eight, the automation runs in parallel with the existing process. From week nine, compare: time, error rate, lead time. Only then is the decision about the next step made.",
            "This framework has a side effect that is often more important than the technology: it makes visible where work is actually tied up. In several projects, the biggest time sink was not the process everyone had assumed.",
          ],
        },
      ],
      conclusion:
        "Automation without job loss is not a contradiction — but it is not automatic either. It is the result of a decision: automate tasks, qualify people, clarify responsibility. Where that decision is not made, displacement happens. Where it is made, capacity appears.",
      cta: {
        text: "Want to introduce automation without losing your team? We will show you where the start creates the least friction.",
        label: "Book an initial call",
        href: "/en/contact",
      },
    },
  },
};

export function getArticle(slug: string, lang: Lang): BlogArticle | undefined {
  return BLOG_ARTICLES[slug]?.[lang];
}
