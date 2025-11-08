# Build System Summary

## What Was Created

### 1. Pure Static Deployment (No Node.js)

The CMS now supports **completely static deployment** where all API responses are pre-rendered as JSON files at build time.

**Build Command:**
```bash
./build-all.sh --static-only --clean
```

**Output:** `dist/static-complete.zip` (429 KB)

**Contains:**
- 22 pre-rendered HTML pages (all routes)
- 13 pre-rendered JSON API files in `/api/**/*.json`
- All static assets (_next, CSS, JS)
- Media uploads (if any)

**Deployment:** Upload to any static host (S3, Netlify, Vercel, GitHub Pages, cPanel public_html)

**No Backend Required** - Everything is pre-rendered!

---

## How It Works

### Build Process

1. **Frontend Build** (`frontend/`)
   - Next.js builds 22 static pages with `output: 'export'`
   - All SSR removed (converted to client-side fetching)
   - Images set to unoptimized for static hosting
   - Output: `frontend/out/`

2. **Backend Static Export** (`backend/src/export-static.js`)
   - Queries SQLite database
   - Exports posts, pages, settings, menus to JSON files
   - Mimics API response format: `{ data: ..., pagination: ... }`
   - Output: `dist/static-api/`

3. **Merge & Package**
   - Copies `static-api/` into `frontend/out/api/`
   - Creates `dist/static-complete.zip`
   - Ready to upload anywhere!

### Runtime Behavior

**With `NEXT_PUBLIC_STATIC_API=true`:**
- Frontend tries `/api/posts/index.json` first
- Falls back to live API if JSON not found
- No backend server needed for GET requests

**Frontend API Client** (`frontend/lib/api.js`):
```javascript
// Tries static JSON first
const staticPath = url.replace(API_BASE, '') + '/index.json';
const staticResponse = await fetch(staticPath);
if (staticResponse.ok) {
    return staticResponse.json();
}
// Falls back to API server
```

---

## Build Flags

The `build-all.sh` script supports multiple deployment modes:

### Static-Only Deployment
```bash
./build-all.sh --static-only --clean
```
- Pre-renders all API responses
- No Node.js required
- Perfect for Netlify/S3/cPanel
- Output: `dist/static-complete.zip`

### Unified Deployment (Strapi-style)
```bash
./build-all.sh --backend-bundle --clean
```
- Backend serves frontend from `/public`
- API at `/api/*`, media at `/media/*`
- Single Node.js app for everything
- Output: `backend/build/` with vendored node_modules

### Traditional Split
```bash
./build-all.sh --backend-zip --clean
```
- Separate frontend and backend
- Frontend: `dist/frontend-static.zip`
- Backend: `dist/backend.zip`
- Deploy independently

### Available Flags
- `--clean` - Remove previous builds
- `--static-only` - Generate pure static bundle
- `--backend-zip` - Create backend.zip
- `--backend-bundle` - Vendor node_modules into backend/build
- `--skip-frontend` - Skip frontend build
- `--skip-backend` - Skip backend build

---

## Files Modified/Created

### New Files
1. **`backend/src/export-static.js`** - Exports DB to static JSON
2. **`frontend/.env.static`** - Environment for static mode
3. **`README-STATIC-DEPLOYMENT.md`** - Complete deployment guide

### Modified Files
1. **`build-all.sh`** - Added `--static-only` flag and static export integration
2. **`backend/package.json`** - Added `export:static` script
3. **`frontend/lib/api.js`** - Added static JSON fallback logic
4. **`README.md`** - Updated deployment section with 3 options

### Previous Changes (from earlier work)
- All pages converted from `getServerSideProps` to client-side `useEffect`
- `frontend/next.config.js` - Added `output: 'export'`
- `.nvmrc` - Set to Node 20
- `docker/Dockerfile` - Multi-stage build
- `backend/src/index.js` - Unified deployment (serves frontend from /public)

---

## Example Static API Files

### Posts List (`/api/posts/index.json`)
```json
{
  "data": [
    {
      "id": 3,
      "type": "post",
      "status": "published",
      "title": "Welcome Back to School",
      "slug": "welcome-back",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2
  }
}
```

### Individual Post (`/api/posts/welcome-back/index.json`)
```json
{
  "data": {
    "id": 3,
    "title": "Welcome Back to School",
    "content": "<p>We are excited...</p>",
    "slug": "welcome-back",
    ...
  }
}
```

### Settings (`/api/settings/theme/index.json`)
```json
{
  "data": {
    "key": "theme",
    "value": "colorlib-fresh"
  }
}
```

---

## Deployment Comparison

| Feature | Static-Only | Unified | Split |
|---------|-------------|---------|-------|
| **Node.js Required** | ❌ No | ✅ Yes | ✅ Yes |
| **Cost** | Free/cheap | Moderate | Higher |
| **Performance** | ⚡ Fastest | Fast | Fast |
| **Admin UI** | ❌ Disabled | ✅ Works | ✅ Works |
| **Content Updates** | Rebuild required | Live | Live |
| **Hosting Options** | Any static host | cPanel/VPS | Any host |
| **Complexity** | Simple | Medium | Complex |
| **Security** | 🔒 Most secure | Secure | Secure |

---

## Testing

### Local Static Server Test
```bash
cd /Applications/MAMP/htdocs/pscms-frontend
unzip dist/static-complete.zip -d test-deploy
cd test-deploy
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Check Static API Files
```bash
curl http://localhost:8000/api/posts/index.json | python3 -m json.tool
curl http://localhost:8000/api/settings/theme/index.json
```

### Verify Build Artifacts
```bash
ls -lh dist/
# Should show:
# - frontend-static.zip (433 KB)
# - static-complete.zip (429 KB)
# - static-api/ directory
```

---

## Limitations of Static-Only Mode

### ⚠️ What Doesn't Work
- **Admin UI** - No login/auth (server-side required)
- **Create/Edit/Delete** - Read-only (must rebuild to update)
- **User Forms** - Contact forms need external service (Formspree)
- **Search** - Need client-side search (lunr.js) or external service
- **Comments** - Need external service (Disqus, Commento)
- **Real-time Data** - All data is from build time

### ✅ What Works Perfectly
- **All public pages** - Homepage, about, contact, posts
- **Blog listing** - All published posts
- **Individual posts** - Full content and metadata
- **Settings** - Theme, homepage config, features
- **Navigation** - Menus and links
- **Performance** - CDN-served, instant loads
- **SEO** - All pages pre-rendered for search engines

---

## When to Use Each Deployment Mode

### Use Static-Only When:
- Content updates are infrequent (weekly/monthly)
- No admin access needed from production
- Want maximum performance and zero cost
- Hosting on Netlify/Vercel/S3/GitHub Pages
- Don't need user authentication

### Use Unified Deployment When:
- Need admin UI in production
- Content updates are frequent (daily)
- Have cPanel with Node.js support
- Want simple single-server deployment
- Need full CMS functionality

### Use Split Deployment When:
- Frontend and backend on different hosts
- Need separate scaling for API and frontend
- Want to use multiple CDNs
- Complex infrastructure requirements

---

## Next Steps

1. **Choose Deployment Mode:**
   - Static-only: `./build-all.sh --static-only --clean`
   - Unified: `./build-all.sh --backend-bundle --clean`
   - Split: `./build-all.sh --backend-zip --clean`

2. **Upload to Host:**
   - See [README-STATIC-DEPLOYMENT.md](README-STATIC-DEPLOYMENT.md) for detailed instructions

3. **Test Deployed Site:**
   - Check all pages load
   - Verify posts and pages work
   - Test theme switching (if admin enabled)
   - Confirm media files display

4. **Update Content:**
   - For static: Edit locally, rebuild, redeploy
   - For unified/split: Use admin UI live

---

## Questions?

See the main [README.md](README.md) or [README-STATIC-DEPLOYMENT.md](README-STATIC-DEPLOYMENT.md) for more details.

**Build successful! Ready to deploy. 🚀**
