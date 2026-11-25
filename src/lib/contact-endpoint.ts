/**
 * Ziel für das Kontaktformular.
 *
 * `/api/kontakt` ist eine Cloudflare-Pages-Function und existiert nur auf der
 * kanonischen Domain. Auf anderen Hosts (Freebuff-Sites-Vorschau, Preview-
 * Deployments) zeigt der relative Pfad ins Leere, deshalb geht der Request
 * dort an die kanonische Domain — dieselbe Function, dieselben Regeln
 * (Validierung, Honeypot, Rate-Limit, Archiv, Retry), kein zweiter Datenpfad.
 *
 * CORS ist dafür bereits eingerichtet: die Function beantwortet OPTIONS mit
 * 204 und setzt `access-control-allow-origin: *` auf allen Antworten.
 */
export const CANONICAL_ORIGIN = "https://mohr-more.biz";

export function contactEndpoint(): string {
  if (typeof window === "undefined") return "/api/kontakt";
  const { origin, hostname } = window.location;
  // Gleiche Domain oder lokale Entwicklung: relativ bleiben.
  if (origin === CANONICAL_ORIGIN) return "/api/kontakt";
  if (hostname === "localhost" || hostname === "127.0.0.1") return "/api/kontakt";
  return `${CANONICAL_ORIGIN}/api/kontakt`;
}
