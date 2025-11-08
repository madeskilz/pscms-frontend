# Unified CMS Deployment (cPanel-ready)

This is a **unified deployment** (like Strapi) - the backend serves both the API and the static frontend/admin UI.
Everything runs from a single Node.js process.

## Requirements
- Node.js 18+ (Node 20 recommended)
- Set environment variables (see below)

## Install & Run (general)
```bash
npm install --omit=dev
node src/index.js
```

The app serves:
- API endpoints at `/api/*`
- Media uploads at `/media/*`
- Frontend public site at `/` (all other routes)
- Admin UI at `/admin/*` (embedded in frontend build)

## Database
SQLite file is created automatically if not present. For shared hosting, set the DB path via env var:
`DATABASE_FILE=data/cms.sqlite`

Run migrations if needed:
```bash
npm run migrate
```

## Refresh Tokens & Media
Ensure persistent storage for `storage/uploads` and the database file.

## cPanel Node App Quick Setup
1. Upload contents of this folder to a directory in your account (e.g., `~/apps/pscms`).
2. In cPanel > Setup Node.js App:
   - Application root: the folder above
   - Application startup file: `src/index.js`
   - Node version: 20.x
   - Environment Variables:
     - `PORT=3001` (or leave blank for Passenger auto-assign)
     - `NODE_ENV=production`
     - `DATABASE_FILE=data/cms.sqlite`
     - `UPLOAD_DIR=storage/uploads`
3. If you didn't upload `node_modules`, click "Run NPM Install".
4. Click "Restart App".
5. Access your site:
   - Public site: https://yourdomain.com
   - Admin: https://yourdomain.com/admin
   - API: https://yourdomain.com/api/*

## Note on Frontend API Base
The frontend is built with a static API base URL. Ensure `NEXT_PUBLIC_API_BASE` matches your deployment URL:
- For same-domain deployment: Set to empty string or `/` (relative URLs)
- For separate API domain: Set to `https://api.yourdomain.com` before building
