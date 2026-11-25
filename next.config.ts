import type { NextConfig } from "next";

/**
 * Zwei Deploy-Ziele teilen sich diesen Code:
 *
 * - Cloudflare Pages (GitHub Action) braucht den statischen Export nach `out/`.
 * - Freebuff Sites baut über OpenNext einen Worker und braucht dafür einen
 *   Server-Build (`.next/standalone`); ein Export erzeugt den nicht.
 *
 * Deshalb ist der Export opt-in über `NEXT_STATIC_EXPORT=1` statt fest im
 * Config-Objekt.
 */
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  experimental: {
    globalNotFound: true,
  },
  images: {
    // Beide Ziele liefern die Bilder unverändert aus.
    unoptimized: true,
  },
};

export default nextConfig;
