import type { Metadata } from "next";
import { SITE } from "@/data/services";
import "../design-system.css";

const PAGE_URL = `${SITE.url}/impressum`;

export const metadata: Metadata = {
  title: "Impressum — MOHR & MORE",
  description:
    "Impressum und rechtliche Informationen der MOHR & MORE Business. Angaben gemäß § 5 TMG und § 55 Abs. 2 RStV.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: PAGE_URL,
      "x-default": PAGE_URL,
      en: `${SITE.url}/en/legal`,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Impressum — MOHR & MORE",
    description: "Impressum und rechtliche Informationen der MOHR & MORE Business.",
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
            Impressum
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Angaben gemäß § 5 TMG und § 55 Abs. 2 RStV
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none space-y-12">
          {/* Verantwortlicher */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Verantwortlicher</h2>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="font-semibold text-[var(--text)]">MOHR & MORE Business</p>
              <p className="mt-2 text-[var(--text-secondary)]">
                Gunnar Mohr & Gregor Mohr<br />
                Geschäftsführer
              </p>
              <div className="mt-4 space-y-1 text-sm text-[var(--text-secondary)]">
                <p>Köln, Deutschland</p>
              </div>
            </div>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Kontakt</h2>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="space-y-2 text-[var(--text-secondary)]">
                <p>
                  <strong className="text-[var(--text)]">E-Mail:</strong>{" "}
                  <a href="mailto:info@mohr-more.biz" className="text-[var(--accent)] hover:underline">
                    info@mohr-more.biz
                  </a>
                </p>
                <p>
                  <strong className="text-[var(--text)]">Internet:</strong>{" "}
                  <a href="https://mohr-more.biz" className="text-[var(--accent)] hover:underline">
                    https://mohr-more.biz
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Haftung für Inhalte */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Haftung für Inhalte</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. 
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können 
                wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß 
                § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen 
                Gesetzen verantwortlich.
              </p>
              <p>
                Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter 
                Umständen verpflichtet, übermittelte oder gespeicherte fremde Informationen 
                zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen 
                nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche 
                Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten 
                Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Haftung für Links</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren 
                Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden 
                Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten 
                verantwortlich.
              </p>
              <p>
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche 
                Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der 
                Verlinkung nicht erkennbar.
              </p>
              <p>
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne 
                konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei 
                Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend 
                entfernen.
              </p>
            </div>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Urheberrecht</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen 
                Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, 
                Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen 
                des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen 
                Autors bzw. Erstellers.
              </p>
              <p>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, 
                werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte 
                Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen 
                entsprechenden Hinweis.
              </p>
              <p>
                Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte 
                umgehend entfernen.
              </p>
            </div>
          </section>

          {/* Streitschlichtung */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Streitschlichtung</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung 
                (OS) bereit:{" "}
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren 
                vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>
        </div>

        {/* Footer navigation */}
        <div className="mt-16 flex flex-wrap gap-6 border-t border-[var(--border)] pt-8">
          <a 
            href="/datenschutz" 
            className="font-mono text-sm text-[var(--accent)] hover:underline"
          >
            → Datenschutzerklärung
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
