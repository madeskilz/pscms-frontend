#!/usr/bin/env bash
set -euo pipefail

# Static Strapi-Style Build Script
# Creates self-contained static bundle in /dist with SQLite database

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PUBLIC_DIR="$ROOT_DIR/public"
DIST_DIR="$ROOT_DIR/dist"

echo "[build] Creating static Strapi-style bundle..."

# Clean previous build
if [[ -d "$DIST_DIR" ]]; then
  echo "[build] Cleaning previous dist..."
  rm -rf "$DIST_DIR"
fi

# Create dist directory structure
mkdir -p "$DIST_DIR"
mkdir -p "$DIST_DIR/db"
mkdir -p "$DIST_DIR/js"
mkdir -p "$DIST_DIR/css"
mkdir -p "$DIST_DIR/themes"

# Copy main files
echo "[build] Copying application files..."
cp "$PUBLIC_DIR/index.html" "$DIST_DIR/"
cp -R "$PUBLIC_DIR/js"/* "$DIST_DIR/js/"
cp -R "$PUBLIC_DIR/css"/* "$DIST_DIR/css/"

# Copy themes from legacy frontend if present
FRONTEND_THEMES_DIR="$ROOT_DIR/frontend/themes"
if [[ -d "$FRONTEND_THEMES_DIR" ]]; then
  echo "[build] Copying theme assets from frontend/themes..."
  cp -R "$FRONTEND_THEMES_DIR"/* "$DIST_DIR/themes/"
fi

# Also copy any public embedded themes if they exist (fallback)
if [[ -d "$PUBLIC_DIR/themes" ]]; then
  echo "[build] Copying theme assets from public/themes..."
  cp -R "$PUBLIC_DIR/themes"/* "$DIST_DIR/themes/"
fi

# Copy utility pages
if [[ -f "$PUBLIC_DIR/db-tools.html" ]]; then
  cp "$PUBLIC_DIR/db-tools.html" "$DIST_DIR/"
fi

# Copy existing SQLite database if present from common locations
echo "[build] Checking for existing SQLite database to include..."
DB_CANDIDATES=(
  "$ROOT_DIR/data/cms.sqlite"
  "$ROOT_DIR/cms.db"
  "$ROOT_DIR/sqlite.db"
  "$ROOT_DIR/app.sqlite"
  "$ROOT_DIR/db/cms.db"
  "$ROOT_DIR/db/sqlite.db"
  "$ROOT_DIR/db/app.sqlite"
  "$PUBLIC_DIR/db/cms.db"
  "$PUBLIC_DIR/db/sqlite.db"
  "$PUBLIC_DIR/db/app.sqlite"
  "$PUBLIC_DIR/data/cms.db"
  "$PUBLIC_DIR/data/sqlite.db"
  "$PUBLIC_DIR/data/app.sqlite"
  "$PUBLIC_DIR/data/cms.sqlite"
)

DB_COPIED=false
for SRC in "${DB_CANDIDATES[@]}"; do
  if [[ -f "$SRC" ]]; then
    echo "[build] Found database: $SRC"
    BASENAME="$(basename "$SRC")"
    cp "$SRC" "$DIST_DIR/db/$BASENAME"
    DB_COPIED=true
    # Do not break; copy all known names so runtime fallback order works
  fi
done

if [[ "$DB_COPIED" == false ]]; then
  echo "[build] No existing database found. Dist will run in-memory until you export."
fi

# Create README for database directory
cat > "$DIST_DIR/db/README.md" <<'DBEOF'
# Database Directory

Place your `cms.db` SQLite database file here.

## Quick Start

1. **First Run**: If no database file exists the app runs in-memory
2. **Export**: Login → Admin → Export Database to download `cms.db`
3. **Place File**: Move `cms.db` into this `/db/` directory
4. **Refresh**: Reload the application to load from the file

## Supported Filenames

- `cms.db` (recommended)
- `sqlite.db`
- `app.sqlite`

The application will try to load from these filenames in order.

## File-Only Mode

This application operates in **FILE-ONLY MODE**:
- No localStorage used for admin data
- Database exists in memory during session
- Changes are lost on refresh unless exported
- Export database regularly to persist changes

## Workflow

1. **Load**: App loads database from this folder at startup
2. **Edit**: Make changes in admin dashboard (in-memory only)
3. **Export**: Use "Export Database" to download current state
4. **Replace**: Replace the file in this folder with the new version
5. **Refresh**: Reload page to use updated database

## Default Credentials

- **Email**: admin@school.test
- **Password**: ChangeMe123!

## Notes

- Database contains: posts, pages, users, settings, media, menus
- Sessions are in-memory only (logout on refresh)
- Export database before deploying updates
DBEOF

# Create main README for dist
cat > "$DIST_DIR/README.md" <<'MAINEOF'
# School CMS - Static Strapi-Style Bundle

A **pure client-side CMS** powered by SQLite WebAssembly. Runs entirely in the browser without Node.js.

## Build Structure

```
/dist                          # Production-ready static bundle
  ├── index.html              # Main entry point
  ├── db/                     # Database directory
  │   ├── cms.db             # SQLite database (place here)
  │   └── README.md          # Database instructions
  ├── js/                     # Application logic
  │   ├── main.js            # Application bootstrap
  │   ├── db.js              # SQLite layer (sql.js)
  │   └── ui.js              # UI rendering
  ├── css/                    # Stylesheets
  │   └── style.css          # Main styles
  ├── themes/                 # Theme assets (if applicable)
  └── db-tools.html          # Database management utility
```

## Deployment

### Static Hosting Options

Upload the entire `/dist` folder to:
- **AWS S3** + CloudFront
- **Netlify** / **Vercel**
- **GitHub Pages**
- **cPanel** (public_html)
- **Google Cloud Storage**
- Any static file server

### Quick Deploy

```bash
# Upload dist folder contents to web root
scp -r dist/* user@server:/var/www/html/

# Or for cPanel
# Upload via File Manager to public_html
```

## Database Setup

1. **First Launch**: Opens `index.html` (runs in-memory if no db file)
2. **Export Database**: Login → navigate to Database → Export
3. **Place File**: Move downloaded `cms.db` to `/dist/db/`
4. **Refresh**: Database loads from file automatically

## Admin Access

- **URL**: `/#/admin`
- **Email**: admin@school.test
- **Password**: ChangeMe123!

## File-Only Mode

- Database stored as SQLite file (no localStorage)
- Sessions in-memory only (logout on refresh)
  Export database after changes to persist data
  Replace `/dist/db/cms.db` with exported file

## Features

### Public Site
- Dynamic homepage with posts
- Post/page rendering
- Theme support
- Database-driven menus

### Admin Dashboard
- Posts & pages CRUD
- Media library (base64)
- Settings management
- Database export/import

## Usage

```bash
# Open locally
open dist/index.html

# Or serve via HTTP
python3 -m http.server 8080 --directory dist
# Then visit: http://localhost:8080
```

## Update Workflow

1. Make changes in admin
2. Export database (downloads cms.db)
3. Replace `/dist/db/cms.db` with new file
4. Refresh page
5. Deploy updated database to production

## Browser Requirements

- ES6+ JavaScript
- WebAssembly support
- Modern browser (Chrome, Firefox, Safari, Edge)

## License

MIT License
MAINEOF

echo "[build] ✓ Static bundle created in /dist"
echo ""
echo "📦 Distribution: $DIST_DIR"
echo ""
echo "🧪 Test Locally:"
echo "   python3 -m http.server 8080 --directory $DIST_DIR"
echo "   open http://localhost:8080"
echo ""
echo "🚀 Deploy:"
echo "   Upload /dist folder to your static host"
echo "   Place cms.db in /dist/db/ directory"
echo ""
