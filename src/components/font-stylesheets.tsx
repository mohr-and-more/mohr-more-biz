/**
 * Shared font stylesheets for both root layouts (DE: `src/app/(de)/layout.tsx`,
 * EN: `src/app/en/layout.tsx`).
 *
 * Kept in one place so the two independent documents load identical fonts and
 * preconnects. Rendered inside the root layout's `<head>`.
 */
export function FontStylesheets() {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@400,500,700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
