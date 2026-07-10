# Contributing

Thanks for improving LinkVault.

## Local Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Run `npm run dev`.
4. Sign in with `demo@linkvault.local` and `Demo1234`.

## Branches And Commits

- Use short branches like `feat/csv-export` or `fix/session-expiry`.
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.

## Before Opening A PR

Run:

```bash
npm run typecheck
npm test
npm run build
```

Open a PR with what changed, why it changed, and screenshots for UI work.
