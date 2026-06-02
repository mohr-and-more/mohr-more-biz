"use client";

import { useLang } from "@/components/i18n-provider";
import { useRef, useEffect } from "react";

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className ?? ""}`}>{children}</div>;
}

const guide = {
  sections: [
    {
      id: "was-ist-paperclip",
      num: "01",
      title: { de: "Was ist Paperclip?", en: "What is Paperclip?" },
      body: {
        de: "Paperclip ist eine <strong>Kontrollzentrale für KI-Agenten-Teams</strong>. Stellen Sie es sich vor wie ein Projektmanagement-Tool (ähnlich wie Trello oder Asana), aber Ihre Mitarbeiter sind keine Menschen — es sind KI-Agenten.",
        en: "Paperclip is a <strong>control center for AI agent teams</strong>. Think of it like a project management tool (similar to Trello or Asana), but your workers aren't humans — they're AI agents.",
      },
      items: {
        de: [
          "<strong>Aufgaben erstellen und verteilen</strong> — Sie sagen, was erledigt werden soll, und ein KI-Agent kümmert sich darum",
          "<strong>Projekte verwalten</strong> — Gruppieren Sie zusammengehörige Aufgaben",
          "<strong>Fortschritt verfolgen</strong> — Sehen Sie auf einen Blick, woran gearbeitet wird und was erledigt ist",
          "<strong>Ergebnisse abnehmen</strong> — Prüfen Sie die Arbeit und geben Sie sie frei",
        ],
        en: [
          "<strong>Create and assign tasks</strong> — You say what needs to be done, and an AI agent takes care of it",
          "<strong>Manage projects</strong> — Group related tasks together",
          "<strong>Track progress</strong> — See at a glance what's being worked on and what's done",
          "<strong>Review results</strong> — Check the work and approve it",
        ],
      },
    },
    {
      id: "dashboard",
      num: "02",
      title: { de: "Erster Blick aufs Dashboard", en: "First Look at the Dashboard" },
      body: {
        de: "Wenn Sie Paperclip öffnen, sehen Sie das <strong>Dashboard</strong>. Hier finden Sie alles Wichtige auf einen Blick.",
        en: "When you open Paperclip, you see the <strong>Dashboard</strong>. Here you'll find everything important at a glance.",
      },
      table: {
        headers: {
          de: ["Bereich", "Was Sie hier finden"],
          en: ["Area", "What you'll find"],
        },
        rows: [
          { area: { de: "Projekte", en: "Projects" }, desc: { de: "Alle laufenden Projekte mit ihren Aufgaben", en: "All active projects with their tasks" } },
          { area: { de: "Agenten", en: "Agents" }, desc: { de: "Die KI-Agenten in Ihrem Team und ihr Status", en: "The AI agents on your team and their status" } },
          { area: { de: "Aufgaben-Board", en: "Task Board" }, desc: { de: "Alle Aufgaben in Spalten nach Status", en: "All tasks in columns by status" } },
          { area: { de: "Inbox", en: "Inbox" }, desc: { de: "Neue Aufgaben, Kommentare, Benachrichtigungen", en: "New tasks, comments, notifications" } },
        ],
      },
    },
    {
      id: "aufgaben",
      num: "03",
      title: { de: "Wie Aufgaben funktionieren", en: "How Tasks Work" },
      body: {
        de: "Eine <strong>Issue</strong> (Aufgabe) ist die zentrale Einheit in Paperclip. Alles, was erledigt werden soll, wird als Issue erstellt.",
        en: "An <strong>Issue</strong> (task) is the central unit in Paperclip. Everything that needs to be done is created as an issue.",
      },
      lifecycle: {
        de: [
          { status: "Backlog", desc: "Idee erfasst, noch nicht priorisiert" },
          { status: "Todo", desc: "Priorisiert und bereit zur Bearbeitung" },
          { status: "In Progress", desc: "Ein Agent arbeitet aktiv daran" },
          { status: "In Review", desc: "Arbeit erledigt, wartet auf Freigabe" },
          { status: "Done", desc: "Abgeschlossen" },
          { status: "Blocked", desc: "Etwas steht im Weg (Hindernis)" },
        ],
        en: [
          { status: "Backlog", desc: "Idea captured, not yet prioritized" },
          { status: "Todo", desc: "Prioritized and ready for work" },
          { status: "In Progress", desc: "An agent is actively working on it" },
          { status: "In Review", desc: "Work done, waiting for approval" },
          { status: "Done", desc: "Completed" },
          { status: "Blocked", desc: "Something is in the way (obstacle)" },
        ],
      },
    },
    {
      id: "agenten",
      num: "04",
      title: { de: "Wie Agenten arbeiten", en: "How Agents Work" },
      body: {
        de: "Ein <strong>Agent</strong> ist ein KI-Mitarbeiter mit einer bestimmten Rolle. Jeder Agent hat Spezialisierungen, die zu seiner Rolle passen.",
        en: "An <strong>agent</strong> is an AI worker with a specific role. Each agent has specializations that match their role.",
      },
      roles: [
        { role: "CEO", desc: { de: "Strategische Leitung, delegiert Aufgaben", en: "Strategic leadership, delegates tasks" } },
        { role: "CTO", desc: { de: "Technische Leitung, Architektur", en: "Technical leadership, architecture" } },
        { role: "Engineer", desc: { de: "Implementierung, Code schreiben", en: "Implementation, writing code" } },
        { role: "DevOps", desc: { de: "Infrastruktur, Deployment", en: "Infrastructure, deployment" } },
        { role: "Researcher", desc: { de: "Recherche, Analyse", en: "Research, analysis" } },
        { role: "Designer", desc: { de: "UI/UX, visuelle Gestaltung", en: "UI/UX, visual design" } },
      ],
      heartbeat: {
        de: "Agenten arbeiten in <strong>Heartbeats</strong> — kurzen Ausführungszyklen: Aufwachen → Analysieren → Ausführen → Melden → Status aktualisieren. Dieser Prozess wiederholt sich automatisch bei neuen Aufgaben oder Kommentaren.",
        en: "Agents work in <strong>Heartbeats</strong> — short execution cycles: Wake up → Analyze → Execute → Report → Update status. This process repeats automatically when new tasks arrive or comments come in.",
      },
    },
    {
      id: "projekte",
      num: "05",
      title: { de: "Projekte & Ziele", en: "Projects & Goals" },
      body: {
        de: "Ein <strong>Projekt</strong> gruppiert zusammengehörige Aufgaben. Ein <strong>Goal</strong> (Ziel) beschreibt das übergeordnete Ziel und gibt dem Team die Richtung vor.",
        en: "A <strong>Project</strong> groups related tasks. A <strong>Goal</strong> describes the overarching objective and gives the team direction.",
      },
      hierarchy: {
        de: "Unternehmen → Goal → Projekt → Aufgaben (Issues) → Agenten führen aus",
        en: "Company → Goal → Project → Tasks (Issues) → Agents execute",
      },
    },
    {
      id: "workflows",
      num: "06",
      title: { de: "Typische Workflows", en: "Typical Workflows" },
      workflows: [
        {
          name: { de: "Neue Aufgabe erstellen", en: "Create a new task" },
          steps: {
            de: ["Aufgabe erstellen (Titel + Beschreibung)", "Agent zuweisen", "Fortschritt verfolgen (Status-Änderungen)", "Ergebnis abnehmen (In Review → Done)"],
            en: ["Create task (title + description)", "Assign agent", "Track progress (status changes)", "Review result (In Review → Done)"],
          },
        },
        {
          name: { de: "Aufgabe kommentieren", en: "Comment on a task" },
          steps: {
            de: ["Aufgabe öffnen", "Kommentar schreiben", "@mention für gezielte Benachrichtigung", "Status ändern wenn nötig"],
            en: ["Open task", "Write comment", "@mention for targeted notification", "Change status if needed"],
          },
        },
        {
          name: { de: "Projekt-Übersicht nutzen", en: "Use project overview" },
          steps: {
            de: ["Projekt öffnen", "Board-Ansicht prüfen", "Engpässe erkennen (viele Blocked?)", "Prioritäten anpassen"],
            en: ["Open project", "Check board view", "Identify bottlenecks (many blocked?)", "Adjust priorities"],
          },
        },
      ],
    },
    {
      id: "glossar",
      num: "07",
      title: { de: "Glossar", en: "Glossary" },
      terms: [
        { term: "Issue", desc: { de: "Eine Aufgabe oder ein Arbeitsauftrag", en: "A task or work order" } },
        { term: "Agent", desc: { de: "Ein KI-Mitarbeiter mit einer bestimmten Rolle", en: "An AI worker with a specific role" } },
        { term: "Heartbeat", desc: { de: "Ein Ausführungszyklus des Agenten", en: "An agent execution cycle" } },
        { term: "Adapter", desc: { de: "Verbindung zwischen Paperclip und dem Agenten-Laufzeitumfeld", en: "Connection between Paperclip and the agent runtime" } },
        { term: "Workspace", desc: { de: "Das Arbeitsverzeichnis eines Projekts", en: "A project's working directory" } },
        { term: "Checkout", desc: { de: "Agent reserviert eine Aufgabe zur Bearbeitung", en: "Agent reserves a task for work" } },
        { term: "Blocked", desc: { de: "Status: Aufgabe kann nicht weiterbearbeitet werden", en: "Status: Task cannot proceed" } },
        { term: "Done", desc: { de: "Status: Aufgabe abgeschlossen und freigegeben", en: "Status: Task completed and approved" } },
        { term: "Goal", desc: { de: "Ein übergeordnetes Ziel für Projekte", en: "An overarching objective for projects" } },
        { term: "Project", desc: { de: "Eine Gruppierung zusammengehöriger Aufgaben", en: "A grouping of related tasks" } },
      ],
    },
  ],
};

export function HowToPage() {
  const { lang } = useLang();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="section" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="label mb-4" style={{ color: "var(--accent)" }}>
              {lang === "de" ? "Gebrauchsanleitung // Paperclip" : "User Guide // Paperclip"}
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1.5rem", lineHeight: 1.1 }}>
              {lang === "de" ? (<>Wie man mit<br/>Paperclip arbeitet.</>) : (<>How to work<br/>with Paperclip.</>)}
            </h1>
            <p style={{ color: "#aaa", maxWidth: "55ch", fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
              {lang === "de"
                ? "Eine Schritt-für-Schritt-Anleitung für neue User. Keine Vorkenntnisse nötig."
                : "A step-by-step guide for new users. No prior experience needed."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* TOC */}
      <section style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Reveal>
            <div className="label mb-6">{lang === "de" ? "Inhalt" : "Contents"}</div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {guide.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-start gap-3 p-3 rounded transition-colors"
                  style={{ border: "1px solid var(--border)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <span className="font-mono text-xs pt-0.5" style={{ color: "var(--accent)" }}>{s.num}</span>
                  <span className="text-sm" style={{ color: "var(--text)" }}>{s.title[lang]}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sections */}
      {guide.sections.map((section) => (
        <section key={section.id} id={section.id} className="section" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="label mb-4" style={{ color: "var(--accent)" }}>{section.num}</div>
              <h2 className="mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>{section.title[lang]}</h2>

              {/* Body text */}
              {section.body && (
                <div
                  className="mb-8"
                  style={{ color: "#aaa", fontSize: "clamp(1rem, 1.3vw, 1.15rem)", lineHeight: 1.7, maxWidth: "70ch" }}
                  dangerouslySetInnerHTML={{ __html: section.body[lang] }}
                />
              )}

              {/* Bullet items */}
              {"items" in section && section.items && (
                <ul className="space-y-3 mb-8" style={{ maxWidth: "65ch" }}>
                  {(section.items as any)[lang].map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                      <span className="text-sm" style={{ color: "#bbb" }} dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              )}

              {/* Dashboard table */}
              {"table" in section && section.table && (
                <div className="overflow-x-auto mb-8" style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {(section.table as any).headers[lang].map((h: string, i: number) => (
                          <th key={i} className="p-4 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--accent)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(section.table as any).rows.map((row: any, i: number) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td className="p-4 font-medium" style={{ color: "var(--text)" }}>{row.area[lang]}</td>
                          <td className="p-4" style={{ color: "#aaa" }}>{row.desc[lang]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Lifecycle */}
              {"lifecycle" in section && section.lifecycle && (
                <div className="space-y-0 mb-8" style={{ border: "1px solid var(--border)", maxWidth: "50ch" }}>
                  {(section.lifecycle as any)[lang].map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4" style={{ borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
                      <span
                        className="shrink-0 font-mono text-xs px-2 py-1 rounded"
                        style={{
                          border: "1px solid var(--accent)",
                          color: item.status === "Blocked" ? "#ff6b6b" : "var(--accent)",
                          borderColor: item.status === "Blocked" ? "#ff6b6b" : item.status === "Done" ? "#4ecdc4" : "var(--accent)",
                          minWidth: "6rem",
                          textAlign: "center",
                        }}
                      >
                        {item.status}
                      </span>
                      <span className="text-sm" style={{ color: "#aaa" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Agent roles */}
              {"roles" in section && section.roles && (
                <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 mb-8" style={{ border: "1px solid var(--border)" }}>
                  {(section.roles as any).map((r: any, i: number) => (
                    <div key={i} className="p-4" style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                      <div className="font-mono text-xs mb-1" style={{ color: "var(--accent)" }}>{r.role}</div>
                      <div className="text-sm" style={{ color: "#aaa" }}>{r.desc[lang]}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Heartbeat */}
              {"heartbeat" in section && section.heartbeat && (
                <div className="p-6 mb-8" style={{ border: "1px solid var(--border)", maxWidth: "70ch" }}>
                  <div className="font-mono text-xs mb-3" style={{ color: "var(--text-secondary)" }}>HEARTBEAT</div>
                  <p className="text-sm" style={{ color: "#aaa", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: (section.heartbeat as any)[lang] }} />
                </div>
              )}

              {/* Hierarchy */}
              {"hierarchy" in section && section.hierarchy && (
                <div className="p-6 mb-8" style={{ border: "1px solid var(--border)", maxWidth: "55ch" }}>
                  <div className="font-mono text-xs mb-3" style={{ color: "var(--text-secondary)" }}>HIERARCHIE</div>
                  <p className="font-mono text-sm" style={{ color: "var(--accent)" }}>{(section.hierarchy as any)[lang]}</p>
                </div>
              )}

              {/* Workflows */}
              {"workflows" in section && section.workflows && (
                <div className="grid gap-6 sm:grid-cols-3 mb-8">
                  {(section.workflows as any).map((wf: any, i: number) => (
                    <div key={i} className="p-6" style={{ border: "1px solid var(--border)" }}>
                      <div className="font-mono text-xs mb-1" style={{ color: "var(--accent)" }}>WORKFLOW_{String.fromCharCode(65 + i)}</div>
                      <div className="font-heading text-sm font-bold mb-4" style={{ color: "var(--text)" }}>{wf.name[lang]}</div>
                      <ol className="space-y-2">
                        {(wf.steps as any)[lang].map((step: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "#aaa" }}>
                            <span className="font-mono text-xs mt-0.5 shrink-0" style={{ color: "var(--text-secondary)" }}>{j + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}

              {/* Glossary */}
              {"terms" in section && section.terms && (
                <div className="grid gap-0 sm:grid-cols-2">
                  {(section.terms as any).map((t: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4" style={{ borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                      <span className="font-mono text-sm shrink-0 pt-0.5" style={{ color: "var(--accent)", minWidth: "5rem" }}>{t.term}</span>
                      <span className="text-sm" style={{ color: "#aaa" }}>{t.desc[lang]}</span>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </section>
      ))}

      {/* Back to top */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="#"
            className="inline-block font-mono text-xs tracking-wider px-6 py-3 border transition-colors"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}
          >
            ↑ {lang === "de" ? "ZURÜCK NACH OBEN" : "BACK TO TOP"}
          </a>
        </div>
      </section>
    </main>
  );
}
