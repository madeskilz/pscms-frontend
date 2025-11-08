# Static-Only Deployment Guide

This CMS can be deployed as **pure static files** without any Node.js runtime. All API responses are pre-rendered as JSON files during the build process.

## Build for Static Deployment

```bash
./build-all.sh --static-only --clean
```

This creates `dist/static-complete.zip` containing:
- All frontend HTML/CSS/JS pages (22 static pages)
- Pre-rendered API responses as JSON files in `/api/**/*.json`
- Media uploads (if any) in static paths

## What's Inside

```
static-complete.zip/
├── index.html                    # Homepage
├── about.html                    # Static pages
├── contact.html
├── posts.html                    # Blog listing
├── posts/
│   ├── [slug].html              # Individual posts
│   └── ...
├── api/                          # Pre-rendered API
│   ├── manifest.json            # All available routes
│   ├── posts/
│   │   ├── index.json          # Posts list
│   │   ├── welcome-back/
│   │   │   └── index.json      # Individual post
│   │   └── ...
│   ├── settings/
│   │   ├── theme/index.json
│   │   ├── homepage/index.json
│   │   └── ...
│   └── menus/
│       └── primary/index.json
├── _next/                        # Next.js assets (JS/CSS)
└── media/                        # (optional) uploaded files

```

## Deployment Options

### Option 1: AWS S3 + CloudFront
```bash
unzip dist/static-complete.zip -d static-site
aws s3 sync static-site/ s3://your-bucket-name/ --acl public-read
```

### Option 2: Netlify
```bash
# Drag and drop dist/static-complete.zip to Netlify UI
# OR via CLI:
unzip dist/static-complete.zip -d deploy
netlify deploy --prod --dir=deploy
```

### Option 3: Vercel
```bash
unzip dist/static-complete.zip -d public
vercel --prod
```

### Option 4: GitHub Pages
```bash
unzip dist/static-complete.zip -d docs
git add docs/
git commit -m "Deploy static site"
git push origin main
# Enable GitHub Pages in repo settings → Source: main branch /docs folder
```

### Option 5: cPanel Static Hosting
1. Login to cPanel → File Manager
2. Navigate to `public_html/` (or subdirectory)
3. Upload `dist/static-complete.zip`
4. Extract the zip file
5. Set permissions if needed (755 for directories, 644 for files)
6. Access via your domain

### Option 6: Google Cloud Storage
```bash
unzip dist/static-complete.zip -d static-site
gsutil -m cp -r static-site/* gs://your-bucket-name/
gsutil iam ch allUsers:objectViewer gs://your-bucket-name
# Configure bucket for website hosting in GCS console
```

## How It Works

### Data Flow
1. **Build Time**: 
   - `backend/src/export-static.js` queries SQLite database
   - Exports all posts, pages, settings, menus to JSON files
   - Frontend build copies JSON files into `/api/` directory

2. **Runtime**:
   - Frontend loads static HTML
   - JavaScript fetches from `/api/posts/index.json` instead of `http://api.example.com/api/posts`
   - No server-side rendering, no API server needed
   - Works with `NEXT_PUBLIC_STATIC_API=true` environment variable

### Frontend API Client
The `frontend/lib/api.js` client automatically:
- Checks for `NEXT_PUBLIC_STATIC_API=true`
- Tries `/api/path/index.json` for GET requests
- Falls back to live API server if JSON not found
- Caches responses for performance

## Limitations

### ⚠️ Admin Features Disabled
- Login/authentication requires server-side logic
- Cannot create/edit/delete content (read-only)
- For content updates, rebuild and redeploy

### ⚠️ Dynamic Features
- No real-time data (must rebuild to update)
- No user-submitted forms (comments, contact forms need external service like Formspree)
- No search (consider client-side search with lunr.js or external service)

### ⚠️ Media Uploads
- Uploaded files from backend are included at build time
- New uploads require rebuild and redeploy
- Consider using external media service (Cloudinary, Uploadcare) for dynamic media

## Updating Content

Since this is static, content updates require a rebuild:

```bash
# 1. Update content via backend (run backend locally)
cd backend
npm run dev  # Start backend at localhost:3001

# 2. Make changes via admin UI at http://localhost:3001/admin

# 3. Rebuild static site
cd ..
./build-all.sh --static-only

# 4. Redeploy
# Upload new dist/static-complete.zip to your host
```

## Hybrid Deployment (Optional)

You can also deploy frontend as static and backend separately:

```bash
# Build both separately
./build-all.sh --clean

# Deploy frontend/out to static host (S3, Netlify)
# Deploy backend/build to cPanel/VPS with Node.js

# Set NEXT_PUBLIC_API_BASE in frontend to point to backend URL
NEXT_PUBLIC_API_BASE=https://api.yourschool.com npm run build:static
```

## Environment Variables

### For Static-Only Mode
```env
NEXT_PUBLIC_STATIC_API=true
```

### For Hybrid Mode (separate API server)
```env
NEXT_PUBLIC_API_BASE=https://api.yourschool.com
```

## Testing Locally

```bash
# Extract and serve locally
unzip dist/static-complete.zip -d test-deploy
cd test-deploy
python3 -m http.server 8000

# Visit http://localhost:8000
```

## Performance

Static sites are extremely fast:
- No database queries
- No server processing
- Served from CDN (if using S3/CloudFront/Netlify)
- Perfect lighthouse scores
- Instant page loads

## Cost

Static hosting is very cheap or free:
- **Netlify**: 100GB/month free
- **Vercel**: Unlimited bandwidth free tier
- **GitHub Pages**: Free for public repos
- **AWS S3**: ~$0.023/GB + $0.005/1000 requests
- **cPanel**: Included with shared hosting

## Security

Static sites are more secure:
- No server to hack
- No database to exploit
- No runtime vulnerabilities
- Only risk is XSS in frontend (sanitize user content)

## SEO

Fully SEO-friendly:
- All pages are pre-rendered HTML
- Search engines can crawl easily
- Fast page loads improve rankings
- Add `sitemap.xml` and `robots.txt` to root

## Summary

✅ **Use Static-Only When:**
- Content updates are infrequent (weekly/monthly)
- No need for user authentication
- Want maximum performance and minimum cost
- Don't need real-time data

❌ **Use Regular Deployment When:**
- Need admin UI for daily content updates
- Require user authentication/roles
- Need dynamic features (comments, forms, search)
- Want real-time analytics

---

**Questions?** Check the main README.md or contact the development team.
