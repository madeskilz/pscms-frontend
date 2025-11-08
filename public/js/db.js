/**
 * Database Module - Pure Client-Side SQLite using sql.js
 * Handles all database operations in the browser using WebAssembly
 */

class Database {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.ready = false;
  }

  /**
   * Initialize sql.js and load or create the database
   */
  async init() {
    if (this.ready) return;

    console.log('[DB] Initializing sql.js...');
    
    // Load sql.js from CDN
    this.SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Load database ONLY from file system - no localStorage
    // Priority: File system → Create new (with auto-download)
    
    let dbLoaded = false;
    
    // Try loading from filesystem
    const dbPaths = ['db/cms.db', 'db/sqlite.db', 'db/app.sqlite'];
    for (const path of dbPaths) {
      try {
        console.log(`[DB] Attempting to load from ${path}...`);
        const response = await fetch(path);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          this.db = new this.SQL.Database(uint8Array);
          console.log(`[DB] Database loaded from ${path}`);
          console.log('[DB] ✓ File-based mode - no localStorage used');
          dbLoaded = true;
          break;
        }
      } catch (e) {
        // File doesn't exist, continue to next option
      }
    }
    
    // If not loaded from file, create new database
    if (!dbLoaded) {
      console.log('[DB] No database file found - creating new database');
      console.log('[DB] ⚠️  Database will exist in memory only until downloaded');
      this.db = new this.SQL.Database();
      await this.createSchema();
      await this.seedInitialData();
      this.save();
      
      // Auto-download the database file for user to place in /db/ folder
      console.log('[DB] Auto-downloading cms.db file...');
      console.log('[DB] ⚠️  IMPORTANT: Move this file to /dist/db/ to persist your data');
      setTimeout(() => {
        const data = this.db.export();
        this._saveToFile(data, 'cms.db');
      }, 1000); // Small delay to ensure console messages are visible
    }

    this.ready = true;
    console.log('[DB] Database ready');
  }

  /**
   * Create database schema (converted from Knex migrations)
   */
  async createSchema() {
    console.log('[DB] Creating schema...');

    // Roles table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        capabilities TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        display_name TEXT,
        role_id INTEGER,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      )
    `);

    // Posts table (posts and pages)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL DEFAULT 'post',
        status TEXT NOT NULL DEFAULT 'draft',
        title TEXT,
        content TEXT,
        slug TEXT NOT NULL UNIQUE,
        author_id INTEGER,
        meta TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);

    // Settings table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // Menus table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        items TEXT
      )
    `);

    // Media table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        path TEXT,
        mime TEXT,
        size INTEGER,
        uploader_id INTEGER,
        meta TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploader_id) REFERENCES users(id)
      )
    `);

    // Refresh tokens table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        revoked_at DATETIME,
        replaced_by_token_hash TEXT,
        ip TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('[DB] Schema created');
  }

  /**
   * Seed initial data (admin user, default settings)
   */
  async seedInitialData() {
    console.log('[DB] Seeding initial data...');

    // Create Administrator role with all capabilities
    const capabilities = [
      'manage_users', 'manage_plugins', 'create_post', 'publish_post',
      'upload_media', 'view_analytics', 'impersonate', 'manage_settings'
    ];
    
    this.db.run(
      'INSERT INTO roles (name, capabilities) VALUES (?, ?)',
      ['Administrator', JSON.stringify(capabilities)]
    );

    // Create admin user (password: ChangeMe123!)
    // Simple hash for demo - in production use proper bcrypt
    const passwordHash = await this._simpleHash('ChangeMe123!');
    this.db.run(
      `INSERT INTO users (email, password_hash, display_name, role_id, active) 
       VALUES (?, ?, ?, 1, 1)`,
      ['admin@school.test', passwordHash, 'Admin User']
    );

    // Default settings
    const settings = [
      { key: 'site_title', value: JSON.stringify('K12 School CMS') },
      { key: 'theme', value: JSON.stringify({ active: 'colorlib-kids' }) },
      { 
        key: 'homepage', 
        value: JSON.stringify({
          heroTitle: 'Welcome to Our School',
          heroSubtitle: 'Inspiring excellence and growth for every student',
          ctaText: 'Explore Programs',
          ctaHref: '/about',
          featuredPostIds: []
        })
      },
      {
        key: 'hero',
        value: JSON.stringify({
          title: 'Welcome to Our School',
          subtitle: 'Empowering the next generation through quality education and innovation',
          ctaText: 'Learn More',
          ctaLink: '/about',
          imageUrl: ''
        })
      },
      {
        key: 'features',
        value: JSON.stringify([
          { title: 'Quality Education', description: 'Committed to academic excellence', icon: 'school' },
          { title: 'Supportive Environment', description: 'A safe and nurturing space', icon: 'favorite' },
          { title: 'Extracurricular Activities', description: 'Sports, arts, and clubs', icon: 'sports' }
        ])
      },
      {
        key: 'primary_menu',
        value: JSON.stringify([
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Posts', href: '/posts' },
          { label: 'Contact', href: '/contact' }
        ])
      }
    ];

    settings.forEach(s => {
      this.db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [s.key, s.value]);
    });

    // Sample posts and pages
    const posts = [
      {
        type: 'page', status: 'published', title: 'About Us', slug: 'about',
        content: '<p>We are a vibrant learning community committed to excellence.</p>',
        author_id: 1
      },
      {
        type: 'page', status: 'published', title: 'Contact', slug: 'contact',
        content: '<p>Reach us via email or phone. We are here to help.</p>',
        author_id: 1
      },
      {
        type: 'post', status: 'published', title: 'Welcome Back to School', slug: 'welcome-back',
        content: '<p>We are excited to welcome our students back for a new term!</p>',
        author_id: 1
      }
    ];

    posts.forEach(p => {
      this.db.run(
        `INSERT INTO posts (type, status, title, slug, content, author_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [p.type, p.status, p.title, p.slug, p.content, p.author_id]
      );
    });

    // Default menu
    this.db.run(
      'INSERT INTO menus (name, items) VALUES (?, ?)',
      ['primary', JSON.stringify([
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Posts', href: '/posts' },
        { label: 'Contact', href: '/contact' }
      ])]
    );

    console.log('[DB] Initial data seeded');
  }

  /**
   * Execute a SELECT query
   */
  query(sql, params = []) {
    if (!this.ready) throw new Error('Database not initialized');
    
    const results = [];
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    
    stmt.free();
    return results;
  }

  /**
   * Execute a single SELECT query and return first result
   */
  queryOne(sql, params = []) {
    const results = this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Execute INSERT/UPDATE/DELETE
   */
  exec(sql, params = []) {
    if (!this.ready) throw new Error('Database not initialized');
    
    this.db.run(sql, params);
    this.save();
    
    return {
      changes: this.db.getRowsModified(),
      lastId: this.db.exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0]
    };
  }

  /**
   * Save database to file only (no localStorage)
   */
  save(downloadAsFile = false) {
    // Database exists only in memory during session
    // No localStorage persistence for admin data
    console.log('[DB] Database updated in memory');
    
    // Save to file if requested
    if (downloadAsFile) {
      const data = this.db.export();
      this._saveToFile(data, 'cms.db');
    }
  }

  /**
   * Save database data to a file (downloads to user's Downloads folder)
   * User should move this to /build/data/ for auto-loading
   */
  _saveToFile(data, filename = 'cms.db') {
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`[DB] Database file saved: ${filename}`);
    console.log('[DB] Move this file to /build/data/ folder to enable auto-loading');
  }

  /**
   * Export database file for download
   */
  export() {
    const data = this.db.export();
    this._saveToFile(data, 'cms.db');
    console.log('[DB] Database exported as cms.db');
    console.log('[DB] Move this file to /build/data/ folder to enable auto-loading');
  }

  /**
   * Import database from file (loads into memory only)
   */
  async import(file) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    this.db = new this.SQL.Database(uint8Array);
    console.log('[DB] Database imported into memory');
    console.log('[DB] ⚠️  Changes will be lost on refresh - save to file to persist');
  }

  /**
   * Reset database (recreate in memory)
   */
  async reset() {
    this.db.close();
    this.db = new this.SQL.Database();
    await this.createSchema();
    await this.seedInitialData();
    this.save();
    console.log('[DB] Database reset in memory');
    console.log('[DB] ⚠️  Export to file to persist this reset');
  }

  // Helper methods

  async _simpleHash(password) {
    // Simple hash for demo - NOT SECURE for production
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// Global database instance
const db = new Database();
