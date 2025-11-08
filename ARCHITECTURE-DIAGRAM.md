# Architecture Diagram - Pure Client-Side SQLite CMS

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser Window                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      index.html                            │ │
│  │                                                             │ │
│  │  <div id="app">                                            │ │
│  │    <!-- Dynamic content injected by UI.js -->              │ │
│  │  </div>                                                     │ │
│  │                                                             │ │
│  │  <script src="sql-wasm.js"></script>  ← CDN               │ │
│  │  <script src="js/db.js"></script>                          │ │
│  │  <script src="js/ui.js"></script>                          │ │
│  │  <script src="js/main.js"></script>                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    JavaScript Runtime                      │ │
│  │                                                             │ │
│  │  ┌─────────────┐      ┌─────────────┐    ┌─────────────┐ │ │
│  │  │  main.js    │      │   ui.js     │    │   db.js     │ │ │
│  │  │             │      │             │    │             │ │ │
│  │  │ - Init DB   │─────→│ - Render    │───→│ - SQLite    │ │ │
│  │  │ - Init UI   │      │ - Routes    │    │ - CRUD      │ │ │
│  │  │ - Routing   │      │ - Events    │    │ - Schema    │ │ │
│  │  └─────────────┘      │ - Forms     │    │ - Persist   │ │ │
│  │                        └─────────────┘    └─────────────┘ │ │
│  │                               │                    │        │ │
│  │                               ▼                    ▼        │ │
│  │                        ┌─────────────┐    ┌─────────────┐ │ │
│  │                        │   DOM API   │    │  sql.js     │ │ │
│  │                        │             │    │ (WASM)      │ │ │
│  │                        │ - render    │    │             │ │ │
│  │                        │ - events    │    │ SQLite DB   │ │ │
│  │                        └─────────────┘    └─────────────┘ │ │
│  │                                                    │        │ │
│  └────────────────────────────────────────────────────┼───────┘ │
│                                                       │         │
│  ┌────────────────────────────────────────────────────┼───────┐ │
│  │                  Browser Storage                   ▼       │ │
│  │                                                             │ │
│  │  localStorage                                               │ │
│  │  ├─ cms_database: "base64-encoded-sqlite..."              │ │
│  │  └─ cms_session:  "{ id, email, role, ... }"              │ │
│  │                                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                        Data Flow                                │
└─────────────────────────────────────────────────────────────────┘

1. USER ACTION (click, form submit)
         ↓
2. UI.js handles event
         ↓
3. UI.js calls db.js method
         ↓
4. db.js executes SQL (via sql.js)
         ↓
5. db.js saves to localStorage
         ↓
6. UI.js re-renders DOM
         ↓
7. USER sees updated UI


┌─────────────────────────────────────────────────────────────────┐
│                     Routing (Hash-based)                        │
└─────────────────────────────────────────────────────────────────┘

URL Hash                  →  Handler in ui.js
─────────────────────────────────────────────────────────────────
#/                        →  renderPublic('/') → renderHome()
#/posts                   →  renderPublic('/posts') → renderPostsIndex()
#/posts/welcome-back      →  renderPublic('/posts/...') → renderPost(slug)
#/about                   →  renderPublic('/about') → renderPage(slug)
#/admin                   →  renderAdmin('/admin') → renderDashboard()
#/admin/posts             →  renderAdmin('/admin/posts') → renderPostsList()
#/admin/posts/new         →  renderAdmin('/admin/posts/new') → renderPostEdit()
#/admin/posts/edit/1      →  renderAdmin('/admin/posts/edit/1') → renderPostEdit(id)
#/admin/settings          →  renderAdmin('/admin/settings') → renderSettings()


┌─────────────────────────────────────────────────────────────────┐
│                    Database Operations                          │
└─────────────────────────────────────────────────────────────────┘

Operation               JavaScript Call
─────────────────────────────────────────────────────────────────
Get all posts           db.query('SELECT * FROM posts WHERE type = ?', ['post'])
Get single post         db.queryOne('SELECT * FROM posts WHERE slug = ?', [slug])
Create post             db.exec('INSERT INTO posts (...) VALUES (...)', [values])
Update post             db.exec('UPDATE posts SET ... WHERE id = ?', [values, id])
Delete post             db.exec('DELETE FROM posts WHERE id = ?', [id])
Get setting             db.queryOne('SELECT value FROM settings WHERE key = ?', [key])
Update setting          db.exec('UPDATE settings SET value = ? WHERE key = ?', [val, key])
Save to localStorage    db.save() → localStorage.setItem('cms_database', base64)


┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Architecture                      │
└─────────────────────────────────────────────────────────────────┘

Local Development:
┌──────────────────┐
│  /public folder  │  ← Edit source files here
└────────┬─────────┘
         │ ./build-static.sh (copy files)
         ▼
┌──────────────────┐
│  /build folder   │  ← Production-ready static files
└────────┬─────────┘
         │ python3 -m http.server 8080
         ▼
┌──────────────────┐
│  localhost:8080  │  ← Test locally
└──────────────────┘


Production Deployment:
┌──────────────────┐
│  /build folder   │
└────────┬─────────┘
         │ Upload via FTP, Git, drag & drop
         ▼
┌──────────────────────────────────────┐
│  Static Hosting Provider             │
│  (S3, Netlify, GitHub Pages, cPanel) │
└────────┬─────────────────────────────┘
         │ Serve static files
         ▼
┌──────────────────┐
│  Public URL      │  ← Live site
│  yourdomain.com  │
└──────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  User's Browser                      │
│  - Downloads index.html, JS, CSS     │
│  - Loads sql.js WebAssembly          │
│  - Initializes SQLite in memory      │
│  - Loads DB from localStorage        │
│  - Renders UI                        │
└──────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    File Dependencies                            │
└─────────────────────────────────────────────────────────────────┘

index.html
    │
    ├── css/style.css          (styling)
    ├── sql-wasm.js            (CDN - SQLite WebAssembly)
    ├── js/db.js               (database layer)
    │     └── sql.js API       (from CDN)
    │
    ├── js/ui.js               (UI rendering)
    │     └── db instance      (from db.js)
    │
    └── js/main.js             (app init)
          ├── db.init()        (initialize database)
          └── UI.init()        (initialize UI)


┌─────────────────────────────────────────────────────────────────┐
│              Comparison: Old vs New Architecture                │
└─────────────────────────────────────────────────────────────────┘

OLD (Node.js + Next.js)                  NEW (Pure Client-Side)
───────────────────────────────────────────────────────────────────
Backend:  Express.js server        →     None (browser only)
Frontend: Next.js (React)          →     Vanilla JavaScript
Database: SQLite (server-side)     →     SQLite (browser via sql.js)
Storage:  File system              →     localStorage
API:      REST endpoints           →     Direct SQL queries
Build:    npm, webpack, complex    →     Simple file copy
Deploy:   cPanel Node.js app       →     Any static host
Runtime:  Node.js required         →     Browser only

Dependencies:
  OLD: ~200 npm packages           →     NEW: 1 (sql.js from CDN)

Lines of Code:
  OLD: ~10,000 (incl. deps)        →     NEW: ~1,700

Build Time:
  OLD: 30-60 seconds               →     NEW: < 1 second

Deployment:
  OLD: Node.js, npm install        →     NEW: Upload files


┌─────────────────────────────────────────────────────────────────┐
│                    Security Model                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Login Form (ui.js)                                             │
│  - Email input                                                  │
│  - Password input                                               │
└────────┬────────────────────────────────────────────────────────┘
         │ Form submit
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Authentication (ui.js handleFormSubmit)                        │
│  1. Hash password (SHA-256)                                     │
│  2. Query: SELECT * FROM users WHERE email = ?                  │
│  3. Compare password_hash                                       │
│  4. If match:                                                   │
│     - Get role and capabilities                                 │
│     - Create session object                                     │
│     - Store in localStorage                                     │
└────────┬────────────────────────────────────────────────────────┘
         │ Success
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Session Storage (localStorage)                                 │
│                                                                 │
│  cms_session = {                                                │
│    id: 1,                                                       │
│    email: "admin@school.test",                                  │
│    display_name: "Admin User",                                  │
│    role: "Administrator",                                       │
│    capabilities: [                                              │
│      "manage_users", "create_post", "publish_post",             │
│      "upload_media", "manage_settings", ...                     │
│    ]                                                            │
│  }                                                              │
└────────┬────────────────────────────────────────────────────────┘
         │ On each request
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  Access Control (ui.js checkAuth)                               │
│  - Read cms_session from localStorage                           │
│  - Check if user exists                                         │
│  - Render admin UI or redirect to login                         │
└─────────────────────────────────────────────────────────────────┘

⚠️ NOTE: This is CLIENT-SIDE ONLY security (suitable for demos/personal use)
   For production, add server-side authentication and authorization.
```
