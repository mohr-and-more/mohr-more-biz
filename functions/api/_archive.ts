/**
 * Gemeinsame Form des Kontakt-Archivs (KV-Bucket `KONTAKT_ARCHIVE`).
 *
 * Vorher hatte jede der drei Functions (`kontakt.ts`, `kontakt/retry.ts`,
 * `kontakt/queue.ts`) eine eigene Kopie von `ArchiveRecord`, der Präfix- und
 * TTL-Konstanten und der KV-Oberfläche. Die Kopien liefen bereits auseinander
 * (die Queue kannte `ipHash` nicht, dafür ein optionales `message`). Hier
 * steht die Form einmal.
 *
 * Bewusst nur Daten und Konstanten, keine Verarbeitungslogik: der Schreibpfad
 * bleibt in `kontakt.ts`, das Nachstellen in `retry.ts`, die Sicht in
 * `queue.ts`.
 */

/** Zustand eines Archiveintrags. `webhook` = über den optionalen Zweitweg zugestellt. */
export type DeliveryStatus = "pending" | "sent" | "webhook" | "failed" | "not_configured";

export interface ArchiveRecord {
  name: string;
  company: string;
  email: string;
  message: string;
  betreff: string;
  quelle: string;
  page: string;
  lang: string;
  id: string;
  createdAt: string;
  delivery: DeliveryStatus;
  retryCount?: number;
  lastAttemptAt?: string;
  ipHash?: string;
}

/** Schlüsselpräfix aller Kontakt-Einträge im Bucket. */
export const ARCHIVE_PREFIX = "kontakt:";
/** Aufbewahrung: 30 Tage, danach löscht KV den Eintrag selbst. */
export const ARCHIVE_TTL_SECONDS = 60 * 60 * 24 * 30;

export interface KVListResult {
  keys: Array<{ name: string }>;
  list_complete: boolean;
  cursor?: string;
}

/** Die Teilmenge der KV-API, die die Kontakt-Functions tatsächlich nutzen. */
export interface ArchiveKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<KVListResult>;
}

/** Eintragsschlüssel: sortierbar nach Zeit, eindeutig über die ID. */
export function archiveKey(record: { createdAt: string; id: string }): string {
  return `${ARCHIVE_PREFIX}${record.createdAt}:${record.id}`;
}
