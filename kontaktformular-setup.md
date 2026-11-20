# Kontaktformular — Cloudflare-Einrichtung

Diese Anleitung schaltet den Mailversand von `/api/kontakt` scharf. Vorher
antwortet das Formular mit `503 mail_not_configured` und bietet dem Absender
einen vorausgefüllten `mailto:`-Link an — es geht also nichts verloren, es
kommt nur nichts an.

Alle Werte gehören ausschließlich in die Cloudflare- bzw. GitHub-Oberfläche.
Nichts davon wird im Repo, im Code oder in einer Datei abgelegt.

**Reihenfolge:** 1 → 2 → 3 → 4 → 5 → 6. Schritt 6 ist Pflicht, sonst greifen
die Variablen aus Schritt 3 nicht.

---

## 1. Email Sending für die Domain freischalten

Cloudflare Dashboard → **Email** → **Email Sending** → Domain `mohr-more.biz`
onboarden. Danach muss der Absender auf dieser Domain liegen
(`kontakt@mohr-more.biz` ist der Default in `functions/api/_mail.ts`).

Ohne diesen Schritt antwortet die Cloudflare-API mit einem Fehler, der im Log
als `kontakt.delivery_failed` mit `provider_error` erscheint.

## 2. API-Token anlegen

**My Profile → API Tokens → Create Token**, Berechtigung
**Email Sending: Edit**, beschränkt auf das Konto. Ergebnis sind zwei Werte:

| Wert | Wofür |
|---|---|
| Account-ID | `CF_EMAIL_ACCOUNT_ID` |
| Token | `CF_EMAIL_API_TOKEN` |

Der Token wird nur einmal angezeigt. Er ist der einzige Wert, der sich nicht
automatisieren lässt.

## 3. Pages-Variablen setzen

Cloudflare Dashboard → **Workers & Pages** → Projekt `mohr-more` →
**Settings → Variables and Secrets** — jeweils für **Production** *und*
**Preview**:

| Name | Typ | Wert |
|---|---|---|
| `CF_EMAIL_ACCOUNT_ID` | Variable | Account-ID aus Schritt 2 |
| `CF_EMAIL_API_TOKEN` | **Secret** | Token aus Schritt 2 |
| `KONTAKT_RETRY_TOKEN` | **Secret** | selbst erzeugter Zufallswert, z. B. `openssl rand -hex 32` |

Optional:

| Name | Zweck |
|---|---|
| `KONTAKT_TO_EMAIL` | Empfänger, Default `info@mohr-more.biz` |
| `KONTAKT_FROM_EMAIL` | Absender, Default `kontakt@mohr-more.biz` |
| `KONTAKT_ALERT_WEBHOOK` | Alarm-Kanal (Slack/n8n), der bei jeder nicht zugestellten Anfrage benachrichtigt |
| `KONTAKT_FALLBACK_WEBHOOK` | zweiter Zustellweg, falls der Mailversand scheitert |

## 4. KV-Binding `KONTAKT_ARCHIVE` anlegen

Ohne Archiv gibt es nichts nachzustellen: Der Retry-Lauf hat dann keine Quelle
und antwortet mit `no_archive`.

Cloudflare Dashboard → **Workers & Pages → KV** → Namespace anlegen, z. B.
`mohr-more-kontakt-archive`. Dann im Pages-Projekt `mohr-more` unter
**Settings → Functions → KV namespace bindings**:

- Variable name: **`KONTAKT_ARCHIVE`** (exakt so, der Code liest diesen Namen)
- Namespace: der eben angelegte
- Environment: **Production** und **Preview**

Einträge laufen nach 30 Tagen automatisch ab (`expirationTtl`).

## 5. GitHub-Secret `KONTAKT_RETRY_TOKEN`

GitHub → Repo **mohr-and-more/mohr-more-biz** → **Settings → Secrets and
variables → Actions → New repository secret**:

- Name: **`KONTAKT_RETRY_TOKEN`**
- Value: **exakt derselbe Wert** wie in Schritt 3

Dieses Secret schützt die Endpunkte `POST /api/kontakt/retry` und
`GET /api/kontakt/queue` und wird vom Workflow
`.github/workflows/kontakt-retry.yml` alle 30 Minuten verwendet. Fehlt es,
überspringt der Workflow den Lauf (kein Fehler) und die Endpunkte antworten mit
`503 retry_disabled` bzw. `503 queue_disabled`.

## 6. Redeploy

Pages-Variablen und Bindings greifen erst mit einem neuen Deployment. Eine
Änderung der Environment-Variablen allein reicht nicht.

GitHub → **Actions** → *Deploy to Cloudflare Pages* → **Run workflow**
(Branch `main`), oder einen Commit auf `main` pushen.

## Prüfen

Vor der Einrichtung (Ist-Zustand ohne Secrets):

```bash
curl -s -X POST https://mohr-more.biz/api/kontakt/retry    # {"error":"retry_disabled"}
curl -s      https://mohr-more.biz/api/kontakt/queue      # {"error":"queue_disabled"}
```

Nach Schritt 6, mit dem Token aus Schritt 5:

```bash
TOKEN=<KONTAKT_RETRY_TOKEN>

curl -s -X POST https://mohr-more.biz/api/kontakt/retry \
  -H "x-retry-token: $TOKEN"
# {"ok":true,"scanned":0,"retried":0,"delivered":0,"failed":0,"skipped":0,"truncated":false}

curl -s "https://mohr-more.biz/api/kontakt/queue?token=$TOKEN"
# {"ok":true,"total":0,"open":0,"sent":0,"oldestOpenAt":null,"entries":[]}
```

Und eine echte Anfrage über das Formular auf `/kontakt` bzw. `/en/contact`:
Die Antwort ist `200 {"ok":true,"delivery":"sent",...}` und die Mail landet bei
`KONTAKT_TO_EMAIL`. Kommt `delivery: "queued"` zurück, ist die Anfrage im
Archiv gespeichert und wird beim nächsten Retry-Lauf nachgestellt.

## Wenn etwas nicht ankommt

| Symptom | Ursache |
|---|---|
| `503 mail_not_configured` | Schritt 3 fehlt oder es wurde nach dem Setzen nicht neu deployed (Schritt 6) |
| `502 mail_failed` | Token ungültig/abgelaufen oder Domain nicht für Email Sending freigeschaltet (Schritt 1/2) — Details stehen im Pages-Log |
| `200 {"delivery":"queued"}` | Mailversand scheitert, Anfrage liegt im Archiv; Retry-Lauf und `queue` zeigen sie |
| `503 queue_disabled` | `KONTAKT_RETRY_TOKEN` fehlt in den Pages-Variablen |
| `503 no_archive` | Schritt 4 fehlt (Binding nicht gesetzt oder Name nicht `KONTAKT_ARCHIVE`) |
| Retry-Workflow „übersprungen" | GitHub-Secret `KONTAKT_RETRY_TOKEN` fehlt (Schritt 5) |

Logs: Cloudflare Dashboard → Pages-Projekt → **Functions → Logs**. Dort stehen
`kontakt.delivered` bzw. `kontakt.delivery_failed` als JSON — mit Metadaten
(ID, Provider, Versuche, Fehlertext), aber ohne Klartext-Nachricht.
