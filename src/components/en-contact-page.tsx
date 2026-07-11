"use client";

import { useEffect, useRef, useState, FormEvent } from "react";

/**
 * /en/contact — English contact page (MMB-468 / Sub 8)
 *
 * Mirrors the DE `KontaktPage` (`src/app/kontakt/kontakt-page.tsx`) but uses
 * EN copy directly (the page is already inside the EN layout; hardcoding the
 * EN strings here keeps the markup minimal and avoids reliance on the
 * client-side lang state for SEO-critical content).
 *
 * Server-Endpoint (same as DE): POST /api/kontakt
 *
 * Pre-fills the message field from ?subject= and ?source= query parameters,
 * matching the DE ?betreff=/?quelle= convention with EN aliases.
 */
export function EnContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject") ?? params.get("betreff");
    const source = params.get("source") ?? params.get("quelle");
    const form = formRef.current;
    if (!form) return;
    const msg = form.querySelector<HTMLTextAreaElement>('textarea[name="message"]');
    const subjectInput = form.querySelector<HTMLInputElement>('input[name="subject"]');
    if (subjectInput && subject) subjectInput.value = subject;
    if (msg && subject) {
      const src = source ? `\n\n(source: ${source})` : "";
      msg.value = `Subject: ${subject}${src}\n\n`;
    }
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/kontakt", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `HTTP ${res.status}`);
      }
      setStatus("ok");
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "44px",
    padding: "var(--mm-space-3)",
    background: "var(--mm-color-surface)",
    border: "1px solid var(--mm-color-border)",
    borderRadius: "var(--mm-radius-sm)",
    color: "var(--mm-color-text)",
    fontSize: "var(--mm-text-base)",
  };

  return (
    <main>
      <a href="#main" className="mm-skip-link">Skip to main content</a>

      <section className="mm-hero" aria-labelledby="contact-hero-title">
        <div className="mm-container" id="main">
          <div className="mm-hero-text">
            <span className="mm-tag">Contact</span>
            <h1 id="contact-hero-title">Let&apos;s talk.</h1>
            <p>
              We respond within 24 hours — personally, no strings attached, straight to the
              point. Pick the channel that suits you best.
            </p>
            <div className="mm-hero-actions">
              <a href="tel:+490000000000" className="mm-btn mm-btn-primary">
                <PhoneIcon /> Call us
              </a>
              <a href="mailto:info@mohr-more.biz" className="mm-btn mm-btn-secondary">
                <MailIcon /> Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section" aria-labelledby="contact-cards-title">
        <div className="mm-container">
          <h2 id="contact-cards-title">Multiple channels, one point of contact</h2>
          <div
            style={{
              marginTop: "var(--mm-space-6)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--mm-space-4)",
            }}
          >
            <a href="tel:+490000000000" className="mm-card" style={{ textDecoration: "none", color: "inherit" }}>
              <PhoneIcon />
              <h3 style={{ marginTop: "var(--mm-space-3)" }}>Direct line</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>+49 0000 0000000</p>
              <p style={{ fontSize: "var(--mm-text-sm)", color: "var(--mm-color-faint)" }}>
                Mon–Fri 8 AM–5 PM. Real people, no IVR maze.
              </p>
            </a>
            <a href="mailto:info@mohr-more.biz" className="mm-card" style={{ textDecoration: "none", color: "inherit" }}>
              <MailIcon />
              <h3 style={{ marginTop: "var(--mm-space-3)" }}>Send us a message</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>info@mohr-more.biz</p>
              <p style={{ fontSize: "var(--mm-text-sm)", color: "var(--mm-color-faint)" }}>
                Reply within 24 hours. Also for non-urgent requests.
              </p>
            </a>
            <div className="mm-card">
              <CalendarIcon />
              <h3 style={{ marginTop: "var(--mm-space-3)" }}>Book a slot directly</h3>
              <p style={{ color: "var(--mm-color-muted)" }}>
                30-minute consultation — calendar link drops you in a free slot in one click.
              </p>
              <a href="#contact-form" className="mm-btn mm-btn-secondary" style={{ marginTop: "var(--mm-space-3)" }}>
                Choose channel
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact-form"
        className="mm-section"
        style={{ background: "var(--mm-color-background)" }}
        aria-labelledby="contact-form-title"
      >
        <div className="mm-container" style={{ maxWidth: "720px" }}>
          <h2 id="contact-form-title">Send us a message</h2>
          <p style={{ color: "var(--mm-color-muted)", marginTop: "var(--mm-space-3)" }}>
            Four fields, GDPR checkbox, done. We&apos;ll get back within 24 hours.
          </p>
          {status === "ok" ? (
            <div
              role="status"
              className="mm-card"
              style={{
                marginTop: "var(--mm-space-6)",
                borderColor: "var(--mm-color-success)",
                background: "rgba(31, 138, 76, 0.08)",
              }}
            >
              <strong style={{ color: "var(--mm-color-success)" }}>Thank you!</strong>
              <p style={{ marginTop: "var(--mm-space-2)", color: "var(--mm-color-muted)" }}>
                We&apos;ve received your message and will reply within 24 hours.
              </p>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="mm-form"
              style={{
                marginTop: "var(--mm-space-6)",
                display: "grid",
                gap: "var(--mm-space-4)",
              }}
              noValidate
            >
              <input type="hidden" name="subject" />
              <div className="mm-form-row" style={{ display: "grid", gap: "var(--mm-space-2)" }}>
                <label htmlFor="name" style={{ fontWeight: 600 }}>Your name *</label>
                <input id="name" name="name" type="text" required style={inputStyle} autoComplete="name" placeholder="First and last name" />
              </div>
              <div className="mm-form-row" style={{ display: "grid", gap: "var(--mm-space-2)" }}>
                <label htmlFor="company" style={{ fontWeight: 600 }}>Company (optional)</label>
                <input id="company" name="company" type="text" style={inputStyle} autoComplete="organization" placeholder="Acme Corp." />
              </div>
              <div className="mm-form-row" style={{ display: "grid", gap: "var(--mm-space-2)" }}>
                <label htmlFor="email" style={{ fontWeight: 600 }}>Email address *</label>
                <input id="email" name="email" type="email" required style={inputStyle} autoComplete="email" placeholder="[email protected]" />
              </div>
              <div className="mm-form-row" style={{ display: "grid", gap: "var(--mm-space-2)" }}>
                <label htmlFor="message" style={{ fontWeight: 600 }}>Your message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  style={{ ...inputStyle, minHeight: "140px", resize: "vertical" }}
                  placeholder="What's it about? What do you want to achieve? When works for you?"
                />
              </div>
              <div className="mm-form-checkbox" style={{ display: "flex", gap: "var(--mm-space-2)", alignItems: "flex-start" }}>
                <input id="privacy" name="privacy" type="checkbox" required style={{ marginTop: "4px" }} />
                <label htmlFor="privacy" style={{ fontSize: "var(--mm-text-sm)", color: "var(--mm-color-muted)" }}>
                  I agree that MOHR &amp; MORE processes my details to handle this request according to
                  the privacy policy. Consent can be withdrawn at any time. (Privacy Policy)
                </label>
              </div>
              {status === "error" ? (
                <p role="alert" style={{ color: "var(--mm-color-danger)" }}>
                  Something went wrong. Please try again or call us directly.
                  {errorMsg ? ` (${errorMsg})` : null}
                </p>
              ) : null}
              <button
                type="submit"
                className="mm-btn mm-btn-primary"
                disabled={status === "sending"}
                style={{ minHeight: "48px" }}
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p style={{ fontSize: "var(--mm-text-xs)", color: "var(--mm-color-faint)" }}>
                Your data is processed solely to handle your request and is never shared with third
                parties. See our privacy policy for details.
              </p>
            </form>
          )}
        </div>
      </section>

      <section className="mm-section" aria-labelledby="contact-info-title">
        <div className="mm-container">
          <h2 id="contact-info-title">How to find us</h2>
          <div
            style={{
              marginTop: "var(--mm-space-6)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--mm-space-6)",
            }}
          >
            <div>
              <h3>Address</h3>
              <p style={{ color: "var(--mm-color-muted)", marginTop: "var(--mm-space-2)" }}>
                1 Sample Street<br />
                12345 Sample City<br />
                Germany
              </p>
            </div>
            <div>
              <h3>Office hours</h3>
              <p style={{ color: "var(--mm-color-muted)", marginTop: "var(--mm-space-2)" }}>
                Mon–Fri 8:00–17:00
              </p>
            </div>
            <div>
              <h3>Direct channels</h3>
              <ul style={{ listStyle: "none", padding: 0, marginTop: "var(--mm-space-2)", display: "grid", gap: "var(--mm-space-1)" }}>
                <li><a href="tel:+490000000000" style={{ color: "inherit" }}>+49 0000 0000000</a></li>
                <li><a href="mailto:info@mohr-more.biz" style={{ color: "inherit" }}>info@mohr-more.biz</a></li>
              </ul>
            </div>
          </div>
          <div
            style={{
              marginTop: "var(--mm-space-8)",
              aspectRatio: "16/9",
              maxHeight: "400px",
              background: "var(--mm-color-surface)",
              border: "1px solid var(--mm-color-border)",
              borderRadius: "var(--mm-radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--mm-color-faint)",
            }}
            aria-label="Map placeholder — 1 Sample Street, 12345 Sample City, Germany"
          >
            Map placeholder — 1 Sample Street, 12345 Sample City, Germany
          </div>
        </div>
      </section>
    </main>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}