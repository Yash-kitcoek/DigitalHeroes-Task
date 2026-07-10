# LinkVault

Branded short links with click analytics for marketing teams. LinkVault is a full-stack trial project built for the Digital Heroes Full Stack Developer Trial: auth, persistent data, CRUD, search/filter/pagination, redirects, analytics, SEO, docs, and open-source polish.

## Demo

- Demo email: `demo@linkvault.local`
- Demo password: `Demo1234`
- Local app: `http://localhost:3000`

## What It Does

LinkVault helps campaign teams create memorable short URLs, keep UTM context organized, export link data, and see which sources generate clicks. Every `/r/[slug]` redirect records a click event, then the dashboard turns those events into trend and source analytics.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript strict
- Supabase (Postgres) persistence
- HTTP-only cookie sessions
- CSS design tokens

## Quick Start

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor -> New query**, paste the contents of `sql/schema.sql`, and run it.
3. In **Project Settings -> API**, copy the **Project URL** and the **service_role** secret key.

```bash
pnpm install
cp .env.example .env.local
# then fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
pnpm dev
```

Then open `http://localhost:3000` and sign in with the demo account (the app seeds it automatically on first run).

## Environment Variables

| Name | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Absolute app URL for canonical SEO assets. |
| `SESSION_SECRET` | Recommended | Long random value for production session hardening. |
| `SUPABASE_URL` | Yes | Your Supabase project URL, from Project Settings -> API. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role secret key. Server-only — never expose this to the browser. |

## Scripts

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

## Architecture Notes

- `lib/db.ts` owns persistence and seed data, backed by Supabase Postgres (`lib/supabase.ts`); `sql/schema.sql` defines the tables.
- `lib/auth.ts` handles password hashing and HTTP-only sessions.
- `app/api/links` exposes CRUD, search, filters, pagination, and CSV export.
- `app/r/[slug]` is the public redirect endpoint that records clicks.
- Dashboard pages use server auth checks plus focused client components for interactivity.

## Deployment

Deploy to Vercel or Netlify with `npm run build`. Set `NEXT_PUBLIC_APP_URL` to your deployed URL, and add `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` in the platform's environment variable settings (same values as `.env.local`). Data now persists in Supabase Postgres, so it survives redeploys and cold starts.

## Digital Heroes Credit

Built as a portfolio-grade submission for the Digital Heroes Full Stack Developer Trial.
