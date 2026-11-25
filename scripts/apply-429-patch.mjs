/**
 * Einmal-Patch für die 429-Anzeige in beiden Kontaktformularen.
 *
 * Läuft in der CI (Workflow „One-shot 429 patch"), weil der Agent keinen
 * Schreibzugriff auf das Repo hat. Jede Ersetzung muss genau einmal passen,
 * sonst bricht das Skript ab, ohne etwas zu schreiben.
 *
 * Lokal prüfbar:
 *   node scripts/apply-429-patch.mjs <verzeichnis-mit-altstand>
 */
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";

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

// 1 — Strings für die Wartezeit
replaceOnce(
  "src/lib/i18n.ts",
  `      errorMinLen: {
        de: "Bitte schreiben Sie mindestens 20 Zeichen in die Nachricht.",
        en: "Please write at least 20 characters in your message.",
      },`,
  `      errorMinLen: {
        de: "Bitte schreiben Sie mindestens 20 Zeichen in die Nachricht.",
        en: "Please write at least 20 characters in your message.",
      },
      /** 429 — \`{minutes}\` wird aus dem Retry-After-Header ersetzt. */
      errorRateLimit: {
        de: "Zu viele Anfragen in kurzer Zeit. Bitte warten Sie noch {minutes} Min. und senden Sie die Nachricht dann erneut.",
        en: "Too many requests in a short time. Please wait {minutes} min and try again.",
      },`
);

// 2 — DE-Formular: Helfer + eigene Behandlung der 429-Antwort
replaceOnce(
  "src/app/(de)/kontakt/kontakt-page.tsx",
  `function fallbackMailLabel(lang: string): string {`,
  `/**
 * 429: Wartezeit aus dem Retry-After-Header in Minuten, Default 10.
 * Der Server schickt Sekunden; gerundet wird auf ganze Minuten.
 */
function rateLimitMessage(template: string, retryAfter: string | null): string {
  const seconds = Number(retryAfter);
  const minutes = Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : 10;
  return template.replace("{minutes}", String(minutes));
}

function fallbackMailLabel(lang: string): string {`
);

replaceOnce(
  "src/app/(de)/kontakt/kontakt-page.tsx",
  `        const data: { error?: string } = await res
          .json()
          .catch(() => ({ error: "unknown" }));
        setStatus("error");`,
  `        const data: { error?: string } = await res
          .json()
          .catch(() => ({ error: "unknown" }));
        if (data.error === "rate_limit") {
          // Kein mailto-Ausweg: die Anfrage wurde abgewiesen, nicht verloren —
          // ein zweiter Kanal würde sie nur doppelt senden.
          setStatus("error");
          setErrorMsg(rateLimitMessage(t.form.errorRateLimit[lang], res.headers.get("retry-after")));
          return;
        }
        setStatus("error");`
);

// 3 — EN-Formular: gleiche Behandlung, Strings aus i18n
replaceOnce(
  "src/components/en-contact-page.tsx",
  `import { useEffect, useRef, useState, FormEvent } from "react";`,
  `import { useEffect, useRef, useState, FormEvent } from "react";
import { translations } from "@/lib/i18n";`
);

replaceOnce(
  "src/components/en-contact-page.tsx",
  `export function EnContactPage() {`,
  `/** 429: Wartezeit aus dem Retry-After-Header in Minuten, Default 10. */
function rateLimitMessage(template: string, retryAfter: string | null): string {
  const seconds = Number(retryAfter);
  const minutes = Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds / 60) : 10;
  return template.replace("{minutes}", String(minutes));
}

export function EnContactPage() {`
);

replaceOnce(
  "src/components/en-contact-page.tsx",
  `        const data: { error?: string } = await res.json().catch(() => ({}));
        setStatus("error");`,
  `        const data: { error?: string } = await res.json().catch(() => ({}));
        if (data.error === "rate_limit") {
          // No mailto fallback here: the request was rejected, not lost — a second
          // channel would only send it twice.
          setStatus("error");
          setErrorMsg(
            rateLimitMessage(
              translations.contactPage.form.errorRateLimit.en,
              res.headers.get("retry-after")
            )
          );
          return;
        }
        setStatus("error");`
);

// 4 — ungenutztes Bild entfernen (nirgends referenziert, Team nutzt /team/<slug>.png)
const image = `${root}/public/gunnar-mohr.png`;
if (existsSync(image)) {
  rmSync(image);
  console.log("public/gunnar-mohr.png: gelöscht");
}

replaceOnce(
  "public/_routes.json",
  `    "/gunnar-mohr.png",\n`,
  ``
);

console.log("Patch vollständig angewendet.");
