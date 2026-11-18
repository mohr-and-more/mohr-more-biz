/**
 * MOHR & MORE Blog — Übersichtsdaten (DE + EN).
 *
 * `BLOG_POSTS` ist die gemeinsame Quelle für Blogkarten, Detailrouten und
 * Sitemap. Die vollständigen Artikeltexte liegen in `blog-articles.ts`, damit
 * die Blog-Übersicht (Client-Komponente) nicht den kompletten Artikeltext in
 * ihr JS-Bundle zieht.
 */

export interface BlogLocaleSummary {
  title: string;
  excerpt: string;
}

export interface BlogPost {
  slug: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: number;
  tags: { de: string[]; en: string[] };
  locales: { de: BlogLocaleSummary; en: BlogLocaleSummary };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "zero-human-company-2026",
    date: "2026-07-15",
    author: "Gregor Mohr",
    authorRole: "CEO & Co-Founder",
    readTime: 7,
    tags: {
      de: ["Zero-Human", "KI", "Unternehmensstrategie"],
      en: ["Zero-Human", "AI", "Business Strategy"],
    },
    locales: {
      de: {
        title: "Zero-Human Company 2026: Was bedeutet das für Ihr Unternehmen?",
        excerpt:
          "Das Konzept der Zero-Human Company klingt radikal — ist es aber nicht. Wir erklären, wie autonome KI-Systeme Geschäftsmodelle verändern und warum jetzt der richtige Zeitpunkt ist.",
      },
      en: {
        title: "Zero-Human Company 2026: What Does This Mean for Your Business?",
        excerpt:
          "The concept of a Zero-Human Company sounds radical — but it isn’t. We explain how autonomous AI systems are changing business models and why now is the right moment.",
      },
    },
  },
  {
    slug: "ki-agenten-im-mittelstand",
    date: "2026-06-20",
    author: "Gunnar Mohr",
    authorRole: "CTO & Co-Founder",
    readTime: 9,
    tags: {
      de: ["KI-Agenten", "Mittelstand", "Praxisbericht"],
      en: ["AI Agents", "SME", "Field Report"],
    },
    locales: {
      de: {
        title: "KI-Agenten im Mittelstand: Erfahrungen aus unserem internen Betrieb",
        excerpt:
          "Seit 2024 betreiben wir unsere eigene Firma als Testfeld für KI-Agenten. Was funktioniert hat, was nicht — und was Mittelständler daraus mitnehmen können.",
      },
      en: {
        title: "AI Agents for SMEs: What We Learned from Running Them Internally",
        excerpt:
          "Since 2024 we have been running our own company as a test bed for AI agents. What worked, what didn’t — and what SMEs can take away from it.",
      },
    },
  },
  {
    slug: "automatisierung-ohne-jobverlust",
    date: "2026-05-10",
    author: "Gregor Mohr",
    authorRole: "CEO & Co-Founder",
    readTime: 6,
    tags: {
      de: ["Automatisierung", "Zukunft der Arbeit", "KI"],
      en: ["Automation", "Future of Work", "AI"],
    },
    locales: {
      de: {
        title: "Automatisierung ohne Jobverlust: Ein Widerspruch?",
        excerpt:
          "Die Angst vor Arbeitsplatzverlust durch KI ist real — aber sie verstellt den Blick auf die eigentliche Chance.",
      },
      en: {
        title: "Automation Without Job Loss: A Contradiction?",
        excerpt:
          "The fear of job loss due to AI is real — but it obscures the actual opportunity.",
      },
    },
  },
];

/** Alle exportierbaren Artikel-Slugs, abgeleitet aus den Artikeldaten. */
export const BLOG_SLUGS: string[] = BLOG_POSTS.map((post) => post.slug);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
