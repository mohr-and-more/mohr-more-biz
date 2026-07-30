/** MOHR & MORE Blog Data */
export interface BlogPost {
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  date: string;
  author: string;
  authorRole: string;
  tags: string[];
  readTime: number;
}
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "zero-human-company-2026",
    title: "Zero-Human Company 2026: Was bedeutet das für Ihr Unternehmen?",
    titleEn: "Zero-Human Company 2026: What Does This Mean for Your Business?",
    excerpt: "Das Konzept der Zero-Human Company klingt radikal — ist es aber nicht. Wir erklären, wie autonome KI-Systeme Geschäftsmodelle verändern und warum jetzt der richtige Zeitpunkt ist.",
    excerptEn: "The concept of a Zero-Human Company sounds radical — but it isn't. We explain how autonomous AI systems are changing business models.",
    date: "2026-07-15",
    author: "Gregor Mohr",
    authorRole: "CEO & Co-Founder",
    tags: ["Zero-Human", "KI", "Unternehmensstrategie"],
    readTime: 7,
  },
  {
    slug: "ki-agenten-im-mittelstand",
    title: "KI-Agenten im Mittelstand: Praxisbericht aus 6 Monaten Betrieb",
    titleEn: "AI Agents in SMEs: 6-Month Operations Report",
    excerpt: "Sechs Monate nach Einführung unseres KI-Agentensystems ziehen wir Bilanz. Was funktioniert, was braucht Nachbesserung?",
    excerptEn: "Six months after introducing our AI agent system, we're taking stock. What works, what needs adjustment?",
    date: "2026-06-20",
    author: "Gunnar Mohr",
    authorRole: "CTO & Co-Founder",
    tags: ["KI-Agenten", "Mittelstand", "Praxisbericht"],
    readTime: 9,
  },
  {
    slug: "automatisierung-ohne-jobverlust",
    title: "Automatisierung ohne Jobverlust: Ein Widerspruch?",
    titleEn: "Automation Without Job Loss: A Contradiction?",
    excerpt: "Die Angst vor Arbeitsplatzverlust durch KI ist real — aber sie verstellt den Blick auf die eigentliche Chance.",
    excerptEn: "The fear of job loss due to AI is real — but it blinds us to the real opportunity.",
    date: "2026-05-10",
    author: "Gregor Mohr",
    authorRole: "CEO & Co-Founder",
    tags: ["Automatisierung", "Zukunft der Arbeit", "KI"],
    readTime: 6,
  },
];
