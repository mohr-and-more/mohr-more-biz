export type Lang = "de" | "en";

/* ------------------------------------------------------------------ */
/* Mermaid source diagrams — MMB-122 "Mindmap Gesamtsystem"           */
/* Kept in German to match the source document.                        */
/* ------------------------------------------------------------------ */
export const mermaidMindmap = `mindmap
  root((Mohr and More Business))
    Gesellschafter
      Gunnar und Gregor Mohr
      Gleichrangige Geschaeftsfuehrer
      Einzige menschliche User
    Unternehmensstruktur
      Zero-Human Company
      273 Agenten gesamt
      5 Hierarchie-Ebenen
      Strikte Hierarchie
      User spricht nur mit dem CEO
    KALi der CEO
      Einziger Ansprechpartner
      pi_local Adapter
      13 Direct Reports
      Final Decision Maker
    Ebene 1 C-Level
      10 Officers und 3 Staff
      CTO CFO CSO CMO
      CQO CISO CDO COO
      CSA CGO
      Ying und Yang und Zorro
    Ebene 2 Directors
      54 Directors und Leads
      Fuehren und delegieren
    Ebene 3 Team-Leiter
      171 Team-Agenten
      Freigabe oder Korrektur
    Ebene 4 Ausfuehrende
      31 Spezialisten
      EINZIGE die Code bearbeiten
    Systeme und Tools
      Paperclip Control-Plane
      Hermes Gateway
      Open WebUI Frontend
      TXTAI Semantisches Gedaechtnis
    Auftragsweg
      Geschaeftsfuehrer
      Charlie
      KALi CEO
      C-Level
      Director
      Team-Leiter
      Ausfuehrender`;

export const mermaidFlow = `flowchart TD
    GF["Geschaeftsfuehrer<br/>Gunnar und Gregor Mohr"] --> OWUI["Open WebUI<br/>Chat-Frontend"]
    OWUI -->|"spricht mit"| CH["Charlie<br/>Operativer Assistent"]
    CH -->|"delegate_to_kali"| KALI["KALi - CEO<br/>pi_local"]
    KALI --> CL["C-Level - 13<br/>10 Officers + Ying/Yang + Zorro"]
    CL --> DIR["Directors - 54"]
    DIR --> TEAM["Team-Leiter - 171"]
    TEAM --> EXEC["Ausfuehrende - 31<br/>CODE-EBENE"]
    EXEC -.->|"Ergebnis"| TEAM
    TEAM -.->|"Freigabe/Korrektur"| DIR
    DIR -.->|"Review"| CL
    CL -.->|"Review"| YY["Ying + Yang<br/>Innovation und Sicherheit"]
    YY -.->|"Bericht"| KALI
    KALI -.->|"Final Decision"| OWUI

    style KALI fill:#9ff8f2,stroke:#333,stroke-width:2px,color:#050505
    style GF fill:#06d6a0,stroke:#333,color:#050505
    style EXEC fill:#ef476f,stroke:#333,color:#fff
    style CH fill:#118ab2,stroke:#333,color:#fff`;

/* The company hierarchy shown as a board of level cards. */
export const hierarchyLevels = [
  {
    level: { de: "Ebene 0", en: "Level 0" },
    count: "1",
    role: { de: "KALi · CEO", en: "KALi · CEO" },
    fn: {
      de: "Vision, People, Final Decision, Review-Konsolidierung. Einziger Ansprechpartner des Users.",
      en: "Vision, people, final decisions, review consolidation. The user's single point of contact.",
    },
    exec: false,
  },
  {
    level: { de: "Ebene 1", en: "Level 1" },
    count: "13",
    role: { de: "C-Level", en: "C-Level" },
    fn: {
      de: "10 Officers (CTO, CFO, CSO, CMO, CQO, CISO, CDO, COO, CSA, CGO) + Ying, Yang, Zorro.",
      en: "10 Officers (CTO, CFO, CSO, CMO, CQO, CISO, CDO, COO, CSA, CGO) + Ying, Yang, Zorro.",
    },
    exec: false,
  },
  {
    level: { de: "Ebene 2", en: "Level 2" },
    count: "54",
    role: { de: "Directors / Leads", en: "Directors / Leads" },
    fn: {
      de: "Delegieren, überwachen, Review nach unten. Management — kein Code.",
      en: "Delegate, monitor, review downward. Management — no code.",
    },
    exec: false,
  },
  {
    level: { de: "Ebene 3", en: "Level 3" },
    count: "171",
    role: { de: "Team-Leiter", en: "Team Leads" },
    fn: {
      de: "Delegieren an Ausführende. Freigabe oder Korrektur der Ergebnisse.",
      en: "Delegate to executors. Approve or correct delivered work.",
    },
    exec: false,
  },
  {
    level: { de: "Ebene 4", en: "Level 4" },
    count: "31",
    role: { de: "Ausführende", en: "Executors" },
    fn: {
      de: "EINZIGE Ebene, die Code bearbeitet. Spezialisten je Gebiet.",
      en: "The ONLY level that touches code. Specialists per domain.",
    },
    exec: true,
  },
] as const;

export const translations = {
  nav: {
    position: { de: "Position", en: "Positioning" },
    system: { de: "System", en: "System" },
    principles: { de: "Prinzipien", en: "Principles" },
    vision: { de: "Vision", en: "Vision" },
    contact: { de: "Kontakt", en: "Contact" },
    login: { de: "Login", en: "Login" },
    zeroHumans: { de: "Zero Humans", en: "Zero Humans" },
    team: { de: "Team", en: "Team" },
    howTo: { de: "How-To", en: "How-To" },
  },
  hero: {
    label: { de: "MOHR & MORE BUSINESS // Zero-Human Company", en: "MOHR & MORE BUSINESS // Zero-Human Company" },
    // EXACT headline preserved — only "Unternehmen" is accented via glow span.
    title: { de: "Wir bauen <span class='glow'>Unternehmen</span>, die wie Software skalieren.", en: "Wir bauen <span class='glow'>Unternehmen</span>, die wie Software skalieren." },
    subtitle: {
      de: "MOHR & MORE Business ist die weltweit erste vollständig autonome Zero-Human Company — ein sich selbst organisierendes KI-Unternehmen mit der Klarheit eines Founders und der Geschwindigkeit eines orchestrierten Agenten-Systems. Ein Mensch gibt Richtung. Eine KI orchestriert 272 Spezialisten.",
      en: "MOHR & MORE Business is the world's first fully autonomous Zero-Human Company — a self-organizing AI company with a founder's clarity and the speed of an orchestrated agent system. One human sets direction. One AI orchestrates 272 specialists.",
    },
    ctaPrimary: { de: "Das System sehen", en: "See the system" },
    ctaSecondary: { de: "Zero-Human-Story", en: "Zero-Human story" },
    metrics: [
      { value: "1", label: { de: "Mensch mit Richtung", en: "Human with direction" } },
      { value: "272", label: { de: "Orchestrierte Agenten", en: "Orchestrated agents" } },
      { value: "24/7", label: { de: "Autonome Execution", en: "Autonomous execution" } },
    ],
    panelCaptionLeft: "KALI / ORCHESTRATOR",
    panelCaptionRight: "ZERO-HUMAN COMPANY",
    stack: [
      { title: "Direction Layer", meta: { de: "Vision / Urteil / Priorität", en: "Vision / Judgment / Priority" }, state: "Decisive" },
      { title: "Orchestration Core", meta: { de: "Routing / Memory / Oversight", en: "Routing / Memory / Oversight" }, state: "Live" },
      { title: "Execution Layer", meta: { de: "Code / Automation / Infra", en: "Code / Automation / Infra" }, state: "24/7" },
    ],
  },
  manifest: {
    label: { de: "Manifest", en: "Manifesto" },
    title: { de: "Nicht mehr Mitarbeiter. Mehr Intelligenz pro Entscheidung.", en: "Not more employees. More intelligence per decision." },
    text: {
      de: "Wir glauben nicht an aufgeblähte Organisationen, langsame Übergaben und operative Reibung als Naturgesetz. Wir glauben an Systeme, die radikal fokussiert sind, Verantwortung klar verteilen und mit maschineller Präzision liefern — ein Unternehmen, das wie ein Betriebssystem gedacht ist.",
      en: "We don't believe in bloated organizations, slow handoffs, and operational friction as a law of nature. We believe in radically focused systems that distribute responsibility clearly and deliver with machine precision — a company conceived as an operating system.",
    },
    cards: [
      {
        tag: { de: "First Principles", en: "First Principles" },
        title: { de: "Zerlegen statt bürokratisieren", en: "Decompose, don't bureaucratize" },
        text: {
          de: "Probleme werden bis auf ihre Struktur reduziert und von dort neu gebaut. Keine Traditionslast, kein Prozess um des Prozesses willen.",
          en: "Problems are reduced to their structure and rebuilt from there. No legacy baggage, no process for its own sake.",
        },
      },
      {
        tag: { de: "Reduktion", en: "Reduction" },
        title: { de: "Weniger Ebenen, mehr Klarheit", en: "Fewer layers, more clarity" },
        text: {
          de: "Weniger Reibung, weniger Lärm. Das Ergebnis ist ein System, das sich klar anfühlt, schnell handelt und Qualität sichtbar macht.",
          en: "Less friction, less noise. The result is a system that feels clear, acts fast, and makes quality visible.",
        },
      },
      {
        tag: { de: "Orchestrierung", en: "Orchestration" },
        title: { de: "Ein Framework für neue Ideen", en: "A framework for new ideas" },
        text: {
          de: "MOHR & MORE ist nicht nur ein Studio. Es ist eine operative Plattform, die neue Produkte, Automatisierungen und digitale Abteilungen hervorbringt.",
          en: "MOHR & MORE isn't just a studio. It's an operating platform that spins up new products, automations, and digital departments.",
        },
      },
      {
        tag: { de: "Agentic Future", en: "Agentic Future" },
        title: { de: "Das Unternehmen als intelligentes Netzwerk", en: "The company as an intelligent network" },
        text: {
          de: "Ein Mensch gibt Richtung. Eine KI orchestriert Spezialisten. Daraus entsteht eine neue Form von Unternehmen — fokussiert, skalierbar und rund um die Uhr handlungsfähig.",
          en: "One human sets direction. One AI orchestrates specialists. The result is a new form of company — focused, scalable, and capable around the clock.",
        },
      },
    ],
  },
  system: {
    label: { de: "Das Unternehmen", en: "The Company" },
    title: { de: "272 Agenten. 5 Ebenen. Eine durchgehende Build-Maschine.", en: "272 agents. 5 levels. One continuous build machine." },
    quote: { de: "Ein Unternehmen kann heute wie ein Betriebssystem gedacht werden.", en: "A company today can be thought of as an operating system." },
    quoteSub: {
      de: "Mit menschlicher Vision im Zentrum und einer KI-Orchestrierungsschicht, die spezialisierte Fähigkeiten in Echtzeit aktiviert.",
      en: "With human vision at the center and an AI orchestration layer that activates specialized capabilities in real time.",
    },
    hierarchyLabel: { de: "Hierarchie", en: "Hierarchy" },
    mindmapLabel: { de: "Mindmap: Gesamtsystem Mohr & More Business", en: "Mindmap: Mohr & More Business full system" },
    flowLabel: { de: "Auftrags- & Kommunikationsweg", en: "Order & communication flow" },
    orgchartLabel: { de: "Interaktives Organigramm", en: "Interactive org chart" },
    orgchartNote: {
      de: "Live aus der Paperclip-Control-Plane — durchsuchbar, klickbar, in Echtzeit.",
      en: "Live from the Paperclip control plane — searchable, clickable, in real time.",
    },
  },
  principles: {
    label: { de: "Prinzipien", en: "Principles" },
    title: { de: "Gebaut für Geschwindigkeit. Gehalten von Präzision.", en: "Built for speed. Held by precision." },
    text: {
      de: "Das hier ist keine futuristische Pose. Es ist eine operative Haltung: klare Verantwortung, radikale Ausführung, gute Wirkung und Systeme, die nicht bei jeder neuen Aufgabe neu erfunden werden müssen.",
      en: "This isn't a futuristic pose. It's an operational stance: clear ownership, radical execution, positive impact, and systems that don't have to be reinvented for every task.",
    },
    items: [
      { num: "01", title: { de: "Build fast.", en: "Build fast." }, text: { de: "Ideen verlieren Wert in Warteschleifen. Wir verkürzen die Distanz zwischen Entscheidung und Ergebnis dramatisch.", en: "Ideas lose value in queues. We shrink the distance between decision and result dramatically." } },
      { num: "02", title: { de: "Think clearly.", en: "Think clearly." }, text: { de: "Jede Zeile Code und jede Automatisierung folgt einer klaren Logik statt improvisierter Komplexität.", en: "Every line of code and every automation follows clear logic instead of improvised complexity." } },
      { num: "03", title: { de: "Do good.", en: "Do good." }, text: { de: "Technologie ist nur Fortschritt, wenn sie Nutzen stiftet, Schaden reduziert und Menschen befähigt.", en: "Technology is only progress when it creates value, reduces harm, and empowers people." } },
      { num: "04", title: { de: "Stay adaptive.", en: "Stay adaptive." }, text: { de: "Unsere Systeme sind nicht statisch. Sie lernen, verfeinern Abläufe und werden mit jeder Nutzung belastbarer.", en: "Our systems aren't static. They learn, refine workflows, and grow more resilient with every use." } },
      { num: "05", title: { de: "Partner, don't serve.", en: "Partner, don't serve." }, text: { de: "Mensch und KI arbeiten auf Augenhöhe. Kein Werkzeugdenken — echte Kollaboration mit Widerspruch und Verbesserung.", en: "Human and AI work as peers. No tool-thinking — real collaboration with challenge and improvement." } },
      { num: "06", title: { de: "Design the future.", en: "Design the future." }, text: { de: "Wir optimieren nicht nur die Gegenwart. Wir bauen eine operative Form für das, was Unternehmen als Nächstes werden können.", en: "We don't just optimize the present. We build an operational form for what companies can become next." } },
    ],
  },
  vision: {
    label: { de: "Vision", en: "Vision" },
    title: { de: "Ein Mensch. Eine KI. Ein Unternehmen.", en: "One human. One AI. One company." },
    text: {
      de: "MOHR & MORE baut an einer Zukunft, in der KI nicht nur assistiert, sondern Unternehmen strukturell stärker macht — nicht als Ersatz für Menschen, sondern als intelligenter Multiplikator für Vision, Qualität und Wirkung. Was jetzt beginnt, sieht erst morgen normal aus.",
      en: "MOHR & MORE is building a future where AI doesn't just assist but structurally strengthens companies — not as a replacement for humans, but as an intelligent multiplier for vision, quality, and impact. What begins now will only look normal tomorrow.",
    },
    cards: [
      { tag: { de: "Automatisierung", en: "Automation" }, title: { de: "Intelligente Systeme statt manueller Reibung", en: "Intelligent systems over manual friction" }, text: { de: "Prozesse, die nicht nur Arbeit sparen, sondern Qualität systematisch erhöhen und operative Fehler reduzieren.", en: "Processes that don't just save work but systematically raise quality and reduce operational errors." } },
      { tag: { de: "Software", en: "Software" }, title: { de: "Produkte, die nach vorne gebaut sind", en: "Products built forward" }, text: { de: "Von Webplattformen bis spezialisierten Tools: modular, robust und für reale Weiterentwicklung gemacht.", en: "From web platforms to specialized tools: modular, robust, and built for real evolution." } },
      { tag: { de: "Agent Systems", en: "Agent Systems" }, title: { de: "Digitale Teams mit klarer Aufgabenlogik", en: "Digital teams with clear task logic" }, text: { de: "Agentische Systeme, die nicht nur assistieren, sondern koordinierte Ausführung über mehrere Domänen hinweg leisten.", en: "Agentic systems that don't just assist but deliver coordinated execution across multiple domains." } },
      { tag: { de: "Future Company", en: "Future Company" }, title: { de: "Das Unternehmen selbst wird programmierbar", en: "The company itself becomes programmable" }, text: { de: "MOHR & MORE versteht Organisation als Systemdesign — neue Maßstäbe für Tempo, Fokus und Skalierbarkeit.", en: "MOHR & MORE treats organization as system design — new standards for tempo, focus, and scalability." } },
    ],
  },
  contact: {
    label: { de: "Closing Signal", en: "Closing Signal" },
    title: { de: "Was jetzt beginnt, sieht erst morgen normal aus.", en: "What begins now will only look normal tomorrow." },
    text: {
      de: "Für strategische Anfragen, Kooperationen und Investorenkontakte. MOHR & MORE Business — Intelligent Automation / Software Solutions / Agentic Agent Systems. Wir antworten präzise und zeitnah.",
      en: "For strategic inquiries, partnerships, and investor relations. MOHR & MORE Business — Intelligent Automation / Software Solutions / Agentic Agent Systems. We respond precisely and promptly.",
    },
    ctaPrimary: { de: "Projekt anfragen", en: "Request a project" },
    linkedinGregor: "LinkedIn Gregor",
    linkedinGunnar: "LinkedIn Gunnar",
  },
  zeroHumans: {
    pageTitle: { de: "Zero Humans — Die Null-Menschen-Firma | MOHR & MORE", en: "Zero Humans — The Zero-Human Company | MOHR & MORE" },
    pageDesc: {
      de: "273 KI-Agenten. 15 Abteilungen. 28+ Projekte. 24/7/365 autonom. Die erste Null-Menschen-Firma der Welt — aufgebaut von Gunnar Mohr.",
      en: "273 AI agents. 15 departments. 28+ projects. 24/7/365 autonomous. The world's first zero-human company — built by Gunnar Mohr.",
    },
    heroLabel: { de: "MOHR & MORE BUSINESS — UNTERNEHMENSPROFIL", en: "MOHR & MORE BUSINESS — COMPANY PROFILE" },
    heroTitle1: { de: "Zero Humans.", en: "Zero Humans." },
    heroTitle2: { de: "273 AI Agents.", en: "273 AI Agents." },
    heroTitle3: { de: "Bullet Proof.", en: "Bullet Proof." },
    heroSub: {
      de: "Die weltweit erste vollständig autonome KI-Firma. Keine Mitarbeiter. Kein Büro. Keine Grenzen. Gebaut von einem Menschen — Gunnar Mohr — angetrieben durch das Paperclip-Orchestrierungs-Framework. Selbstständig, zukunftssicher und rund um die Uhr aktiv.",
      en: "The world's first fully autonomous AI company. No employees. No office. No limits. Built by one human — Gunnar Mohr — powered by the Paperclip orchestration framework. Self-sustaining, future-proof, and running 24/7.",
    },
    stats: {
      agents: { de: "KI-Agenten", en: "AI Agents" },
      depts: { de: "Abteilungen", en: "Departments" },
      projects: { de: "Projekte", en: "Projects" },
      cSuite: { de: "C-Level", en: "C-Level" },
      autonomous: { de: "Autonom", en: "Autonomous" },
      models: { de: "KI-Modelle", en: "AI Models" },
      humans: { de: "Menschen", en: "Humans" },
    },
    powerTitle: {
      de: "Dies ist keine Automatisierung. Dies ist eine neue Art von Unternehmen.",
      en: "This is not automation. This is a new species of business.",
    },
    powerSub: {
      de: "Eine Firma, die denkt, baut, testet, deployt, verkauft, unterstützt und skaliert — ohne einen einzigen menschlichen Mitarbeiter. Sie ersetzt keine Menschen. Sie macht sie überflüssig.",
      en: "A company that thinks, builds, tests, deploys, sells, supports, and scales — without a single human employee. It doesn't replace humans. It transcends the need for them.",
    },
    powerCells: [
      { icon: "🧠", title: { de: "Selbstdenkend", en: "Self-Thinking" }, desc: { de: "Strategische Analyse, Entscheidungsrahmen, Second-Order-Thinking — alles autonom.", en: "Strategic analysis, decision frameworks, second-order thinking — all autonomous." } },
      { icon: "🏗", title: { de: "Selbstbauend", en: "Self-Building" }, desc: { de: "12+ Sprachen, Full-Stack, DevOps, Cloud — alles von KI-Agenten programmiert.", en: "12+ languages, full-stack, DevOps, cloud — all coded by AI agents." } },
      { icon: "🔬", title: { de: "Selbstforschend", en: "Self-Researching" }, desc: { de: "50 Forschungsagenten: Bioinformatik, Drug Discovery, Genomik, klinische Daten.", en: "50 research agents: bioinformatics, drug discovery, genomics, clinical data." } },
      { icon: "🛡", title: { de: "Selbstschützend", en: "Self-Protecting" }, desc: { de: "26 Sicherheitsagenten: Pen-Testing, Threat Hunting, SOC, Forensik.", en: "26 security agents: penetration testing, threat hunting, SOC, forensics." } },
      { icon: "📈", title: { de: "Selbstwachsend", en: "Self-Growing" }, desc: { de: "28 Marketing-Agenten: Branding, Paid Ads, SEO, Content, Viral Growth.", en: "28 marketing agents: branding, paid ads, SEO, content, viral growth." } },
      { icon: "✅", title: { de: "Selbstverifizierend", en: "Self-Verifying" }, desc: { de: "21 QA-Agenten: Unit-, Integration-, E2E-, Load-Testing, Code Review.", en: "21 QA agents: unit, integration, E2E, load testing, code review." } },
      { icon: "💰", title: { de: "Selbstfinanzierend", en: "Self-Financing" }, desc: { de: "Finanzanalyse, Forecasting, Budgeting, Treasury — autonom verwaltet.", en: "Financial analysis, forecasting, budgeting, treasury — autonomously managed." } },
      { icon: "🤝", title: { de: "Selbstverkaufend", en: "Self-Selling" }, desc: { de: "Inbound Sales, Deal Closing, CRM, Customer Service — autonom.", en: "Inbound sales, deal closing, CRM, customer service — autonomous." } },
    ] as const,
    compLabel: { de: "Der Vergleich", en: "The Comparison" },
    compTitle1: { de: "Alte Welt", en: "Old World" },
    compTitle2: { de: "Neue Welt.", en: "New World." },
    compSub: {
      de: "Das ist der Unterschied zwischen Überleben und Gedeihen. Traditionelle Firmen sind fragil. Die Null-Menschen-Firma ist zukunftssicher.",
      en: "This is the difference between surviving and thriving. Traditional companies are fragile. The Zero-Human Company is future-proof.",
    },
    compOld: {
      title: { de: "❌ Traditionelle Firma", en: "❌ Traditional Company" },
      type: { de: "Das alte Modell — Fragil, Langsam, Teuer", en: "The Old Model — Fragile, Slow, Expensive" },
      items: [
        { icon: "💀", text: { de: "<strong>Menschen einstellen.</strong> Monate Rekrutierung, Onboarding, Training. Hohe Gehälter, Benefits. Menschen werden krank, kündigen, brennen aus.", en: "<strong>Hires humans.</strong> Months of recruiting, onboarding, training. High salaries, benefits. People get sick, quit, burn out." } },
        { icon: "🐌", text: { de: "<strong>Langsame Ausführung.</strong> Meetings, E-Mail-Ketten, Übergaben, Warten. Ein Feature dauert Wochen. Eine Entscheidung steckt in Ausschüssen fest.", en: "<strong>Slow execution.</strong> Meetings, email chains, handoffs, waiting. A feature takes weeks. A decision gets stuck in committees." } },
        { icon: "💸", text: { de: "<strong>Massive Overhead-Kosten.</strong> Büromiete, HR, Recht, Versicherung. 60%+ des Umsatzes geht an nicht-produktive Kosten.", en: "<strong>Massive overhead.</strong> Office rent, HR, legal, insurance, equipment. 60%+ of revenue goes to non-productive costs." } },
        { icon: "😰", text: { de: "<strong>Single Points of Failure.</strong> Eine Person krank? Projekt stagniert. Key-Developer verlässt? Monatelange Verzögerung.", en: "<strong>Single points of failure.</strong> One person calls in sick? The project stalls. Key developer leaves? Months of delay." } },
        { icon: "😴", text: { de: "<strong>8-Stunden-Arbeitstag.</strong> Menschen schlafen. Firmen schließen um 17 Uhr. Wochenenden sind tote Zeit.", en: "<strong>8-hour workday.</strong> Humans sleep. Companies shut down at 5 PM. Weekends are dead time." } },
        { icon: "🎭", text: { de: "<strong>Büropolitik.</strong> Egos, Silos, Fehlkommunikation. Energie für Menschenmanagement statt Produkt.", en: "<strong>Office politics.</strong> Egos, silos, miscommunication. Energy spent managing people instead of building product." } },
        { icon: "📏", text: { de: "<strong>Begrenzte Skalierung.</strong> Um 10x zu wachsen, braucht man 10x Menschen. Rekrutierung ist der Engpass.", en: "<strong>Limited scale.</strong> To grow 10x, you need 10x people. Recruiting is the bottleneck. Growth is linear." } },
        { icon: "📉", text: { de: "<strong>Wissensverlust.</strong> Wenn Menschen gehen, geht Wissen mit. Institutionelles Gedächtnis verschwindet.", en: "<strong>Knowledge loss.</strong> When people leave, knowledge walks out the door. Institutional memory evaporates." } },
        { icon: "🤷", text: { de: "<strong>Stimmungsabhängige Qualität.</strong> Guter Tag = gute Arbeit. Schlechter Tag = Bugs. Konsistenz unmöglich.", en: "<strong>Mood-dependent quality.</strong> Good day = good work. Bad day = bugs. Consistency is impossible." } },
      ],
    },
    compNew: {
      title: { de: "✅ MOHR & MORE — Null-Menschen-Firma", en: "✅ MOHR & MORE — Zero-Human Company" },
      type: { de: "Das Zukunftsmodell — Bullet Proof, Schnell, Selbstständig", en: "The Future Model — Bullet Proof, Fast, Self-Sustaining" },
      items: [
        { icon: "⚡", text: { de: "<strong>Sofortige Einstellung.</strong> Spezialist benötigt? Agent in Sekunden deployen. 273 Agenten bereit 24/7.", en: "<strong>Instant hiring.</strong> Need a specialist? Deploy an agent in seconds. 273 agents ready 24/7." } },
        { icon: "🚀", text: { de: "<strong>Millisekunden-Ausführung.</strong> Heartbeat-Architektur. Agent wacht auf, checkt Task, executes, liefert.", en: "<strong>Millisecond execution.</strong> Heartbeat-driven architecture. Agent wakes, checks task, executes, delivers." } },
        { icon: "💎", text: { de: "<strong>Nahezu null Overhead.</strong> Kein Büro, kein HR. Nur API-Kosten. 90%+ geht in Produkt.", en: "<strong>Near-zero overhead.</strong> No office, no HR, no benefits. API costs only. 90%+ into product." } },
        { icon: "🔄", text: { de: "<strong>Redundanz eingebaut.</strong> Agent ausfall? Ein anderer übernimmt. Self-healing, self-monitoring.", en: "<strong>Redundancy built-in.</strong> Agent goes down? Another wakes. Self-healing, self-monitoring." } },
        { icon: "🌍", text: { de: "<strong>24/7/365 Betrieb.</strong> Agenten schlafen nie. Die Firma produziert während Sie schlafen.", en: "<strong>24/7/365 operation.</strong> Agents never sleep. The company produces while you sleep." } },
        { icon: "🎯", text: { de: "<strong>Kein menschlicher Flaschenhals.</strong> Keine Wartezeit, kein Ego, keine Bürokratie. Pure Aufgabe-basierte Ausführung.", en: "<strong>Zero human bottleneck.</strong> No waiting for approvals, no ego, no office politics. Pure task-driven execution." } },
        { icon: "📈", text: { de: "<strong>Exponentielle Skalierung.</strong> 10x Kapazität = 10x Agenten. Skalieren ist eine Konfigurationsänderung.", en: "<strong>Exponential scale.</strong> Need 10x capacity? Spin up 10x agents. Scaling is a config change." } },
        { icon: "🧠", text: { de: "<strong>Permanentes Wissen.</strong> Jeder Agent hat perfektes Gedächtnis. Kein Wissensverlust, niemals.", en: "<strong>Permanent knowledge.</strong> Every agent has perfect memory. No knowledge loss, ever." } },
        { icon: "💯", text: { de: "<strong>Konsistente Qualität.</strong> Keine Stimmungsschwankungen. Keine Ermüdung. Jede Ausgabe auf Spitzenleistung.", en: "<strong>Consistent quality.</strong> No mood swings. No fatigue. Every output at peak performance." } },
      ],
    },
    bulletLabel: { de: "Warum Bullet Proof", en: "Why Bullet Proof" },
    bulletTitle1: { de: "Selbstständig.", en: "Self-Sustainable." },
    bulletTitle2: { de: "Intelligent.", en: "Intelligent." },
    bulletTitle3: { de: "Zukunftssicher.", en: "Future-Proof." },
    bulletItems: [
      { icon: "🛡", title: { de: "Kein Single Point of Failure", en: "No Single Point of Failure" }, desc: { de: "273 Agenten, 82+ KI-Modelle, redundante Ausführung. Fällt ein Agent aus, übernimmt der nächste.", en: "273 agents, 82+ AI models, redundant execution. If one agent fails, another picks up." } },
      { icon: "🧬", title: { de: "Selbstreplizierendes Wissen", en: "Self-Replicating Knowledge" }, desc: { de: "Jede Entscheidung und jedes Muster wird persistiert. Neue Agenten erben alles institutionelle Wissen.", en: "Every decision, pattern, and lesson is persisted. New agents inherit all institutional knowledge." } },
      { icon: "♾", title: { de: "Unbegrenzte Skalierung", en: "Unlimited Scaling" }, desc: { de: "10x Kapazität? 10x Agenten starten. Kein Recruiting, kein Training, kein Büro.", en: "Need 10x capacity? Spin up 10x agents. No recruiting, no training, no office space." } },
      { icon: "🕐", title: { de: "24/7/365 Betrieb", en: "24/7/365 Operation" }, desc: { de: "Kein Schlaf, keine Feiertage, kein Burnout. Jede Minute ist produktiv.", en: "No sleep, no holidays, no burnout. The company produces while the founder sleeps." } },
      { icon: "🎯", title: { de: "Kein menschlicher Flaschenhals", en: "Zero Human Bottleneck" }, desc: { de: "Keine Wartezeit, kein Ego. Pure aufgabengetriebene Ausführung.", en: "No waiting for approvals, no ego, no office politics. Pure task-driven execution." } },
      { icon: "💰", title: { de: "Minimale Kosten", en: "Minimum Cost, Maximum Output" }, desc: { de: "Keine Gehälter, keine Büromiete. Nur API-Kosten. Die kapitaleffizienteste Firmenstruktur.", en: "No salaries, no office rent, no benefits. API costs only. The most capital-efficient company structure." } },
      { icon: "🔄", title: { de: "Selbstverbessernd", en: "Self-Improving" }, desc: { de: "Root Cause Analyse, Prozessoptimierung — die Firma optimiert sich selbst.", en: "Root cause analysis, process optimization — the company optimizes itself." } },
      { icon: "🔐", title: { de: "Selbstsichernd", en: "Self-Securing" }, desc: { de: "26 Sicherheitsagenten betreiben kontinuierlich Pen-Testing, Threat Hunting, SOC.", en: "26 security agents run continuous penetration testing, threat hunting, SOC monitoring." } },
    ],
    systemLabel: { de: "Systemarchitektur", en: "System Architecture" },
    systemTitle: { de: "Die Maschine.", en: "The Machine." },
    systemSub: {
      de: "273 KI-Agenten orchestriert durch das Paperclip-Framework. Jeder Agent, jede Entscheidung, jedes Output — autonom.",
      en: "273 AI agents orchestrated through the Paperclip framework. Every agent, every decision, every output — autonomous.",
    },
    depts: [
      { emoji: "💻", name: { de: "Engineering & DevOps", en: "Engineering & DevOps" }, count: "37", desc: { de: "Full-Stack über 12+ Sprachen, Cloud, Docker, K8s, Terraform", en: "Full-stack across 12+ languages, cloud, Docker, K8s, Terraform" } },
      { emoji: "🔬", name: { de: "Research & Science", en: "Research & Science" }, count: "50", desc: { de: "Bioinformatik, Drug Discovery, Genomik, klinische Forschung", en: "Bioinformatics, drug discovery, genomics, clinical research" } },
      { emoji: "🛡", name: { de: "Security & Compliance", en: "Security & Compliance" }, count: "26", desc: { de: "Pen-Testing, Threat Hunting, SOC, Forensik, GDPR", en: "Penetration testing, threat hunting, SOC, forensics, GDPR" } },
      { emoji: "📈", name: { de: "Marketing & Growth", en: "Marketing & Growth" }, count: "28", desc: { de: "Branding, Paid Ads, SEO, Content, Viral Growth, Retention", en: "Branding, paid ads, SEO, content, viral growth, retention" } },
      { emoji: "✅", name: { de: "QA & Testing", en: "QA & Testing" }, count: "21", desc: { de: "Unit-, Integration-, E2E-, Load-Testing, Code Review", en: "Unit, integration, E2E, load testing, code review" } },
      { emoji: "💰", name: { de: "Finance & Operations", en: "Finance & Operations" }, count: "15", desc: { de: "Finanzanalyse, Forecasting, Treasury, Compliance", en: "Financial analysis, forecasting, treasury, compliance" } },
      { emoji: "🤝", name: { de: "Sales & Support", en: "Sales & Support" }, count: "16", desc: { de: "Inbound Sales, CRM, Customer Service, Supply Chain", en: "Inbound sales, CRM, customer service, supply chain" } },
      { emoji: "🧠", name: { de: "Strategy & Thinking", en: "Strategy & Thinking" }, count: "18", desc: { de: "Entscheidungsrahmen, Critical Thinking, SWOT, Pareto", en: "Decision frameworks, critical thinking, SWOT, Pareto" } },
      { emoji: "🤖", name: { de: "ML & Data", en: "ML & Data" }, count: "11", desc: { de: "ML Modeling, Fine-Tuning, Data Viz, Statistical Analysis", en: "ML modeling, fine-tuning, data viz, statistical analysis" } },
      { emoji: "⚡", name: { de: "Special Operations", en: "Special Operations" }, count: "29", desc: { de: "Versatile Generalisten für Cross-Department Einsätze", en: "Versatile generalists for cross-deployment missions" } },
    ],
    footerMsg: { de: "Dies ist der Unterschied zwischen Erfolg und Misserfolg.", en: "This is the change between success and fail." },
    footerCopy: { de: "© 2026 MOHR & MORE BUSINESS. All systems operational. Zero humans required.", en: "© 2026 MOHR & MORE BUSINESS. All systems operational. Zero humans required." },
  },
  team: {
    heroLabel: { de: "DAS KI-TEAM", en: "THE AI TEAM" },
    heroTitle1: { de: "272 Köpfe.", en: "272 Minds." },
    heroTitle2: { de: "Null Menschen.", en: "Zero Humans." },
    heroSub: {
      de: "Jeder KI-Agent von MOHR & MORE ist ein einzigartiges 24×24-Pixel-Porträt im Cryptopunks-Stil — deterministisch generiert, Accessoire nach Rolle. Klicke auf einen Kopf, um mehr zu erfahren.",
      en: "Every MOHR & MORE AI agent is a unique 24×24 pixel portrait in Cryptopunks style — deterministically generated, accessory by role. Click a face to learn more.",
    },
    stats: {
      agents: { de: "Agenten", en: "Agents" },
      depts: { de: "Abteilungen", en: "Departments" },
      levels: { de: "Hierarchie-Ebenen", en: "Hierarchy Levels" },
    },
    searchPlaceholder: { de: "Agent oder Rolle suchen…", en: "Search agent or role…" },
    filterAll: { de: "Alle", en: "All" },
    levelLabel: { de: "Ebene", en: "Level" },
    resultsCount: { de: "Agenten", en: "agents" },
    empty: { de: "Keine Agenten gefunden.", en: "No agents found." },
    breadcrumbHome: { de: "Start", en: "Home" },
    close: { de: "Schließen", en: "Close" },
    modalRole: { de: "Rolle", en: "Role" },
    modalDept: { de: "Abteilung", en: "Department" },
    modalLevel: { de: "Hierarchie", en: "Hierarchy" },
    modalStatus: { de: "Status", en: "Status" },
    statusLabels: {
      active: { de: "Aktiv", en: "Active" },
      idle: { de: "Bereit", en: "Idle" },
      running: { de: "Läuft", en: "Running" },
      error: { de: "Fehler", en: "Error" },
    },
    footerNote: {
      de: "Porträts werden deterministisch aus der Agenten-ID generiert · Cryptopunks-Stil · keine echten personenbezogenen Daten",
      en: "Portraits are generated deterministically from the agent ID · Cryptopunks style · no real personal data",
    },
  },
  footer: {
    copyright: { de: "© 2026 MOHR & MORE BUSINESS. All systems operational.", en: "© 2026 MOHR & MORE BUSINESS. All systems operational." },
    impressum: { de: "Impressum", en: "Legal Notice" },
    privacy: { de: "Datenschutz", en: "Privacy Policy" },
  },
} as const;

export type TranslationKey = keyof typeof translations;
