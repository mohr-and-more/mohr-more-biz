"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mermaid: any;
  }
}

/**
 * Renders a Mermaid diagram client-side using the mermaid.js library (loaded
 * from CDN once). Falls back to a <pre> code block if the library fails to
 * load, so the content is always visible (and SEO/indexable).
 */
export function Mermaid({
  chart,
  ariaLabel,
}: {
  chart: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m: any = await loadMermaid();
      if (cancelled || !m) {
        setFailed(true);
        return;
      }
      try {
        m.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            darkMode: true,
            background: "transparent",
            primaryColor: "#121216",
            primaryTextColor: "#f5f7fb",
            primaryBorderColor: "rgba(159,248,242,0.5)",
            lineColor: "rgba(245,247,251,0.45)",
            secondaryColor: "#18181d",
            tertiaryColor: "#0d0d0f",
            textColor: "#f5f7fb",
            mainBkg: "#121216",
            nodeBorder: "rgba(159,248,242,0.45)",
          },
          fontFamily: "'Satoshi','Inter',sans-serif",
        });
        const id = `mmd-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await m.render(id, chart);
        if (!cancelled) setHtml(svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (failed) {
    return (
      <pre
        className="ascii-block"
        role="img"
        aria-label={ariaLabel}
      >
        {chart}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-host"
      role="img"
      aria-label={ariaLabel}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {!html ? <pre className="ascii-block">{chart}</pre> : null}
    </div>
  );
}

// Singleton loader so multiple diagrams share one mermaid.js download.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mermaidPromise: Promise<any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadMermaid(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.mermaid) return Promise.resolve(window.mermaid);
  if (mermaidPromise) return mermaidPromise;
  mermaidPromise = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    s.async = true;
    s.onload = () => resolve(window.mermaid ?? null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return mermaidPromise;
}
