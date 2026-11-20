#!/usr/bin/env node
/**
 * Testmail für den Kontaktformular-Versand.
 *
 * Ruft POST /api/kontakt/test auf und gibt das Provider-Ergebnis aus.
 * Das Token kommt aus --token=… oder aus der Umgebungsvariable
 * KONTAKT_TEST_TOKEN (identisch zum Pages-Secret).
 *
 *   node scripts/test-kontakt-mail.mjs --token=<TOKEN>
 *   node scripts/test-kontakt-mail.mjs --url=https://mohr-more.biz --token=<TOKEN>
 *
 * Exit-Code 0 bei erfolgreicher Zustellung, 1 sonst — damit lässt es sich in
 * einem Deploy-Check verwenden.
 */

const args = new Map(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [key, ...rest] = a.replace(/^--/, "").split("=");
      return [key, rest.join("=")];
    })
);

const baseUrl = (args.get("url") || process.env.KONTAKT_URL || "https://mohr-more.biz").replace(/\/$/, "");
const token = (args.get("token") || process.env.KONTAKT_TEST_TOKEN || "").trim();

if (!token) {
  console.error("Fehlendes Token: --token=<TOKEN> oder KONTAKT_TEST_TOKEN setzen.");
  process.exit(1);
}

try {
  const res = await fetch(`${baseUrl}/api/kontakt/test`, {
    method: "POST",
    headers: { "x-test-token": token },
  });
  const body = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = body;
  }
  console.log(`HTTP ${res.status}`);
  console.log(JSON.stringify(parsed, null, 2));
  process.exit(res.ok ? 0 : 1);
} catch (error) {
  console.error("Testmail fehlgeschlagen:", error instanceof Error ? error.message : error);
  process.exit(1);
}
