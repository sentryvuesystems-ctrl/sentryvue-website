# SentryVue Systems Website

Professional CCTV installation — See More. Stay Secure.

## Stack

Next.js 13, React 18, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Local setup

1. Install Node.js 18.17+ and npm.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and provide the deployment values.
4. Run `npx prisma generate`.
5. Apply migrations with `npx prisma migrate deploy` when a PostgreSQL database is available.
6. Run `npm run dev` for local development.

## Production deployment

Use any Node-compatible host that supports a Next.js server and a reachable PostgreSQL database. Set the environment variables below in the host dashboard, then run:

```text
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

The application listens on the host-provided `PORT` through `next start`. Do not commit `.env` files or provider credentials.

## Required environment variables

- `DATABASE_URL` — PostgreSQL connection string.
- `NEXT_PUBLIC_SITE_URL` — public site URL, used for notification branding.

## Notification environment variables

Email alerts use Resend:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` — a verified sender, for example `SentryVue Website <alerts@your-domain>`.
- `ENQUIRY_ALERT_EMAIL` — defaults to `sentryvuesystems@gmail.com`.

The email notification is formatted as an order sheet and includes the SentryVue logo, brand colours, and every submitted enquiry field.

## Deployment portability notes

- The Prisma client uses the standard generated location; it no longer contains a machine-specific absolute path.
- Build configuration is controlled through environment variables rather than a particular hosting provider.
- Persistent data belongs in PostgreSQL, not the local filesystem.
- Email provider credentials must be configured per host as environment variables.
- Domain DNS, HTTPS, and any provider callback/verification settings must be updated when changing hosts.
