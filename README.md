This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Dokumentation

- [kontaktformular-setup.md](kontaktformular-setup.md) — Cloudflare-Einrichtung des Kontaktformulars: Email Sending, API-Token, Pages-Variablen, KV-Binding `KONTAKT_ARCHIVE`, GitHub-Secret `KONTAKT_RETRY_TOKEN`, Redeploy.
- [design-system.md](design-system.md) — Design System (Tokens, Komponenten) und Stand des Rollouts.

### Kontaktformular prüfen

```bash
npm run mail:test                 # eine Testmail über /api/kontakt/test
KONTAKT_RETRY_TOKEN=… npm run kontakt:check   # Live-Check: Mailversand, Archiv, Retry
```

`kontakt:check` schickt eine als „Live-Check“ markierte Anfrage durch das Formular und belegt danach, ob sie zugestellt, archiviert und – falls nötig – nachgeliefert wurde. Details und Fehlerbehebung: [kontaktformular-setup.md](kontaktformular-setup.md).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
