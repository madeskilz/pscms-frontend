#!/usr/bin/env bash
set -euo pipefail

# Root build script: builds frontend static bundle and backend deployable artifact.
# Usage: ./build-all.sh [--clean] [--backend-zip] [--skip-frontend] [--skip-backend]
# Outputs:
#  - frontend/out/  (static export bundle)
#  - dist/backend.zip (if --backend-zip)
#  - backend/build/  (copied backend app files)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
DIST_DIR="$ROOT_DIR/dist"

CLEAN=0
ZIP_BACKEND=0
BACKEND_BUNDLE=0
STATIC_ONLY=0
SKIP_FRONTEND=0
SKIP_BACKEND=0

for arg in "$@"; do
  case "$arg" in
    --clean) CLEAN=1 ;;
    --backend-zip) ZIP_BACKEND=1 ;;
    --skip-frontend) SKIP_FRONTEND=1 ;;
    --skip-backend) SKIP_BACKEND=1 ;;
    --backend-bundle) BACKEND_BUNDLE=1 ;;
    --static-only) STATIC_ONLY=1 ;;
    *) echo "Unknown arg: $arg"; exit 1 ;;
  esac
 done

mkdir -p "$DIST_DIR"

# Verify Node version (Next.js requires >= 18.17.0)
REQUIRED_NODE_MAJOR=18
REQUIRED_NODE_MINOR=17
NODE_VER=$(node -v 2>/dev/null || echo "v0.0.0")
NODE_MAJOR=$(echo "$NODE_VER" | sed -E 's/^v([0-9]+)\..*/\1/')
NODE_MINOR=$(echo "$NODE_VER" | sed -E 's/^v[0-9]+\.([0-9]+).*/\1/')
if [[ -z "$NODE_MAJOR" || "$NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" || ( "$NODE_MAJOR" -eq "$REQUIRED_NODE_MAJOR" && "$NODE_MINOR" -lt "$REQUIRED_NODE_MINOR" ) ]]; then
  echo "[env][ERROR] Node.js $NODE_VER detected. Next.js requires >= v18.17.0." >&2
  echo "Install Node 20 LTS (recommended). If you use nvm:" >&2
  echo "  nvm install 20 && nvm use 20" >&2
  echo "Alternatively, run this build inside the provided Dockerfile (Node 20)." >&2
  exit 1
fi

if [[ $CLEAN -eq 1 ]]; then
  echo "[clean] Removing previous build artifacts"
  rm -rf "$FRONTEND_DIR/out" "$FRONTEND_DIR/.next" "$BACKEND_DIR/build" "$DIST_DIR/backend.zip"
fi

############################################
# Frontend static export
############################################
if [[ $SKIP_FRONTEND -eq 0 ]]; then
  echo "[frontend] Checking for SSR pages (getServerSideProps)"
  # Match actual function declarations only (ignore commented lines)
  SSR_MATCHES=$(grep -R -n --include="*.js" -E "^[[:space:]]*export[[:space:]]+async[[:space:]]+function[[:space:]]+getServerSideProps\b" "$FRONTEND_DIR/pages" || true)
  if [[ -n "$SSR_MATCHES" ]]; then
    echo "\n[frontend][ERROR] Static export is not possible because the following pages use getServerSideProps:" >&2
    echo "$SSR_MATCHES" >&2
    echo "\nTo enable static export for bucket hosting, convert these pages to use getStaticProps or client-side fetching." >&2
    echo "Aborting frontend static build." >&2
    exit 1
  fi

  echo "[frontend] Installing dependencies"
  (cd "$FRONTEND_DIR" && npm install)
  echo "[frontend] Building static export"
  (cd "$FRONTEND_DIR" && npm run build:static)
  echo "[frontend] Static files ready at frontend/out"
  # Single Page App fallbacks for common static hosts
  if [[ -f "$FRONTEND_DIR/out/index.html" ]]; then
    cp "$FRONTEND_DIR/out/index.html" "$FRONTEND_DIR/out/404.html" || true
    cp "$FRONTEND_DIR/out/index.html" "$FRONTEND_DIR/out/200.html" || true
  fi
  echo "[frontend] Creating archive dist/frontend-static.zip"
  (cd "$FRONTEND_DIR/out" && zip -qr "$DIST_DIR/frontend-static.zip" .)
  
  if [[ $STATIC_ONLY -eq 1 ]]; then
    echo "[static] Generating static API data from database"
    (cd "$BACKEND_DIR" && npm run export:static)
    echo "[static] Merging static API into frontend build"
    cp -R "$DIST_DIR/static-api/api" "$FRONTEND_DIR/out/api"
    echo "[static] Creating unified static bundle"
    rm -f "$DIST_DIR/static-complete.zip"
    (cd "$FRONTEND_DIR/out" && zip -qr "$DIST_DIR/static-complete.zip" .)
    echo "[static] Static-only deployment ready at dist/static-complete.zip"
  fi
  
  echo "[frontend] Embedding static build into backend for unified deployment"
fi

############################################
# Backend packaging
############################################
if [[ $SKIP_BACKEND -eq 0 ]]; then
  echo "[backend] Installing dependencies (production only)"
  (cd "$BACKEND_DIR" && npm install --omit=dev)
  echo "[backend] Running migrations"
  (cd "$BACKEND_DIR" && npm run migrate)
  echo "[backend] Seeding initial data (idempotent expected)"
  (cd "$BACKEND_DIR" && npm run seed || echo "[backend] Seed may have partial failures if data exists; continuing")

  echo "[backend] Creating build directory"
  rm -rf "$BACKEND_DIR/build"
  mkdir -p "$BACKEND_DIR/build"
  cp -R "$BACKEND_DIR/src" "$BACKEND_DIR/build/src"
  cp "$BACKEND_DIR/knexfile.js" "$BACKEND_DIR/build/"
  cp "$BACKEND_DIR/package.json" "$BACKEND_DIR/build/"
  # Include runtime assets for cPanel
  mkdir -p "$BACKEND_DIR/build/storage/uploads"
  mkdir -p "$BACKEND_DIR/build/data"
  
  # Embed frontend static build into backend (Strapi-style unified deployment)
  if [[ $SKIP_FRONTEND -eq 0 && -d "$FRONTEND_DIR/out" ]]; then
    echo "[backend] Copying frontend static build to backend/build/public"
    cp -R "$FRONTEND_DIR/out" "$BACKEND_DIR/build/public"
  fi
  # Try copying existing SQLite db if present (root data or backend/data)
  if [[ -f "$ROOT_DIR/data/cms.sqlite" ]]; then
    cp "$ROOT_DIR/data/cms.sqlite" "$BACKEND_DIR/build/data/cms.sqlite"
  elif [[ -f "$BACKEND_DIR/data/cms.sqlite" ]]; then
    cp "$BACKEND_DIR/data/cms.sqlite" "$BACKEND_DIR/build/data/cms.sqlite"
  fi
  # Generate a minimal README for backend deployment
  cat > "$BACKEND_DIR/build/README-deploy.md" <<'EOF'
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
EOF
  # Copy environment example if exists
  [[ -f "$ROOT_DIR/.env" ]] && cp "$ROOT_DIR/.env" "$BACKEND_DIR/build/.env.example" || true

  if [[ $ZIP_BACKEND -eq 1 ]]; then
    echo "[backend] Creating backend.zip"
    (cd "$BACKEND_DIR/build" && zip -r "$DIST_DIR/backend.zip" .)
    echo "[backend] Archive created at dist/backend.zip"
  fi

  if [[ $BACKEND_BUNDLE -eq 1 ]]; then
    echo "[backend] Vendoring production node_modules into build for cPanel"
    # Ensure production deps are installed in backend dir, then copy
    (cd "$BACKEND_DIR" && npm install --omit=dev)
    cp -R "$BACKEND_DIR/node_modules" "$BACKEND_DIR/build/node_modules"
    echo "[backend] node_modules copied into backend/build/node_modules"
  fi
fi

############################################
# Summary
############################################
 echo "Build complete." 
 echo "Artifacts:" 
 [[ $SKIP_FRONTEND -eq 0 ]] && echo " - Frontend static bundle: frontend/out" 
 [[ $SKIP_FRONTEND -eq 0 ]] && echo " - Frontend static zip: dist/frontend-static.zip" 
 [[ $STATIC_ONLY -eq 1 ]] && echo " - STATIC-ONLY complete bundle: dist/static-complete.zip (includes pre-rendered API)" 
 [[ $SKIP_BACKEND -eq 0 && $ZIP_BACKEND -eq 1 ]] && echo " - Backend zip: dist/backend.zip" 
 [[ $SKIP_BACKEND -eq 0 ]] && echo " - Backend build dir: backend/build" 
 [[ $SKIP_BACKEND -eq 0 && $BACKEND_BUNDLE -eq 1 ]] && echo " - Backend includes node_modules for cPanel upload"

echo "Next steps:" 
 if [[ $STATIC_ONLY -eq 1 ]]; then
   echo "  STATIC-ONLY: Upload 'dist/static-complete.zip' contents to any static host (S3, GCS, Netlify, cPanel public_html)."
   echo "  No Node.js required. Admin features disabled. API responses are pre-rendered JSON files."
 elif [[ $SKIP_BACKEND -eq 0 ]]; then
   echo "  UNIFIED DEPLOYMENT (Strapi-style): Upload 'backend/build' (or backend.zip) to cPanel and run as Node app."
   echo "  The backend serves both API (/api/*) and frontend static site (/) from one process."
 else
   echo "  Upload 'frontend/out' separately to static hosting and point NEXT_PUBLIC_API_BASE to your backend URL."
 fi 
