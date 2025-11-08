#!/usr/bin/env bash
set -euo pipefail

# Static Build Script for Pure Client-Side SQLite CMS
# Copies /public to /build (no compilation, just assembly)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PUBLIC_DIR="$ROOT_DIR/public"
BUILD_DIR="$ROOT_DIR/build"

echo "[build] Creating static build..."

# Clean previous build
if [[ -d "$BUILD_DIR" ]]; then
  echo "[build] Cleaning previous build..."
  rm -rf "$BUILD_DIR"
fi

# Create build directory
mkdir -p "$BUILD_DIR"

# Copy all files from public to build
echo "[build] Copying files from /public to /build..."
cp -R "$PUBLIC_DIR"/* "$BUILD_DIR/"

# Create data directory if it doesn't exist
mkdir -p "$BUILD_DIR/data"

# Create README for deployment
cat > "$BUILD_DIR/README.md" <<'EOF'
# School CMS - Pure Client-Side SQLite Application

This is a **pure client-side CMS** that runs entirely in the browser using SQLite WebAssembly (sql.js).

## Architecture

- **No Node.js required** - runs directly from `index.html`
- **No API server** - all data operations happen in-browser
- **SQLite database** stored in browser localStorage
- **Vanilla JavaScript** - no frameworks, no build tools

## Structure

```
/build
  ├── index.html       # Main entry point
  ├── js/
  │   ├── main.js      # Application orchestrator
  │   ├── db.js        # SQLite database layer (sql.js)
  │   └── ui.js        # UI rendering and DOM manipulation
  ├── css/
  │   └── style.css    # Styles
  └── data/            # Optional: place for sqlite file backups
```

## Deployment

### Option 1: Local File System
1. Open `index.html` directly in a modern browser
2. Database is created automatically in localStorage

### Option 2: Static Web Hosting
1. Upload entire `/build` folder to any static host:
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Netlify
   - Vercel
   - GitHub Pages
   - cPanel `public_html`
2. Access via your domain - database persists in browser storage

### Option 3: cPanel Static Hosting
1. Upload contents of `/build` to `public_html` (or subdirectory)
2. Access via: `https://yourdomain.com/`
3. No Node.js setup required

## Features

### Public Site
- Homepage with hero, features, and recent posts
- Posts listing and individual post pages
- Pages (About, Contact, etc.)
- Dynamic menu from database
- Fully themed UI

### Admin Dashboard (`#/admin`)
- Login: `admin@school.test` / `ChangeMe123!`
- Create/Edit/Delete posts and pages
- Media library with file uploads (base64)
- Settings management (site title, theme)
- Database export/import
- Full CRUD operations

## Database

- **Location**: Browser localStorage (key: `cms_database`)
- **Format**: Base64-encoded SQLite database
- **Persistence**: Survives page reloads, tied to browser/domain
- **Export**: Download `.sqlite` file from admin
- **Import**: Upload `.sqlite` file to restore

## Browser Requirements

- Modern browser with:
  - ES6+ JavaScript support
  - WebAssembly support
  - localStorage
  - FileReader API

## Data Persistence

All data is stored locally in the browser:
- **Posts, pages, settings, menus** → SQLite in localStorage
- **Media files** → Base64-encoded in SQLite
- **User sessions** → localStorage

**Important**: Clearing browser data will erase the database. Use the export feature to back up your data.

## Security Notes

- This is a **client-side demo/prototype** suitable for:
  - Personal sites
  - Prototypes
  - Static marketing sites
  - Educational projects

- **NOT suitable for production** with multiple users because:
  - Passwords use simple SHA-256 (demo only)
  - No server-side validation
  - Data only exists in each user's browser
  - No real authentication or authorization

## Development

To modify:
1. Edit files in `/public`
2. Run `./build-static.sh` to rebuild
3. Open `/build/index.html` in browser

## Troubleshooting

**Database not loading?**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try clearing localStorage and reloading

**Changes not saving?**
- Verify browser console shows "Database saved to localStorage"
- Check localStorage isn't full (quota ~5-10MB)

**Media uploads failing?**
- Large images may exceed localStorage quota
- Consider resizing images before upload

## License

MIT License - Free to use and modify

EOF

echo "[build] ✓ Static build complete!"
echo ""
echo "Build output: $BUILD_DIR"
echo ""
echo "To test locally:"
echo "  1. Open $BUILD_DIR/index.html in a browser"
echo "  2. Or serve via: python3 -m http.server 8000 --directory $BUILD_DIR"
echo ""
echo "To deploy:"
echo "  Upload entire /build folder to your static host"
echo ""
