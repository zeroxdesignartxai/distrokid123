# Project Brain — DistroKid Upload Assistant

## Vision
Deliver a distributor-agnostic release packaging tool that automates metadata and assets without relying on DistroKid upload APIs.

## Target users
- Indie artists managing multiple releases.
- Small labels coordinating catalog bulk uploads.
- Managers needing consistent metadata exports.

## Brand rules
- Voice: confident, pragmatic, artist-friendly.
- Design: dark UI, high-contrast, minimal distractions.

## Tech stack
- Next.js (App Router) for the web UI.
- Fastify API with Zod validation.
- SQLite local persistence with migration scripts.
- Node worker polling background jobs.

## Environments
- Local dev: SQLite file stored in `data/dev.sqlite`.

## Standard commands
- Install: `npm install`
- Migrate: `npm run migrate`
- Lint: `npm run lint`
- Unit tests: `npm run test`
- Build: `npm run build`

## Known issues
- Jobs are placeholder implementations; AI integrations are stubbed.
- Dependency install can fail if the npm registry is blocked by network policy.

## Decisions
- Use SQLite to keep local-first MVP lightweight.
- Background worker processes queued jobs in the same database.

## Roadmap
1. Streaming ZIP import/export.
2. S3-compatible storage for audio/art assets.
3. AI provider adapters for metadata + cover art.
4. Multi-distributor export templates.

## Run log
- 2026-01-12: `npm install` failed (403 from registry).
- 2026-01-12: `npm run lint` failed (missing dependencies).
- 2026-01-12: `npm run test` failed (missing dependencies).
- 2026-01-12: `npm run build` failed (missing dependencies).
