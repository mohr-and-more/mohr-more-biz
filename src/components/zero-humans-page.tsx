"use client";

import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { useRef, useEffect } from "react";
import { QuotaCard } from "@/components/quota-card";

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className ?? ""}`}>{children}</div>;
}

export function ZeroHumansPage() {
  const { lang } = useLang();
  const t = translations.zeroHumans;

  return (
    <main className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-16 text-center sm:px-6">
        <div
          className="pointer-events-none absolute -right-[10%] -top-[20%] h-[600px] w-[600px] blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.06 }}
        />
        <Reveal>
          <div className="label mb-4" style={{ color: "var(--accent)" }}>
            {t.heroLabel[lang]}
          </div>
          <h1 className="mb-4" style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}>
            {t.heroTitle1[lang]}<br />
            <span style={{ color: "var(--accent)" }}>{t.heroTitle2[lang]}</span><br />
            <span style={{ color: "var(--text-secondary)" }}>{t.heroTitle3[lang]}</span>
          </h1>
          <p
            className="mx-auto mb-12 max-w-[60ch]"
            style={{ color: "var(--muted)", fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
          >
            {t.heroSub[lang]}
          </p>
        </Reveal>
        <Reveal>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              ["272", t.stats.agents[lang]],
              ["15", t.stats.depts[lang]],
              ["28+", t.stats.projects[lang]],
              ["16", t.stats.cSuite[lang]],
              ["24/7", t.stats.autonomous[lang]],
              ["82+", t.stats.models[lang]],
              ["0", t.stats.humans[lang]],
            ].map(([num, label]) => (
              <div
                key={String(num)}
                className="relative overflow-hidden rounded border p-5 text-center"
                style={{ borderColor: "var(--border)", background: "var(--card)", minWidth: "100px" }}
              >
                <div className="font-heading text-4xl font-extrabold leading-none" style={{ color: "var(--accent)" }}>
                  {num}
                </div>
                <div className="font-mono mt-2 text-[0.6rem] uppercase tracking-[0.15em]" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── LIVE QUOTA (MMB-504) — adopted from MiniMax dashboard ── */}
      <section className="py-20" id="live-quota">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <div className="label mb-4" style={{ color: "var(--accent)" }}>
              {t.quota.sectionLabel[lang]}
            </div>
            <h2 className="mb-4">{t.quota.sectionTitle[lang]}</h2>
            <p className="mx-auto mb-12 max-w-[65ch]" style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
              {t.quota.sectionSub[lang]}
            </p>
          </Reveal>
          <Reveal>
            <QuotaCard
              title={t.quota.label[lang]}
              rows={t.quota.rows.map((row) => {
                const r: {
                  label: string;
                  sub?: string;
                  percent?: number;
                  used?: number;
                  max?: number;
                  ariaLabel?: string;
                } = { label: row.label[lang] };
                if (row.sub) r.sub = row.sub[lang];
                const maybePercent = (row as { percent?: unknown }).percent;
                const maybeUsed = (row as { used?: unknown }).used;
                const maybeMax = (row as { max?: unknown }).max;
                if (typeof maybePercent === "number") r.percent = maybePercent;
                if (typeof maybeUsed === "number") r.used = maybeUsed;
                if (typeof maybeMax === "number") r.max = maybeMax;
                if (row.ariaLabel) r.ariaLabel = row.ariaLabel[lang];
                return r;
              })}
            />
          </Reveal>
        </div>
      </section>

      {/* ── POWER GRID ── */}
      <section className="border-t border-b py-20" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <div className="label mb-4" style={{ color: "var(--accent)" }}>
              {lang === "de" ? "Die Null-Menschen-Firma" : "The Zero-Human Company"}
            </div>
            <h2 className="mb-4">{t.powerTitle[lang]}</h2>
            <p className="mx-auto mb-12 max-w-[65ch]" style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
              {t.powerSub[lang]}
            </p>
          </Reveal>
          <Reveal>
            <div
              className="mx-auto grid max-w-[1100px] gap-px border"
              style={{ borderColor: "var(--border)", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
            >
              {t.powerCells.map((cell, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-7 text-center"
                  style={{ background: "var(--bg)" }}
                >
                  <div className="text-4xl">{cell.icon}</div>
                  <h4 className="font-heading text-sm font-bold">{cell.title[lang]}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {cell.desc[lang]}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── VS COMPARISON ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="label mb-4" style={{ color: "var(--accent)" }}>{t.compLabel[lang]}</div>
            <h2 className="mb-4">
              {t.compTitle1[lang]}{" "}
              <span style={{ color: "var(--text-secondary)" }}>{lang === "de" ? "vs." : "vs."}</span>
              <br />
              <span style={{ color: "var(--accent)" }}>{t.compTitle2[lang]}</span>
            </h2>
            <p className="mb-10 max-w-[65ch]" style={{ color: "var(--muted)" }}>
              {t.compSub[lang]}
            </p>
          </Reveal>
          <Reveal>
            <div className="gap-0" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
              {/* Desktop: side by side */}
              <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-stretch">
                <VsColumn
                  lang={lang}
                  title={t.compOld.title[lang]}
                  type={t.compOld.type[lang]}
                  items={t.compOld.items}
                  variant="old"
                />
                <div className="flex items-center justify-center p-4 font-heading text-2xl font-extrabold" style={{ color: "var(--accent)" }}>
                  VS
                </div>
                <VsColumn
                  lang={lang}
                  title={t.compNew.title[lang]}
                  type={t.compNew.type[lang]}
                  items={t.compNew.items}
                  variant="new"
                />
              </div>
              {/* Mobile: stacked */}
              <div className="flex flex-col gap-6 md:hidden">
                <VsColumn
                  lang={lang}
                  title={t.compOld.title[lang]}
                  type={t.compOld.type[lang]}
                  items={t.compOld.items}
                  variant="old"
                />
                <div className="py-4 text-center font-heading text-2xl font-extrabold" style={{ color: "var(--accent)" }}>
                  VS
                </div>
                <VsColumn
                  lang={lang}
                  title={t.compNew.title[lang]}
                  type={t.compNew.type[lang]}
                  items={t.compNew.items}
                  variant="new"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BULLET PROOF ── */}
      <section className="border-t py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="label mb-4" style={{ color: "var(--accent)" }}>{t.bulletLabel[lang]}</div>
            <h2 className="mb-4">
              {t.bulletTitle1[lang]}.{" "}
              <span style={{ color: "var(--accent)" }}>{t.bulletTitle2[lang]}</span>.{" "}
              {t.bulletTitle3[lang]}.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {t.bulletItems.map((item, i) => (
              <Reveal key={i}>
                <div
                  className="flex items-start gap-3 rounded border p-5"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div className="shrink-0 text-3xl">{item.icon}</div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold">{item.title[lang]}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      {item.desc[lang]}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="border-t py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="label mb-4" style={{ color: "var(--accent)" }}>
              {lang === "de" ? "15 Abteilungen" : "15 Departments"}
            </div>
            <h2 className="mb-4">
              {lang === "de" ? "Jede Fähigkeit." : "Every capability."}{" "}
              <span style={{ color: "var(--accent)" }}>{lang === "de" ? "Voll besetzt." : "Fully staffed."}</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {t.depts.map((dept, i) => (
              <Reveal key={i}>
                <div
                  className="rounded border p-5 transition-colors hover:border-[var(--accent)]"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading text-sm font-bold">
                      {dept.emoji} {dept.name[lang]}
                    </h4>
                    <span
                      className="font-mono rounded px-2 py-0.5 text-[0.6rem]"
                      style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}
                    >
                      {dept.count}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {dept.desc[lang]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p
              className="font-mono mb-8 max-w-[55ch] text-sm leading-relaxed"
              style={{ color: "var(--accent)" }}
            >
              &ldquo;{t.footerMsg[lang]}&rdquo;
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "var(--text-secondary)" }}>
              {t.footerCopy[lang]}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

/* ── VS Column component ── */
function VsColumn({
  lang,
  title,
  type,
  items,
  variant,
}: {
  lang: "de" | "en";
  title: string;
  type: string;
  items: readonly { icon: string; text: { de: string; en: string } }[];
  variant: "old" | "new";
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderColor: variant === "new" ? "var(--accent)" : undefined,
        padding: "clamp(1.5rem, 3vw, 2rem)",
      }}
    >
      <h3
        className="font-heading text-lg font-bold"
        style={{ color: variant === "new" ? "var(--accent)" : "var(--accent)", opacity: variant === "old" ? 1 : undefined }}
      >
        {title}
      </h3>
      <div
        className="font-mono mb-5 text-[0.5rem] uppercase tracking-[0.2em]"
        style={{ color: "var(--text-secondary)" }}
      >
        {type}
      </div>
      {items.map((item, i) => (
        <div key={i} className="mb-3 flex items-start gap-2.5 text-sm">
          <span className="mt-0.5 shrink-0 text-base">{item.icon}</span>
          <span className="leading-relaxed" style={{ color: "var(--muted)" }} dangerouslySetInnerHTML={{ __html: item.text[lang] }} />
        </div>
      ))}
    </div>
  );
}
