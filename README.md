# DistroKid Upload Assistant MVP

A production-ready scaffold for a bulk release packaging tool that does **not** rely on a DistroKid upload API. The system ingests audio, generates metadata and cover art jobs, and exports DistroKid-ready bundles.

## Project brief
- **Project name:** DistroKid Upload Assistant
- **Goal:** Generate distributor-ready release packages quickly without direct distributor APIs.
- **Target users:** Indie artists, label operators, catalog managers.
- **Core workflow:** Import → Generate → Export → (Optional) QC review.
- **Platform:** Web
- **Language:** TypeScript
- **Integrations:** SQLite (local), background worker
- **Must-have:** Bulk ingest, metadata generation jobs, cover art jobs, export-ready packaging
- **Nice-to-have:** ZIP import/export, AI adapters, multi-distributor export
- **Constraints:** No DistroKid upload API dependency, local-first SQLite storage.

## File tree
```
apps/
  api/
    migrations/
    src/
      db/
      routes/
    test/
  web/
    app/
  worker/
    src/
packages/
  shared/
    src/
    test/
docs/
  PROJECT_BRAIN.md
  CHANGELOG.md
data/
```

## Setup commands
```bash
npm install
npm run migrate
npm run dev        # web app
npm run api        # API server
npm run worker     # background worker
```

## Upgrade roadmap
1. Add ZIP import/export endpoints with streaming uploads.
2. Integrate S3-compatible storage and pre-signed URLs.
3. Build release editor UI and QC workflows.
4. Swap placeholder jobs with AI provider adapters.
5. Add distributor export templates beyond DistroKid.
