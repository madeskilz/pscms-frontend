/**
 * UI Module - Pure JavaScript DOM manipulation
 * Handles all UI rendering and interactions
 */

const UI = {
  currentView: 'public',
  currentUser: null,
  sessionToken: null, // In-memory only - no localStorage

  /**
   * Initialize UI
   */
  init() {
    // Session exists only in memory during page session
    // No localStorage used for admin authentication
    this.currentUser = null;
    this.sessionToken = null;
    this.setupEventListeners();
    this.render();
  },

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-route]')) {
        e.preventDefault();
        const route = e.target.getAttribute('data-route');
        this.navigate(route);
      }

      if (e.target.matches('[data-action]')) {
        e.preventDefault();
        const action = e.target.getAttribute('data-action');
        this.handleAction(action, e.target);
      }
    });

    // Handle form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.matches('[data-form]')) {
        e.preventDefault();
        const formType = e.target.getAttribute('data-form');
        this.handleFormSubmit(formType, e.target);
      }
    });
  },

  /**
   * Navigate to a route
   */
  navigate(route) {
    window.location.hash = route;
    this.render();
  },

  /**
   * Render current view based on hash
   */
    async render() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');

    if (hash.startsWith('/admin')) {
      if (!this.currentUser) {
        this.renderLogin();
        return;
      }
      this.renderAdmin(hash);
    } else {
        await this.renderPublic(hash);
    }
  },

  /**
   * Render login page
   */
  renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="login-container">
        <div class="login-box">
          <h1>School CMS</h1>
          <h2>Admin Login</h2>
          <form data-form="login">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn-primary">Login</button>
          </form>
          <a href="#/" data-route="/" class="back-link">← Back to site</a>
        </div>
      </div>
    `;
  },

  /**
   * Render admin dashboard
   */
  renderAdmin(hash) {
    const app = document.getElementById('app');
    
    // Admin navigation
    const nav = `
      <nav class="admin-nav">
        <div class="admin-nav-brand">
          <h2>CMS Admin</h2>
        </div>
        <div class="admin-nav-links">
          <a href="#/admin" data-route="/admin">Dashboard</a>
          <a href="#/admin/posts" data-route="/admin/posts">Posts</a>
          <a href="#/admin/pages" data-route="/admin/pages">Pages</a>
          <a href="#/admin/media" data-route="/admin/media">Media</a>
          <a href="#/admin/settings" data-route="/admin/settings">Settings</a>
          <a href="#/" data-route="/">View Site</a>
          <button data-action="logout" class="btn-link">Logout</button>
        </div>
      </nav>
    `;

    let content = '';

    if (hash === '/admin' || hash === '/admin/') {
      content = this.renderDashboard();
    } else if (hash.startsWith('/admin/posts')) {
      if (hash.includes('/edit/')) {
        const id = hash.split('/').pop();
        content = this.renderPostEdit(id);
      } else if (hash.includes('/new')) {
        content = this.renderPostEdit(null, 'post');
      } else {
        content = this.renderPostsList('post');
      }
    } else if (hash.startsWith('/admin/pages')) {
      if (hash.includes('/edit/')) {
        const id = hash.split('/').pop();
        content = this.renderPostEdit(id);
      } else if (hash.includes('/new')) {
        content = this.renderPostEdit(null, 'page');
      } else {
        content = this.renderPostsList('page');
      }
    } else if (hash.startsWith('/admin/media')) {
      content = this.renderMedia();
    } else if (hash.startsWith('/admin/settings')) {
      content = this.renderSettings();
    }

    app.innerHTML = nav + `<main class="admin-content">${content}</main>`;
  },

  /**
   * Render admin dashboard
   */
  renderDashboard() {
    const posts = db.query('SELECT COUNT(*) as count FROM posts WHERE type = ? AND status = ?', ['post', 'published']);
    const pages = db.query('SELECT COUNT(*) as count FROM posts WHERE type = ?', ['page']);
    const drafts = db.query('SELECT COUNT(*) as count FROM posts WHERE status = ?', ['draft']);
    const media = db.query('SELECT COUNT(*) as count FROM media');
      const recentPosts = db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 5');

      const user = this.currentUser;
      const greeting = user ? `Welcome, ${user.display_name || user.email}` : 'Welcome';

      const recentPostsList = recentPosts.map(p => `
      <tr>
        <td><a href="#/admin/${p.type}s/edit/${p.id}" data-route="/admin/${p.type}s/edit/${p.id}">${p.title}</a></td>
        <td><span class="status-badge status-${p.status}">${p.status}</span></td>
        <td>${p.type}</td>
        <td>${new Date(p.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');

    return `
      <div class="dashboard">
        <div class="dashboard-header">
          <div>
            <h1>CMS Admin</h1>
            <p class="dashboard-greeting">${greeting}</p>
          </div>
        </div>
        
        <div class="alert-warning">
          <strong>⚠️ FILE-ONLY MODE:</strong> Changes exist in memory only. Export database regularly to save your work!
        </div>

        <div class="dashboard-analytics">
          <div class="stat-card stat-primary">
            <div class="stat-icon">📄</div>
            <div class="stat-content">
              <h3>${posts[0]?.count || 0}</h3>
              <p>Published Posts</p>
            </div>
          </div>
          <div class="stat-card stat-info">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <h3>${pages[0]?.count || 0}</h3>
              <p>Pages</p>
            </div>
          </div>
          <div class="stat-card stat-warning">
            <div class="stat-icon">✏️</div>
            <div class="stat-content">
              <h3>${drafts[0]?.count || 0}</h3>
              <p>Drafts</p>
            </div>
          </div>
          <div class="stat-card stat-success">
            <div class="stat-icon">🖼️</div>
            <div class="stat-content">
              <h3>${media[0]?.count || 0}</h3>
              <p>Media Files</p>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-section">
            <h2>Quick Actions</h2>
            <div class="action-cards">
              <a href="#/admin/posts" data-route="/admin/posts" class="action-card action-primary">
                <div class="action-icon">📄</div>
                <div class="action-content">
                  <h3>Posts</h3>
                  <p>Manage blog posts</p>
                </div>
              </a>
              <a href="#/admin/pages" data-route="/admin/pages" class="action-card action-info">
                <div class="action-icon">📋</div>
                <div class="action-content">
                  <h3>Pages</h3>
                  <p>Manage static pages</p>
                </div>
              </a>
              <a href="#/admin/media" data-route="/admin/media" class="action-card action-success">
                <div class="action-icon">🖼️</div>
                <div class="action-content">
                  <h3>Media</h3>
                  <p>Upload files</p>
                </div>
              </a>
              <a href="#/admin/settings" data-route="/admin/settings" class="action-card action-secondary">
                <div class="action-icon">⚙️</div>
                <div class="action-content">
                  <h3>Settings</h3>
                  <p>Configure site</p>
                </div>
              </a>
            </div>
            <div class="dashboard-actions">
              <a href="#/admin/posts/new" data-route="/admin/posts/new" class="btn-primary">✍️ New Post</a>
              <a href="#/admin/pages/new" data-route="/admin/pages/new" class="btn-primary">📄 New Page</a>
              <button data-action="export-db" class="btn-secondary">💾 Export Database</button>
              <button data-action="import-db" class="btn-secondary">📥 Import Database</button>
            </div>
          </div>

          <div class="dashboard-section">
            <h2>Recent Activity</h2>
            ${recentPosts.length > 0 ? `
              <div class="recent-posts-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentPostsList}
                  </tbody>
                </table>
              </div>
            ` : '<p class="empty-state">No recent activity</p>'}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render posts/pages list
   */
  renderPostsList(type = 'post') {
    const posts = db.query(
      'SELECT * FROM posts WHERE type = ? ORDER BY created_at DESC',
      [type]
    );

    const title = type === 'post' ? 'Posts' : 'Pages';
    const newRoute = `/admin/${type}s/new`;

    const rows = posts.map(post => `
      <tr>
        <td>${post.title || '(No title)'}</td>
        <td>${post.slug}</td>
        <td><span class="status-badge status-${post.status}">${post.status}</span></td>
        <td>${new Date(post.created_at).toLocaleDateString()}</td>
        <td class="actions">
          <a href="#/admin/${type}s/edit/${post.id}" data-route="/admin/${type}s/edit/${post.id}" class="btn-sm">Edit</a>
          <button data-action="delete-post" data-id="${post.id}" class="btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `).join('');

    return `
      <div class="posts-list">
        <div class="list-header">
          <h1>${title}</h1>
          <a href="#${newRoute}" data-route="${newRoute}" class="btn-primary">New ${title.slice(0, -1)}</a>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows : '<tr><td colspan="5">No items found</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  },

  /**
   * Render post/page edit form
   */
  renderPostEdit(id, type = 'post') {
    let post = { type, status: 'draft', title: '', content: '', slug: '' };
    
    if (id) {
      const existing = db.queryOne('SELECT * FROM posts WHERE id = ?', [id]);
      if (existing) post = existing;
    }

    return `
      <div class="post-edit">
        <h1>${id ? 'Edit' : 'New'} ${post.type === 'post' ? 'Post' : 'Page'}</h1>
        <form data-form="save-post" data-id="${id || ''}">
          <input type="hidden" name="type" value="${post.type}">
          
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" name="title" value="${post.title}" required>
          </div>

          <div class="form-group">
            <label for="slug">Slug</label>
            <input type="text" id="slug" name="slug" value="${post.slug}" required>
          </div>

          <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" name="content" rows="15">${post.content}</textarea>
          </div>

          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" name="status">
              <option value="draft" ${post.status === 'draft' ? 'selected' : ''}>Draft</option>
              <option value="published" ${post.status === 'published' ? 'selected' : ''}>Published</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">Save</button>
            <a href="#/admin/${post.type}s" data-route="/admin/${post.type}s" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    `;
  },

  /**
   * Render media library
   */
  renderMedia() {
    const media = db.query('SELECT * FROM media ORDER BY created_at DESC');

    const items = media.map(m => `
      <div class="media-item">
        ${m.mime?.startsWith('image/') ? 
          `<img src="${m.data}" alt="${m.filename}">` :
          `<div class="file-icon">📄</div>`
        }
        <p>${m.filename}</p>
        <button data-action="delete-media" data-id="${m.id}" class="btn-sm btn-danger">Delete</button>
      </div>
    `).join('');

    return `
      <div class="media-library">
        <div class="list-header">
          <h1>Media Library</h1>
          <label for="upload-media" class="btn-primary">Upload File</label>
          <input type="file" id="upload-media" accept="image/*" style="display:none" data-action="upload-media">
        </div>
        <div class="media-grid">
          ${items.length ? items : '<p>No media files</p>'}
        </div>
      </div>
    `;
  },

  /**
   * Render settings page
   */
  renderSettings() {
    const siteTitle = db.queryOne('SELECT value FROM settings WHERE key = ?', ['site_title']);
    const theme = db.queryOne('SELECT value FROM settings WHERE key = ?', ['theme']);
    
    let siteTitleValue = 'K12 School CMS';
    let themeValue = 'colorlib-kids';
    
    try {
      siteTitleValue = siteTitle ? JSON.parse(siteTitle.value) : siteTitleValue;
      const themeData = theme ? JSON.parse(theme.value) : { active: themeValue };
      themeValue = themeData.active;
    } catch (e) {}

    return `
      <div class="settings">
        <h1>Settings</h1>
        <form data-form="save-settings">
          <div class="form-group">
            <label for="site_title">Site Title</label>
            <input type="text" id="site_title" name="site_title" value="${siteTitleValue}">
          </div>

          <div class="form-group">
            <label for="theme">Theme</label>
            <select id="theme" name="theme">
              <option value="classic" ${themeValue === 'classic' ? 'selected' : ''}>Classic</option>
              <option value="modern" ${themeValue === 'modern' ? 'selected' : ''}>Modern</option>
              <option value="vibrant" ${themeValue === 'vibrant' ? 'selected' : ''}>Vibrant</option>
              <option value="colorlib-kids" ${themeValue === 'colorlib-kids' ? 'selected' : ''}>Colorlib Kids</option>
              <option value="colorlib-education" ${themeValue === 'colorlib-education' ? 'selected' : ''}>Colorlib Education</option>
              <option value="colorlib-fresh" ${themeValue === 'colorlib-fresh' ? 'selected' : ''}>Colorlib Fresh</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">Save Settings</button>
          </div>
        </form>
      </div>
    `;
  },

  /**
   * Render public site
   */
    async renderPublic(hash) {
    const app = document.getElementById('app');
    const theme = this.getActiveTheme();
    
    // Public navigation
    const nav = this.renderPublicNav();
    
    let content = '';

    if (hash === '/' || hash === '') {
        content = await this.renderHome();
    } else if (hash.startsWith('/posts/')) {
      const slug = hash.replace('/posts/', '');
      content = this.renderPost(slug);
    } else if (hash === '/posts') {
      content = this.renderPostsIndex();
    } else {
      // Try to find a page by slug
      const slug = hash.slice(1);
      content = this.renderPage(slug);
    }

        const themeClass = `theme-${theme}`;
        app.innerHTML = nav + `<main class="public-content ${themeClass}">${content}</main>` + this.renderPublicFooter();
  },

  /**
   * Render public navigation
   */
  renderPublicNav() {
    const menu = db.queryOne('SELECT items FROM menus WHERE name = ?', ['primary']);
    let menuItems = [];
    
    if (menu) {
      try {
        menuItems = JSON.parse(menu.items);
      } catch (e) {}
    }

    const links = menuItems.map(item => 
      `<a href="#${item.href}" data-route="${item.href}">${item.label}</a>`
    ).join('');

      const theme = this.getActiveTheme();
      const themeClass = `theme-${theme}`;

    return `
      <nav class="public-nav ${themeClass}">
        <div class="nav-brand">
          <h1>School CMS</h1>
        </div>
        <div class="nav-links">
          ${links}
          <a href="#/admin" data-route="/admin" class="admin-link">Admin</a>
        </div>
      </nav>
    `;
  },

  /**
   * Render public footer
   */
  renderPublicFooter() {
    const siteTitle = db.queryOne('SELECT value FROM settings WHERE key = ?', ['site_title']);
    let title = 'School CMS';
    try {
      title = siteTitle ? JSON.parse(siteTitle.value) : title;
    } catch (e) {}

      const currentYear = new Date().getFullYear();

    return `
      <footer class="public-footer">
        <div class="footer-container">
          <div class="footer-grid">
            <div class="footer-section footer-brand">
              <div class="footer-logo">
                <div class="logo-box">S</div>
              </div>
              <h3>${title}</h3>
              <p>Empowering Nigerian K12 students with quality education and innovative learning experiences.</p>
            </div>

            <div class="footer-section">
              <h4>Quick Links</h4>
              <div class="footer-links">
                <a href="#/" data-route="/">Home</a>
                <a href="#/about" data-route="/about">About</a>
                <a href="#/contact" data-route="/contact">Contact</a>
                <a href="#/admin" data-route="/admin">Admin</a>
              </div>
            </div>

            <div class="footer-section">
              <h4>Resources</h4>
              <div class="footer-links">
                <a href="#">Student Portal</a>
                <a href="#">Parent Portal</a>
                <a href="#">Staff Portal</a>
                <a href="#">Library</a>
              </div>
            </div>

            <div class="footer-section">
              <h4>Contact Us</h4>
              <div class="footer-contact">
                <a href="mailto:info@school.test">📧 info@school.test</a>
                <p>📞 +234 (0) 123 456 7890</p>
                <p>📍 Lagos, Nigeria</p>
              </div>
            </div>
          </div>

          <div class="footer-divider"></div>

          <div class="footer-bottom">
            <p>&copy; ${currentYear} K12 School CMS. All rights reserved.</p>
            <div class="footer-legal">
              <a href="#">Privacy Policy</a>
              <span>•</span>
              <a href="#">Terms of Service</a>
              <span>•</span>
              <a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  },

  /**
   * Render home page with theme support
   */
    async renderHome() {
    const hero = db.queryOne('SELECT value FROM settings WHERE key = ?', ['hero']);
    const features = db.queryOne('SELECT value FROM settings WHERE key = ?', ['features']);
        const homepage = db.queryOne('SELECT value FROM settings WHERE key = ?', ['homepage']);
        const siteTitle = db.queryOne('SELECT value FROM settings WHERE key = ?', ['site_title']);
    const posts = db.query(
        'SELECT * FROM posts WHERE type = ? AND status = ? ORDER BY created_at DESC LIMIT 6',
      ['post', 'published']
    );

        let heroData = { title: 'Welcome', subtitle: 'Empowering education through technology', ctaText: 'Learn More', ctaLink: '/about' };
    let featuresData = [];
        let homepageData = { featuredPostIds: [], postsSectionTitle: 'Latest News & Updates' };
        let title = 'K12 School CMS';

    try {
      if (hero) heroData = JSON.parse(hero.value);
      if (features) featuresData = JSON.parse(features.value);
        if (homepage) homepageData = JSON.parse(homepage.value);
        if (siteTitle) title = JSON.parse(siteTitle.value);
    } catch (e) {}

        // Get active theme
        const activeTheme = this.getActiveTheme();

        // Try to load theme's Hero component
        let heroHtml = '';
        try {
            const themeModule = await import(`/themes/${activeTheme}/components/Hero.js`);
            if (themeModule && themeModule.renderHero) {
                heroHtml = themeModule.renderHero(heroData);
            }
        } catch (e) {
            console.log(`[Theme] No custom Hero for ${activeTheme}, using default`);
            // Fallback to default hero
            heroHtml = `
        <section class="hero">
          <h1>${heroData.title}</h1>
          <p>${heroData.subtitle}</p>
          <a href="#${heroData.ctaLink}" data-route="${heroData.ctaLink}" class="btn-primary">${heroData.ctaText}</a>
        </section>
      `;
        }

        const featuresList = featuresData.map((f, idx) => `
      <div class="feature-card">
        <div class="feature-icon">${f.icon || '✨'}</div>
        <h3>${f.title}</h3>
        <p>${f.description}</p>
      </div>
    `).join('');

        // Parent quick links section
        const parentLinks = `
      <section class="parent-links">
        <div class="section-header">
          <h2>For Parents</h2>
          <p>Quick access to essential resources and information for parents and guardians.</p>
        </div>
        <div class="quick-links-grid">
          <div class="quick-link-card">
            <div class="quick-link-icon" style="background: var(--primary-color);">📚</div>
            <h3>Admissions</h3>
            <p>Enrollment steps and requirements for new students.</p>
            <a href="#/posts" data-route="/posts" class="card-link">Learn More →</a>
          </div>
          <div class="quick-link-card">
            <div class="quick-link-icon" style="background: var(--secondary-color);">📅</div>
            <h3>Calendar</h3>
            <p>Key dates, events, and academic schedules.</p>
            <a href="#/posts" data-route="/posts" class="card-link">View Calendar →</a>
          </div>
          <div class="quick-link-card">
            <div class="quick-link-icon" style="background: #28a745;">🤝</div>
            <h3>PTA</h3>
            <p>Parent-Teacher Association news and updates.</p>
            <a href="#/posts" data-route="/posts" class="card-link">Join PTA →</a>
          </div>
        </div>
      </section>
    `;

        // Featured posts section
        let featuredPostsHtml = '';
        if (homepageData.featuredPostIds && homepageData.featuredPostIds.length > 0) {
            const featuredPosts = posts.filter(p => homepageData.featuredPostIds.includes(p.id));
            if (featuredPosts.length > 0) {
                featuredPostsHtml = `
          <section class="featured-posts">
            <div class="section-header">
              <h2>Featured Posts</h2>
              <p>Highlighted content and important updates from our school community.</p>
            </div>
            <div class="featured-grid">
              ${featuredPosts.map(p => `
                <div class="featured-card">
                  <h3><a href="#/posts/${p.slug}" data-route="/posts/${p.slug}">${p.title}</a></h3>
                  <time>${new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                  <p>${p.content?.replace(/<[^>]*>/g, '').substring(0, 140)}...</p>
                  <a href="#/posts/${p.slug}" data-route="/posts/${p.slug}" class="read-more">Read more →</a>
                </div>
              `).join('')}
            </div>
          </section>
        `;
            }
        }

        const postsList = posts.slice(0, 3).map(p => `
      <div class="post-card">
        <h3><a href="#/posts/${p.slug}" data-route="/posts/${p.slug}">${p.title}</a></h3>
        <time>${new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        <p>${p.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
        <a href="#/posts/${p.slug}" data-route="/posts/${p.slug}" class="read-more">Read more →</a>
      </div>
    `).join('');

    return `
      <div class="home">
        ${heroHtml}

        ${featuresList ? `
          <section class="features">
            <div class="section-header">
              <h2>Why Choose Us</h2>
              <p>Discover what makes our school the perfect place for your child's educational journey</p>
            </div>
            <div class="features-grid">
              ${featuresList}
            </div>
          </section>
        ` : ''}

        ${parentLinks}

        ${featuredPostsHtml}

        ${postsList ? `
          <section class="recent-posts">
            <div class="section-header">
              <h2>${homepageData.postsSectionTitle || 'Latest News & Updates'}</h2>
              <p>Stay informed with the latest announcements, events, and stories from our school.</p>
            </div>
            <div class="posts-grid">
              ${postsList}
            </div>
            <a href="#/posts" data-route="/posts" class="btn-view-all">View All Posts →</a>
          </section>
        ` : `
          <section class="recent-posts">
            <div class="empty-state">
              <h2>No published posts yet</h2>
              <p>Check back soon for updates and announcements!</p>
            </div>
          </section>
        `}
      </div>
    `;
  },

  /**
   * Render single post
   */
  renderPost(slug) {
    const post = db.queryOne(
      'SELECT * FROM posts WHERE slug = ? AND status = ?',
      [slug, 'published']
    );

    if (!post) {
      return '<div class="not-found"><h1>Post not found</h1></div>';
    }

    return `
      <article class="post">
        <h1>${post.title}</h1>
        <div class="post-meta">
          <time>${new Date(post.created_at).toLocaleDateString()}</time>
        </div>
        <div class="post-content">
          ${post.content}
        </div>
      </article>
    `;
  },

  /**
   * Render posts index
   */
  renderPostsIndex() {
    const posts = db.query(
      'SELECT * FROM posts WHERE type = ? AND status = ? ORDER BY created_at DESC',
      ['post', 'published']
    );

    const postsList = posts.map(p => `
      <div class="post-card">
        <h2><a href="#/posts/${p.slug}" data-route="/posts/${p.slug}">${p.title}</a></h2>
        <p class="post-date">${new Date(p.created_at).toLocaleDateString()}</p>
        <p>${p.content?.substring(0, 200)}...</p>
        <a href="#/posts/${p.slug}" data-route="/posts/${p.slug}" class="read-more">Read more →</a>
      </div>
    `).join('');

    return `
      <div class="posts-index">
        <h1>All Posts</h1>
        <div class="posts-list">
          ${postsList.length ? postsList : '<p>No posts found</p>'}
        </div>
      </div>
    `;
  },

  /**
   * Render single page
   */
  renderPage(slug) {
      // Special handling for rich pages
      if (slug === 'about') return this.renderAboutPage();
      if (slug === 'contact') return this.renderContactPage();
      if (slug === 'admissions') return this.renderAdmissionsPage();
      if (slug === 'calendar') return this.renderCalendarPage();
      if (slug === 'pta') return this.renderPTAPage();
      if (slug === 'parents') return this.renderParentsPage();

      // Default page rendering
    const page = db.queryOne(
      'SELECT * FROM posts WHERE slug = ? AND type = ? AND status = ?',
      [slug, 'page', 'published']
    );

    if (!page) {
      return '<div class="not-found"><h1>Page not found</h1></div>';
    }

    return `
      <article class="page">
        <h1>${page.title}</h1>
        <div class="page-content">
          ${page.content}
        </div>
      </article>
    `;
  },

    /**
     * Render About page with rich content
     */
    renderAboutPage() {
        const aboutData = db.queryOne('SELECT value FROM settings WHERE key = ?', ['about_page']);
        let data = {
            vision: '',
            mission: '',
            values: [],
            facilities: [],
            achievements: []
        };

        try {
            if (aboutData) data = JSON.parse(aboutData.value);
        } catch (e) { }

        const siteTitle = db.queryOne('SELECT value FROM settings WHERE key = ?', ['site_title']);
        let title = 'K12 School CMS';
        try {
            if (siteTitle) title = JSON.parse(siteTitle.value);
        } catch (e) { }

        return `
      <div class="page-container about-page">
        <div class="page-header">
          <h1>About Our School</h1>
          <p class="page-subtitle">Dedicated to excellence in education and nurturing the next generation of leaders.</p>
        </div>

        ${data.vision ? `
          <section class="content-section vision-section">
            <div class="section-icon">🎯</div>
            <h2>Our Vision</h2>
            <p class="vision-text">${data.vision}</p>
          </section>
        ` : ''}

        ${data.mission ? `
          <section class="content-section mission-section">
            <div class="section-icon">🚀</div>
            <h2>Our Mission</h2>
            <p class="mission-text">${data.mission}</p>
          </section>
        ` : ''}

        ${data.values && data.values.length > 0 ? `
          <section class="content-section values-section">
            <h2>Our Core Values</h2>
            <div class="values-grid">
              ${data.values.map((value, idx) => `
                <div class="value-card">
                  <div class="value-number">${idx + 1}</div>
                  <h3>${value.title}</h3>
                  <p>${value.description}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${data.facilities && data.facilities.length > 0 ? `
          <section class="content-section facilities-section">
            <h2>Our Facilities</h2>
            <div class="facilities-grid">
              ${data.facilities.map(facility => `
                <div class="facility-card">
                  <div class="facility-icon">${facility.icon}</div>
                  <h3>${facility.title}</h3>
                  <p>${facility.description}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${data.achievements && data.achievements.length > 0 ? `
          <section class="content-section achievements-section">
            <h2>Our Achievements</h2>
            <div class="achievements-timeline">
              ${data.achievements.map(achievement => `
                <div class="achievement-item">
                  <div class="achievement-year">${achievement.year}</div>
                  <div class="achievement-content">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="cta-section">
          <h2>Join Our Community</h2>
          <p>Interested in learning more about our school? We'd love to hear from you!</p>
          <a href="#/contact" data-route="/contact" class="btn-primary">Get in Touch</a>
        </section>
      </div>
    `;
    },

    /**
     * Render Contact page with rich content
     */
    renderContactPage() {
        const contactData = db.queryOne('SELECT value FROM settings WHERE key = ?', ['contact_page']);
        let data = {
            phone: '',
            email: '',
            address: '',
            officeHours: [],
            departments: [],
            socialMedia: []
        };

        try {
            if (contactData) data = JSON.parse(contactData.value);
        } catch (e) { }

        return `
      <div class="page-container contact-page">
        <div class="page-header">
          <h1>Contact Us</h1>
          <p class="page-subtitle">We'd love to hear from you! Reach out with any questions, feedback, or enrollment inquiries.</p>
        </div>

        <div class="contact-grid">
          <div class="contact-form-section">
            <h2>Send Us a Message</h2>
            <form data-form="contact" class="contact-form">
              <div class="form-group">
                <label for="contact-name">Your Name</label>
                <input type="text" id="contact-name" name="name" required>
              </div>
              <div class="form-group">
                <label for="contact-email">Email Address</label>
                <input type="email" id="contact-email" name="email" required>
              </div>
              <div class="form-group">
                <label for="contact-subject">Subject</label>
                <input type="text" id="contact-subject" name="subject" required>
              </div>
              <div class="form-group">
                <label for="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows="6" required></textarea>
              </div>
              <button type="submit" class="btn-primary">Send Message</button>
            </form>
          </div>

          <div class="contact-info-section">
            <div class="contact-info-card">
              <h3>📍 Visit Us</h3>
              <p>${data.address}</p>
            </div>

            <div class="contact-info-card">
              <h3>📞 Call Us</h3>
              <p><a href="tel:${data.phone}">${data.phone}</a></p>
            </div>

            <div class="contact-info-card">
              <h3>📧 Email Us</h3>
              <p><a href="mailto:${data.email}">${data.email}</a></p>
            </div>

            ${data.officeHours && data.officeHours.length > 0 ? `
              <div class="contact-info-card">
                <h3>🕐 Office Hours</h3>
                ${data.officeHours.map(schedule => `
                  <p><strong>${schedule.day}:</strong> ${schedule.hours}</p>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        ${data.departments && data.departments.length > 0 ? `
          <section class="departments-section">
            <h2>Department Contacts</h2>
            <div class="departments-grid">
              ${data.departments.map(dept => `
                <div class="department-card">
                  <h3>${dept.name}</h3>
                  <p>📧 <a href="mailto:${dept.email}">${dept.email}</a></p>
                  <p>📞 <a href="tel:${dept.phone}">${dept.phone}</a></p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${data.socialMedia && data.socialMedia.length > 0 ? `
          <section class="social-section">
            <h2>Connect With Us</h2>
            <div class="social-links">
              ${data.socialMedia.map(social => `
                <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link">
                  <span class="social-icon">${social.icon}</span>
                  <span>${social.platform}</span>
                </a>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    `;
    },

    /**
     * Render Admissions page
     */
    renderAdmissionsPage() {
        const data = db.queryOne('SELECT value FROM settings WHERE key = ?', ['admissions_page']);
        let admissions = { hero: {}, process: [], requirements: {}, admissionCriteria: [], importantDates: [] };
        try {
            if (data) admissions = JSON.parse(data.value);
        } catch (e) { }

        return `
      <div class="page-container admissions-page">
        <div class="page-header">
          <h1>${admissions.hero?.title || 'Admissions'}</h1>
          <p class="page-subtitle">${admissions.hero?.subtitle || ''}</p>
        </div>

        ${admissions.process && admissions.process.length > 0 ? `
          <section class="content-section">
            <h2>Admission Process</h2>
            <div class="process-steps">
              ${admissions.process.map(step => `
                <div class="process-step">
                  <div class="step-number">${step.icon}</div>
                  <div class="step-content">
                    <h3>Step ${step.step}: ${step.title}</h3>
                    <p>${step.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <div class="two-column-section">
          ${admissions.requirements ? `
            <section class="content-card">
              <h3>📋 Required Documents</h3>
              <ul class="checklist">
                ${(admissions.requirements.documents || []).map(doc => `<li>${doc}</li>`).join('')}
              </ul>
            </section>
          ` : ''}

          ${admissions.admissionCriteria && admissions.admissionCriteria.length > 0 ? `
            <section class="content-card">
              <h3>✓ Admission Criteria</h3>
              <ul class="checklist">
                ${admissions.admissionCriteria.map(criteria => `<li>${criteria}</li>`).join('')}
              </ul>
            </section>
          ` : ''}
        </div>

        ${admissions.requirements?.fees ? `
          <section class="content-section fees-section">
            <h2>Fee Structure</h2>
            <div class="fees-grid">
              <div class="fee-card">
                <h3>Application Fee</h3>
                <p class="fee-amount">${admissions.requirements.fees.application}</p>
              </div>
              <div class="fee-card">
                <h3>Registration Fee</h3>
                <p class="fee-amount">${admissions.requirements.fees.registration}</p>
              </div>
              ${admissions.requirements.fees.tuition ? `
                <div class="fee-card">
                  <h3>Primary Tuition</h3>
                  <p class="fee-amount">${admissions.requirements.fees.tuition.primary}</p>
                </div>
                <div class="fee-card">
                  <h3>Secondary Tuition</h3>
                  <p class="fee-amount">${admissions.requirements.fees.tuition.secondary}</p>
                </div>
              ` : ''}
            </div>
          </section>
        ` : ''}

        ${admissions.importantDates && admissions.importantDates.length > 0 ? `
          <section class="content-section">
            <h2>Important Dates</h2>
            <div class="dates-timeline">
              ${admissions.importantDates.map(item => `
                <div class="date-item">
                  <div class="date-marker"></div>
                  <div class="date-content">
                    <h3>${item.event}</h3>
                    <p class="date-value">${item.date}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="cta-section">
          <h2>Ready to Apply?</h2>
          <p>Start your child's educational journey with us today!</p>
          <a href="#/contact" data-route="/contact" class="btn-primary">Contact Admissions Office</a>
        </section>
      </div>
    `;
    },

    /**
     * Render Calendar page
     */
    renderCalendarPage() {
        const data = db.queryOne('SELECT value FROM settings WHERE key = ?', ['calendar_page']);
        let calendar = { hero: {}, currentTerm: {}, events: [], termDates: [] };
        try {
            if (data) calendar = JSON.parse(data.value);
        } catch (e) { }

        return `
      <div class="page-container calendar-page">
        <div class="page-header">
          <h1>${calendar.hero?.title || 'Academic Calendar'}</h1>
          <p class="page-subtitle">${calendar.hero?.subtitle || ''}</p>
        </div>

        ${calendar.currentTerm ? `
          <div class="current-term-banner">
            <h2>${calendar.currentTerm.name}</h2>
            <p>${calendar.currentTerm.startDate} - ${calendar.currentTerm.endDate}</p>
          </div>
        ` : ''}

        ${calendar.events && calendar.events.length > 0 ? `
          <section class="content-section">
            <h2>Upcoming Events</h2>
            <div class="events-grid">
              ${calendar.events.map(monthGroup => `
                <div class="month-section">
                  <h3 class="month-header">${monthGroup.month}</h3>
                  <div class="events-list">
                    ${monthGroup.items.map(event => `
                      <div class="event-card event-${event.type}">
                        <div class="event-date">${event.date}</div>
                        <div class="event-details">
                          <h4>${event.title}</h4>
                          <p>${event.description}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${calendar.termDates && calendar.termDates.length > 0 ? `
          <section class="content-section">
            <h2>Term Dates</h2>
            <div class="term-dates-grid">
              ${calendar.termDates.map(term => `
                <div class="term-card">
                  <h3>${term.term}</h3>
                  <ul class="term-details">
                    <li><strong>Resumption:</strong> ${term.resumption}</li>
                    <li><strong>Mid-Term Break:</strong> ${term.midTerm}</li>
                    <li><strong>Exams:</strong> ${term.exams}</li>
                    <li><strong>Vacation:</strong> ${term.vacation}</li>
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    `;
    },

    /**
     * Render PTA page
     */
    renderPTAPage() {
        const data = db.queryOne('SELECT value FROM settings WHERE key = ?', ['pta_page']);
        let pta = { hero: {}, mission: '', leadership: [], benefits: [], upcomingMeetings: [], initiatives: [] };
        try {
            if (data) pta = JSON.parse(data.value);
        } catch (e) { }

        return `
      <div class="page-container pta-page">
        <div class="page-header">
          <h1>${pta.hero?.title || 'Parent-Teacher Association'}</h1>
          <p class="page-subtitle">${pta.hero?.subtitle || ''}</p>
        </div>

        ${pta.mission ? `
          <section class="mission-section">
            <div class="section-icon">🤝</div>
            <p class="mission-text">${pta.mission}</p>
          </section>
        ` : ''}

        ${pta.leadership && pta.leadership.length > 0 ? `
          <section class="content-section">
            <h2>PTA Leadership</h2>
            <div class="leadership-grid">
              ${pta.leadership.map(leader => `
                <div class="leader-card">
                  <div class="leader-icon">👤</div>
                  <h3>${leader.position}</h3>
                  <p class="leader-name">${leader.name}</p>
                  <p>📧 <a href="mailto:${leader.email}">${leader.email}</a></p>
                  <p>📞 ${leader.phone}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <div class="two-column-section">
          ${pta.benefits && pta.benefits.length > 0 ? `
            <section class="content-card">
              <h3>✨ Membership Benefits</h3>
              <ul class="benefits-list">
                ${pta.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
              </ul>
            </section>
          ` : ''}

          ${pta.initiatives && pta.initiatives.length > 0 ? `
            <section class="content-card">
              <h3>🎯 Current Initiatives</h3>
              <ul class="benefits-list">
                ${pta.initiatives.map(initiative => `<li>${initiative}</li>`).join('')}
              </ul>
            </section>
          ` : ''}
        </div>

        ${pta.upcomingMeetings && pta.upcomingMeetings.length > 0 ? `
          <section class="content-section">
            <h2>Upcoming Meetings</h2>
            <div class="meetings-list">
              ${pta.upcomingMeetings.map(meeting => `
                <div class="meeting-card">
                  <div class="meeting-date">
                    <div class="date-icon">📅</div>
                    <div>${meeting.date}</div>
                    <div class="meeting-time">${meeting.time}</div>
                  </div>
                  <div class="meeting-details">
                    <h3>${meeting.venue}</h3>
                    <p><strong>Agenda:</strong> ${meeting.agenda}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <section class="cta-section">
          <h2>Join the PTA Today!</h2>
          <p>Be part of our community and make a difference in your child's education.</p>
          <a href="#/contact" data-route="/contact" class="btn-primary">Get Involved</a>
        </section>
      </div>
    `;
    },

    /**
     * Render Parents page
     */
    renderParentsPage() {
        const data = db.queryOne('SELECT value FROM settings WHERE key = ?', ['parents_page']);
        let parents = { hero: {}, quickLinks: [], resources: [], faqs: [], importantContacts: [] };
        try {
            if (data) parents = JSON.parse(data.value);
        } catch (e) { }

        return `
      <div class="page-container parents-page">
        <div class="page-header">
          <h1>${parents.hero?.title || 'For Parents'}</h1>
          <p class="page-subtitle">${parents.hero?.subtitle || ''}</p>
        </div>

        ${parents.quickLinks && parents.quickLinks.length > 0 ? `
          <section class="content-section">
            <h2>Quick Links</h2>
            <div class="quick-links-grid">
              ${parents.quickLinks.map(link => `
                <a href="${link.link}" class="parent-link-card">
                  <div class="link-icon">${link.icon}</div>
                  <h3>${link.title}</h3>
                  <p>${link.description}</p>
                </a>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${parents.resources && parents.resources.length > 0 ? `
          <section class="content-section">
            <h2>Parent Resources</h2>
            <div class="resources-grid">
              ${parents.resources.map(resource => `
                <div class="resource-card">
                  <h3>${resource.category}</h3>
                  <ul>
                    ${resource.items.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${parents.faqs && parents.faqs.length > 0 ? `
          <section class="content-section faqs-section">
            <h2>Frequently Asked Questions</h2>
            <div class="faqs-list">
              ${parents.faqs.map(faq => `
                <div class="faq-item">
                  <h3>Q: ${faq.question}</h3>
                  <p>A: ${faq.answer}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${parents.importantContacts && parents.importantContacts.length > 0 ? `
          <section class="content-section">
            <h2>Important Contacts</h2>
            <div class="contacts-grid">
              ${parents.importantContacts.map(contact => `
                <div class="contact-card-mini">
                  <h3>${contact.department}</h3>
                  <p>📞 ${contact.contact}</p>
                  <p>📧 <a href="mailto:${contact.email}">${contact.email}</a></p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    `;
    },

  /**
   * Handle form submissions
   */
  async handleFormSubmit(formType, form) {
    const formData = new FormData(form);

      if (formType === 'contact') {
          const name = formData.get('name');
          const email = formData.get('email');
          const subject = formData.get('subject');
          const message = formData.get('message');

          // In a real app, this would send an email or save to database
          console.log('[CONTACT] Form submitted:', { name, email, subject, message });

          alert(`Thank you for your message, ${name}!\n\nWe'll get back to you at ${email} soon.\n\nNote: This is a demo - no actual email was sent.`);
          form.reset();
          return;
      }

    if (formType === 'login') {
      const email = formData.get('email');
      const password = formData.get('password');
      
      const user = db.queryOne('SELECT * FROM users WHERE email = ?', [email]);
      
      if (user) {
        const passwordHash = await db._simpleHash(password);
        if (user.password_hash === passwordHash) {
          const role = db.queryOne('SELECT * FROM roles WHERE id = ?', [user.role_id]);
          const session = {
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            role: role?.name,
            capabilities: role ? JSON.parse(role.capabilities || '[]') : []
          };
          // Store in memory only - no localStorage
          this.currentUser = session;
          this.sessionToken = crypto.randomUUID();
          console.log('[AUTH] ✓ Logged in - session exists in memory only');
          console.log('[AUTH] ⚠️  You will be logged out on page refresh');
          this.navigate('/admin');
        } else {
          alert('Invalid password');
        }
      } else {
        alert('User not found');
      }
    }

    if (formType === 'save-post') {
      const id = form.getAttribute('data-id');
      const data = {
        type: formData.get('type'),
        title: formData.get('title'),
        slug: formData.get('slug'),
        content: formData.get('content'),
        status: formData.get('status'),
        author_id: this.currentUser?.id || 1
      };

      if (id) {
        db.exec(
          'UPDATE posts SET title = ?, slug = ?, content = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [data.title, data.slug, data.content, data.status, id]
        );
        alert('Post updated!\n\n⚠️ Remember to export database to save changes to file.');
      } else {
        db.exec(
          'INSERT INTO posts (type, title, slug, content, status, author_id) VALUES (?, ?, ?, ?, ?, ?)',
          [data.type, data.title, data.slug, data.content, data.status, data.author_id]
        );
        alert('Post created!\n\n⚠️ Remember to export database to save changes to file.');
      }

      this.navigate(`/admin/${data.type}s`);
    }

    if (formType === 'save-settings') {
      const siteTitle = formData.get('site_title');
      const theme = formData.get('theme');

      db.exec(
        'UPDATE settings SET value = ? WHERE key = ?',
        [JSON.stringify(siteTitle), 'site_title']
      );
      
      db.exec(
        'UPDATE settings SET value = ? WHERE key = ?',
        [JSON.stringify({ active: theme }), 'theme']
      );

      alert('Settings saved!\n\n⚠️ Remember to export database to persist changes.');
      this.render();
    }
  },

  /**
   * Handle actions
   */
  async handleAction(action, element) {
    if (action === 'logout') {
      this.currentUser = null;
      this.sessionToken = null;
      console.log('[AUTH] Logged out');
      this.navigate('/');
    }

    if (action === 'delete-post') {
      if (confirm('Are you sure you want to delete this post?')) {
        const id = element.getAttribute('data-id');
        db.exec('DELETE FROM posts WHERE id = ?', [id]);
        this.render();
      }
    }

    if (action === 'delete-media') {
      if (confirm('Delete this file?')) {
        const id = element.getAttribute('data-id');
        db.exec('DELETE FROM media WHERE id = ?', [id]);
        this.render();
      }
    }

    if (action === 'upload-media') {
      const file = element.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          db.exec(
            'INSERT INTO media (filename, path, mime, size, uploader_id, data) VALUES (?, ?, ?, ?, ?, ?)',
            [file.name, file.name, file.type, file.size, this.currentUser?.id || 1, e.target.result]
          );
          this.render();
        };
        reader.readAsDataURL(file);
      }
    }

    if (action === 'export-db') {
      db.export();
    }

    if (action === 'import-db') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.sqlite,.db';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          await db.import(file);
          alert('Database imported');
          this.render();
        }
      };
      input.click();
    }
  },

  /**
   * Get active theme
   */
  getActiveTheme() {
    const theme = db.queryOne('SELECT value FROM settings WHERE key = ?', ['theme']);
    try {
      const themeData = theme ? JSON.parse(theme.value) : { active: 'colorlib-kids' };
      return themeData.active;
    } catch (e) {
      return 'colorlib-kids';
    }
  }
};
