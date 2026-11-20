# Kontaktformular — Cloudflare-Einrichtung

Diese Anleitung schaltet den Mailversand von `/api/kontakt` scharf. Vorher
antwortet das Formular mit `503 mail_not_configured` und bietet dem Absender
einen vorausgefüllten `mailto:`-Link an — es geht also nichts verloren, es
kommt nur nichts an.

Alle Werte gehören ausschließlich in die Cloudflare- bzw. GitHub-Oberfläche.
Nichts davon wird im Repo, im Code oder in einer Datei abgelegt.

**Reihenfolge:** 1 → 2 → 3 → 4 → 5 → 6. Schritt 6 ist Pflicht, sonst greifen
weder die Variablen aus Schritt 3 noch das Binding aus Schritt 4.

**Voraussetzungen** (laut Cloudflare-Doku, Stand November 2026): Email Sending
ist Beta und nur im **Workers Paid**-Plan verfügbar; die Domain muss über
Cloudflare-DNS laufen.

---

## 1. Email Sending für die Domain freischalten

Dashboard → **Compute** → **Email Service** → **Email Sending**
(direkt: `dash.cloudflare.com/?to=/:account/email-service/sending`) →
**Onboard Domain** → Domain `mohr-more.biz` wählen → **Done**.

Cloudflare legt dabei auf der Subdomain `cf-bounce` die nötigen DNS-Einträge
an (MX für Bounces, TXT für SPF, DKIM und DMARC). Das dauert meist 5–15
Minuten, im Extremfall bis zu 24 Stunden. Der Absender muss auf dieser Domain
liegen (`kontakt@mohr-more.biz` ist der Default in `functions/api/_mail.ts`).

Ohne diesen Schritt antwortet die Cloudflare-API mit einem Fehler, der im Log
als `kontakt.delivery_failed` mit `provider_error` erscheint.

## 2. API-Token anlegen

Dashboard → **My Profile** → **API Tokens** → **Create Token**
(alternativ **Manage Account** → **API Tokens** für einen Account-Token, der
nicht an eine Person gebunden ist) → *Create Custom Token*:

- **Policy type:** Account
- **Permission:** **Email Sending: Edit**

Ergebnis sind zwei Werte:

| Wert | Wofür |
|---|---|
| Account-ID | `CF_EMAIL_ACCOUNT_ID` |
| Token (`cfut_…`) | `CF_EMAIL_API_TOKEN` |

Der Token wird nur einmal angezeigt. Er ist der einzige Wert, der sich nicht
automatisieren lässt. Die Account-ID steht zusätzlich im Dashboard unter
**Manage Account → Account ID**.

## 3. Pages-Variablen setzen

Dashboard → **Workers & Pages** → Projekt `mohr-more` →
**Settings** → **Variables and Secrets** → **Add** — jeweils für
**Production** *und* **Preview**:

| Name | Typ | Wert |
|---|---|---|
| `CF_EMAIL_ACCOUNT_ID` | Variable | Account-ID aus Schritt 2 |
| `CF_EMAIL_API_TOKEN` | **Secret** | Token aus Schritt 2 |
| `KONTAKT_RETRY_TOKEN` | **Secret** | selbst erzeugter Zufallswert, z. B. `openssl rand -hex 32` |

Pro Eintrag: Namen und Wert eintragen, bei Secrets **Encrypt** wählen, dann
**Save**.

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

**Namespace anlegen:** Dashboard → **Workers KV**
(`dash.cloudflare.com/<account-id>/workers/kv/namespaces`, am schnellsten über
die Dashboard-Suche nach „KV") → **Create instance** → Name z. B.
`mohr-more-kontakt-archive` → **Create**.

**Binding setzen:** **Workers & Pages** → Projekt `mohr-more` →
**Settings** → **Bindings** → **Add** → **KV namespace**:

- **Variable name:** **`KONTAKT_ARCHIVE`** (exakt so, der Code liest diesen Namen)
- **KV namespace:** der eben angelegte
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

Variablen, Secrets und Bindings greifen erst mit einem neuen Deployment — das
Setzen allein reicht nicht (Cloudflare dokumentiert das für Secrets und für
KV-Bindings ausdrücklich).

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
| `502 mail_failed` | Token ungültig/abgelaufen, Domain nicht onboarded (Schritt 1) oder Account nicht im Workers-Paid-Plan — Details stehen im Pages-Log |
| `200 {"delivery":"queued"}` | Mailversand scheitert, Anfrage liegt im Archiv; Retry-Lauf und `queue` zeigen sie |
| `503 queue_disabled` | `KONTAKT_RETRY_TOKEN` fehlt in den Pages-Variablen |
| `503 no_archive` | Schritt 4 fehlt (Binding nicht gesetzt oder Name nicht `KONTAKT_ARCHIVE`) |
| Retry-Workflow „übersprungen" | GitHub-Secret `KONTAKT_RETRY_TOKEN` fehlt (Schritt 5) |

Logs: Cloudflare Dashboard → Pages-Projekt → **Functions → Logs**. Dort stehen
`kontakt.delivered` bzw. `kontakt.delivery_failed` als JSON — mit Metadaten
(ID, Provider, Versuche, Fehlertext), aber ohne Klartext-Nachricht.

## Quellen (geprüft am 20.11.2026)

- Email Sending einrichten: <https://developers.cloudflare.com/email-service/get-started/send-emails/>
- REST-Endpunkt `POST /accounts/{account_id}/email/sending/send`: ebenda
- Pages-Variablen und Secrets: <https://developers.cloudflare.com/pages/functions/bindings/#environment-variables> und <https://developers.cloudflare.com/pages/functions/bindings/#secrets>
- KV-Binding im Pages-Projekt: <https://developers.cloudflare.com/pages/functions/bindings/#kv-namespaces>
- KV-Namespace anlegen: <https://developers.cloudflare.com/kv/get-started/#2-create-a-kv-namespace>
- API-Token erstellen: <https://developers.cloudflare.com/fundamentals/api/get-started/create-token/>
