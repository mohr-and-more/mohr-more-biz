export type Lang = "de" | "en";

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
    kiEntwicklung: { de: "KI Entwicklung", en: "AI Engineering" },
  },
  hero: {
    label: { de: "Unternehmerduo // 2026", en: "Entrepreneurial Duo // 2026" },
    title: { de: "Commerce.<br/>Technology.<br/>Execution.", en: "Commerce.<br/>Technology.<br/>Execution." },
    subtitle: {
      de: "Gregor Mohr und Gunnar Mohr verbinden Handelsrealität mit technologischer Umsetzungskraft. Zwei komplementäre Profile. Ein gemeinsames System für moderne Geschäftsmodelle an der Schnittstelle von Markt und Infrastruktur.",
      en: "Gregor Mohr and Gunnar Mohr combine trade reality with technological execution power. Two complementary profiles. A shared system for modern business models at the intersection of market and infrastructure.",
    },
    ctaPrimary: { de: "Strategisches Gespräch", en: "Strategic Conversation" },
    ctaSecondary: { de: "System erkunden", en: "Explore System" },
  },
  manifest: {
    label: { de: "Positionierung", en: "Positioning" },
    title: { de: "Praxis trifft<br/>Innovation.", en: "Practice meets<br/>Innovation." },
    text: {
      de: 'Wir operieren an der Schnittstelle von <strong>realem Commerce</strong> und <strong>digitaler Infrastruktur</strong>. Gregor Mohr bringt das Handelsverständnis. Gunnar Mohr liefert die technologische Durchschlagskraft. Das Ergebnis ist ein Unternehmerprofil, das Märkte nicht nur analysiert, sondern aktiv gestaltet — mit pragmatischer Erfahrung auf der einen und KI-gestützter Exekution auf der anderen Seite.',
      en: 'We operate at the intersection of <strong>real commerce</strong> and <strong>digital infrastructure</strong>. Gregor Mohr brings trade expertise. Gunnar Mohr delivers technological impact. The result is an entrepreneurial profile that doesn\'t just analyze markets but actively shapes them — with pragmatic experience on one side and AI-powered execution on the other.',
    },
  },
  system: {
    label: { de: "Systemarchitektur", en: "System Architecture" },
    title: { de: "Zwei Module.<br/>Eine Plattform.", en: "Two Modules.<br/>One Platform." },
    module01: {
      badge: "MODULE_01",
      role: {
        de: "Gregor Mohr // Kaufmännischer Stratege & Geschäftsführer",
        en: "Gregor Mohr // Commercial Strategist & Managing Director",
      },
      title: {
        de: "Handel, Retouren & AI-Voicebot",
        en: "Trade, Returns & AI Voicebot",
      },
      items: [
        { de: "trabusco — passion for trade (seit 2002, Köln/Riga)", en: "trabusco — passion for trade (since 2002, Cologne/Riga)" },
        { de: "Internationales B2B-Sourcing: Textilien, Beauty, Elektronik", en: "International B2B sourcing: textiles, beauty, electronics" },
        { de: "Netzwerke Asien, UAE, Europa — physischer Warenverkehr", en: "Networks Asia, UAE, Europe — physical goods trade" },
        { de: "Alles10Euro / PermaX GmbH — Festpreis-Onlineshop", en: "Alles10Euro / PermaX GmbH — fixed-price online shop" },
        { de: "TENIOS — AI-Voicebot für E-Commerce & Retail", en: "TENIOS — AI Voicebot for E-Commerce & Retail" },
        { de: 'ZigZag Global / BuyBay — Retouren-SaaS ("Der Retourenexperte")', en: 'ZigZag Global / BuyBay — Returns SaaS ("The Returns Expert")' },
        { de: 'YouTube "Greg the Crack" — KI-Voicebot-Experte', en: 'YouTube "Greg the Crack" — AI Voicebot Expert' },
        { de: "LinkedIn: linkedin.com/in/gregormohr", en: "LinkedIn: linkedin.com/in/gregormohr" },
      ],
    },
    module02: {
      badge: "MODULE_02",
      role: {
        de: "Gunnar Mohr // Technischer Architekt & Geschäftsführer",
        en: "Gunnar Mohr // Technical Architect & Managing Director",
      },
      title: {
        de: "KI-Agenten, Full-Stack & Infrastruktur",
        en: "AI Agents, Full-Stack & Infrastructure",
      },
      items: [
        { de: "Flowfon / TerminTelefon — 24/7 KI-Telefonassistenten", en: "Flowfon / TerminTelefon — 24/7 AI phone assistants" },
        { de: "Full-Stack Entwicklung & Cloud-Architektur (Sparte Development)", en: "Full-stack development & cloud architecture (Development Division)" },
        { de: "FLIXFOTO™ — KI-Produktfotografie für E-Commerce", en: "FLIXFOTO™ — AI product photography for E-Commerce" },
        { de: "Alles10Euro 2.0 — Festpreis-Onlineshop", en: "Alles10Euro 2.0 — fixed-price online shop" },
        { de: "NODᵉSIM Network — eSIM-NFT · IoT · Web3 / Blockchain", en: "NODᵉSIM Network — eSIM-NFT · IoT · Web3 / Blockchain" },
        { de: "Automatisierung & KI-Agenten-Netzwerke", en: "Automation & AI agent networks" },
        { de: '"Trees for the World" Namibia — Entwicklungshelfer', en: '"Trees for the World" Namibia — development worker' },
        { de: "LinkedIn: linkedin.com/in/gunmo", en: "LinkedIn: linkedin.com/in/gunmo" },
      ],
    },
  },
  principles: {
    label: { de: "Betriebsprinzipien", en: "Operating Principles" },
    title: { de: "Was dieses<br/>System antreibt.", en: "What drives this<br/>System." },
    items: [
      {
        num: "01",
        title: { de: "Pragmatik", en: "Pragmatism" },
        text: {
          de: "Keine Theorie ohne Marktvalidierung. Jede Idee wird anhand realer Handelsstrukturen und technischer Machbarkeit geprüft, bevor sie skaliert.",
          en: "No theory without market validation. Every idea is tested against real trade structures and technical feasibility before scaling.",
        },
        video: "/videos/THINK.mp4",
      },
      {
        num: "02",
        title: { de: "Autonomie", en: "Autonomy" },
        text: {
          de: "Eigene Produkte, eigene Infrastruktur, eigene Konsensmechanismen. Von der Supply Chain bis zum Blockchain-Protokoll.",
          en: "Own products, own infrastructure, own consensus mechanisms. From supply chain to blockchain protocol.",
        },
        video: "/videos/SPEED.mp4",
      },
      {
        num: "03",
        title: { de: "Tiefe", en: "Depth" },
        text: {
          de: "Vom Sourcing in der Restposten-Logistik bis zum KI-Modell. Ende-zu-Ende-Kompetenz statt oberflächlicher Integrationen.",
          en: "From sourcing in off-price logistics to AI models. End-to-end competence over superficial integrations.",
        },
        video: "/videos/DEEP-TECH.mp4",
      },
      {
        num: "04",
        title: { de: "Skalierung", en: "Scaling" },
        text: {
          de: "Modulare Architektur für internationale Geschäftsmodelle. Handelsnetzwerke und digitale Plattformen wachsen gemeinsam.",
          en: "Modular architecture for international business models. Trade networks and digital platforms grow together.",
        },
        video: "/videos/SCALE.mp4",
      },
    ],
  },
  vision: {
    label: { de: "Zukunftssystem", en: "Future System" },
    title: { de: "Die nächste Ebene<br/>der Wertschöpfung.", en: "The Next Level<br/>of Value Creation." },
    text: {
      de: "Wir bauen Unternehmen und Infrastrukturen, die ohne Aufsehen funktionieren. Stille Effizienz. Hinter den Kulissen. Von der Restposten-Distribution bis zur dezentralen Konnektivitätsmonetarisierung. Die Zukunft gehört denen, die Handel und Technologie als eine Einheit begreifen — nicht als getrennte Disziplinen. Dieses Profil ist für Investoren, strategische Partner und Geschäftsanfragen international anschlussfähig positioniert.",
      en: "We build companies and infrastructures that work without fanfare. Silent efficiency. Behind the scenes. From off-price distribution to decentralized connectivity monetization. The future belongs to those who understand trade and technology as one entity — not as separate disciplines. This profile is positioned for international resonance with investors, strategic partners, and business inquiries.",
    },
  },
  contact: {
    label: { de: "Initiieren", en: "Initiate" },
    title: { de: "Verbindung<br/>aufbauen.", en: "Build<br/>Connection." },
    text: {
      de: "Für strategische Anfragen, Kooperationen und Investorenkontakte. Wir antworten präzise und zeitnah.",
      en: "For strategic inquiries, partnerships and investor relations. We respond precisely and promptly.",
    },
    ctaPrimary: { de: "Kontakt aufnehmen", en: "Get in Touch" },
    linkedinGregor: "LinkedIn Gregor",
    linkedinGunnar: "LinkedIn Gunnar",
  },
  zeroHumans: {
    pageTitle: { de: "Zero Humans — Die Null-Menschen-Firma | MOHR & MORE", en: "Zero Humans — The Zero-Human Company | MOHR & MORE" },
    pageDesc: {
      de: "272 KI-Agenten. 15 Abteilungen. 28+ Projekte. 24/7/365 autonom. Die erste Null-Menschen-Firma der Welt — aufgebaut von Gunnar Mohr.",
      en: "272 AI agents. 15 departments. 28+ projects. 24/7/365 autonomous. The world's first zero-human company — built by Gunnar Mohr.",
    },
    heroLabel: { de: "MOHR & MORE BUSINESS — UNTERNEHMENSPROFIL", en: "MOHR & MORE BUSINESS — COMPANY PROFILE" },
    heroTitle1: { de: "Zero Humans.", en: "Zero Humans." },
    heroTitle2: { de: "272 AI Agents.", en: "272 AI Agents." },
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
        { icon: "⚡", text: { de: "<strong>Sofortige Einstellung.</strong> Spezialist benötigt? Agent in Sekunden deployen. 272 Agenten bereit 24/7.", en: "<strong>Instant hiring.</strong> Need a specialist? Deploy an agent in seconds. 272 agents ready 24/7." } },
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
      { icon: "🛡", title: { de: "Kein Single Point of Failure", en: "No Single Point of Failure" }, desc: { de: "272 Agenten, 82+ KI-Modelle, redundante Ausführung. Fällt ein Agent aus, übernimmt der nächste.", en: "272 agents, 82+ AI models, redundant execution. If one agent fails, another picks up." } },
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
      de: "272 KI-Agenten orchestriert durch das Paperclip-Framework. Jeder Agent, jede Entscheidung, jedes Output — autonom.",
      en: "272 AI agents orchestrated through the Paperclip framework. Every agent, every decision, every output — autonomous.",
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
    // MMB-504 — Quota Card (MiniMax-style usage widget, adopted from MiniMax dashboard)
    quota: {
      label: { de: "Live-Auslastung", en: "Live usage" },
      sectionLabel: { de: "Echtzeit-Betriebsdaten", en: "Real-time operations" },
      sectionTitle: {
        de: "Wie viel Kapazität unsere Flotte gerade nutzt.",
        en: "How much capacity our fleet is consuming right now.",
      },
      sectionSub: {
        de: "Snapshot der MiniMax-Coding-Plan-Auslastung (5h-Limit / Wochen-Limit / Video-Bonus) — Adaption des MiniMax-Quota-Panels für das mohr-more.biz Dashboard. Echtzeit-API folgt, sobald die MiniMax-Plattform Cookie-basierte Auth für /coding_plan/remains öffnet (Status-Issue #88). Stand: 2026-07-06 — Build MMB-504 / MMB-506.",
        en: "Snapshot of the MiniMax Coding Plan usage (5h limit / Weekly limit / Video bonus) — adoption of the MiniMax quota panel for the mohr-more.biz dashboard. Live API will follow once MiniMax opens cookie-based auth for /coding_plan/remains (tracking issue #88). Snapshot date: 2026-07-06 — build MMB-504 / MMB-506.",
      },
      rows: [
        {
          label: { de: "5h-Fenster", en: "5h window" },
          sub:   { de: "Reset in 2 Std 17 Min", en: "Resets in 2 hr 17 min" },
          used: 416,
          max: 1600,
          ariaLabel: { de: "5-Stunden-Fenster 416 von 1600 (26 %)", en: "5-hour window 416 of 1600 (26 %)" },
        },
        {
          label: { de: "7d-Fenster", en: "7d window" },
          sub:   { de: "Reset in 6 Tagen 6 Std", en: "Resets in 6 days 6 hr" },
          used: 960,
          max: 8000,
          ariaLabel: { de: "Wochen-Fenster 960 von 8000 (12 %)", en: "Weekly window 960 of 8000 (12 %)" },
        },
        {
          label: { de: "Video-Bonus", en: "Video bonus" },
          sub:   { de: "Reset in 6 Std 17 Min", en: "Resets in 6 hr 17 min" },
          used: 0,
          max: 3,
          ariaLabel: { de: "Video-Bonus 0 von 3", en: "Video bonus 0 of 3" },
        },
      ],
    },
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
  contactPage: {
    pageLabel: { de: "Kontakt", en: "Contact" },
    hero: {
      title: {
        de: "Sprechen Sie mit uns.",
        en: "Let's talk.",
      },
      intro: {
        de: "Wir antworten binnen 24 Stunden — persönlich, unverbindlich und auf den Punkt. Wählen Sie den Weg, der Ihnen am liebsten ist.",
        en: "We respond within 24 hours — personally, no strings attached, straight to the point. Pick the channel that suits you best.",
      },
    },
    cards: {
      callLabel: { de: "Anrufen", en: "Call us" },
      callTitle: { de: "Direkter Draht", en: "Direct line" },
      callText: {
        de: "Mo–Fr 8–17 Uhr. Persönlich, ohne Warteschleifen-Robot.",
        en: "Mon–Fri 8–17. Real people, no IVR maze.",
      },
      emailLabel: { de: "E-Mail", en: "Email" },
      emailTitle: { de: "Schreiben Sie uns", en: "Send us a message" },
      emailText: {
        de: "Antwort binnen 24 Stunden. Auch für nicht-eilige Anfragen.",
        en: "Reply within 24 hours. Also for non-urgent requests.",
      },
      bookLabel: { de: "Termin", en: "Booking" },
      bookTitle: { de: "Termin direkt buchen", en: "Book a slot directly" },
      bookText: {
        de: "30-Minuten-Beratungsgespräch — Kalender-Link führt Sie in einem Klick zum freien Slot.",
        en: "30-minute consultation — calendar link drops you in a free slot in one click.",
      },
      cta: { de: "Weg wählen", en: "Choose" },
    },
    form: {
      title: { de: "Schreiben Sie uns eine Nachricht", en: "Send us a message" },
      subtitle: {
        de: "Vier Felder, DSGVO-Checkbox, fertig. Wir melden uns binnen 24 Stunden.",
        en: "Four fields, GDPR checkbox, done. We'll get back within 24 hours.",
      },
      name: { de: "Ihr Name", en: "Your name" },
      namePh: { de: "Vor- und Nachname", en: "First and last name" },
      company: { de: "Firma (optional)", en: "Company (optional)" },
      companyPh: { de: "Firma GmbH", en: "Acme Corp." },
      email: { de: "E-Mail-Adresse", en: "Email address" },
      emailPh: { de: "[email protected]", en: "[email protected]" },
      message: { de: "Ihre Nachricht", en: "Your message" },
      messagePh: {
        de: "Worum geht es? Was möchten Sie erreichen? Welcher Termin passt Ihnen?",
        en: "What's it about? What do you want to achieve? When works for you?",
      },
      consent: {
        de: "Ich willige ein, dass MOHR & MORE meine Angaben zur Bearbeitung dieser Anfrage gemäß der Datenschutzerklärung verarbeitet. Die Einwilligung kann jederzeit widerrufen werden.",
        en: "I agree that MOHR & MORE processes my details to handle this request according to the privacy policy. Consent can be withdrawn at any time.",
      },
      consentLink: { de: "(Datenschutzerklärung)", en: "(Privacy Policy)" },
      submit: { de: "Nachricht senden", en: "Send message" },
      submitting: { de: "Wird gesendet…", en: "Sending…" },
      success: {
        de: "Vielen Dank! Wir haben Ihre Nachricht erhalten und melden uns binnen 24 Stunden bei Ihnen.",
        en: "Thank you! We've received your message and will reply within 24 hours.",
      },
      errorGeneric: {
        de: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.",
        en: "Something went wrong. Please try again or call us directly.",
      },
      errorNetwork: {
        de: "Server momentan nicht erreichbar. Bitte später erneut versuchen.",
        en: "Server unreachable right now. Please try again later.",
      },
      errorRequired: {
        de: "Bitte füllen Sie alle Pflichtfelder aus.",
        en: "Please fill in all required fields.",
      },
      errorEmail: {
        de: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        en: "Please enter a valid email address.",
      },
      errorConsent: {
        de: "Ohne DSGVO-Einwilligung können wir Ihre Anfrage leider nicht bearbeiten.",
        en: "Without GDPR consent we cannot process your request.",
      },
      errorMinLen: {
        de: "Bitte schreiben Sie mindestens 20 Zeichen in die Nachricht.",
        en: "Please write at least 20 characters in your message.",
      },
    },
    address: {
      title: { de: "So finden Sie uns", en: "How to find us" },
      block: { de: "Adresse & Öffnungszeiten", en: "Address & hours" },
      street: { de: "Musterstraße 1", en: "1 Sample Street" },
      postalCity: { de: "12345 Musterstadt, DE", en: "12345 Sample City, DE" },
      hoursLabel: { de: "Öffnungszeiten", en: "Office hours" },
      hoursText: { de: "Mo–Fr 8–17 Uhr", en: "Mon–Fri 8 AM–5 PM" },
      phoneLabel: { de: "Telefon", en: "Phone" },
      emailLabel: { de: "E-Mail", en: "Email" },
      mapTitle: { de: "Standort MOHR & MORE auf Google Maps", en: "MOHR & MORE location on Google Maps" },
    },
    multiChannel: {
      title: { de: "Mehrere Wege, ein Ansprechpartner", en: "Multiple channels, one point of contact" },
      desc: {
        de: "Wählen Sie den Kanal, der Ihnen am bequemsten ist. Jede Anfrage landet bei derselben Person — versprochen.",
        en: "Pick the channel that suits you best. Every request lands with the same person — promised.",
      },
      phone: { de: "+49 0000 0000000", en: "+49 0000 0000000" },
      email: { de: "[email protected]", en: "[email protected]" },
    },
  },
  services: {
    hero: {
      title: {
        de: "Leistungen, die Ihr Unternehmen messbar voranbringen.",
        en: "Services that measurably move your business forward.",
      },
      intro: {
        de: "Von der Strategie über die Umsetzung bis zur laufenden Wartung: Wir digitalisieren Vertrieb und Verwaltung für den Mittelstand — pragmatisch, messbar und ohne Reibungsverluste.",
        en: "From strategy through implementation to ongoing maintenance: we digitalize sales and administration for mid-market companies — pragmatic, measurable, and friction-free.",
      },
      ctaPrimary: {
        de: "Beratungsgespräch vereinbaren",
        en: "Book a consultation",
      },
      ctaSecondary: {
        de: "Leistungen ansehen",
        en: "Browse services",
      },
    },
    cards: {
      title: {
        de: "Sechs Leistungen, ein Ziel: Ihr Wachstum.",
        en: "Six services, one goal: your growth.",
      },
      subtitle: {
        de: "Jede Karte folgt demselben klaren Muster: Problem → Lösung → Ergebnis. Klicken Sie rein, um Details, FAQs und konkrete Lieferergebnisse zu sehen.",
        en: "Every card follows the same clear pattern: Problem → Solution → Outcome. Click in for details, FAQs, and concrete deliverables.",
      },
    },
    cta: {
      title: {
        de: "Bereit, den ersten Schritt zu machen?",
        en: "Ready to take the first step?",
      },
      text: {
        de: "Vereinbaren Sie ein unverbindliches Erstgespräch. Wir hören zu, analysieren Ihre Situation und schlagen Ihnen die nächsten drei konkreten Schritte vor.",
        en: "Book a no-obligation initial consultation. We listen, analyze your situation, and propose three concrete next steps.",
      },
      button: {
        de: "Jetzt Beratung anfragen",
        en: "Request a consultation",
      },
    },
  },
  serviceDetail: {
    back: { de: "← Zurück zur Übersicht", en: "← Back to overview" },
    ctaTitle: {
      de: "Interesse geweckt?",
      en: "Interested?",
    },
    ctaText: {
      de: "Vereinbaren Sie ein unverbindliches Erstgespräch. Wir beantworten Ihre Fragen und erstellen ein erstes Konzept.",
      en: "Book a no-obligation initial consultation. We answer your questions and draft an initial concept.",
    },
    ctaButton: {
      de: "Beratung anfragen",
      en: "Request a consultation",
    },
    faqTitle: {
      de: "Häufig gestellte Fragen",
      en: "Frequently asked questions",
    },
    benefitsTitle: {
      de: "Was Sie konkret bekommen",
      en: "What you concretely get",
    },
    problemTitle: { de: "Problem", en: "Problem" },
    solutionTitle: { de: "Lösung", en: "Solution" },
    outcomeTitle: { de: "Ergebnis", en: "Outcome" },
  },
  referencesPage: {
    pageLabel: { de: "Referenzen", en: "References" },
    hero: {
      title: {
        de: "Case Studies mit messbaren Ergebnissen.",
        en: "Case studies with measurable outcomes.",
      },
      intro: {
        de: "Drei Beispiele aus den letzten 18 Monaten — anonymisiert, aber mit echten Zahlen. Filtern Sie nach Branche und lesen Sie, wie wir Herausforderungen in konkrete Resultate verwandelt haben.",
        en: "Three examples from the last 18 months — anonymized, with real numbers. Filter by industry and see how we turn challenges into measurable results.",
      },
    },
    filter: {
      label: { de: "Filter", en: "Filter" },
      searchLabel: {
        de: "Nach Branche oder Stichwort filtern",
        en: "Filter by industry or keyword",
      },
      searchPh: {
        de: "z.B. Mittelstand, Handwerk, Workflow …",
        en: "e.g. SME, crafts, workflow …",
      },
      allLabel: { de: "Alle Branchen", en: "All industries" },
      emptyLabel: {
        de: "Keine Cases gefunden. Bitte Filter anpassen.",
        en: "No cases found. Please adjust your filter.",
      },
      resetLabel: { de: "Filter zurücksetzen", en: "Reset filter" },
      resultCount: {
        de: "{count} Cases",
        en: "{count} cases",
      },
    },
    statsTitle: {
      de: "Kennzahlen auf einen Blick",
      en: "Key metrics at a glance",
    },
    readMore: { de: "Case lesen →", en: "Read case →" },
    ctaTitle: { de: "Ihr Projekt könnte das nächste Case Study sein.", en: "Your project could be the next case study." },
    ctaText: {
      de: "Vereinbaren Sie ein unverbindliches Erstgespräch. Wir besprechen Ihre Situation und skizzieren die ersten Schritte.",
      en: "Book a no-obligation initial consultation. We discuss your situation and outline the first steps.",
    },
    ctaButton: { de: "Beratung anfragen", en: "Request a consultation" },
  },
  caseDetail: {
    back: { de: "← Zurück zur Übersicht", en: "← Back to overview" },
    ctaTitle: { de: "Ähnliche Herausforderung?", en: "Similar challenge?" },
    ctaText: {
      de: "Wir besprechen Ihre Situation in einem unverbindlichen Erstgespräch und zeigen Ihnen, welche Schritte wir empfehlen würden.",
      en: "We'll discuss your situation in a no-obligation initial consultation and show you which steps we would recommend.",
    },
    ctaButton: { de: "Beratung anfragen", en: "Request a consultation" },
    detailsTitle: {
      de: "Ergebnisse im Detail",
      en: "Results in detail",
    },
    detailsSummary: {
      de: "Alle Ergebnisse anzeigen",
      en: "Show all results",
    },
    statsTitle: { de: "Kennzahlen", en: "Key metrics" },
    problemTitle: { de: "Ausgangslage", en: "Starting point" },
    solutionTitle: { de: "Vorgehen", en: "Approach" },
    clientLabel: { de: "Kunde", en: "Client" },
    durationLabel: { de: "Laufzeit", en: "Duration" },
    branchLabel: { de: "Branche", en: "Industry" },
  },
  /**
   * /ueber-uns (MMB-474, Sub 6 von 8 aus MMB-468)
   * DE + EN vollständig — wird via useLang() umgeschaltet.
   */
  about: {
    hero: {
      label: { de: "Über uns", en: "About us" },
      title: {
        de: "Menschen, Mission, Meilensteine.",
        en: "People, Mission, Milestones.",
      },
      intro: {
        de: "MOHR & MORE wurde 2009 in Köln gegründet. Heute sind wir ein Umsetzungspartner für den Mittelstand — mit einem Team aus erfahrenen Köpfen, klaren Werten und einem Track Record, der für sich spricht.",
        en: "MOHR & MORE was founded in 2009 in Cologne. Today we are an implementation partner for SMEs — with a team of seasoned professionals, clear values and a track record that speaks for itself.",
      },
      ctaPrimary: { de: "Kontakt aufnehmen", en: "Get in touch" },
      ctaSecondary: { de: "Leistungen ansehen", en: "View services" },
    },
    intro: {
      label: { de: "Mission", en: "Mission" },
      title: {
        de: "Wir bauen Unternehmen, die wie Software skalieren.",
        en: "We build companies that scale like software.",
      },
      text: {
        de: "Wir verbinden kaufmännische Realität mit technologischer Umsetzungskraft. Statt Berater-PowerPoint liefern wir lauffähige Lösungen — pragmatisch, messbar und mit einem Team, das mitdenkt. Unser Anspruch: Jedes Projekt verlässt unser Haus mit einer Zahl, die sich verbessert hat.",
        en: "We combine commercial reality with technological execution power. Instead of consultant PowerPoint, we ship working solutions — pragmatic, measurable and with a team that thinks ahead. Our standard: every project leaves our house with at least one number that has improved.",
      },
      meta: {
        location: {
          de: "Standort",
          en: "Location",
        },
        founded: {
          de: "Gegründet",
          en: "Founded",
        },
        focus: {
          de: "Fokus",
          en: "Focus",
        },
        locationValue: { de: "Köln / NRW", en: "Cologne / NRW" },
        foundedValue: { de: "2009", en: "2009" },
        focusValue: {
          de: "Digitalisierung & Umsetzung für den Mittelstand",
          en: "Digitalization & implementation for SMEs",
        },
      },
    },
    team: {
      label: { de: "Team", en: "Team" },
      title: {
        de: "Vier Köpfe, ein System.",
        en: "Four people, one system.",
      },
      subtitle: {
        de: "Platzhalter-Fotos. Sobald der Kunde echte Teamfotos liefert, werden hier nur die Daten getauscht — die Komponente bleibt unverändert.",
        en: "Placeholder photos. Once the client delivers real team photos, only the data gets swapped — the component stays unchanged.",
      },
    },
    timeline: {
      label: { de: "Geschichte", en: "History" },
      title: {
        de: "Von 2009 bis heute.",
        en: "From 2009 to today.",
      },
      subtitle: {
        de: "Sechs Meilensteine auf dem Weg zur Zero-Human Company.",
        en: "Six milestones on the way to the Zero-Human Company.",
      },
    },
    values: {
      label: { de: "Werte", en: "Values" },
      title: {
        de: "Woran wir uns messen lassen.",
        en: "What we hold ourselves to.",
      },
      subtitle: {
        de: "Vier Prinzipien, die jedes Projekt prägen — vom ersten Briefing bis zum Go-Live.",
        en: "Four principles that shape every project — from the first briefing to go-live.",
      },
    },
    cta: {
      title: {
        de: "Lust auf eine konkrete Zusammenarbeit?",
        en: "Ready for a concrete collaboration?",
      },
      text: {
        de: "Vereinbaren Sie ein unverbindliches Erstgespräch. Wir hören zu, sortieren mit Ihnen die Situation und skizzieren die ersten sinnvollen Schritte.",
        en: "Book a no-obligation initial consultation. We listen, sort out the situation with you and outline the first sensible steps.",
      },
      primary: { de: "Kontakt aufnehmen", en: "Get in touch" },
      secondary: { de: "Leistungen ansehen", en: "View services" },
    },
  },
  footer: {
    copyright: { de: "© 2026 MOHR & MORE BUSINESS. All systems operational.", en: "© 2026 MOHR & MORE BUSINESS. All systems operational." },
    impressum: { de: "Impressum", en: "Legal Notice" },
    privacy: { de: "Datenschutz", en: "Privacy Policy" },
  },
  // Sub-Issue 2: MMB-470 — DE-Hauptseite (/)
  // Neue Geschäftsseite (mohr-more.biz) gem. Web-Optimierungsplan MMB-468.
  home: {
    nav: {
      leistungen: { de: "Leistungen", en: "Services" },
      vertrauen: { de: "Vertrauen", en: "Trust" },
      referenzen: { de: "Referenzen", en: "Case Studies" },
      kontakt: { de: "Kontakt", en: "Contact" },
      cta: { de: "Beratung anfragen", en: "Request a Consultation" },
    },
    hero: {
      eyebrow: { de: "Beratung · Umsetzung · Wartung in Musterstadt", en: "Consulting · Execution · Maintenance in Sample City" },
      titleLead: { de: "Wir bringen Ihr Geschäft", en: "We move your business" },
      titleAccent: { de: "strukturierter voran.", en: "forward — with structure." },
      subtitle: {
        de: "MOHR & MORE begleitet kleine und mittelständische Unternehmen in Musterstadt und Umgebung mit klarer Beratung, sauberer Umsetzung und verlässlicher Wartung. Drei Wege. Eine Adresse. Antwort innerhalb von 24 Stunden.",
        en: "MOHR & MORE helps small and mid-sized businesses in Sample City and beyond with clear consulting, clean execution, and reliable maintenance. Three paths. One address. Reply within 24 hours.",
      },
      ctaPrimary: { de: "Beratungsgespräch vereinbaren", en: "Book a consultation" },
      ctaSecondary: { de: "Leistungen ansehen", en: "View services" },
      trust1: { de: "DSGVO-konform", en: "GDPR-compliant" },
      trust2: { de: "Antwort binnen 24 h", en: "Reply within 24 h" },
      trust3: { de: "Lokale Verankerung", en: "Locally rooted" },
      heroAlt: { de: "Beratung und Umsetzung für KMU in Musterstadt — MOHR & MORE", en: "Consulting and execution for SMEs in Sample City — MOHR & MORE" },
    },
    logoBar: {
      label: { de: "Vertrauen von", en: "Trusted by" },
    },
    testimonial: {
      title: { de: "Kundenstimme", en: "Customer voice" },
      quote: {
        de: "Mit MOHR & MORE haben wir unseren Verwaltungsaufwand halbiert und gleichzeitig die Kundenzufriedenheit um 18 % gesteigert.",
        en: "MOHR & MORE cut our admin workload in half while lifting customer satisfaction by 18%.",
      },
      name: { de: "Anna Beispiel", en: "Anna Sample" },
      role: { de: "Geschäftsführerin · Beispiel GmbH", en: "Managing Director · Sample Ltd." },
      initials: { de: "AB", en: "AS" },
    },
    services: {
      label: { de: "Leistungen — Vorschau", en: "Services — Preview" },
      title: { de: "Drei Wege zu mehr Klarheit, Geschwindigkeit und Stabilität.", en: "Three paths to more clarity, speed, and stability." },
      intro: {
        de: "Jede Karte folgt demselben Muster: Problem → Lösung → Ergebnis. Klicken Sie weiter, um die Leistung im Detail zu sehen — oder sprechen Sie uns direkt an.",
        en: "Each card follows the same structure: Problem → Solution → Outcome. Click through to see the service in detail — or talk to us directly.",
      },
      problemLabel: { de: "Problem", en: "Problem" },
      solutionLabel: { de: "Lösung", en: "Solution" },
      resultLabel: { de: "Ergebnis", en: "Outcome" },
      cta: { de: "Mehr erfahren", en: "Learn more" },
      items: {
        beratung: {
          title: { de: "Beratung", en: "Consulting" },
          problem: { de: "Unklare Prozesse, wachsende Komplexität, niemand mit Überblick.", en: "Unclear processes, growing complexity, no one with the full picture." },
          solution: { de: "Wir analysieren, strukturieren und priorisieren mit klarem Plan und festen Terminen.", en: "We analyze, structure, and prioritize — with a clear plan and fixed dates." },
          result: { de: "Ein priorisierter Maßnahmenplan, mit dem Sie sofort entscheiden können.", en: "A prioritized action plan you can act on immediately." },
        },
        umsetzung: {
          title: { de: "Umsetzung", en: "Execution" },
          problem: { de: "Ideen bleiben liegen, weil Kapazität, Wissen oder Koordination fehlen.", en: "Ideas stall because capacity, knowledge, or coordination is missing." },
          solution: { de: "Wir setzen um — Website, Tooling, Automatisierung — mit einem festen Team.", en: "We execute — website, tooling, automation — with a fixed team." },
          result: { de: "Ein fertiges, getestetes Ergebnis, das läuft und gemessen wird.", en: "A finished, tested result that runs and gets measured." },
        },
        wartung: {
          title: { de: "Wartung", en: "Maintenance" },
          problem: { de: "Was einmal lief, läuft irgendwann nicht mehr. Updates, Fehler, Sicherheit.", en: "What once worked eventually stops. Updates, errors, security." },
          solution: { de: "Wir beobachten, pflegen, sichern und verbessern — vertraglich festgelegt.", en: "We monitor, maintain, secure, and improve — under a fixed contract." },
          result: { de: "Planbare Kosten, stabile Systeme, weniger Notfälle.", en: "Predictable cost, stable systems, fewer emergencies." },
        },
      },
    },
    trust: {
      label: { de: "Vertrauen — in Zahlen", en: "Trust — in numbers" },
      title: { de: "Fakten, die man nachprüfen kann.", en: "Facts you can verify." },
      items: [
        { value: "120+", label: { de: "Projekte abgeschlossen", en: "Projects delivered" } },
        { value: "98 %", label: { de: "Kunden-Retention", en: "Client retention" } },
        { value: "24 h", label: { de: "Antwortzeit", en: "Response time" } },
        { value: "15+", label: { de: "Jahre Erfahrung", en: "Years of experience" } },
      ],
    },
    footer: {
      brand: {
        de: "Beratung, Umsetzung und Wartung für kleine und mittelständische Unternehmen in Musterstadt und Umgebung.",
        en: "Consulting, execution, and maintenance for small and mid-sized businesses in Sample City and beyond.",
      },
      col1: { de: "Leistungen", en: "Services" },
      col1Item1: { de: "Übersicht", en: "Overview" },
      col1Item2: { de: "Referenzen", en: "Case studies" },
      col1Item3: { de: "Über uns", en: "About us" },
      col1Item4: { de: "Blog", en: "Blog" },
      col2: { de: "Rechtliches", en: "Legal" },
      col2Item1: { de: "Impressum", en: "Legal notice" },
      col2Item2: { de: "Datenschutz", en: "Privacy policy" },
      col2Item3: { de: "AGB", en: "Terms" },
      col3: { de: "Kontakt", en: "Contact" },
      col3Item3: { de: "Kontaktformular", en: "Contact form" },
      rights: { de: "Alle Rechte vorbehalten.", en: "All rights reserved." },
      impressum: { de: "Impressum", en: "Legal notice" },
      privacy: { de: "Datenschutz", en: "Privacy" },
      agb: { de: "AGB", en: "Terms" },
    },
  },

  // Sub-Issue 7: /blog (DE) + globale Komponenten
  blog: {
    navLabel:       { de: "Blog",        en: "Blog" },
    pageTitle:      { de: "Blog — MOHR & MORE", en: "Blog — MOHR & MORE" },
    pageDesc: {
      de: "Vertriebsautomatisierung, Prozessoptimierung und Digitalisierung für KMU. Praxiserfahrung statt Theorie.",
      en: "Sales automation, process optimization and digitization for SMEs. Real-world experience instead of theory.",
    },
    pillar: {
      label:        { de: "Themen-Cluster", en: "Topic Cluster" },
      title:        { de: "Vertriebsautomatisierung für KMU", en: "Sales Automation for SMEs" },
      description: {
        de: "Wie kleine und mittelständische Unternehmen ohne großen IT-Aufwand Vertriebsprozesse automatisieren, qualifizierte Leads generieren und den Umsatz pro Mitarbeiter steigern — ohne dafür ein großes CRM-Projekt starten zu müssen.",
        en: "How small and medium-sized businesses automate sales processes, generate qualified leads and increase revenue per employee without a major IT project.",
      },
      cta:          { de: "Themen-Cluster lesen", en: "Read the cluster" },
    },
    relatedLabel:   { de: "Weitere Artikel",       en: "More articles" },
    readTime:      { de: "Min. Lesezeit",         en: "min read" },
    cards: [
      {
        slug: "crm-einfach-gemacht",
        tag:  { de: "Vertrieb", en: "Sales" },
        title:{ de: "CRM einfach gemacht: 5 Schritte zur automatisierten Lead-Pflege", en: "CRM made easy: 5 steps to automated lead nurturing" },
        desc: {
          de: "Viele KMU scheuen CRM-Systeme wegen der Komplexität. Diese Anleitung zeigt, wie man mit einfachen Mitteln eine funktionierende Lead-Pipeline aufbaut.",
          en: "Many SMEs shy away from CRM systems due to complexity. This guide shows how to build a working lead pipeline with simple means.",
        },
        date:{ de: "8. Juli 2026", en: "July 8, 2026" },
      },
      {
        slug: "ki-im-verkauf",
        tag:  { de: "KI", en: "AI" },
        title:{ de: "KI im Verkauf: Was funktioniert wirklich?", en: "AI in Sales: What actually works?" },
        desc: {
          de: "Ein ehrlicher Blick auf den Einsatz von KI im Vertrieb — zwischen Hype und echter Effizienzsteigerung.",
          en: "An honest look at using AI in sales — between hype and real efficiency gains.",
        },
        date:{ de: "1. Juli 2026", en: "July 1, 2026" },
      },
      {
        slug: "prozesoptimierung-handwerk",
        tag:  { de: "Prozesse", en: "Processes" },
        title:{ de: "Prozessoptimierung im Handwerk: Ein Praxisbericht", en: "Process optimization in trades: A practical report" },
        desc: {
          de: "Wie ein mittelständischer Handwerksbetrieb seine Auftragsplanung von Excel auf ein strukturiertes System umgestellt hat.",
          en: "How a medium-sized trade business switched from Excel to a structured system for order planning.",
        },
        date:{ de: "24. Juni 2026", en: "June 24, 2026" },
      },
      {
        slug: "dsgvo-webseiten-checkliste",
        tag:  { de: "DSGVO", en: "GDPR" },
        title:{ de: "DSGVO-konforme Website: Die vollständige Checkliste", en: "GDPR-compliant website: The complete checklist" },
        desc: {
          de: "Was wirklich auf einer Webseite stimmen muss, damit sie DSGVO-konform ist — ohne teure Berater.",
          en: "What really needs to be right on a website to be GDPR-compliant — without expensive consultants.",
        },
        date:{ de: "17. Juni 2026", en: "June 17, 2026" },
      },
    ],
    // Detail page
    detail: {
      backLabel:     { de: "Zurück zum Blog",    en: "Back to Blog" },
      tocLabel:      { de: "Inhalt",              en: "Contents" },
      shareLabel:    { de: "Teilen",              en: "Share" },
      relatedLabel:  { de: "Ähnliche Artikel",    en: "Related articles" },
    },
    // 404
    notFound: {
      title:         { de: "Seite nicht gefunden", en: "Page not found" },
      subtitle: {
        de: "Diese Seite existiert nicht oder wurde verschoben.",
        en: "This page does not exist or has been moved.",
      },
      searchLabel:   { de: "Seite suchen …",     en: "Search page …" },
      homeLink:      { de: "Zur Startseite",      en: "Go to homepage" },
      blogLink:      { de: "Zum Blog",             en: "Go to Blog" },
      contactLink:   { de: "Kontakt aufnehmen",    en: "Get in contact" },
      contactDesc: {
        de: "Sie haben nicht gefunden, was Sie suchen?",
        en: "Did not find what you were looking for?",
      },
    },
  },

} as const;

export type TranslationKey = keyof typeof translations;
