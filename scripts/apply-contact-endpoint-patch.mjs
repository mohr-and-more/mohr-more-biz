/**
 * Einmal-Patch: Kontaktformulare zeigen auf die kanonische Function.
 *
 * Läuft in der CI (Workflow „One-shot contact endpoint"), weil der Agent keinen
 * Schreibzugriff auf das Repo hat. Jede Ersetzung muss genau einmal passen,
 * sonst bricht das Skript ab, ohne etwas zu schreiben.
 *
 * Lokal prüfbar:
 *   node scripts/apply-contact-endpoint-patch.mjs <verzeichnis-mit-altstand>
 */
import { readFileSync, writeFileSync } from "node:fs";

const root = process.argv[2] ?? process.cwd();

function replaceOnce(file, from, to) {
  const path = `${root}/${file}`;
  const text = readFileSync(path, "utf8");
  const hits = text.split(from).length - 1;
  if (hits !== 1) {
    console.error(`${file}: Anker ${hits}× gefunden, erwartet 1×`);
    process.exit(1);
  }
  writeFileSync(path, text.replace(from, to));
  console.log(`${file}: gepatcht`);
}

// 1 — gemeinsamer Helfer
writeFileSync(
  `${root}/src/lib/contact-endpoint.ts`,
  `/**
 * Ziel für das Kontaktformular.
 *
 * \`/api/kontakt\` ist eine Cloudflare-Pages-Function und existiert nur auf der
 * kanonischen Domain. Auf anderen Hosts (Freebuff-Sites-Vorschau, Preview-
 * Deployments) zeigt der relative Pfad ins Leere, deshalb geht der Request
 * dort an die kanonische Domain — dieselbe Function, dieselben Regeln
 * (Validierung, Honeypot, Rate-Limit, Archiv, Retry), kein zweiter Datenpfad.
 *
 * CORS ist dafür bereits eingerichtet: die Function beantwortet OPTIONS mit
 * 204 und setzt \`access-control-allow-origin: *\` auf allen Antworten.
 */
export const CANONICAL_ORIGIN = "https://mohr-more.biz";

export function contactEndpoint(): string {
  if (typeof window === "undefined") return "/api/kontakt";
  const { origin, hostname } = window.location;
  // Gleiche Domain oder lokale Entwicklung: relativ bleiben.
  if (origin === CANONICAL_ORIGIN) return "/api/kontakt";
  if (hostname === "localhost" || hostname === "127.0.0.1") return "/api/kontakt";
  return \`\${CANONICAL_ORIGIN}/api/kontakt\`;
}
`
);
console.log("src/lib/contact-endpoint.ts: neu angelegt");

// 2 — DE-Formular
replaceOnce(
  "src/app/(de)/kontakt/kontakt-page.tsx",
  `import { translations } from "@/lib/i18n";`,
  `import { translations } from "@/lib/i18n";
import { contactEndpoint } from "@/lib/contact-endpoint";`
);
replaceOnce(
  "src/app/(de)/kontakt/kontakt-page.tsx",
  `      const res = await fetch("/api/kontakt", {`,
  `      const res = await fetch(contactEndpoint(), {`
);

// 3 — EN-Formular
replaceOnce(
  "src/components/en-contact-page.tsx",
  `import { translations } from "@/lib/i18n";`,
  `import { translations } from "@/lib/i18n";
import { contactEndpoint } from "@/lib/contact-endpoint";`
);
replaceOnce(
  "src/components/en-contact-page.tsx",
  `      const res = await fetch("/api/kontakt", { method: "POST", body: fd });`,
  `      const res = await fetch(contactEndpoint(), { method: "POST", body: fd });`
);

console.log("Patch vollständig angewendet.");
