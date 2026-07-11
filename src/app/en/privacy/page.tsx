import type { Metadata } from "next";
import { SITE } from "@/data/services";
import "../../design-system.css";

const PAGE_URL = `${SITE.url}/en/privacy`;

export const metadata: Metadata = {
  title: "Privacy Policy — MOHR & MORE",
  description:
    "Privacy policy for MOHR & MORE Business. Information according to GDPR regarding the processing of personal data.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: `${SITE.url}/datenschutz`,
      "x-default": PAGE_URL,
      en: PAGE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Privacy Policy — MOHR & MORE",
    description: "Privacy policy for MOHR & MORE Business.",
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
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Information according to GDPR regarding the processing of personal data
          </p>
          <p className="mt-2 font-mono text-sm text-[var(--text-faint)]">
            Last updated: July 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none space-y-12">
          {/* Table of Contents */}
          <nav className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="mb-4 text-lg font-bold">Table of Contents</h2>
            <ol className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#responsible" className="text-[var(--accent)] hover:underline">1. Controller</a></li>
              <li><a href="#contact" className="text-[var(--accent)] hover:underline">2. Contact for Data Protection</a></li>
              <li><a href="#processing" className="text-[var(--accent)] hover:underline">3. Data Processing on This Website</a></li>
              <li><a href="#form" className="text-[var(--accent)] hover:underline">4. Contact Form</a></li>
              <li><a href="#cookies" className="text-[var(--accent)] hover:underline">5. Cookies</a></li>
              <li><a href="#analytics" className="text-[var(--accent)] hover:underline">6. Analytics</a></li>
              <li><a href="#social" className="text-[var(--accent)] hover:underline">7. Social Media</a></li>
              <li><a href="#rights" className="text-[var(--accent)] hover:underline">8. Your Rights</a></li>
              <li><a href="#changes" className="text-[var(--accent)] hover:underline">9. Changes to This Privacy Policy</a></li>
            </ol>
          </nav>

          {/* 1. Controller */}
          <section id="responsible">
            <h2 className="mb-4 text-2xl font-bold">1. Controller</h2>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="font-semibold text-[var(--text)]">MOHR & MORE Business</p>
              <p className="mt-2 text-[var(--text-secondary)]">
                Gunnar Mohr & Gregor Mohr<br />
                Managing Directors
              </p>
              <div className="mt-4 space-y-1 text-sm text-[var(--text-secondary)]">
                <p>Cologne, Germany</p>
                <p>
                  Email:{" "}
                  <a href="mailto:info@mohr-more.biz" className="text-[var(--accent)] hover:underline">
                    info@mohr-more.biz
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Contact for Data Protection */}
          <section id="contact">
            <h2 className="mb-4 text-2xl font-bold">2. Contact for Data Protection</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Since we are not required to designate a data protection officer 
                under Art. 37 GDPR, data protection inquiries are handled directly 
                through the contact details listed above.
              </p>
              <p>
                For general questions about data protection or the processing of 
                your personal data, you can contact us at any time:
              </p>
              <p>
                <a href="mailto:info@mohr-more.biz" className="text-[var(--accent)] hover:underline">
                  info@mohr-more.biz
                </a>
              </p>
            </div>
          </section>

          {/* 3. Data Processing on This Website */}
          <section id="processing">
            <h2 className="mb-4 text-2xl font-bold">3. Data Processing on This Website</h2>
            <div className="space-y-6 text-[var(--text-secondary)]">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">3.1 Collection and Processing of Access Data</h3>
                <p>
                  Every time you visit our website, information is automatically 
                  collected by our web server (hosting provider). These server log 
                  files contain:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Browser type and browser version</li>
                  <li>Operating system used</li>
                  <li>Referrer URL (the previously visited page)</li>
                  <li>Subpages accessed via the accessing system</li>
                  <li>Hostname of the accessing computer (IP address anonymized)</li>
                  <li>Time of the server request</li>
                </ul>
                <p className="mt-2">
                  This data is not combined with other data sources and is used 
                  exclusively for statistical evaluations and the technical 
                  optimization of our website.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">3.2 Legal Basis</h3>
                <p>
                  Processing is carried out on the basis of Art. 6(1)(f) GDPR 
                  (legitimate interest in the technically flawless and optimized 
                  provision of the online service).
                </p>
              </div>
            </div>
          </section>

          {/* 4. Contact Form */}
          <section id="form">
            <h2 className="mb-4 text-2xl font-bold">4. Contact Form</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                If you contact us via the contact form, the data you provide 
                (name, email address, message) will be stored and processed for 
                the purpose of handling your inquiry.
              </p>
              <p>
                The data you enter in the form remains with us until you request 
                deletion, revoke your consent for storage, or the purpose for 
                data storage no longer applies (e.g., after your request has been 
                fully processed).
              </p>
              <p>
                <strong className="text-[var(--text)]">Legal Basis:</strong> Art. 6(1)(a) 
                GDPR (consent), when you contact us via the form.
              </p>
            </div>
          </section>

          {/* 5. Cookies */}
          <section id="cookies">
            <h2 className="mb-4 text-2xl font-bold">5. Cookies</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Our website uses so-called "cookies". Cookies are small text files 
                that are stored on your device and do not cause damage. They serve 
                to make our offering more user-friendly, effective, and secure.
              </p>
              
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                <h3 className="mb-2 font-semibold text-[var(--text)]">5.1 Necessary Cookies</h3>
                <p>
                  These cookies are technically required for the operation of the 
                  website and are set to ensure basic functionality and security. 
                  They cannot be disabled.
                </p>
                <p className="mt-2 font-mono text-xs">
                  Legal Basis: Art. 6(1)(f) GDPR (legitimate interest)
                </p>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                <h3 className="mb-2 font-semibold text-[var(--text)]">5.2 Consent Management</h3>
                <p>
                  We use a consent management tool (Klaro) to obtain and document 
                  your consent for the use of non-necessary cookies. When visiting 
                  our website, you will be informed about this tool and can set your 
                  cookie preferences individually.
                </p>
                <p className="mt-2 font-mono text-xs">
                  Legal Basis: Art. 6(1)(c) GDPR (legal obligation)
                </p>
              </div>

              <p>
                You can change your cookie preferences at any time via the link 
                at the bottom of the page.
              </p>
            </div>
          </section>

          {/* 6. Analytics */}
          <section id="analytics">
            <h2 className="mb-4 text-2xl font-bold">6. Analytics</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                We currently do not use any tracking or analytics services (such as 
                Google Analytics, Matomo, etc.) on this website. If we implement 
                analytics tools in the future, we will inform you accordingly and 
                obtain your consent.
              </p>
            </div>
          </section>

          {/* 7. Social Media */}
          <section id="social">
            <h2 className="mb-4 text-2xl font-bold">7. Social Media</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                On our website, you will find links to our profiles on social 
                networks (LinkedIn). No automatic data exchange with these services 
                takes place as long as you do not click on a link.
              </p>
              <p>
                If you follow a link to LinkedIn, LinkedIn's privacy policy applies. 
                Please inform yourself about data handling on the respective platform:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                    LinkedIn Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* 8. Your Rights */}
          <section id="rights">
            <h2 className="mb-4 text-2xl font-bold">8. Your Rights</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <strong className="text-[var(--text)]">Right of Access</strong> (Art. 15 GDPR): 
                  You can request confirmation as to whether and which personal data 
                  we process about you.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Right to Rectification</strong> (Art. 16 GDPR): 
                  You can request the correction of inaccurate or completion of incomplete 
                  data.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Right to Erasure</strong> (Art. 17 GDPR): 
                  You can request the erasure of your data under certain conditions.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Right to Restriction</strong> (Art. 18 GDPR): 
                  You can request the restriction of processing under certain conditions.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Right to Data Portability</strong> (Art. 20 GDPR): 
                  You can request to receive your data in a structured, commonly used format.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Right to Object</strong> (Art. 21 GDPR): 
                  You can object to the processing of your data.
                </li>
                <li>
                  <strong className="text-[var(--text)]">Right to Lodge a Complaint</strong> (Art. 77 GDPR): 
                  You have the right to lodge a complaint with a data protection supervisory authority.
                </li>
              </ul>
              <p className="mt-4">
                <strong className="text-[var(--text)]">Competent Supervisory Authority:</strong><br />
                Landesbeauftragte für Datenschutz Nordrhein-Westfalen<br />
                (State Commissioner for Data Protection North Rhine-Westphalia)<br />
                Postfach 20 04 44, 40102 Düsseldorf, Germany<br />
                Phone: +49 211 38424-0<br />
                Email: info@ldi.nrw.de
              </p>
            </div>
          </section>

          {/* 9. Changes */}
          <section id="changes">
            <h2 className="mb-4 text-2xl font-bold">9. Changes to This Privacy Policy</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                We reserve the right to amend this privacy policy so that it always 
                complies with current legal requirements or to reflect changes to 
                our services in the privacy policy.
              </p>
              <p>
                The current privacy policy can always be found on this page with the 
                date marked as "Last updated".
              </p>
            </div>
          </section>
        </div>

        {/* Footer navigation */}
        <div className="mt-16 flex flex-wrap gap-6 border-t border-[var(--border)] pt-8">
          <a 
            href="/en/legal" 
            className="font-mono text-sm text-[var(--accent)] hover:underline"
          >
            → Legal Notice
          </a>
          <a 
            href="/en" 
            className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"
          >
            → English Homepage
          </a>
        </div>
      </div>
    </main>
  );
}
