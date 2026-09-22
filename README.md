# SentryVue Systems Website

Professional CCTV installation — See More. Stay Secure.

## Stack

Next.js 13, React 18, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Local setup

1. Install Node.js 18.17+ and npm.
2. Run `npm install` (this also runs `prisma generate` via the `postinstall` hook).
3. Copy `.env.example` to `.env.local` and provide the deployment values.
4. Apply migrations with `npm run db:migrate` when a PostgreSQL database is available.
5. Run `npm run dev` for local development.

## npm scripts

- `npm run dev` — start the Next.js dev server.
- `npm run build` — runs `prisma generate && next build`, so the Prisma client is always generated before the production build. This makes the build self-contained and portable across hosts.
- `npm run start` — start the production server (`next start`).
- `npm run db:migrate` — runs `prisma migrate deploy` to apply migrations against `DATABASE_URL`.

## Production deployment

Use any Node-compatible host that supports a Next.js server and a reachable PostgreSQL database. Set the environment variables below in the host dashboard, then run:

```text
npm ci
npm run db:migrate
npm run build
npm run start
```

`npm run build` regenerates the Prisma client automatically, so no separate `prisma generate` step is required. The application listens on the host-provided `PORT` through `next start`. Do not commit `.env` files or provider credentials.

### Optional build output mode

Set `NEXT_OUTPUT_MODE=standalone` to produce a standalone Next.js server bundle for container/self-hosted deployments. Leave it unset for the default build. The build no longer performs any hosting-provider-specific injection, so it runs identically on any host.

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
