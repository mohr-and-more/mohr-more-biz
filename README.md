# MOHR & MORE — mohr-more.biz

Unternehmensseite von MOHR & MORE: Next.js 16 (App Router) als statischer
Export nach `out/`, ausgeliefert über Cloudflare Pages. Die API-Routen unter
`/api/*` laufen als Pages Functions aus `functions/`.

## Dokumentation

- [kontaktformular-setup.md](kontaktformular-setup.md) — Cloudflare-Einrichtung des Kontaktformulars: Email Sending, API-Token, Pages-Variablen und Secrets, KV-Bindings, GitHub-Secrets, Redeploy.
- [design-system.md](design-system.md) — Design System: Tokens, Komponenten, Aktivierungs-Checkliste und offene Punkte.

### Kontaktformular prüfen

```bash
npm run mail:test                            # Testmail über /api/kontakt/test
KONTAKT_RETRY_TOKEN=… npm run kontakt:check  # Live-Check: Mailversand, Archiv, Retry
```

`kontakt:check` schickt eine als „Live-Check“ markierte Anfrage durch das
Formular und belegt danach, ob sie zugestellt, archiviert und – falls nötig –
nachgeliefert wurde. Einrichtung, Ursachen und Fehlerbehebung:
[kontaktformular-setup.md](kontaktformular-setup.md).

## Deploy

Jeder Push auf `main` startet die GitHub-Action **Deploy to Cloudflare Pages**
(`.github/workflows/deploy.yml`):

1. `npm ci`
2. `npx next build` — statischer Export nach `out/`
3. `cp -r functions out/functions` — die Pages Functions wandern mit ins Deployment
4. `wrangler pages deploy out --project-name=mohr-more`

Manuell derselbe Weg: GitHub → **Actions** → *Deploy to Cloudflare Pages* →
**Run workflow** (Branch `main`).

Variablen, Secrets und KV-Bindings greifen erst mit einem neuen Deployment —
nach dem Setzen also neu deployen ([kontaktformular-setup.md](kontaktformular-setup.md),
Schritt 6).

Ein zweiter Workflow (`.github/workflows/kontakt-retry.yml`) stellt
fehlgeschlagene Kontakt-Anfragen alle 30 Minuten nach und meldet einen
Fehlschlag an den Alarm-Webhook.

## Lokal entwickeln

```bash
npm ci
npm run dev     # http://localhost:3000
npx next build  # prüft genau den Export, den Cloudflare Pages ausliefert
```
