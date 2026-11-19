/**
 * Cloudflare Pages Function — www auf Apex umleiten
 *
 * www.mohr-more.biz ist als Custom Domain am Pages-Projekt `mohr-more`
 * angehängt, damit die Subdomain überhaupt erreichbar ist. Ausgeliefert
 * werden soll aber ausschließlich mohr-more.biz (so zeigen auch alle
 * Canonicals). Deshalb antwortet jede Anfrage an die www-Subdomain mit
 * einem permanenten 301 auf dieselbe URL unter der Apex-Domain — Pfad und
 * Query-String bleiben unverändert.
 *
 * Die Middleware liegt im Wurzelverzeichnis von `functions/` und läuft
 * damit vor allen anderen Functions und vor den statischen Dateien.
 * Alle anderen Hosts (Apex, *.pages.dev) werden unverändert durchgereicht,
 * damit /api/* und die Previews weiter funktionieren.
 */

const APEX_HOST = "mohr-more.biz";
const WWW_HOST = `www.${APEX_HOST}`;

interface MiddlewareContext {
  request: Request;
  next: () => Promise<Response>;
}

export const onRequest = async (context: MiddlewareContext): Promise<Response> => {
  const url = new URL(context.request.url);

  if (url.hostname === WWW_HOST) {
    const target = new URL(`${url.pathname}${url.search}`, `https://${APEX_HOST}`);
    return Response.redirect(target.toString(), 301);
  }

  return context.next();
};
