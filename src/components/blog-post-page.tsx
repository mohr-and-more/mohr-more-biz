import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import type { BlogArticle } from "@/data/blog-articles";
import type { Lang } from "@/lib/i18n";

/**
 * Shared article renderer for `/blog/[slug]` and `/en/blog/[slug]`.
 *
 * Deliberately a server component with an explicit `lang` prop: the full
 * article text must be present in the exported HTML, in the language of the
 * route, without any client-side switch.
 */

const COPY = {
  de: {
    back: "← Zurück zum Blog",
    by: "von",
    min: "Min. Lesezeit",
    otherLang: "Read this article in English",
    otherLangHrefAttr: "en",
    conclusion: "Fazit",
    ctaLabel: "Kontakt aufnehmen",
  },
  en: {
    back: "← Back to the blog",
    by: "by",
    min: "min read",
    otherLang: "Diesen Artikel auf Deutsch lesen",
    otherLangHrefAttr: "de",
    conclusion: "Conclusion",
    ctaLabel: "Get in touch",
  },
} as const;

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul
        key={key}
        style={{
          margin: "0 0 18px",
          paddingLeft: 22,
          color: "var(--mm-color-muted, #4A555A)",
          fontSize: 17,
          lineHeight: 1.75,
        }}
      >
        {bullets.map((item, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            {item}
          </li>
        ))}
      </ul>
    );
    bullets = [];
  };

  paragraphs.forEach((paragraph, index) => {
    if (paragraph.startsWith("• ")) {
      bullets.push(paragraph.slice(2));
      return;
    }
    flushBullets(`ul-${index}`);
    blocks.push(
      <p
        key={index}
        style={{
          margin: "0 0 18px",
          color: "var(--mm-color-muted, #4A555A)",
          fontSize: 17,
          lineHeight: 1.75,
        }}
      >
        {paragraph}
      </p>
    );
  });
  flushBullets("ul-end");

  return <>{blocks}</>;
}

export function BlogPostPage({
  post,
  article,
  lang,
}: {
  post: BlogPost;
  article: BlogArticle;
  lang: Lang;
}) {
  const copy = COPY[lang];
  const summary = post.locales[lang];
  const otherLang: Lang = lang === "de" ? "en" : "de";
  const otherHref = `/${otherLang === "de" ? "blog" : "en/blog"}/${post.slug}`;
  const indexHref = lang === "de" ? "/blog" : "/en/blog";
  const date = new Date(post.date).toLocaleDateString(
    lang === "de" ? "de-DE" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--mm-color-background, #F4F5F6)" }}>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 120px" }}>
        <Link
          href={indexHref}
          style={{
            display: "inline-block",
            marginBottom: 32,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--mm-color-primary, #00736F)",
            textDecoration: "none",
          }}
        >
          {copy.back}
        </Link>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {post.tags[lang].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--mm-color-primary, #00736F)",
                background: "rgba(0,115,111,0.08)",
                padding: "3px 8px",
                borderRadius: 4,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1
          style={{
            fontSize: "clamp(30px, 4.5vw, 44px)",
            fontWeight: 800,
            color: "var(--mm-color-text, #1F2A2E)",
            lineHeight: 1.18,
            margin: "0 0 20px",
          }}
        >
          {summary.title}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            color: "var(--mm-color-faint, #6B7479)",
            marginBottom: 12,
          }}
        >
          <span>
            {copy.by} {post.author} · {post.authorRole}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>{date}</span>
          <span aria-hidden="true">&middot;</span>
          <span>
            {post.readTime} {copy.min}
          </span>
        </div>

        <p style={{ margin: "0 0 40px", fontSize: 13 }}>
          <a
            href={otherHref}
            hrefLang={copy.otherLangHrefAttr}
            rel="alternate"
            style={{ color: "var(--mm-color-primary, #00736F)", fontWeight: 600, textDecoration: "none" }}
          >
            {copy.otherLang}
          </a>
        </p>

        <div
          style={{
            paddingBottom: 8,
            borderBottom: "1px solid var(--mm-color-border, #E4E7E8)",
            marginBottom: 32,
          }}
        >
          {article.intro.map((paragraph, index) => (
            <p
              key={index}
              style={{
                margin: "0 0 18px",
                color: "var(--mm-color-text, #1F2A2E)",
                fontSize: 19,
                lineHeight: 1.7,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {article.sections.map((section) => (
          <section key={section.heading} style={{ marginBottom: 36 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--mm-color-text, #1F2A2E)",
                lineHeight: 1.3,
                margin: "0 0 16px",
              }}
            >
              {section.heading}
            </h2>
            <Paragraphs paragraphs={section.paragraphs} />
          </section>
        ))}

        <section
          aria-labelledby="article-conclusion"
          style={{
            background: "var(--mm-color-surface, #fff)",
            border: "1px solid var(--mm-color-border, #E4E7E8)",
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 32,
          }}
        >
          <h2
            id="article-conclusion"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--mm-color-text, #1F2A2E)",
              margin: "0 0 12px",
            }}
          >
            {copy.conclusion}
          </h2>
          <p
            style={{
              margin: 0,
              color: "var(--mm-color-muted, #4A555A)",
              fontSize: 17,
              lineHeight: 1.75,
            }}
          >
            {article.conclusion}
          </p>
        </section>

        <div
          style={{
            background: "rgba(0,115,111,0.06)",
            border: "1px solid rgba(0,115,111,0.18)",
            borderRadius: 12,
            padding: "28px 32px",
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              color: "var(--mm-color-text, #1F2A2E)",
              fontSize: 17,
              lineHeight: 1.7,
            }}
          >
            {article.cta.text}
          </p>
          <Link
            href={article.cta.href}
            style={{
              display: "inline-block",
              background: "var(--mm-color-primary, #00736F)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              padding: "12px 22px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            {article.cta.label || copy.ctaLabel}
          </Link>
        </div>
      </article>
    </div>
  );
}
