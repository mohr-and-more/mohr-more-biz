"use client";
import Link from "next/link";
import { useLang } from "@/components/i18n-provider";
import { BLOG_POSTS } from "@/data/blog";

export function BlogPage() {
  const { lang } = useLang();
  return (
    <div style={{ minHeight: "100vh", background: "var(--mm-color-background, #F4F5F6)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px 120px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--mm-color-accent, #E97A2B)",
            marginBottom: 12,
          }}>
            "Blog"
          </span>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            color: "var(--mm-color-text, #1F2A2E)",
            lineHeight: 1.15,
            margin: "0 0 16px",
          }}>
            {lang === "de"
              ? "Einblicke & Perspektiven"
              : "Insights & Perspectives"}
          </h1>
          <p style={{
            fontSize: 18,
            color: "var(--mm-color-muted, #4A555A)",
            margin: 0,
            maxWidth: 560,
          }}>
            {lang === "de"
              ? "KI, Automatisierung und Unternehmertum — fundiert und praxisnah."
              : "AI, automation and entrepreneurship — well-researched and practical."}
          </p>
        </div>

        {/* Post list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {BLOG_POSTS.map((post) => {
            const date = new Date(post.date).toLocaleDateString(
              lang === "de" ? "de-DE" : "en-GB",
              { year: "numeric", month: "long", day: "numeric" }
            );
            return (
              <article
                key={post.slug}
                style={{
                  background: "var(--mm-color-surface, #fff)",
                  border: "1px solid var(--mm-color-border, #E4E7E8)",
                  borderRadius: 12,
                  padding: "28px 32px",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Tags */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--mm-color-primary, #00736F)",
                      background: "rgba(0,115,111,0.08)",
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--mm-color-text, #1F2A2E)",
                  margin: "0 0 12px",
                  lineHeight: 1.3,
                }}>
                  <Link href={`/${lang === "de" ? "blog" : "en/blog"}/${post.slug}`} style={{
                    color: "inherit",
                    textDecoration: "none",
                  }}>
                    {lang === "de" ? post.title : post.titleEn}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p style={{
                  fontSize: 15,
                  color: "var(--mm-color-muted, #4A555A)",
                  lineHeight: 1.65,
                  margin: "0 0 16px",
                }}>
                  {lang === "de" ? post.excerpt : post.excerptEn}
                </p>

                {/* Meta */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  fontSize: 13,
                  color: "var(--mm-color-faint, #6B7479)",
                }}>
                  <span>{post.author}</span>
                  <span>&middot;</span>
                  <span>{date}</span>
                  <span>&middot;</span>
                  <span>{post.readTime} min</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
