import type { Metadata } from "next";
import Link from "next/link";
import "./../design-system.css";
import { DesignSystemForm } from "./form";

export const metadata: Metadata = {
  title: "Design System — MOHR & MORE (MMB-468 / Sub 1)",
  description:
    "Interne Vorschau aller Design-System-Komponenten und CSS-Tokens gemäß Web-Optimierungsplan.",
  robots: "noindex, nofollow",
};

export default function DesignSystemPage() {
  return (
    <main className="mm-section">
      <a href="#main" className="mm-skip-link">Zum Hauptinhalt springen</a>
      <div className="mm-container" id="main">
        <header className="mm-section mm-section--tight">
          <span className="mm-tag">MMB-468 / Sub 1</span>
          <h1 style={{ fontSize: "var(--mm-text-hero)", marginTop: "var(--mm-space-3)", color: "var(--mm-color-text)" }}>
            Design System
          </h1>
          <p style={{ color: "var(--mm-color-muted)", maxWidth: "60ch" }}>
            Vorschau aller Komponenten und Tokens gemäß Web-Optimierungsplan (MMB-468).
            Diese Seite ist nur intern erreichbar (noindex). Aktivierung erfolgt
            schrittweise sobald die Markenfarben vom GF bestätigt sind.
          </p>
        </header>

        {/* TOKENS */}
        <section className="mm-section">
          <h2>01 — Farb-Tokens</h2>
          <div className="mm-stats" style={{ marginTop: "var(--mm-space-6)" }}>
            <div className="mm-stat" style={{ borderLeftColor: "var(--mm-color-primary)" }}>
              <strong style={{ color: "var(--mm-color-primary)" }}>#00736F</strong>
              <span>--mm-color-primary</span>
            </div>
            <div className="mm-stat" style={{ borderLeftColor: "var(--mm-color-accent)" }}>
              <strong style={{ color: "var(--mm-color-accent)" }}>#E97A2B</strong>
              <span>--mm-color-accent</span>
            </div>
            <div className="mm-stat">
              <strong style={{ color: "var(--mm-color-text)" }}>#1F2A2E</strong>
              <span>--mm-color-text</span>
            </div>
            <div className="mm-stat">
              <strong style={{ color: "var(--mm-color-muted)" }}>#4A555A</strong>
              <span>--mm-color-muted</span>
            </div>
            <div className="mm-stat">
              <strong style={{ color: "var(--mm-color-dark-bg)" }}>#1F2A2E</strong>
              <span>--mm-color-dark-bg (Footer)</span>
            </div>
            <div className="mm-stat">
              <strong style={{ color: "var(--mm-color-surface)", background: "var(--mm-color-border)", padding: "4px 8px", borderRadius: "4px" }}>#FFFFFF</strong>
              <span>--mm-color-surface</span>
            </div>
          </div>
        </section>

        {/* NAVIGATION */}
        <section className="mm-section">
          <h2>02 — Navigation (.nav .nav-list .nav-search .nav-cta)</h2>
          <nav className="mm-nav" aria-label="Hauptnavigation (Showcase)" style={{ marginTop: "var(--mm-space-4)" }}>
            <div className="mm-container" style={{ display: "flex", alignItems: "center", gap: "var(--mm-space-6)", flexWrap: "wrap" }}>
              <Link href="/" style={{ fontWeight: 700, color: "var(--mm-color-primary)", textDecoration: "none" }}>MOHR &amp; MORE</Link>
              <ul className="mm-nav-list" style={{ flex: 1 }}>
                <li><a href="/leistungen">Leistungen</a></li>
                <li><a href="/referenzen">Referenzen</a></li>
                <li><a href="/ueber-uns">Über uns</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/kontakt">Kontakt</a></li>
              </ul>
              <input type="search" className="mm-nav-search" placeholder="Suche…" aria-label="Suche" />
              <a href="/kontakt?betreff=Beratung" className="mm-nav-cta">Beratung</a>
            </div>
          </nav>
        </section>

        {/* HERO */}
        <section className="mm-section">
          <h2>03 — Hero (.hero .hero-text .hero-media .hero-actions)</h2>
          <div className="mm-hero" style={{ marginTop: "var(--mm-space-4)", borderRadius: "var(--mm-radius-lg)", overflow: "hidden" }}>
            <div className="mm-container">
              <div className="mm-hero-text">
                <span className="mm-tag">Web-Optimierungsplan</span>
                <h1>Mehr Kunden. Weniger Aufwand. Messbar besser.</h1>
                <p>
                  MOHR &amp; MORE digitalisiert Vertrieb und Verwaltung für den
                  Mittelstand — damit Sie sich auf das konzentrieren, was
                  wirklich zählt.
                </p>
                <div className="mm-hero-actions">
                  <a href="/kontakt?betreff=Beratungsgespraech" className="mm-btn mm-btn-primary">Beratungsgespräch vereinbaren</a>
                  <a href="/leistungen" className="mm-btn mm-btn-secondary">Leistungen ansehen</a>
                </div>
              </div>
              <div className="mm-hero-media" role="img" aria-label="Platzhalter Hero-Bild">
                <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--mm-color-faint)" }}>
                  Hero-Bild (WebP, 16:9, preload)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUTTONS */}
        <section className="mm-section">
          <h2>04 — Buttons (.btn .btn-primary .btn-ghost .btn-secondary)</h2>
          <div style={{ display: "flex", gap: "var(--mm-space-3)", flexWrap: "wrap", marginTop: "var(--mm-space-4)" }}>
            <button className="mm-btn mm-btn-primary">Beratung anfragen</button>
            <button className="mm-btn mm-btn-secondary">Leistungen ansehen</button>
            <button className="mm-btn mm-btn-ghost">Mehr erfahren</button>
            <button className="mm-btn mm-btn-accent">Jetzt starten</button>
          </div>
        </section>

        {/* TAGS */}
        <section className="mm-section">
          <h2>05 — Tags (.tag)</h2>
          <div style={{ display: "flex", gap: "var(--mm-space-2)", flexWrap: "wrap", marginTop: "var(--mm-space-4)" }}>
            <span className="mm-tag">Beratung</span>
            <span className="mm-tag">Digitalisierung</span>
            <span className="mm-tag">Mittelstand</span>
            <span className="mm-tag">Logistik</span>
            <span className="mm-tag">Handwerk</span>
          </div>
        </section>

        {/* CARDS */}
        <section className="mm-section">
          <h2>06 — Service-Cards (.card .service-card)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--mm-space-4)", marginTop: "var(--mm-space-4)" }}>
            <article className="mm-card mm-service-card">
              <span className="mm-tag">Beratung</span>
              <h3>Strategieberatung</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>
                <strong>Problem:</strong> Unklare Marktposition.<br />
                <strong>Lösung:</strong> Datenbasierte Analyse.<br />
                <strong>Ergebnis:</strong> +18% Conversion binnen 6 Monaten.
              </p>
            </article>
            <article className="mm-card mm-service-card">
              <span className="mm-tag">Umsetzung</span>
              <h3>Digitalisierung</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>
                <strong>Problem:</strong> Manuelle Prozesse kosten Zeit.<br />
                <strong>Lösung:</strong> Workflow-Automation.<br />
                <strong>Ergebnis:</strong> 50% weniger Verwaltungsaufwand.
              </p>
            </article>
            <article className="mm-card mm-service-card">
              <span className="mm-tag">Wartung</span>
              <h3>Langfristige Begleitung</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>
                <strong>Problem:</strong> Lösungen veralten.<br />
                <strong>Lösung:</strong> Kontinuierliche Optimierung.<br />
                <strong>Ergebnis:</strong> Nachhaltige Wertsteigerung.
              </p>
            </article>
          </div>
        </section>

        {/* TEAM CARDS */}
        <section className="mm-section">
          <h2>07 — Team-Cards (.card .team-card)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--mm-space-4)", marginTop: "var(--mm-space-4)" }}>
            <article className="mm-card mm-team-card">
              <div className="mm-team-avatar" aria-hidden="true">GM</div>
              <h3>[Name Platzhalter]</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>Geschäftsführung</p>
              <p style={{ fontSize: "var(--mm-text-sm)" }}>1–2-Satz Bio Platzhalter.</p>
            </article>
            <article className="mm-card mm-team-card">
              <div className="mm-team-avatar" aria-hidden="true">PL</div>
              <h3>[Name Platzhalter]</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>Projektleitung</p>
              <p style={{ fontSize: "var(--mm-text-sm)" }}>1–2-Satz Bio Platzhalter.</p>
            </article>
            <article className="mm-card mm-team-card">
              <div className="mm-team-avatar" aria-hidden="true">BE</div>
              <h3>[Name Platzhalter]</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>Beratung</p>
              <p style={{ fontSize: "var(--mm-text-sm)" }}>1–2-Satz Bio Platzhalter.</p>
            </article>
            <article className="mm-card mm-team-card">
              <div className="mm-team-avatar" aria-hidden="true">MK</div>
              <h3>[Name Platzhalter]</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>Marketing</p>
              <p style={{ fontSize: "var(--mm-text-sm)" }}>1–2-Satz Bio Platzhalter.</p>
            </article>
          </div>
        </section>

        {/* STATS */}
        <section className="mm-section">
          <h2>08 — Stats (.stats .stat)</h2>
          <div className="mm-stats" style={{ marginTop: "var(--mm-space-4)" }}>
            <div className="mm-stat"><strong>18+</strong><span>Jahre Erfahrung</span></div>
            <div className="mm-stat"><strong>50+</strong><span>Projekte realisiert</span></div>
            <div className="mm-stat"><strong>+38%</strong><span>Conversion bei Kunden</span></div>
            <div className="mm-stat"><strong>98%</strong><span>Kundenzufriedenheit</span></div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="mm-section">
          <h2>09 — Testimonial (.t-card .t-avatar .t-name .t-company)</h2>
          <article className="mm-t-card" style={{ marginTop: "var(--mm-space-4)", maxWidth: "640px" }}>
            <p style={{ fontSize: "var(--mm-text-lg)", fontStyle: "italic" }}>
              „Mit MOHR & MORE haben wir unseren Verwaltungsaufwand halbiert und
              gleichzeitig die Kundenzufriedenheit um 18&nbsp;% gesteigert.&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--mm-space-3)" }}>
              <div className="mm-t-avatar">MS</div>
              <div>
                <div className="mm-t-name">[Name Platzhalter]</div>
                <div className="mm-t-company">Geschäftsführer:in, [Firma Platzhalter]</div>
              </div>
            </div>
          </article>
        </section>

        {/* TIMELINE */}
        <section className="mm-section">
          <h2>10 — Timeline (.timeline .tl-item .tl-year)</h2>
          <div className="mm-timeline" style={{ marginTop: "var(--mm-space-4)" }}>
            <div className="mm-tl-item">
              <span className="mm-tl-year">2009</span>
              <p>Gründung in Köln durch Gregor Mohr.</p>
            </div>
            <div className="mm-tl-item">
              <span className="mm-tl-year">2014</span>
              <p>Eröffnung des Riga-Standorts.</p>
            </div>
            <div className="mm-tl-item">
              <span className="mm-tl-year">2019</span>
              <p>Internationale B2B-Sourcing-Netzwerke in Asien und UAE.</p>
            </div>
            <div className="mm-tl-item">
              <span className="mm-tl-year">2023</span>
              <p>Launch von KI-gestützten Voice- und Retouren-Lösungen.</p>
            </div>
            <div className="mm-tl-item">
              <span className="mm-tl-year">2026</span>
              <p>Zero-Human-Company-Vision mit 272 AI-Agenten.</p>
            </div>
          </div>
        </section>

        {/* LOGO ROW */}
        <section className="mm-section">
          <h2>11 — Logo-Row (.logo-row img)</h2>
          <div className="mm-logo-row" style={{ marginTop: "var(--mm-space-4)" }}>
            <svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg" aria-label="KUNDE A">
              <text x="0" y="22" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">KUNDE A</text>
            </svg>
            <svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg" aria-label="KUNDE B">
              <text x="0" y="22" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">KUNDE B</text>
            </svg>
            <svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg" aria-label="KUNDE C">
              <text x="0" y="22" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">KUNDE C</text>
            </svg>
            <svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg" aria-label="KUNDE D">
              <text x="0" y="22" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">KUNDE D</text>
            </svg>
            <svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg" aria-label="KUNDE E">
              <text x="0" y="22" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">KUNDE E</text>
            </svg>
            <svg viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg" aria-label="KUNDE F">
              <text x="0" y="22" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" fill="currentColor">KUNDE F</text>
            </svg>
          </div>
        </section>

        {/* FORM */}
        <section className="mm-section">
          <h2>12 — Form (.form .form-row .form-input .form-checkbox)</h2>
          <DesignSystemForm />
        </section>

        {/* FOOTER (dark) */}
        <footer className="mm-footer" style={{ marginTop: "var(--mm-space-16)" }}>
          <div className="mm-container">
            <div className="mm-footer-grid">
              <div>
                <h4>MOHR & MORE</h4>
                <p style={{ opacity: 0.75 }}>Zero-Human Company · Köln</p>
              </div>
              <div>
                <h4>Leistungen</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--mm-space-2)" }}>
                  <li><a href="/leistungen/beratung">Beratung</a></li>
                  <li><a href="/leistungen/umsetzung">Umsetzung</a></li>
                  <li><a href="/leistungen/wartung">Wartung</a></li>
                </ul>
              </div>
              <div>
                <h4>Unternehmen</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--mm-space-2)" }}>
                  <li><a href="/ueber-uns">Über uns</a></li>
                  <li><a href="/referenzen">Referenzen</a></li>
                  <li><a href="/blog">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4>Kontakt</h4>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--mm-space-2)" }}>
                  <li><a href="mailto:info@mohr-more.biz">info@mohr-more.biz</a></li>
                  <li><a href="tel:+490000000000">+49 0000 0000000</a></li>
                  <li><a href="/kontakt">Kontaktformular</a></li>
                </ul>
              </div>
            </div>
            <div className="mm-footer-bottom">
              <span>© 2026 MOHR & MORE</span>
              <span>
                <a href="/impressum">Impressum</a> · <a href="/datenschutz">Datenschutz</a> · <a href="/agb">AGB</a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}