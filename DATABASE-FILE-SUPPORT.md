# 🗄️ Database File System Support - Guide

## ✅ Fixed Issues

1. **TypeError Fixed**: `getActivetheme` → `getActiveTheme`
2. **File System Database Support**: Can now load `.db` or `.sqlite` files directly

## 📁 Database Loading Priority

The application now loads the database in this order:

```
1. File System (data/cms.db, data/sqlite.db, or data/app.sqlite)
   ↓ (if not found)
2. Browser localStorage
   ↓ (if not found)
3. Create new database with initial data
```

## 🎯 How to Use Database Files

### Option 1: Export from localStorage to File

**Step 1:** Visit the database tools page
```bash
open http://localhost:8080/db-tools.html
```

**Step 2:** Click "Export to cms.db"
- Downloads `cms.db` file
- Contains all your current data

**Step 3:** Place file in `/build/data/` folder
```bash
mv ~/Downloads/cms.db /Applications/MAMP/htdocs/pscms-frontend/build/data/
```

**Step 4:** Refresh the app
- Will now load from file instead of localStorage
- File takes priority over localStorage

### Option 2: Start with a Database File

If you have an existing SQLite database:

1. Name it one of:
   - `cms.db` (recommended)
   - `sqlite.db`
   - `app.sqlite`

2. Place in `/build/data/` folder

3. Open the app - it will load automatically

### Option 3: Continue Using localStorage Only

Nothing changes - if no file exists, uses localStorage as before.

## 🔧 Database Tools Page

Access at: `http://localhost:8080/db-tools.html`

**Features:**
- ✅ Export database from localStorage → `cms.db` file
- ✅ Import database file → localStorage
- ✅ Clear localStorage database
- ✅ View database status and size

## 📊 Database File Format

**Format:** SQLite 3 database  
**Extension:** `.db` or `.sqlite`  
**Recommended name:** `cms.db`  
**Location:** `/build/data/cms.db`  

**Compatible with:**
- SQLite command-line tool
- DB Browser for SQLite (https://sqlitebrowser.org/)
- Any SQLite client

## 🔄 Workflows

### Workflow 1: Development with File

```bash
# 1. Export current data
open http://localhost:8080/db-tools.html
# Click "Export to cms.db"

# 2. Move to data folder
mv ~/Downloads/cms.db build/data/

# 3. Edit with external tool (optional)
open -a "DB Browser for SQLite" build/data/cms.db

# 4. Refresh app - loads from file
open http://localhost:8080
```

### Workflow 2: Backup and Restore

```bash
# Backup
open http://localhost:8080/db-tools.html
# Export → saves cms.db

# Later... Restore
open http://localhost:8080/db-tools.html
# Import → select cms.db file
# Refresh app
```

### Workflow 3: Deployment with Existing Data

```bash
# 1. Export from dev environment
# Visit db-tools.html → Export

# 2. Add to build
cp ~/Downloads/cms.db build/data/

# 3. Deploy entire /build folder
# Database is included and loads automatically

# 4. Users see your data immediately
# No need to seed or import
```

## 🎨 Use Cases

### 1. Version Control Database
```bash
# Track database changes in git
git add build/data/cms.db
git commit -m "Update content"
git push

# Deploy with consistent data
```

### 2. Edit with External Tools
```bash
# Use DB Browser for SQLite
open -a "DB Browser for SQLite" build/data/cms.db

# Make bulk changes
# Save file
# Refresh app - sees changes
```

### 3. Multiple Environments
```bash
build/data/
  ├── cms.db          # Production data
  ├── dev.db          # Development data
  └── test.db         # Test data

# Swap files as needed
mv build/data/dev.db build/data/cms.db
```

### 4. Share Data Between Team
```bash
# Person A exports
# Person A: db-tools.html → Export → cms.db

# Share file (email, Slack, etc.)

# Person B imports
# Person B: db-tools.html → Import → select cms.db
# Refresh app
```

## 🔍 Inspecting Database Files

### Using SQLite Command Line
```bash
# Open database
sqlite3 build/data/cms.db

# List tables
.tables

# View posts
SELECT * FROM posts;

# View settings
SELECT * FROM settings;

# Exit
.quit
```

### Using DB Browser for SQLite
```bash
# Install (macOS)
brew install --cask db-browser-for-sqlite

# Open file
open -a "DB Browser for SQLite" build/data/cms.db
```

## 📝 Database Schema

Your database includes these tables:

- `roles` - User roles and capabilities
- `users` - User accounts
- `posts` - Blog posts and pages
- `settings` - Configuration (JSON values)
- `menus` - Navigation menus
- `media` - Uploaded files (base64)
- `refresh_tokens` - Session tokens

## ⚙️ Configuration

The database loader checks these paths in order:

1. `data/cms.db`
2. `data/sqlite.db`
3. `data/app.sqlite`

To use a different filename, edit `/public/js/db.js`:

```javascript
const dbPaths = ['data/cms.db', 'data/sqlite.db', 'data/app.sqlite'];
// Add your custom path:
const dbPaths = ['data/cms.db', 'data/my-custom.db'];
```

## 🚀 Production Tips

### Include Database in Build
```bash
# 1. Export your data
# db-tools.html → Export

# 2. Add to build
mkdir -p build/data
cp ~/Downloads/cms.db build/data/

# 3. Deploy
# Upload entire /build folder
# Database is included automatically
```

### Update Database in Production
```bash
# 1. Export from live site
# Visit https://yoursite.com/db-tools.html
# Export → downloads cms.db

# 2. Edit locally
# Make changes with SQLite tools

# 3. Re-deploy
# Upload updated cms.db to /build/data/
```

## 🐛 Troubleshooting

**Database not loading from file?**
- Check file exists in `/build/data/cms.db`
- Check filename exactly matches: `cms.db` (case-sensitive)
- Check browser console for errors
- Ensure file is valid SQLite format

**Still loading from localStorage?**
- Clear localStorage: db-tools.html → Clear Database
- Refresh page
- Should now load from file

**File too large?**
- Consider using IndexedDB instead of localStorage
- Or reduce media file sizes (currently base64)

**Can't see changes after editing file?**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
- Clear browser cache
- Restart web server

## 📦 File Sizes

**Typical sizes:**
- Empty database: ~20 KB
- With sample data: ~50 KB
- With 100 posts: ~200 KB
- With 10 images: ~2 MB (base64-encoded)

**Limits:**
- File system: No practical limit
- localStorage: 5-10 MB
- Recommendation: Use file for >5 MB

## ✅ Summary

**What Changed:**
- ✅ Fixed `getActiveTheme` typo
- ✅ Added file system database loading
- ✅ Priority: File → localStorage → Create new
- ✅ Export saves as `cms.db` (was `app.sqlite`)
- ✅ Added `db-tools.html` utility page
- ✅ Supports `.db` and `.sqlite` extensions

**How to Use:**
1. Visit `http://localhost:8080/db-tools.html`
2. Export to `cms.db`
3. Place in `build/data/`
4. App loads automatically

**Benefits:**
- ✅ Version control database
- ✅ Edit with external tools
- ✅ Share between team members
- ✅ Deploy with existing data
- ✅ Backup and restore easily
- ✅ No localStorage limits

---

**Next Steps:**
1. Rebuild: `./build-static.sh` ✅ (Already done)
2. Test: `./start.sh` or open `http://localhost:8080`
3. Visit tools: `http://localhost:8080/db-tools.html`
4. Export your database and place in `build/data/`
