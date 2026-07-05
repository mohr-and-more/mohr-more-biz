# MOHR & MORE — Design System (MMB-468 / Sub 1)

**Status:** Aktiv (Preview), noch nicht auf Produktivseiten ausgerollt
**Quelle:** `src/app/design-system.css` (16 KB, additiver Layer)
**Preview:** `/design-system` (noindex)
**Parent-Issue:** [MMB-468](https://app.mohr-more.biz/issues/MMB-468) — Web-Optimierungsplan
**Sub-Issue:** [MMB-469](https://app.mohr-more.biz/issues/MMB-469) — Designsystem + Komponentenbibliothek
**Preview:** `/design-system` (noindex) — Beispielseite rendert alle 12 Komponenten-Sektionen.

---

## Wann einsetzen?

Der Layer `design-system.css` ist ein **additives Stylesheet** zur bestehenden `globals.css`. Es definiert eine **neue** Designsprache mit Token-Prefix `--mm-*` (mm = MOHR & MORE). Es ist NICHT in `globals.css` aktiviert — die jetzige Site (dunkel, Mint-Akzent) bleibt unberührt, bis der GF die neuen Markenfarben explizit freigibt.

Aktivierung erfolgt sobald:
1. GF die neuen Markenfarben (`#00736F` / `#E97A2B`) bestätigt hat
2. Logo-SVG vom Kunden geliefert wurde
3. Inhalte (Texte, Bilder, Adressen) final sind

Dann werden die `--mm-*` Klassen schrittweise auf den Subpages (Sub 2–7) ausgerollt.

---

## Farb-Tokens

| Variable                       | Wert      | Verwendung                          |
|--------------------------------|-----------|-------------------------------------|
| `--mm-color-primary`           | `#00736F` | Primärfarbe, CTAs, Logo             |
| `--mm-color-primary-hover`     | `#005A57` | Hover-State von primary             |
| `--mm-color-primary-active`    | `#004A47` | Active-State                        |
| `--mm-color-accent`            | `#E97A2B` | Sekundärakzent, Highlights           |
| `--mm-color-accent-hover`      | `#D2691F` | Hover-State von accent              |
| `--mm-color-text`              | `#1F2A2E` | Haupttext                           |
| `--mm-color-muted`             | `#4A555A` | Sekundärtext, Meta-Info             |
| `--mm-color-faint`             | `#6B7479` | Tertiärtext, Captions               |
| `--mm-color-surface`           | `#FFFFFF` | Karten, Cards, Popups               |
| `--mm-color-background`        | `#F4F5F6` | Seiten-Hintergrund                  |
| `--mm-color-border`            | `#E4E7E8` | Standard-Borders, Dividers          |
| `--mm-color-border-strong`     | `#C9CDD0` | Akzent-Borders, Inputs fokussiert   |
| `--mm-color-dark-bg`           | `#1F2A2E` | Footer, dunkle Sektionen            |
| `--mm-color-dark-fg`           | `#F4F5F6` | Text auf dark-bg                    |
| `--mm-color-success`           | `#1F8A4C` | Erfolgsmeldungen                    |
| `--mm-color-warning`           | `#C97A0E` | Warnungen                           |
| `--mm-color-danger`            | `#B53A2F` | Fehler, Validation                  |
| `--mm-color-info`              | `#1F6FB5` | Info-Hinweise                       |

---

## Radius / Spacing / Shadow

| Gruppe   | Tokens                                                                  |
|----------|-------------------------------------------------------------------------|
| Radius   | `--mm-radius-sm` 6px · `--mm-radius-md` 10px · `--mm-radius-lg` 14px · `--mm-radius-xl` 20px · `--mm-radius-pill` 9999px |
| Spacing  | `--mm-space-1` 4px · `--mm-space-2` 8px · `--mm-space-3` 12px · `--mm-space-4` 16px · `--mm-space-5` 20px · `--mm-space-6` 24px · `--mm-space-8` 32px · `--mm-space-10` 48px · `--mm-space-12` 64px · `--mm-space-16` 80px |
| Shadow   | `--mm-shadow-sm` 0 1px 2px / 6% · `--mm-shadow-md` 0 10px 30px / 8% · `--mm-shadow-lg` 0 24px 60px / 12% |
| Layout   | `--mm-maxw-content` 1200px · `--mm-maxw-narrow` 720px · `--mm-maxw-wide` 1400px |
| Motion   | `--mm-transition` 180ms cubic-bezier(0.16, 1, 0.3, 1)                  |
| Z-Index  | base 1 · overlay 10 · sticky 20 · modal 50 · toast 100                  |

---

## Typografie

| Token                | Wert                              |
|----------------------|-----------------------------------|
| `--mm-font-display`  | Inter var (system fallback)       |
| `--mm-font-body`     | Inter var (system fallback)       |
| `--mm-font-mono`     | ui-monospace                      |
| `--mm-text-hero`     | clamp(2.5rem, 1rem + 6vw, 5rem)   |
| `--mm-text-5xl..xs`  | 3rem, 2.25rem, 1.875rem, 1.5rem, 1.25rem, 1.125rem, 1rem, 0.875rem, 0.75rem |

---

## Komponenten-Klassen

| Komponente              | Klassen                                                                                  |
|-------------------------|------------------------------------------------------------------------------------------|
| **Button**              | `.mm-btn` · `.mm-btn-primary` · `.mm-btn-secondary` · `.mm-btn-ghost` · `.mm-btn-accent` |
| **Card**                | `.mm-card` · `.mm-service-card` · `.mm-team-card` · `.mm-case-card`                      |
| **Form**                | `.mm-form` · `.mm-form-row` · `.mm-form-input` · `.mm-form-checkbox`                    |
| **Navigation**          | `.mm-nav` · `.mm-nav-list` · `.mm-nav-search` · `.mm-nav-cta`                           |
| **Footer**              | `.mm-footer` · `.mm-footer-grid` · `.mm-footer-bottom`                                  |
| **Hero**                | `.mm-hero` · `.mm-hero-text` · `.mm-hero-media` · `.mm-hero-actions`                    |
| **Testimonial**         | `.mm-t-card` · `.mm-t-avatar` · `.mm-t-name` · `.mm-t-company`                          |
| **Section/Container**   | `.mm-section` · `.mm-section--tight` · `.mm-section--dark` · `.mm-container` (--narrow/--wide) |
| **Logo-Row**            | `.mm-logo-row` (mit img/SVG monochrome grayscale)                                        |
| **Stats**               | `.mm-stats` · `.mm-stat`                                                                 |
| **Timeline**            | `.mm-timeline` · `.mm-tl-item` · `.mm-tl-year`                                          |
| **Tag/Chip**            | `.mm-tag`                                                                                |
| **Skip-Link**           | `.mm-skip-link` (erste fokussierbare Komponente)                                        |
| **Cookie-Slot**         | `.mm-cookie-slot` (Klaro-Hook)                                                           |

---

## Konventionen

1. **Namespace:** Alle neuen Klassen mit `mm-`-Prefix, alle Tokens mit `--mm-`-Prefix. Kein Konflikt mit bestehendem `globals.css`.
2. **Mobile-first:** Basis-Styles für Mobile, `@media (max-width: 720px)` für Anpassungen.
3. **Accessibility:** Tap-Targets ≥ 48px · Outline 2px solid primary · Alt-Texte überall · Skip-Link auf jeder Page.
4. **WCAG AA:** Kontraste geprüft (`#00736F` auf `#FFFFFF` = 5.3:1 ✓; `#4A555A` auf `#FFFFFF` = 7.4:1 ✓).
5. **Bilder:** `loading="lazy"` außer Hero · Hero: `fetchpriority="high"` · Format: WebP/AVIF · `width`/`height` immer gesetzt.
6. **Bilingual:** `--mm-*` Klassen werden in `/de/...` und `/en/...` identisch verwendet; Sprachumschaltung erfolgt über Navigation + URL, nicht über Klassen-Varianten.

---

## Aktivierungs-Checkliste (Sub 2–7)

Wenn der GF die Markenfarben bestätigt:

1. [ ] Globale CSS-Variable-Switches in `globals.css` ergänzen, die `--mm-*` → Standard-Tokens mappen (kein Breaking Change)
2. [ ] ODER: bestehende `globals.css` durch `design-system.css` ersetzen (Breaking Change, erfordert Full-Deploy + alle Subpages migrieren)
3. [ ] Navbar global auf `.mm-nav` migrieren
4. [ ] Footer global auf `.mm-footer` migrieren
5. [ ] Hero-Komponenten in Sub 2–6 auf `.mm-hero` umstellen
6. [ ] Form-Komponenten in Sub 4 auf `.mm-form` umstellen
7. [ ] Lighthouse-Run vor und nach dem Switch

---

## Offene Fragen (an GF)

1. **Markenfarben-Bestätigung:** Sind `#00736F` (primary) und `#E97A2B` (accent) final? Oder werden andere Werte erwartet?
2. **Logo-SVG:** Lieferung des echten Marken-Logos als SVG (verschiedene Größen + monochrome Variante für Logo-Row).
3. **Echte Inhalte:** Kundenlogos (6 SVGs), Testimonials (mit Foto-Erlaubnis), Teamfotos, Case Studies (mit Branchen-Zuordnung), Adresse + Öffnungszeiten.
4. **Bilingual-Strategie:** Subdirectory-Modell (`/de/...`, `/en/...`) ODER Subdomain-Modell (`de.mohr-more.biz`, `en.mohr-more.biz`)? Aktuelle Spec nutzt Subdirectory.
5. **Bestehende Inhalte:** Die aktuelle Site hat `/`, `/ki-entwicklung`, `/lazy-code`, `/how-to`, `/zero-humans`, `/dashboard`. Bleiben diese erhalten oder werden sie ins neue Design integriert / umgezogen?