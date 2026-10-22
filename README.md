# Taplo

The business hub for local service businesses: profiles, services, reviews, bookings, payments, teams, analytics, optional NFC.

Spec: the founder's *Taplo — Claude Code Product and Engineering Specification* v1.0. Start with `docs/implementation-status.md`.

## Develop
```bash
npm install
npm run dev            # http://localhost:3000 ; /dev/themes shows the theme showcase
npm run typecheck && npm run lint && npm test
npm run build && npm run test:e2e     # Playwright (set PW_CHROMIUM if the browser path differs)
```
DB integration tests run only when `TAPLO_TEST_DATABASE_URL` points at a throwaway Postgres 16 server (the harness creates and drops its own databases). Copy `.env.example` for configuration; no service is configured by default.

> Next.js 16 differs from older versions — read `AGENTS.md` and `node_modules/next/dist/docs/` before changing framework-level code.
