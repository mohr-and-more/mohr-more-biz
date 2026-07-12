"use client";

import { teamAgents, type TeamAgent } from "@/data/team-agents";
import { useState, useMemo, useCallback } from "react";

/* ── Types ───────────────────────────────────────────── */
interface Floor {
  level: number;
  label: string;
  agents: TeamAgent[];
  bigOffice?: boolean;
}

/* ── Config ──────────────────────────────────────────── */
const ROOMS_PER_FLOOR = 10;

const LEVEL_META: Record<number, { label: string; color: string }> = {
  0: { label: "Ebene 0 · Geschäftsführung", color: "var(--accent)" },
  1: { label: "Ebene 1 · C-Level", color: "#c7b2ff" },
  2: { label: "Ebene 2 · Direktion", color: "#8fc6ff" },
  3: { label: "Ebene 3 · Team", color: "#9ff8f2" },
  4: { label: "Ebene 4 · Ausführung", color: "#7ceee6" },
};

/* ── Helpers ─────────────────────────────────────────── */
function buildFloors(): Floor[] {
  // Group agents by level
  const byLevel = new Map<number, TeamAgent[]>();
  for (const a of teamAgents) {
    if (!byLevel.has(a.level)) byLevel.set(a.level, []);
    byLevel.get(a.level)!.push(a);
  }

  const floors: Floor[] = [];

  // Process levels bottom-to-top: 4, 3, 2, 1, 0
  // So level 0 (KALi) ends up at the top
  const sortedLevels = Array.from(byLevel.keys()).sort((a, b) => b - a);

  for (const level of sortedLevels) {
    const agents = byLevel.get(level)!;
    const meta = LEVEL_META[level] || LEVEL_META[4];

    if (level === 0) {
      // KALi — single big office at the top
      floors.push({
        level,
        label: meta.label,
        agents,
        bigOffice: true,
      });
      continue;
    }

    // Chunk agents into floors of ROOMS_PER_FLOOR
    for (let i = 0; i < agents.length; i += ROOMS_PER_FLOOR) {
      const chunk = agents.slice(i, i + ROOMS_PER_FLOOR);
      floors.push({
        level,
        label: meta.label,
        agents: chunk,
      });
    }
  }

  return floors;
}

/* ── Status colors ───────────────────────────────────── */
const STATUS_GLOW: Record<string, string> = {
  active: "rgba(0, 229, 118, 0.4)",
  running: "rgba(159, 248, 242, 0.5)",
  idle: "transparent",
  error: "rgba(255, 82, 82, 0.3)",
};

const STATUS_LIGHT: Record<string, string> = {
  active: "#00e676",
  running: "#9ff8f2",
  idle: "#1a1a1e",
  error: "#ff5252",
};

function isLit(status: string): boolean {
  return status === "active" || status === "running";
}

/* ── Sub-Components ──────────────────────────────────── */

function NeonSign() {
  return (
    <div
      className="skyscraper-neon"
      style={{
        textAlign: "center",
        padding: "8px 0 12px",
        fontFamily: "var(--font-heading)",
        fontWeight: 900,
        fontSize: "clamp(1.2rem, 3vw, 2.4rem)",
        letterSpacing: "0.08em",
        color: "#9ff8f2",
        textShadow:
          "0 0 4px #9ff8f2, 0 0 10px #9ff8f2, 0 0 20px rgba(159,248,242,0.6), 0 0 40px rgba(159,248,242,0.3)",
        animation: "neonFlicker 4s ease-in-out infinite",
        userSelect: "none",
      }}
    >
      MOHR &amp; MORE
    </div>
  );
}

function Room({ agent }: { agent: TeamAgent }) {
  const [hovered, setHovered] = useState(false);
  const lit = isLit(agent.status);
  const lightColor = STATUS_LIGHT[agent.status] || STATUS_LIGHT.idle;
  const glow = STATUS_GLOW[agent.status] || "transparent";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${agent.name} — ${agent.title}`}
      className="skyscraper-room"
      style={{
        position: "relative",
        background: lit
          ? `linear-gradient(180deg, ${lightColor}22 0%, ${lightColor}08 100%)`
          : "#0a0a0c",
        borderRight: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "2px",
        boxShadow: lit ? `inset 0 0 12px ${glow}` : "none",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
      }}
    >
      {/* Window cross frame */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "1px",
          height: "100%",
          background: "rgba(255,255,255,0.03)",
          pointerEvents: "none",
        }}
      />

      {/* Desk silhouette (pixel-art style) */}
      {lit && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "20%",
            background: "rgba(255,255,255,0.06)",
            borderTop: "2px solid rgba(255,255,255,0.1)",
          }}
        />
      )}

      {/* Cryptopunk avatar head */}
      {lit && (
        <img
          src={`/team/${agent.slug}.png`}
          alt={agent.name}
          width={24}
          height={24}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="skyscraper-agent"
          style={{
            width: "55%",
            height: "auto",
            maxWidth: 28,
            maxHeight: 28,
            imageRendering: "pixelated",
            display: "block",
            position: "relative",
            zIndex: 2,
            filter: `drop-shadow(0 0 4px ${glow})`,
            animation: `agentBob ${2 + (agent.slug.length % 4) * 0.3}s ease-in-out infinite`,
            animationDelay: `${(agent.slug.charCodeAt(0) % 10) * 0.15}s`,
          }}
        />
      )}

      {/* Status indicator dot */}
      <span
        style={{
          position: "absolute",
          top: 2,
          right: 2,
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: lightColor,
          boxShadow: lit ? `0 0 4px ${lightColor}` : "none",
          opacity: lit ? 1 : 0.3,
        }}
      />

      {/* Hover tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            background: "rgba(5,5,5,0.95)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "3px 8px",
            fontSize: 9,
            fontFamily: "var(--font-mono)",
            color: "var(--text)",
            zIndex: 100,
            pointerEvents: "none",
            marginBottom: 2,
          }}
        >
          {agent.name}
        </div>
      )}
    </div>
  );
}

function BigOffice({ agents }: { agents: TeamAgent[] }) {
  const agent = agents[0];
  if (!agent) return null;
  const lit = isLit(agent.status);
  const lightColor = STATUS_LIGHT[agent.status] || STATUS_LIGHT.idle;
  const glow = STATUS_GLOW[agent.status] || "transparent";

  return (
    <div
      title={`${agent.name} — ${agent.title}`}
      className="skyscraper-bigoffice"
      style={{
        position: "relative",
        height: 70,
        background: lit
          ? `linear-gradient(180deg, ${lightColor}1a 0%, ${lightColor}05 100%)`
          : "#0a0a0c",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        boxShadow: lit ? `inset 0 0 30px ${glow}` : "none",
        overflow: "hidden",
      }}
    >
      {/* Crown ornament */}
      <div
        style={{
          fontSize: 14,
          opacity: 0.5,
          color: "var(--accent)",
        }}
      >
        ♛
      </div>

      {/* Large avatar */}
      <img
        src={`/team/${agent.slug}.png`}
        alt={agent.name}
        width={40}
        height={40}
        draggable={false}
        style={{
          width: 44,
          height: 44,
          imageRendering: "pixelated",
          filter: `drop-shadow(0 0 8px ${glow})`,
          animation: "agentBob 2.5s ease-in-out infinite",
        }}
      />

      {/* Name */}
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 13,
          color: "var(--text)",
          letterSpacing: "0.05em",
        }}
      >
        {agent.name}
      </div>

      {/* Status dot */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: lightColor,
          boxShadow: `0 0 6px ${lightColor}`,
        }}
      />
    </div>
  );
}

function FloorRow({ floor }: { floor: Floor }) {
  if (floor.bigOffice) {
    return (
      <div style={{ marginBottom: 1 }}>
        <BigOffice agents={floor.agents} />
      </div>
    );
  }

  // Pad to ROOMS_PER_FLOOR
  const rooms = [...floor.agents];
  while (rooms.length < ROOMS_PER_FLOOR) {
    rooms.push(null as any);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${ROOMS_PER_FLOOR}, 1fr)`,
        height: 36,
        marginBottom: 1,
      }}
    >
      {rooms.map((agent, i) =>
        agent ? (
          <Room key={`${agent.slug}-${i}`} agent={agent} />
        ) : (
          <div
            key={`empty-${i}`}
            style={{
              background: "#08080a",
              borderRight: "1px solid rgba(255,255,255,0.02)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        )
      )}
    </div>
  );
}

function LevelSeparator({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "3px 0",
        marginTop: 2,
        marginBottom: 2,
      }}
    >
      <div style={{ flex: "0 0 8px", height: 1, background: color, opacity: 0.3 }} />
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color,
          opacity: 0.6,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.15 }} />
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
        borderRadius: "var(--radius)",
        padding: "10px 16px",
        textAlign: "center",
        minWidth: 90,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "var(--accent)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-secondary)",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────── */
export function SkyscraperPage() {
  const floors = useMemo(() => buildFloors(), []);

  // Stats
  const stats = useMemo(() => {
    const active = teamAgents.filter((a) => isLit(a.status)).length;
    return {
      total: teamAgents.length,
      active,
      floors: floors.length,
      levels: new Set(teamAgents.map((a) => a.level)).size,
    };
  }, [floors]);

  // Determine where to insert level separators
  // We'll track level changes between floors
  const [showLabels, setShowLabels] = useState(true);

  const toggleLabels = useCallback(() => setShowLabels((v) => !v), []);

  return (
    <main className="min-h-screen">
      <style>{`
        @keyframes neonFlicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 1; }
          47% { opacity: 0.6; }
          49% { opacity: 1; }
          52% { opacity: 0.85; }
          54% { opacity: 1; }
        }
        @keyframes agentBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .skyscraper-agent, .skyscraper-neon { animation: none !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-4 pt-20 pb-6 text-center sm:px-6"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[-30%] h-[500px] w-[500px] -translate-x-1/2 blur-[110px]"
          style={{
            background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            opacity: 0.07,
          }}
        />
        <nav
          className="font-mono mx-auto mb-8 flex max-w-7xl flex-wrap items-center justify-center gap-2 text-[0.65rem] uppercase tracking-[0.15em]"
          style={{ color: "var(--text-secondary)" }}
        >
          <a href="/" className="transition-colors hover:text-text">
            Home
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <a href="/zero-humans" className="transition-colors hover:text-text">
            Zero Humans
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--accent)" }}>Skyscraper</span>
        </nav>
        <div className="label mb-4" style={{ color: "var(--accent)" }}>
          MOHR &amp; MORE HQ
        </div>
        <h1
          className="mb-4"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)" }}
        >
          Der Skyscraper
          <br />
          <span style={{ color: "var(--accent)" }}>272 Agenten · 1 Gebäude</span>
        </h1>
        <p
          className="mx-auto mb-8 max-w-[62ch]"
          style={{
            color: "var(--muted)",
            fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
          }}
        >
          Ein Pixel-Art-Hochhaus mit 272 Büros — eines pro KI-Agent. Frontwand
          durchsichtig: Wer arbeitet, hat Licht an. Der Cryptopunk-Kopf erscheint
          am Schreibtisch. Von ganz oben (KALi) bis ganz unten (ausführende
          Agenten).
        </p>
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-4">
          <StatBox value={String(stats.total)} label="Agenten" />
          <StatBox value={String(stats.active)} label="Aktiv" />
          <StatBox value={String(stats.floors)} label="Stockwerke" />
          <StatBox value={String(stats.levels)} label="Hierarchie-Ebenen" />
        </div>
      </section>

      {/* ── BUILDING ── */}
      <section className="px-4 pb-20 sm:px-6">
        <div
          className="mx-auto"
          style={{
            maxWidth: 720,
          }}
        >
          {/* Ground/soil */}
          <div
            style={{
              height: 30,
              background:
                "linear-gradient(180deg, transparent 0%, #111114 50%, #0a0a0c 100%)",
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
              marginBottom: -10,
              opacity: 0.5,
            }}
          />

          {/* Building container */}
          <div
            style={{
              position: "relative",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "none",
              background: "#060608",
              borderRadius: "0 0 4px 4px",
              boxShadow: "0 0 60px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* Neon roof sign */}
            <div
              style={{
                background: "#08080a",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "4px 0",
              }}
            >
              <NeonSign />
            </div>

            {/* Antenna */}
            <div
              style={{
                position: "absolute",
                top: -30,
                left: "50%",
                transform: "translateX(-50%)",
                width: 2,
                height: 30,
                background: "rgba(255,255,255,0.12)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: -2,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ff5252",
                  boxShadow: "0 0 6px #ff5252",
                  animation: "neonFlicker 2s ease-in-out infinite",
                }}
              />
            </div>

            {/* Floors */}
            <div style={{ padding: "4px 6px" }}>
              {floors.map((floor, idx) => {
                const prevLevel = idx > 0 ? floors[idx - 1].level : null;
                const showSep = showLabels && prevLevel !== null && prevLevel !== floor.level;
                const meta = LEVEL_META[floor.level] || LEVEL_META[4];

                return (
                  <div key={`floor-${idx}`}>
                    {showSep && (
                      <LevelSeparator label={meta.label} color={meta.color} />
                    )}
                    <FloorRow floor={floor} />
                  </div>
                );
              })}
            </div>

            {/* Ground floor label */}
            <div
              style={{
                textAlign: "center",
                padding: "6px 0",
                fontFamily: "var(--font-mono)",
                fontSize: 7,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              ■ Erdgeschoss
            </div>
          </div>

          {/* Ground shadow */}
          <div
            style={{
              height: 20,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
              borderRadius: "50%",
              maxWidth: 320,
              margin: "0 auto",
              marginTop: -2,
              filter: "blur(10px)",
            }}
          />
        </div>
      </section>

      {/* ── LEGEND ── */}
      <section
        className="border-t py-8"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#00e676",
                  boxShadow: "0 0 6px #00e676",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-secondary)",
                }}
              >
                Aktiv · Agent arbeitet
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#9ff8f2",
                  boxShadow: "0 0 6px #9ff8f2",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-secondary)",
                }}
              >
                Running · KALi / CEO
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#1a1a1e",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-secondary)",
                }}
              >
                Idle · Raum dunkel
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ff5252",
                  boxShadow: "0 0 6px rgba(255,82,82,0.5)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--text-secondary)",
                }}
              >
                Error
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p
              className="font-mono mx-auto max-w-[60ch] text-[0.65rem] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Jedes Büro zeigt denselben Cryptopunk-Avatar wie die{" "}
              <a
                href="/zero-humans/team"
                style={{ color: "var(--accent)", textDecoration: "underline" }}
              >
                Team-Seite
              </a>
              . Status-Steuerung erfolgt rein programmatisch über die
              Agenten-Daten. Kein echter Agent wird für die Visualisierung
              ausgeführt.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
