/**
 * Einmal-Patch: DE-Kontaktseite auf die gemeinsame Formular-Komponente
 * umstellen und die neuen Formular-Strings in `src/lib/i18n.ts` ergänzen.
 *
 * Läuft in der CI (Workflow „One-shot contact form unify"), weil der Agent
 * keinen Schreibzugriff auf das Repo hat. Jeder Marker muss genau einmal
 * vorkommen, sonst bricht das Skript ab, ohne etwas zu schreiben.
 *
 * Lokal prüfbar:
 *   node scripts/apply-contact-form-de-patch.mjs <verzeichnis>
 */
import { readFileSync, writeFileSync } from "node:fs";

const root = process.argv[2] ?? process.cwd();

function read(file) {
  return readFileSync(`${root}/${file}`, "utf8");
}
function write(file, text) {
  writeFileSync(`${root}/${file}`, text);
}
function replaceOnce(file, from, to) {
  const text = read(file);
  const hits = text.split(from).length - 1;
  if (hits !== 1) {
    console.error(`${file}: Anker ${hits}× gefunden, erwartet 1×\n---\n${from.slice(0, 120)}\n---`);
    process.exit(1);
  }
  write(file, text.replace(from, to));
}
function cutBetween(file, startMarker, endMarker, replacement = "") {
  const text = read(file);
  const start = text.indexOf(startMarker);
  if (start === -1) {
    console.error(`${file}: Startmarker nicht gefunden: ${startMarker.slice(0, 80)}`);
    process.exit(1);
  }
  const end = text.indexOf(endMarker, start + startMarker.length);
  if (end === -1) {
    console.error(`${file}: Endmarker nicht gefunden: ${endMarker.slice(0, 80)}`);
    process.exit(1);
  }
  write(file, text.slice(0, start) + replacement + text.slice(end));
}

/* ---------------------------------------------------------------- i18n.ts */
replaceOnce(
  "src/lib/i18n.ts",
  `      submitting: { de: "Wird gesendet…", en: "Sending…" },`,
  `      submitting: { de: "Wird gesendet…", en: "Sending…" },
      sendAnother: { de: "Weitere Nachricht senden", en: "Send another message" },
      help: {
        de: "* Pflichtfelder. Daten werden verschlüsselt (HTTPS) an /api/kontakt übertragen.",
        en: "* Required fields. Data sent over HTTPS to /api/kontakt.",
      },
      honeypot: { de: "Bitte leer lassen", en: "Please leave empty" },
      errorDelivery: {
        de: "Die Nachricht konnte nicht automatisch zugestellt werden. Bitte senden Sie sie direkt per E-Mail — der Link ist mit Ihren Angaben vorausgefüllt.",
        en: "Your message could not be delivered automatically. Please send it by email directly — the link is prefilled with your details.",
      },
      fallbackMail: {
        de: "Nachricht per E-Mail senden",
        en: "Send the message by email",
      },
      mailSubject: {
        de: "Kontaktanfrage über mohr-more.biz",
        en: "Contact inquiry via mohr-more.biz",
      },`
);

/* ------------------------------------------- DE-Kontaktseite (KontaktPage) */
const de = "src/app/(de)/kontakt/kontakt-page.tsx";

// 1 — Imports: React-Hooks und Endpunkt-Helfer wandern in die Komponente.
replaceOnce(
  de,
  `import { useEffect, useRef, useState, FormEvent } from "react";
import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { contactEndpoint } from "@/lib/contact-endpoint";`,
  `import { useLang } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";
import { ContactForm, ContactIcon as Icon } from "@/components/contact-form";`
);

// 2 — Lokale Icon-Definition und Formular-Helfer entfallen.
cutBetween(de, `type IconProps = { name: "phone"`, `export function KontaktPage() {`);

// 3 — Formular-State, Validierung und Submit wandern in die Komponente.
cutBetween(
  de,
  `  // Form-Refs (für direkten DOM-Zugriff ohne Re-Render auf jedem Tastendruck)`,
  `  return (`
);

// 4 — Formular-JSX durch die gemeinsame Komponente ersetzen.
cutBetween(
  de,
  `              {status === "success" ? (`,
  `
            </div>
          </div>`,
  `              <ContactForm lang={lang} />
`
);

console.log("Patch vollständig angewendet.");
