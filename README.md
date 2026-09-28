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

## Troubleshooting: enquiry / quote not saving

If the enquiry or quote form returns "An unexpected error occurred. Please try again."
even though the fields are valid, the API route caught an error while writing to the
database or the DB write itself failed. Check the following, in order:

1. **The `ContactSubmission` table must exist.** A baseline migration lives in
   `prisma/migrations/0_init`. Apply it once against the production database:
   - Fresh database (table does not exist yet): `npx prisma migrate deploy`.
   - Database already provisioned via an earlier `prisma db push` (table already
     exists): baseline the migration first so it is not re-applied, then deploy:
     `npx prisma migrate resolve --applied 0_init` followed by
     `npx prisma migrate deploy`.
2. **`DATABASE_URL` must be set** in the host/Vercel project settings and point at the
   Neon/PostgreSQL database. Never commit this value.
3. **`RESEND_API_KEY` must be spelled exactly** (uppercase, underscores). The code reads
   `process.env.RESEND_API_KEY`; a variable named `Resend_API_Key` (mixed case) will be
   ignored and email alerts will be skipped. Email is decoupled from the DB write — a
   missing/wrong Resend key no longer causes a failed submission, it only skips the alert.
4. **Prisma client binary target.** `prisma/schema.prisma` declares Vercel-compatible
   `binaryTargets` (`rhel-openssl-1.0.x`, `rhel-openssl-3.0.x`) so the client generated
   during `postinstall` matches the serverless runtime. `prisma generate` runs on install.

Note: the standalone configurator endpoint (`/api/configure-enquiry`) lives on the
`feature/buy-now-configurator` branch and is not part of `main` (the `/quote` route
redirects to `/#contact` here). That endpoint already applies the same email-decoupling
fix; enabling it is a separate change from this persistence fix.

## Deployment portability notes

- The Prisma client uses the standard generated location; it no longer contains a machine-specific absolute path.
- Build configuration is controlled through environment variables rather than a particular hosting provider.
- Persistent data belongs in PostgreSQL, not the local filesystem.
- Email provider credentials must be configured per host as environment variables.
- Domain DNS, HTTPS, and any provider callback/verification settings must be updated when changing hosts.
