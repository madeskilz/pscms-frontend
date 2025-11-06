# pscms-frontend

This repository contains a production-ready scaffold for a K12-focused CMS (Next.js frontend + Express + SQLite backend).

What was added in this scaffold:

- `backend/` — Express API server, Objection + Knex setup, core migration, auth and posts route stubs.
- `frontend/` — Next.js app (Pages) with Tailwind, three theme stubs (classic, interactive, modern), and a small hero component.
- `docker/` — simple Dockerfile for combined container (editable).
- `.env.example` — example environment variables.
- `.gitignore` updated to ignore data and uploads.

Quick start (development):

1. Install dependencies for backend and frontend (in separate terminals):

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Create the SQLite database and run migrations:

```bash
cd backend
npm run migrate
```

3. Start the backend and frontend:

```bash
cd backend && npm run dev
cd ../frontend && npm run dev
```

Notes:
- The scaffold includes a core Knex migration `backend/src/migrations/20251106_create_core_tables.js` for roles, users, posts, media, taxonomies, comments, settings, and analytics events.
- Authentication is a minimal JWT + bcrypt example. Refresh tokens, RBAC enforcement, and plugin loading are left as next steps.
- Theme stubs live under `frontend/themes` and the site pages are under `frontend/pages`.

Next steps (recommended):

- Implement refresh token storage and rotation in `backend`.
- Add media upload endpoint and sharp-based image processing.
- Implement plugin registry (backend/plugins) and admin UI for plugin management.
- Add unit tests (Jest) and E2E tests (Playwright) as CI steps.
