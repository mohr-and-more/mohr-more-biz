"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * MOHR & MORE — Cookie Consent + GA4 Loader (MMB-468 / Sub 8)
 *
 * Implements a minimal, DSGVO-friendly consent gate that:
 *   1. Sets Google Consent Mode v2 defaults BEFORE gtag loads:
 *        ad_storage="denied", ad_user_data="denied",
 *        ad_personalization="denied", analytics_storage="denied",
 *        wait_for_update=500ms.
 *   2. Loads GA4 only after the user explicitly accepts analytics_storage.
 *   3. Persists consent in a first-party cookie (`mm_consent`) for 365 days.
 *   4. Renders a small banner at the bottom that lets the visitor
 *      accept or decline. Choice is sticky — banner re-appears only
 *      after the cookie expires or is cleared.
 *
 * GA4 Measurement ID is read from `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
 * If unset, the loader is a no-op (so staging/preview builds don't leak
 * analytics hits). Configure via Cloudflare Pages env vars or .env.local:
 *
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *
 * Roadmap note:
 *   - Klaro was the originally proposed CMP; it ships ~80 KB and is overkill
 *     for a single analytics-storage gate. This in-house banner hits the
 *     same DSGVO bar with no third-party bundle. Swap to Klaro or
 *     Cookiebot-Free later by replacing this file; the storage keys
 *     (`mm_consent`) and consent-mode defaults are stable.
 */
type ConsentChoice = "all" | "essential" | null;

const CONSENT_COOKIE = "mm_consent";
const CONSENT_MAX_AGE_DAYS = 365;

function readConsentCookie(): ConsentChoice {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")[1];
  if (raw === "all" || raw === "essential") return raw;
  return null;
}

function writeConsentCookie(choice: ConsentChoice) {
  if (typeof document === "undefined") return;
  const value = choice ?? "";
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${CONSENT_COOKIE}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
}

function updateConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  if (typeof w.gtag !== "function") return;
  if (choice === "all") {
    w.gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  } else {
    w.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }
}

export function ConsentManager() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [choice, setChoice] = useState<ConsentChoice>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from cookie on mount.
  useEffect(() => {
    const existing = readConsentCookie();
    setChoice(existing);
    setHydrated(true);
    // If user already accepted in a previous visit, apply consent immediately
    // so the page_view that fires on first render is captured.
    if (existing === "all" && typeof window !== "undefined") {
      // wait one microtask so dataLayer is initialized by the inline script
      queueMicrotask(() => updateConsent("all"));
    }
  }, []);

  const accept = () => {
    writeConsentCookie("all");
    setChoice("all");
    updateConsent("all");
  };
  const decline = () => {
    writeConsentCookie("essential");
    setChoice("essential");
    updateConsent("essential");
  };

  const gaLoaded = hydrated && choice === "all" && !!measurementId;

  return (
    <>
      {/*
        Google Consent Mode v2 — must run BEFORE the GA4 tag loads.
        Sets default state to "denied" for every storage slot and asks
        gtag to wait up to 500ms for an update() call before sending data.
      */}
      <Script id="mm-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'denied',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500
          });
          gtag('js', new Date());
        `}
      </Script>

      {gaLoaded ? (
        <>
          <Script
            id="mm-ga4-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          />
          <Script id="mm-ga4-config" strategy="afterInteractive">
            {`gtag('config', '${measurementId}', { anonymize_ip: true, send_page_view: true });`}
          </Script>
        </>
      ) : null}

      {/*
        Consent banner — only shown until the user makes a choice.
        Renders as a non-blocking strip at the bottom of the viewport.
        Uses .sr-only utility for the visual label; the banner content is
        self-describing.
      */}
      {hydrated && choice === null ? (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          style={{
            position: "fixed",
            insetInline: 0,
            bottom: 0,
            zIndex: 100,
            padding: "var(--mm-space-4)",
            background: "var(--mm-color-dark-bg, #1F2A2E)",
            color: "var(--mm-color-dark-fg, #F4F5F6)",
            borderTop: "1px solid var(--mm-color-border, #E4E7E8)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--mm-space-4)",
            boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.18)",
          }}
        >
          <div style={{ maxWidth: "720px", flex: "1 1 320px", fontSize: "var(--mm-text-sm, 0.95rem)" }}>
            <strong style={{ display: "block", marginBottom: "var(--mm-space-1)" }}>
              We use cookies.
            </strong>
            <span style={{ opacity: 0.86 }}>
              We use Google Analytics (anonymized IPs) only if you accept. Essential cookies
              (security, session) always run. You can change your choice anytime by clearing
              browser cookies for this site.
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--mm-space-2)" }}>
            <button
              type="button"
              onClick={decline}
              className="mm-btn mm-btn-ghost"
              style={{
                minHeight: "44px",
                borderColor: "var(--mm-color-border-strong, #C9CDD0)",
                color: "var(--mm-color-dark-fg, #F4F5F6)",
              }}
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={accept}
              className="mm-btn mm-btn-primary"
              style={{ minHeight: "44px" }}
            >
              Accept analytics
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}