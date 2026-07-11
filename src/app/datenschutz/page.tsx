import type { Metadata } from "next";
import { SITE } from "@/data/services";
import "../design-system.css";

const PAGE_URL = `${SITE.url}/datenschutz`;

export const metadata: Metadata = {
  title: "Datenschutzerklärung — MOHR & MORE",
  description:
    "Datenschutzerklärung der MOHR & MORE Business. Informationen gemäß DSGVO zur Verarbeitung personenbezogener Daten.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: PAGE_URL,
      "x-default": PAGE_URL,
      en: `${SITE.url}/en/privacy`,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Datenschutzerklärung — MOHR & MORE",
    description: "Datenschutzerklärung der MOHR & MORE Business.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
            Rechtliches
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Informationen gemäß DSGVO zur Verarbeitung personenbezogener Daten
          </p>
          <p className="mt-2 font-mono text-sm text-[var(--text-faint)]">
            Stand: Juli 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none space-y-12">
          {/* Inhaltsverzeichnis */}
          <nav className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="mb-4 text-lg font-bold">Inhaltsverzeichnis</h2>
            <ol className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#verantwortlicher" className="text-[var(--accent)] hover:underline">1. Verantwortlicher</a></li>
              <li><a href="#kontakt" className="text-[var(--accent)] hover:underline">2. Kontakt zum Datenschutzbeauftragten</a></li>
              <li><a href="#datenverarbeitung" className="text-[var(--accent)] hover:underline">3. Datenverarbeitung auf dieser Website</a></li>
              <li><a href="#kontaktformular" className="text-[var(--accent)] hover:underline">4. Kontaktformular</a></li>
              <li><a href="#cookies" className="text-[var(--accent)] hover:underline">5. Cookies</a></li>
              <li><a href="#analyse" className="text-[var(--accent)] hover:underline">6. Analyse-Tools</a></li>
              <li><a href="#social" className="text-[var(--accent)] hover:underline">7. Social Media</a></li>
              <li><a href="#rechte" className="text-[var(--accent)] hover:underline">8. Ihre Rechte</a></li>
              <li><a href="#aenderung" className="text-[var(--accent)] hover:underline">9. Änderungen dieser Datenschutzerklärung</a></li>
            </ol>
          </nav>

          {/* 1. Verantwortlicher */}
          <section id="verantwortlicher">
            <h2 className="mb-4 text-2xl font-bold">1. Verantwortlicher</h2>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="font-semibold text-[var(--text)]">MOHR & MORE Business</p>
              <p className="mt-2 text-[var(--text-secondary)]">
                Gunnar Mohr & Gregor Mohr<br />
                Geschäftsführer
              </p>
              <div className="mt-4 space-y-1 text-sm text-[var(--text-secondary)]">
                <p>Köln, Deutschland</p>
                <p>
                  E-Mail:{" "}
                  <a href="mailto:info@mohr-more.biz" className="text-[var(--accent)] hover:underline">
                    info@mohr-more.biz
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Kontakt zum Datenschutzbeauftragten */}
          <section id="kontakt">
            <h2 className="mb-4 text-2xl font-bold">2. Kontakt zum Datenschutzbeauftragten</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Da wir nach Art. 37 DSGVO nicht zur Benennung eines Datenschutzbeauftragten 
                verpflichtet sind, erfolgt die Bearbeitung datenschutzrechtlicher Anfragen 
                direkt über die oben genannten Kontaktdaten.
              </p>
              <p>
                Für allgemeine Fragen zum Datenschutz oder zur Verarbeitung Ihrer 
                personenbezogenen Daten können Sie sich jederzeit an uns wenden:
              </p>
              <p>
                <a href="mailto:info@mohr-more.biz" className="text-[var(--accent)] hover:underline">
                  info@mohr-more.biz
                </a>
              </p>
            </div>
          </section>

          {/* 3. Datenverarbeitung auf dieser Website */}
          <section id="datenverarbeitung">
            <h2 className="mb-4 text-2xl font-bold">3. Datenverarbeitung auf dieser Website</h2>
            <div className="space-y-6 text-[var(--text-secondary)]">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">3.1 Erhebung und Verarbeitung von Zugriffsdaten</h3>
                <p>
                  Bei jedem Besuch unserer Website werden automatisch Informationen durch 
                  unseren Webserver (Hosting-Provider) erhoben. Diese sogenannten 
                  Server-Logfiles enthalten:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer-URL (die zuvor besuchte Seite)</li>
                  <li>Unterwebseiten, welche über ein zugreifendes System angesteuert werden</li>
                  <li>Hostname des zugreifenden Rechners (IP-Adresse anonymisiert)</li>
                  <li>Uhrzeit der Serveranfrage</li>
                </ul>
                <p className="mt-2">
                  Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und 
                  dienen ausschließlich statistischen Auswertungen sowie der technischen 
                  Optimierung unseres Internetauftritts.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">3.2 Rechtsgrundlage</h3>
                <p>
                  Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO 
                  (berechtigtes Interesse an der technisch fehlerfreien und optimierten 
                  Bereitstellung des Online-Angebots).
                </p>
              </div>
            </div>
          </section>

          {/* 4. Kontaktformular */}
          <section id="kontaktformular">
            <h2 className="mb-4 text-2xl font-bold">4. Kontaktformular</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Wenn Sie uns über das Kontaktformular kontaktieren, werden die von Ihnen 
                eingegebenen Daten (Name, E-Mail-Adresse, Nachricht) zum Zweck der 
                Bearbeitung Ihrer Anfrage gespeichert und verarbeitet.
              </p>
              <p>
                Die von Ihnen im Formular eingegebenen Daten verbleiben bei uns, bis Sie 
                uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen 
                oder der Zweck für die Datenspeicherung entfällt (z.B. nach abgeschlossener 
                Bearbeitung Ihrer Anfrage).
              </p>
              <p>
                <strong className="text-[var(--text)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 
                lit. a DSGVO (Einwilligung), sofern Sie uns über das Formular kontaktieren.
              </p>
            </div>
          </section>

          {/* 5. Cookies */}
          <section id="cookies">
            <h2 className="mb-4 text-2xl font-bold">5. Cookies</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Unsere Website verwendet sogenannte „Cookies". Cookies sind kleine 
                Textdateien, die auf Ihrem Endgerät gespeichert werden und keinen 
                Schaden anrichten. Sie dienen dazu, unser Angebot nutzerfreundlicher, 
                effektiver und sicherer zu machen.
              </p>
              
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                <h3 className="mb-2 font-semibold text-[var(--text)]">5.1 Notwendige Cookies</h3>
                <p>
                  Diese Cookies sind für den Betrieb der Website technisch erforderlich 
                  und werden gesetzt, um die Grundfunktionalität und Sicherheit der 
                  Website zu gewährleisten. Sie können nicht deaktiviert werden.
                </p>
                <p className="mt-2 font-mono text-xs">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                </p>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                <h3 className="mb-2 font-semibold text-[var(--text)]">5.2 Consent Management</h3>
                <p>
                  Wir nutzen ein Consent Management Tool (Klaro), um Ihre Einwilligung 
                  zur Nutzung nicht-notwendiger Cookies einzuholen und zu dokumentieren. 
                  Beim Besuch unserer Website werden Sie über dieses Tool informiert und 
                  können Ihre Cookie-Präferenzen individuell festlegen.
                </p>
                <p className="mt-2 font-mono text-xs">
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)
                </p>
              </div>

              <p>
                Sie können Ihre Cookie-Präferenzen jederzeit über den am Seitenfuß 
                befindlichen Link ändern.
              </p>
            </div>
          </section>

          {/* 6. Analyse-Tools */}
          <section id="analyse">
            <h2 className="mb-4 text-2xl font-bold">6. Analyse-Tools</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Wir nutzen derzeit keine Tracking- oder Analysedienste (wie Google Analytics, 
                Matomo o.ä.) auf dieser Website. Sollten wir in Zukunft Analyse-Tools 
                einsetzen, werden wir Sie entsprechend informieren und Ihre Einwilligung 
                einholen.
              </p>
            </div>
          </section>

          {/* 7. Social Media */}
          <section id="social">
            <h2 className="mb-4 text-2xl font-bold">7. Social Media</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Auf unserer Website finden Sie Links zu unseren Profilen in sozialen 
                Netzwerken (LinkedIn). Es findet kein automatischer Datenaustausch mit 
                diesen Diensten statt, solange Sie nicht auf einen Link klicken.
              </p>
              <p>
                Wenn Sie einem Link zu LinkedIn folgen, gelten die 
                Datenschutzbestimmungen von LinkedIn. Bitte informieren Sie sich 
                auf der jeweiligen Plattform über den Umgang mit Ihren Daten:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                    LinkedIn Datenschutzrichtlinie
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* 8. Ihre Rechte */}
          <section id="rechte">
            <h2 className="mb-4 text-2xl font-bold">8. Ihre Rechte</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden 
                personenbezogenen Daten:
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <strong className="text-[var(--text)]">Recht auf Auskunft</strong> (Art. 15 DSGVO): 
                  Sie können eine Bestätigung darüber verlangen, ob und welche personenbezogenen 
                  Daten wir über Sie verarbeiten.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Recht auf Berichtigung</strong> (Art. 16 DSGVO): 
                  Sie können die Berichtigung unrichtiger oder Vervollständigung unvollständiger 
                  Daten verlangen.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Recht auf Löschung</strong> (Art. 17 DSGVO): 
                  Sie können unter bestimmten Voraussetzungen die Löschung Ihrer Daten verlangen.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Recht auf Einschränkung</strong> (Art. 18 DSGVO): 
                  Sie können unter bestimmten Voraussetzungen die Einschränkung der Verarbeitung 
                  verlangen.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO): 
                  Sie können verlangen, Ihre Daten in einem strukturierten, gängigen Format zu 
                  erhalten.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Widerspruchsrecht</strong> (Art. 21 DSGVO): 
                  Sie können gegen die Verarbeitung Ihrer Daten Widerspruch einlegen.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Beschwerderecht</strong> (Art. 77 DSGVO): 
                  Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
                </li>
              </ul>
              <p className="mt-4">
                <strong className="text-[var(--text)]">Zuständige Aufsichtsbehörde:</strong><br />
                Landesbeauftragte für Datenschutz Nordrhein-Westfalen<br />
                Postfach 20 04 44, 40102 Düsseldorf<br />
                Telefon: 0211/38424-0<br />
                E-Mail: info@ldi.nrw.de
              </p>
            </div>
          </section>

          {/* 9. Änderungen */}
          <section id="aenderung">
            <h2 className="mb-4 text-2xl font-bold">9. Änderungen dieser Datenschutzerklärung</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie 
                stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen 
                unserer Leistungen in der Datenschutzerklärung umzusetzen.
              </p>
              <p>
                Die jeweils aktuelle Datenschutzerklärung finden Sie auf dieser Seite 
                mit dem标注 „Stand: [Datum]".
              </p>
            </div>
          </section>
        </div>

        {/* Footer navigation */}
        <div className="mt-16 flex flex-wrap gap-6 border-t border-[var(--border)] pt-8">
          <a 
            href="/impressum" 
            className="font-mono text-sm text-[var(--accent)] hover:underline"
          >
            → Impressum
          </a>
          <a 
            href="/" 
            className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"
          >
            → Startseite
          </a>
        </div>
      </div>
    </main>
  );
}
