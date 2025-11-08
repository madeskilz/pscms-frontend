# Database File Location

Place your `cms.db` file here for automatic loading.

## Quick Start

When you first run the application, it will:
1. Auto-download `cms.db` to your Downloads folder
2. Show a notification with instructions
3. Save database to localStorage

## To Enable File-Based Loading

1. Find `cms.db` in your Downloads folder
2. Move it to this directory: `/build/data/cms.db`
3. Refresh the application

The app will then load from this file instead of localStorage.

## Supported Filenames

The app will check for these files in order:
- `cms.db` ✅ (recommended)
- `sqlite.db`
- `app.sqlite`

## Benefits of File-Based Storage

✅ No localStorage size limits  
✅ Easy backup (just copy the file)  
✅ Version control friendly  
✅ Share with team members  
✅ Edit with external SQLite tools  

## Creating a Database File

### Option 1: Auto-Download (Easiest)
1. Open the app without a database file
2. It will create a new database
3. `cms.db` auto-downloads to your Downloads folder
4. Move it to this directory

### Option 2: Export from Tools Page
1. Visit `http://localhost:8080/db-tools.html`
2. Click "Export to cms.db"
3. Move the downloaded file here

### Option 3: Create Manually
```bash
# Using SQLite command line
sqlite3 cms.db < schema.sql
```

## File Format

- **Type:** SQLite 3 database
- **Encoding:** UTF-8
- **Size:** Typically 50KB - 5MB
- **Compatible with:** Any SQLite 3 client

## Editing the Database

You can edit the database file with:

### DB Browser for SQLite (Recommended)
```bash
# Install (macOS)
brew install --cask db-browser-for-sqlite

# Open
open -a "DB Browser for SQLite" cms.db
```

### SQLite Command Line
```bash
# Open database
sqlite3 cms.db

# List tables
.tables

# View data
SELECT * FROM posts;

# Exit
.quit
```

### TablePlus, DBeaver, etc.
Any SQLite-compatible database client will work.

## Deployment

### Include Database in Deployment
```bash
# 1. Export your content
# 2. Place cms.db in this directory
# 3. Deploy entire /build folder
# 4. Users get your content automatically
```

### Update Production Database
```bash
# 1. Export from live site (db-tools.html)
# 2. Edit locally
# 3. Replace cms.db in this directory
# 4. Redeploy
```

## Backup

**Recommended:** Backup this file regularly

```bash
# Simple backup
cp cms.db cms.db.backup

# Timestamped backup
cp cms.db cms.db.$(date +%Y%m%d_%H%M%S)

# Automated daily backup
0 0 * * * cp /path/to/build/data/cms.db /path/to/backups/cms.db.$(date +\%Y\%m\%d)
```

## Troubleshooting

**File not loading?**
- Ensure filename is exactly `cms.db` (case-sensitive)
- Check file is in `/build/data/` directory
- Verify file is a valid SQLite database
- Clear browser cache and reload

**Changes not saving?**
- Currently, changes save to localStorage, not the file
- Use "Export Database" to save changes back to file
- Or use db-tools.html to export

**File too large?**
- Optimize images before uploading
- Clear old media files
- Export only needed content

## Schema

The database contains these tables:
- `roles` - User roles and capabilities
- `users` - User accounts  
- `posts` - Blog posts and pages
- `settings` - Site configuration
- `menus` - Navigation menus
- `media` - Uploaded files (base64)
- `refresh_tokens` - Session management

## Next Steps

1. Start the application
2. Wait for auto-download notification
3. Move `cms.db` from Downloads to here
4. Refresh and enjoy!

---

Need help? Check `db-tools.html` for database utilities.
