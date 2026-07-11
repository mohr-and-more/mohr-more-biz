import type { Metadata } from "next";
import { SITE } from "@/data/services";
import "../../design-system.css";

const PAGE_URL = `${SITE.url}/en/legal`;

export const metadata: Metadata = {
  title: "Legal Notice — MOHR & MORE",
  description:
    "Legal notice and required disclosures for MOHR & MORE Business in accordance with German law.",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      de: `${SITE.url}/impressum`,
      "x-default": PAGE_URL,
      en: PAGE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PAGE_URL,
    siteName: SITE.name,
    title: "Legal Notice — MOHR & MORE",
    description: "Legal notice and required disclosures for MOHR & MORE Business.",
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
            Legal Notice
          </h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Information according to § 5 TMG (German Teleservices Act)
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none space-y-12">
          {/* Responsible Party */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Responsible Party</h2>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="font-semibold text-[var(--text)]">MOHR & MORE Business</p>
              <p className="mt-2 text-[var(--text-secondary)]">
                Gunnar Mohr & Gregor Mohr<br />
                Managing Directors
              </p>
              <div className="mt-4 space-y-1 text-sm text-[var(--text-secondary)]">
                <p>Cologne, Germany</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Contact</h2>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="space-y-2 text-[var(--text-secondary)]">
                <p>
                  <strong className="text-[var(--text)]">Email:</strong>{" "}
                  <a href="mailto:info@mohr-more.biz" className="text-[var(--accent)] hover:underline">
                    info@mohr-more.biz
                  </a>
                </p>
                <p>
                  <strong className="text-[var(--text)]">Website:</strong>{" "}
                  <a href="https://mohr-more.biz" className="text-[var(--accent)] hover:underline">
                    https://mohr-more.biz
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Liability for Content */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Liability for Content</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                The contents of our pages have been created with the utmost care. 
                However, we cannot guarantee the accuracy, completeness, or timeliness 
                of the content. As a service provider, we are responsible for our 
                own content on these pages in accordance with § 7 para. 1 of the 
                German Teleservices Act (TMG).
              </p>
              <p>
                According to §§ 8 to 10 TMG, we are not obligated to monitor 
                transmitted or stored third-party information or to investigate 
                circumstances that indicate illegal activity.
              </p>
              <p>
                Obligations to remove or block the use of information under general 
                law remain unaffected. Liability in this regard is only possible 
                from the moment of knowledge of a specific legal violation. Upon 
                becoming aware of such violations, we will remove the content 
                immediately.
              </p>
            </div>
          </section>

          {/* Liability for Links */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Liability for Links</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                Our offer contains links to external websites of third parties, 
                the contents of which are beyond our control. We cannot assume 
                any responsibility for these external contents. The respective 
                provider or operator of the linked pages is always responsible 
                for their content.
              </p>
              <p>
                The linked pages were checked for possible legal violations at 
                the time of linking. Illegal content was not recognizable at 
                the time of linking.
              </p>
              <p>
                Permanent control of the linked pages is not reasonable without 
                concrete evidence of a legal violation. Upon becoming aware of 
                such violations, we will remove the respective links immediately.
              </p>
            </div>
          </section>

          {/* Copyright */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Copyright</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                The content and works created by the site operator on these pages 
                are subject to German copyright law. Duplication, processing, 
                distribution, or any form of commercialization of such material 
                beyond the scope of copyright law shall require the prior written 
                consent of the respective author or creator.
              </p>
              <p>
                Where the content on this site was not created by the operator, 
                the copyrights of third parties are observed. In particular, 
                third-party content is identified as such. Should you nevertheless 
                become aware of a copyright infringement, please notify us 
                accordingly.
              </p>
              <p>
                Upon becoming aware of legal violations, we will remove such 
                content immediately.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Online Dispute Resolution</h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                The European Commission provides a platform for online dispute 
                resolution (OS):{" "}
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
                Our email address can be found in the legal notice above.
              </p>
              <p>
                We are not prepared or obligated to participate in dispute 
                resolution proceedings before a consumer arbitration board.
              </p>
            </div>
          </section>
        </div>

        {/* Footer navigation */}
        <div className="mt-16 flex flex-wrap gap-6 border-t border-[var(--border)] pt-8">
          <a 
            href="/en/privacy" 
            className="font-mono text-sm text-[var(--accent)] hover:underline"
          >
            → Privacy Policy
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
