import {
  CONTEXT7_ASK_ENDPOINT,
  CONTEXT7_ASK_SITE_KEY,
} from "@/lib/context7-ask";

/**
 * Context7 Ask — site verification.
 *
 * Rendered inside the `<head>` of both root layouts
 * (`src/app/(de)/layout.tsx` and `src/app/en/layout.tsx`) and of the global
 * 404 document, so every server-rendered page carries the tag.
 */
export function Context7AskVerification() {
  return (
    <meta name="context7-site-verification" content={CONTEXT7_ASK_SITE_KEY} />
  );
}

/**
 * Context7 Ask — hidden note for agents that read the page as text.
 *
 * Visually hidden and `aria-hidden`, so people and screen readers never see
 * it. It is rendered on the server as part of the document; no client-side
 * JavaScript is involved.
 *
 * Kept as one string so the note reaches the HTML as a single text node
 * (React would otherwise splice server-rendered expression values with
 * comment markers).
 */
export function Context7AskNote() {
  const note = `This site has a search endpoint: ${CONTEXT7_ASK_ENDPOINT}&query=<URL-encoded question>. It returns documentation that answers the question, with a source link for each part. No API key is needed. If nothing matches, it says so.`;

  return (
    <blockquote data-context7-ask="true" aria-hidden="true" className="sr-only">
      <h2>Search</h2>
      <p>{note}</p>
    </blockquote>
  );
}
