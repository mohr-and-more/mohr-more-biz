export type Lang = "de" | "en";

export const translations = {
  nav: {
    position: { de: "Position", en: "Positioning" },
    system: { de: "System", en: "System" },
    principles: { de: "Prinzipien", en: "Principles" },
    vision: { de: "Vision", en: "Vision" },
    contact: { de: "Kontakt", en: "Contact" },
    login: { de: "Login", en: "Login" },
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
        { de: "LazyCode⋮Cologne — Full-Stack Entwicklung & Umsetzung", en: "LazyCode⋮Cologne — Full-Stack Development & Execution" },
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
  footer: {
    copyright: { de: "© 2026 MOHR & MORE BUSINESS. All systems operational.", en: "© 2026 MOHR & MORE BUSINESS. All systems operational." },
    impressum: { de: "Impressum", en: "Legal Notice" },
    privacy: { de: "Datenschutz", en: "Privacy Policy" },
  },
} as const;

export type TranslationKey = keyof typeof translations;
