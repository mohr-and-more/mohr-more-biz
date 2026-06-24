"use client";

import { useLang } from "@/components/i18n-provider";
import { translations, type Lang } from "@/lib/i18n";
import { teamAgents, type TeamAgent } from "@/data/team-agents";
import { useState, useMemo, useEffect, useCallback } from "react";

const STATUS_COLOR: Record<string, string> = {
  active: "#00e676",
  running: "var(--accent)",
  idle: "#868e96",
  error: "#ff5252",
};

function PixelPortrait({ slug, name, size }: { slug: string; name: string; size: number }) {
  return (
    <img
      src={`/team/${slug}.png`}
      alt={`Cryptopunks-Porträt von ${name}`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      style={{ width: size, height: size, imageRendering: "pixelated", display: "block" }}
    />
  );
}

export function TeamPage() {
  const { lang } = useLang();
  const t = translations.team;

  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [level, setLevel] = useState<number | "all">("all");
  const [selected, setSelected] = useState<TeamAgent | null>(null);

  // distinct departments (preserve insertion order from data) + levels present
  const departments = useMemo(() => {
    const seen = new Map<string, { id: string; de: string; en: string; emoji: string }>();
    for (const a of teamAgents) {
      if (!seen.has(a.dept.id)) seen.set(a.dept.id, a.dept);
    }
    return Array.from(seen.values());
  }, []);
  const levels = useMemo(() => Array.from(new Set(teamAgents.map((a) => a.level))).sort((x, y) => x - y), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teamAgents.filter((a) => {
      if (dept !== "all" && a.dept.id !== dept) return false;
      if (level !== "all" && a.level !== level) return false;
      if (q) {
        const hay = `${a.name} ${a.title} ${a.dept.de} ${a.dept.en}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, dept, level]);

  // close modal on ESC + lock scroll
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const resetFilters = useCallback(() => {
    setQuery(""); setDept("all"); setLevel("all");
  }, []);

  return (
    <main className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 pt-20 pb-10 text-center sm:px-6">
        <div
          className="pointer-events-none absolute left-1/2 top-[-30%] h-[500px] w-[500px] -translate-x-1/2 blur-[110px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)", opacity: 0.07 }}
        />
        {/* breadcrumb */}
        <nav className="font-mono mx-auto mb-8 flex max-w-7xl flex-wrap items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.15em]" style={{ color: "var(--text-secondary)" }}>
          <a href="/" className="transition-colors hover:text-text">{t.breadcrumbHome[lang]}</a>
          <span style={{ color: "var(--border)" }}>/</span>
          <a href="/zero-humans" className="transition-colors hover:text-text">Zero Humans</a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--accent)" }}>{translations.nav.team[lang]}</span>
        </nav>
        <div className="label mb-4" style={{ color: "var(--accent)" }}>{t.heroLabel[lang]}</div>
        <h1 className="mb-4" style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)" }}>
          {t.heroTitle1[lang]}<br />
          <span style={{ color: "var(--accent)" }}>{t.heroTitle2[lang]}</span>
        </h1>
        <p className="mx-auto mb-10 max-w-[62ch]" style={{ color: "var(--muted)", fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}>
          {t.heroSub[lang]}
        </p>
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-4">
          {[["272", t.stats.agents[lang]], [String(departments.length), t.stats.depts[lang]], ["5", t.stats.levels[lang]]].map(([num, label]) => (
            <div key={String(label)} className="rounded border px-5 py-3 text-center" style={{ borderColor: "var(--border)", background: "var(--card)", minWidth: "110px" }}>
              <div className="font-heading text-3xl font-extrabold leading-none" style={{ color: "var(--accent)" }}>{num}</div>
              <div className="font-mono mt-1 text-[0.58rem] uppercase tracking-[0.12em]" style={{ color: "var(--text-secondary)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTROLS ── */}
      <section className="sticky top-16 z-30 border-y" style={{ background: "rgba(3,3,3,0.9)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder[lang]}
              aria-label={t.searchPlaceholder[lang]}
              className="font-mono w-full rounded border px-4 py-2 text-sm outline-none transition-colors focus:border-[var(--accent)] lg:max-w-xs"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
            />
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Chip active={dept === "all"} onClick={() => setDept("all")}>{t.filterAll[lang]}</Chip>
              {departments.map((d) => (
                <Chip key={d.id} active={dept === d.id} onClick={() => setDept(dept === d.id ? "all" : d.id)}>
                  <span className="mr-1">{d.emoji}</span>{d[lang]}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Chip active={level === "all"} onClick={() => setLevel("all")}>{t.filterAll[lang]} ({t.levelLabel[lang]})</Chip>
              {levels.map((lv) => (
                <Chip key={lv} active={level === lv} onClick={() => setLevel(level === lv ? "all" : lv)}>
                  {lv}
                </Chip>
              ))}
            </div>
          </div>
          <div className="font-mono mt-3 text-[0.65rem] uppercase tracking-[0.12em]" style={{ color: "var(--text-secondary)" }}>
            {filtered.length} {t.resultsCount[lang]}
            {(query || dept !== "all" || level !== "all") && (
              <button onClick={resetFilters} className="ml-3 underline-offset-2 hover:underline" style={{ color: "var(--accent)" }}>✕ reset</button>
            )}
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-24 text-center" style={{ color: "var(--muted)" }}>{t.empty[lang]}</div>
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))" }}>
              {filtered.map((a) => (
                <button
                  key={a.slug}
                  type="button"
                  onClick={() => setSelected(a)}
                  title={`${a.name} — ${a.title}`}
                  className="group flex flex-col items-center rounded-lg border p-2 text-center transition-all hover:-translate-y-1"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <span className="sr-only">{a.name}</span>
                  <div className="relative">
                    <PixelPortrait slug={a.slug} name={a.name} size={84} />
                    <span
                      className="absolute right-0 top-0 inline-block h-2.5 w-2.5 rounded-full border"
                      title={a.status}
                      style={{ background: STATUS_COLOR[a.status] || STATUS_COLOR.idle, borderColor: "var(--bg)" }}
                    />
                  </div>
                  <div className="mt-1.5 w-full truncate text-[11px] font-semibold leading-tight" style={{ color: "var(--text)" }}>{a.name}</div>
                  <div className="w-full truncate text-[9px] leading-tight" style={{ color: "var(--text-secondary)" }}>{a.dept.emoji} {a.dept[lang]}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER NOTE ── */}
      <section className="border-t py-12 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono mx-auto max-w-[60ch] text-[0.65rem] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {t.footerNote[lang]}
          </p>
        </div>
      </section>

      {/* ── MODAL ── */}
      {selected && <AgentModal agent={selected} lang={lang} onClose={() => setSelected(null)} />}
    </main>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono whitespace-nowrap rounded border px-3 py-1 text-[0.65rem] uppercase tracking-[0.08em] transition-colors"
      style={{
        borderColor: active ? "var(--accent)" : "var(--border)",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        background: active ? "rgba(0,229,255,0.06)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

function AgentModal({ agent, lang, onClose }: { agent: TeamAgent; lang: Lang; onClose: () => void }) {
  const t = translations.team;
  const statusLabel = t.statusLabels[agent.status as keyof typeof t.statusLabels]?.[lang] ?? agent.status;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={agent.name}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-xl border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close[lang]}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors hover:text-text"
          style={{ borderColor: "var(--border)", background: "rgba(3,3,3,0.6)", color: "var(--text-secondary)" }}
        >
          ✕
        </button>

        {/* header band */}
        <div className="flex items-center gap-4 p-6" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="shrink-0 rounded-lg border p-1" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
            <PixelPortrait slug={agent.slug} name={agent.name} size={88} />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading truncate text-2xl font-bold leading-tight" style={{ color: "var(--text)" }}>{agent.name}</h2>
            <div className="font-mono mt-1 text-[0.7rem] uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
              {agent.dept.emoji} {agent.dept[lang]}
            </div>
          </div>
        </div>

        {/* body */}
        <div className="space-y-4 p-6">
          <Row label={t.modalRole[lang]} value={agent.title} />
          <Row label={t.modalDept[lang]} value={`${agent.dept.emoji} ${agent.dept[lang]}`} />
          <Row label={t.modalLevel[lang]} value={agent.levelLabel[lang]} />
          <Row
            label={t.modalStatus[lang]}
            value={
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[agent.status] || STATUS_COLOR.idle }} />
                {statusLabel}
              </span>
            }
          />
          <div>
            <div className="font-mono mb-1 text-[0.6rem] uppercase tracking-[0.12em]" style={{ color: "var(--text-secondary)" }}>
              {lang === "de" ? "Was macht der Agent?" : "What does this agent do?"}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{agent.desc[lang]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="font-mono w-24 shrink-0 text-[0.6rem] uppercase tracking-[0.12em] pt-0.5" style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{value}</div>
    </div>
  );
}
