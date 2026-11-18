import Link from "next/link";
import { FontStylesheets } from "@/components/font-stylesheets";
import "./globals.css";

/**
 * Global 404 document (app/global-not-found.tsx).
 *
 * The app uses two independent root layouts (DE and EN), so there is no single
 * layout that could wrap a global not-found page. This file renders its own
 * minimal document and keeps the German language tag for the exported
 * `404.html`.
 */
export default function NotFound() {
  return (
    <html lang="de">
      <head>
        <FontStylesheets />
      </head>
      <body className="antialiased">
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            404
          </p>
          <h1 style={{ fontSize: 32, margin: 0 }}>Diese Seite existiert nicht.</h1>
          <p style={{ margin: 0 }}>Die angeforderte Adresse wurde nicht gefunden.</p>
          <Link href="/" style={{ fontWeight: 600 }}>
            Zur Startseite
          </Link>
        </main>
      </body>
    </html>
  );
}
