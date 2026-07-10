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
- Native Node persistence in `data/linkvault.json`
- HTTP-only cookie sessions
- CSS design tokens

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open `http://localhost:3000` and sign in with the demo account.

## Environment Variables

| Name | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Absolute app URL for canonical SEO assets. |
| `SESSION_SECRET` | Recommended | Long random value for production session hardening. |

## Scripts

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```

## Architecture Notes

- `lib/db.ts` owns persistence, seed data, and file writes.
- `lib/auth.ts` handles password hashing and HTTP-only sessions.
- `app/api/links` exposes CRUD, search, filters, pagination, and CSV export.
- `app/r/[slug]` is the public redirect endpoint that records clicks.
- Dashboard pages use server auth checks plus focused client components for interactivity.

## Deployment

Deploy to Vercel or Netlify with `npm run build`. Set `NEXT_PUBLIC_APP_URL` to your deployed URL. The file-backed store is ideal for review and local demos; production can replace `lib/db.ts` with Postgres or Supabase without changing the UI contracts.

## Digital Heroes Credit

Built as a portfolio-grade submission for the Digital Heroes Full Stack Developer Trial.
