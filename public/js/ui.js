/**
 * UI Module - Pure JavaScript DOM manipulation
 * Handles all UI rendering and interactions
 */

// Import page modules
import { renderAdmissionsPage } from './pages/admissions.js';
import { renderCalendarPage } from './pages/calendar.js';
import { renderPTAPage } from './pages/pta.js';
import { renderParentsPage } from './pages/parents.js';
import { renderResourcesPage } from './pages/resources.js';
import { renderFAQsPage } from './pages/faqs.js';

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
            <a href="#/admissions" data-route="/admissions" class="card-link">Learn More →</a>
          </div>
          <div class="quick-link-card">
            <div class="quick-link-icon" style="background: var(--secondary-color);">📅</div>
            <h3>Calendar</h3>
            <p>Key dates, events, and academic schedules.</p>
            <a href="#/calendar" data-route="/calendar" class="card-link">View Calendar →</a>
          </div>
          <div class="quick-link-card">
            <div class="quick-link-icon" style="background: #28a745;">🤝</div>
            <h3>PTA</h3>
            <p>Parent-Teacher Association news and updates.</p>
            <a href="#/pta" data-route="/pta" class="card-link">Join PTA →</a>
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
      if (slug === 'admissions') return renderAdmissionsPage(db);
      if (slug === 'calendar') return renderCalendarPage(db);
      if (slug === 'pta') return renderPTAPage(db);
      if (slug === 'parents') return renderParentsPage(db);
      if (slug === 'resources') return renderResourcesPage(db);
      if (slug === 'faqs') return renderFAQsPage(db);

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
   * Handle form submissions
   */
  async handleFormSubmit(formType, form) {
        // Get all pages of type 'page' with 'admission' in slug or title
        const admissionPages = db.queryAll(
            `SELECT id, title, slug, content, created_at, updated_at 
             FROM posts 
             WHERE status = ? AND (type = ? OR slug LIKE ? OR title LIKE ?) 
             ORDER BY created_at DESC`,
            ['published', 'page', '%admission%', '%Admission%']
        );

        return `
      <div class="page-container admissions-page">
        <div class="page-header">
          <h1>🎓 Admissions</h1>
          <p class="page-subtitle">Everything you need to know about joining our school</p>
        </div>

        <!-- Quick Info Cards -->
        <div class="info-cards-grid">
          <div class="info-card gradient-blue">
            <div class="info-icon">📝</div>
            <h3>Application</h3>
            <p>Submit your application online or visit our office</p>
          </div>
          <div class="info-card gradient-purple">
            <div class="info-icon">📅</div>
            <h3>Timeline</h3>
            <p>Applications accepted year-round for all grades</p>
          </div>
          <div class="info-card gradient-green">
            <div class="info-icon">💰</div>
            <h3>Fees</h3>
            <p>Competitive and transparent fee structure</p>
          </div>
          <div class="info-card gradient-orange">
            <div class="info-icon">🎯</div>
            <h3>Requirements</h3>
            <p>Simple documentation and age-appropriate criteria</p>
          </div>
        </div>

        <!-- Admission Information List -->
        ${admissionPages.length > 0 ? `
          <section class="content-section">
            <h2>📚 Admission Information</h2>
            <div class="modern-list">
              ${admissionPages.map(page => {
                  const excerpt = page.content ? page.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...' : 'Click to read more about this admission information.';
                  const date = new Date(page.updated_at || page.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                  return `
                  <div class="modern-list-item">
                    <div class="list-item-icon">📄</div>
                    <div class="list-item-content">
                      <h3><a href="#/posts/${page.slug}" data-route="/posts/${page.slug}">${page.title}</a></h3>
                      <p class="list-item-excerpt">${excerpt}</p>
                      <div class="list-item-meta">
                        <span class="meta-date">📅 ${date}</span>
                        <a href="#/posts/${page.slug}" data-route="/posts/${page.slug}" class="read-more-link">Read More →</a>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Admission Process Steps -->
        <section class="content-section">
          <h2>🚀 How to Apply</h2>
          <div class="process-steps-modern">
            <div class="step-card">
              <div class="step-number-modern">1</div>
              <h3>Submit Application</h3>
              <p>Fill out the online application form or visit our admissions office to get started.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern">2</div>
              <h3>Document Review</h3>
              <p>Submit required documents including birth certificate, previous records, and photos.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern">3</div>
              <h3>Assessment</h3>
              <p>Age-appropriate assessment to determine the right class placement for your child.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern">4</div>
              <h3>Enrollment</h3>
              <p>Complete enrollment process, pay fees, and receive your admission letter.</p>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section-modern">
          <div class="cta-content">
            <h2>Ready to Join Our School Family?</h2>
            <p>Start your child's educational journey with us today. Our admissions team is here to help!</p>
            <div class="cta-buttons">
              <a href="#/contact" data-route="/contact" class="btn-primary-modern">Contact Admissions</a>
              <a href="#/about" data-route="/about" class="btn-secondary-modern">Learn More About Us</a>
            </div>
          </div>
        </section>
      </div>
    `;
    },

  /**
   * Handle form submissions
   */
  async handleFormSubmit(formType, form) {
    const formData = new FormData(form);
        // Get all posts ordered by date
        const allPosts = db.queryAll(
            'SELECT id, title, slug, content, created_at, updated_at FROM posts WHERE status = ? ORDER BY created_at DESC LIMIT 50',
            ['published']
        );

        // Group posts by month
        const postsByMonth = {};
        allPosts.forEach(post => {
            const date = new Date(post.created_at);
            const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            if (!postsByMonth[monthKey]) {
                postsByMonth[monthKey] = [];
            }
            postsByMonth[monthKey].push(post);
        });

        const now = new Date();
        const currentMonth = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

        return `
      <div class="page-container calendar-page">
        <div class="page-header">
          <h1>📅 Events & Updates</h1>
          <p class="page-subtitle">All school events, news, and announcements organized by date</p>
        </div>

        <!-- Current Month Highlight -->
        <div class="current-month-banner">
          <div class="banner-content">
            <div class="banner-icon">📆</div>
            <div>
              <h2>${currentMonth}</h2>
              <p>${allPosts.filter(p => {
                  const date = new Date(p.created_at);
                  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) === currentMonth;
              }).length} events and updates this month</p>
            </div>
          </div>
        </div>

        <!-- Posts Timeline -->
        ${Object.keys(postsByMonth).length > 0 ? Object.keys(postsByMonth).map(monthKey => `
          <section class="month-section-modern">
            <div class="month-header-sticky">
              <h2 class="month-title">${monthKey}</h2>
              <span class="month-count">${postsByMonth[monthKey].length} ${postsByMonth[monthKey].length === 1 ? 'event' : 'events'}</span>
            </div>
            
            <div class="timeline-list">
              ${postsByMonth[monthKey].map(post => {
                  const date = new Date(post.created_at);
                  const day = date.getDate();
                  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const excerpt = post.content ? post.content.substring(0, 180).replace(/<[^>]*>/g, '') + '...' : '';
                  const isToday = date.toDateString() === now.toDateString();

                  return `
                  <div class="timeline-item ${isToday ? 'timeline-today' : ''}">
                    <div class="timeline-date">
                      <div class="date-number">${day}</div>
                      <div class="date-weekday">${weekday}</div>
                    </div>
                    <div class="timeline-connector"></div>
                    <div class="timeline-content">
                      <div class="timeline-card">
                        ${isToday ? '<span class="today-badge">Today</span>' : ''}
                        <h3><a href="#/posts/${post.slug}" data-route="/posts/${post.slug}">${post.title}</a></h3>
                        <p class="timeline-excerpt">${excerpt}</p>
                        <a href="#/posts/${post.slug}" data-route="/posts/${post.slug}" class="timeline-read-more">Read Full Article →</a>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        `).join('') : `
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No Events Yet</h3>
            <p>Check back soon for upcoming events and announcements!</p>
          </div>
        `}
      </div>
    `;
    },

    /**
     * Render PTA page - Modern list view
     */
    renderPTAPage() {
        // Query PTA-related posts from database
        const ptaPosts = db.queryAll(
            `SELECT * FROM posts WHERE status = ? AND (type = ? OR slug LIKE ? OR title LIKE ? OR content LIKE ?) ORDER BY created_at DESC`,
            ['published', 'page', '%pta%', '%PTA%', '%Parent-Teacher%']
        );

        return `
      <div class="page-container pta-page">
        <div class="page-header">
          <h1>🤝 Parent-Teacher Association</h1>
          <p class="page-subtitle">Building strong partnerships between home and school</p>
        </div>

        <!-- Info Cards -->
        <div class="info-cards-grid">
          <div class="info-card gradient-blue">
            <div class="info-card-icon">👥</div>
            <h3>Community</h3>
            <p>Join our vibrant community of engaged parents and dedicated teachers working together.</p>
          </div>
          <div class="info-card gradient-purple">
            <div class="info-card-icon">📅</div>
            <h3>Events</h3>
            <p>Regular meetings, workshops, and social events to connect and collaborate.</p>
          </div>
          <div class="info-card gradient-green">
            <div class="info-card-icon">💡</div>
            <h3>Initiatives</h3>
            <p>Drive positive change through fundraisers, programs, and school improvements.</p>
          </div>
          <div class="info-card gradient-orange">
            <div class="info-card-icon">🎯</div>
            <h3>Impact</h3>
            <p>Make a meaningful difference in your child's educational journey and school experience.</p>
          </div>
        </div>

        <!-- PTA Posts/Updates -->
        ${ptaPosts.length > 0 ? `
          <section class="content-section">
            <h2>PTA News & Updates</h2>
            <div class="modern-list">
              ${ptaPosts.map(post => {
                const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');
                const postDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                return `
                  <div class="modern-list-item">
                    <div class="list-item-icon">📄</div>
                    <div class="list-item-content">
                      <h3><a href="#/posts/${post.slug}" data-route="/posts/${post.slug}">${post.title}</a></h3>
                      <p class="list-item-meta">${postDate}</p>
                      ${excerpt ? `<p class="list-item-excerpt">${excerpt}</p>` : ''}
                      <a href="#/posts/${post.slug}" data-route="/posts/${post.slug}" class="read-more-link">Read More →</a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Membership Benefits -->
        <section class="content-section">
          <h2>Membership Benefits</h2>
          <div class="process-steps-modern">
            <div class="step-card">
              <div class="step-number-modern gradient-blue">1</div>
              <h3>Stay Informed</h3>
              <p>Get regular updates about school activities, events, and important announcements.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-purple">2</div>
              <h3>Network & Connect</h3>
              <p>Meet other parents, build friendships, and create a supportive community network.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-green">3</div>
              <h3>Influence Decisions</h3>
              <p>Have a voice in school policies, programs, and initiatives that affect your children.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-orange">4</div>
              <h3>Support Excellence</h3>
              <p>Contribute to fundraising efforts and programs that enhance educational quality.</p>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section-modern">
          <div class="cta-content">
            <h2>Join the PTA Today!</h2>
            <p>Be part of our community and make a difference in your child's education. Together, we can create an even better learning environment.</p>
          </div>
          <div class="cta-buttons">
            <a href="#/contact" data-route="/contact" class="btn-primary-modern">Get Involved</a>
            <a href="#/calendar" data-route="/calendar" class="btn-secondary-modern">View Events</a>
          </div>
        </section>
      </div>
    `;
    },

    /**
     * Render Parents page - Modern hub for parent resources
     */
    renderParentsPage() {
        // Query parent-related posts
        const parentPosts = db.queryAll(
            `SELECT * FROM posts WHERE status = ? AND (slug LIKE ? OR title LIKE ? OR content LIKE ?) ORDER BY created_at DESC LIMIT 10`,
            ['published', '%parent%', '%Parent%', '%parent%']
        );

        return `
      <div class="page-container parents-page">
        <div class="page-header">
          <h1>👨‍👩‍👧‍👦 For Parents</h1>
          <p class="page-subtitle">Resources, guides, and information to support your child's learning journey</p>
        </div>

        <!-- Quick Access Cards -->
        <div class="info-cards-grid">
          <div class="info-card gradient-blue">
            <div class="info-card-icon">📚</div>
            <h3>Resources</h3>
            <p>Access guides, handbooks, and helpful materials for parents.</p>
            <a href="#/resources" data-route="/resources" class="card-link-white">View Resources →</a>
          </div>
          <div class="info-card gradient-purple">
            <div class="info-card-icon">❓</div>
            <h3>FAQs</h3>
            <p>Find answers to commonly asked questions about school policies and procedures.</p>
            <a href="#/faqs" data-route="/faqs" class="card-link-white">View FAQs →</a>
          </div>
          <div class="info-card gradient-green">
            <div class="info-card-icon">🤝</div>
            <h3>PTA</h3>
            <p>Join the Parent-Teacher Association and get involved in school activities.</p>
            <a href="#/pta" data-route="/pta" class="card-link-white">Join PTA →</a>
          </div>
          <div class="info-card gradient-orange">
            <div class="info-card-icon">📞</div>
            <h3>Contact</h3>
            <p>Reach out to teachers, staff, and administration for support.</p>
            <a href="#/contact" data-route="/contact" class="card-link-white">Contact Us →</a>
          </div>
        </div>

        <!-- Parent Updates -->
        ${parentPosts.length > 0 ? `
          <section class="content-section">
            <h2>Parent Updates & News</h2>
            <div class="modern-list">
              ${parentPosts.map(post => {
                const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');
                const postDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                return `
                  <div class="modern-list-item">
                    <div class="list-item-icon">📄</div>
                    <div class="list-item-content">
                      <h3><a href="#/posts/${post.slug}" data-route="/posts/${post.slug}">${post.title}</a></h3>
                      <p class="list-item-meta">${postDate}</p>
                      ${excerpt ? `<p class="list-item-excerpt">${excerpt}</p>` : ''}
                      <a href="#/posts/${post.slug}" data-route="/posts/${post.slug}" class="read-more-link">Read More →</a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Key Information -->
        <section class="content-section">
          <h2>Essential Parent Information</h2>
          <div class="process-steps-modern">
            <div class="step-card">
              <div class="step-number-modern gradient-blue">📖</div>
              <h3>Parent Handbook</h3>
              <p>Comprehensive guide covering school policies, procedures, and expectations.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-purple">📅</div>
              <h3>School Calendar</h3>
              <p>Important dates, holidays, events, and academic schedules for the year.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-green">💳</div>
              <h3>Payment Portal</h3>
              <p>Secure online payment system for tuition, fees, and other school expenses.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-orange">📊</div>
              <h3>Progress Reports</h3>
              <p>Access your child's academic progress, attendance, and performance reports.</p>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="cta-section-modern">
          <div class="cta-content">
            <h2>Need Help or Support?</h2>
            <p>Our team is here to assist you. Reach out to us with any questions or concerns about your child's education.</p>
          </div>
          <div class="cta-buttons">
            <a href="#/contact" data-route="/contact" class="btn-primary-modern">Contact School</a>
            <a href="#/faqs" data-route="/faqs" class="btn-secondary-modern">View FAQs</a>
          </div>
        </section>
      </div>
    `;
    },

    /**
     * Render Resources page - Document library and downloads
     */
    renderResourcesPage() {
        // Query resource-related posts
        const resourcePosts = db.queryAll(
            `SELECT * FROM posts WHERE status = ? AND (slug LIKE ? OR title LIKE ? OR content LIKE ?) ORDER BY created_at DESC`,
            ['published', '%resource%', '%Resource%', '%handbook%']
        );

        return `
      <div class="page-container resources-page">
        <div class="page-header">
          <h1>📚 Resources & Downloads</h1>
          <p class="page-subtitle">Handbooks, guides, forms, and helpful documents for students and parents</p>
        </div>

        <!-- Resource Categories -->
        <div class="info-cards-grid">
          <div class="info-card gradient-blue">
            <div class="info-card-icon">📖</div>
            <h3>Handbooks</h3>
            <p>Student handbook, parent handbook, and policy documents.</p>
          </div>
          <div class="info-card gradient-purple">
            <div class="info-card-icon">📝</div>
            <h3>Forms</h3>
            <p>Download permission slips, enrollment forms, and other required documents.</p>
          </div>
          <div class="info-card gradient-green">
            <div class="info-card-icon">📊</div>
            <h3>Reports</h3>
            <p>Academic calendars, newsletters, and school performance reports.</p>
          </div>
          <div class="info-card gradient-orange">
            <div class="info-card-icon">📧</div>
            <h3>Templates</h3>
            <p>Letter templates, project guidelines, and study resources.</p>
          </div>
        </div>

        <!-- Resource Documents -->
        ${resourcePosts.length > 0 ? `
          <section class="content-section">
            <h2>Available Resources</h2>
            <div class="modern-list">
              ${resourcePosts.map(post => {
                const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');
                const postDate = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                return `
                  <div class="modern-list-item">
                    <div class="list-item-icon">📄</div>
                    <div class="list-item-content">
                      <h3><a href="#/posts/${post.slug}" data-route="/posts/${post.slug}">${post.title}</a></h3>
                      <p class="list-item-meta">${postDate}</p>
                      ${excerpt ? `<p class="list-item-excerpt">${excerpt}</p>` : ''}
                      <a href="#/posts/${post.slug}" data-route="/posts/${post.slug}" class="read-more-link">View Resource →</a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : `
          <section class="content-section">
            <div class="empty-state">
              <p>📁 No resources available at this time. Check back soon for handbooks, forms, and guides.</p>
            </div>
          </section>
        `}

        <!-- Common Resources -->
        <section class="content-section">
          <h2>Commonly Requested Documents</h2>
          <div class="process-steps-modern">
            <div class="step-card">
              <div class="step-number-modern gradient-blue">📖</div>
              <h3>Student Handbook</h3>
              <p>Comprehensive guide to school policies, rules, and expectations for students.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-purple">👨‍👩‍👧</div>
              <h3>Parent Handbook</h3>
              <p>Essential information for parents about school operations and involvement.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-green">📅</div>
              <h3>Academic Calendar</h3>
              <p>Important dates, holidays, exam schedules, and school events for the year.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-orange">📝</div>
              <h3>Enrollment Forms</h3>
              <p>Applications and forms needed for new student registration and enrollment.</p>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="cta-section-modern">
          <div class="cta-content">
            <h2>Need a Specific Document?</h2>
            <p>Can't find what you're looking for? Contact our office and we'll help you get the documents you need.</p>
          </div>
          <div class="cta-buttons">
            <a href="#/contact" data-route="/contact" class="btn-primary-modern">Contact Office</a>
            <a href="#/parents" data-route="/parents" class="btn-secondary-modern">Parent Portal</a>
          </div>
        </section>
      </div>
    `;
    },

    /**
     * Render FAQs page - Frequently Asked Questions
     */
    renderFAQsPage() {
        // Query FAQ-related posts
        const faqPosts = db.queryAll(
            `SELECT * FROM posts WHERE status = ? AND (slug LIKE ? OR title LIKE ? OR content LIKE ?) ORDER BY created_at DESC`,
            ['published', '%faq%', '%FAQ%', '%question%']
        );

        return `
      <div class="page-container faqs-page">
        <div class="page-header">
          <h1>❓ Frequently Asked Questions</h1>
          <p class="page-subtitle">Find answers to common questions about our school, programs, and policies</p>
        </div>

        <!-- FAQ Categories -->
        <div class="info-cards-grid">
          <div class="info-card gradient-blue">
            <div class="info-card-icon">🎓</div>
            <h3>Admissions</h3>
            <p>Questions about enrollment, requirements, and application process.</p>
          </div>
          <div class="info-card gradient-purple">
            <div class="info-card-icon">📚</div>
            <h3>Academics</h3>
            <p>Information about curriculum, exams, and academic programs.</p>
          </div>
          <div class="info-card gradient-green">
            <div class="info-card-icon">💳</div>
            <h3>Fees & Payment</h3>
            <p>Details about tuition, payment schedules, and financial aid.</p>
          </div>
          <div class="info-card gradient-orange">
            <div class="info-card-icon">🏫</div>
            <h3>School Life</h3>
            <p>Questions about facilities, activities, and daily operations.</p>
          </div>
        </div>

        <!-- FAQ Posts -->
        ${faqPosts.length > 0 ? `
          <section class="content-section">
            <h2>Questions & Answers</h2>
            <div class="faq-list-modern">
              ${faqPosts.map((post, index) => {
                const excerpt = post.excerpt || (post.content ? post.content.substring(0, 200) + '...' : '');
                return `
                  <div class="faq-item-modern">
                    <div class="faq-number">${String(index + 1).padStart(2, '0')}</div>
                    <div class="faq-content">
                      <h3 class="faq-question">Q: ${post.title}</h3>
                      ${excerpt ? `<p class="faq-answer">A: ${excerpt}</p>` : ''}
                      <a href="#/posts/${post.slug}" data-route="/posts/${post.slug}" class="read-more-link">Read Full Answer →</a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Common FAQs -->
        <section class="content-section">
          <h2>Most Common Questions</h2>
          <div class="faq-list-modern">
            <div class="faq-item-modern">
              <div class="faq-number">01</div>
              <div class="faq-content">
                <h3 class="faq-question">Q: What are the admission requirements?</h3>
                <p class="faq-answer">A: Admission requirements include completed application form, birth certificate, previous school records, passport photographs, and entrance examination. Visit our <a href="#/admissions" data-route="/admissions">Admissions page</a> for detailed information.</p>
              </div>
            </div>
            <div class="faq-item-modern">
              <div class="faq-number">02</div>
              <div class="faq-content">
                <h3 class="faq-question">Q: What is the school's operating schedule?</h3>
                <p class="faq-answer">A: School hours are Monday-Friday, 8:00 AM to 3:00 PM. Extended care is available from 3:00 PM to 5:00 PM for an additional fee. Check our <a href="#/calendar" data-route="/calendar">Calendar</a> for specific dates and holidays.</p>
              </div>
            </div>
            <div class="faq-item-modern">
              <div class="faq-number">03</div>
              <div class="faq-content">
                <h3 class="faq-question">Q: How can I pay school fees?</h3>
                <p class="faq-answer">A: We accept bank transfers, online payments through our portal, and in-person payments at the school's accounts office. Payment plans are available upon request. Contact our accounts department for details.</p>
              </div>
            </div>
            <div class="faq-item-modern">
              <div class="faq-number">04</div>
              <div class="faq-content">
                <h3 class="faq-question">Q: Does the school provide transportation?</h3>
                <p class="faq-answer">A: Yes, we offer school bus services covering major areas within Lagos. Transport fees are separate from tuition and vary by distance. Contact us for route information and pricing.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="cta-section-modern">
          <div class="cta-content">
            <h2>Still Have Questions?</h2>
            <p>Don't see your question here? Our staff is ready to help you with any inquiries about our school.</p>
          </div>
          <div class="cta-buttons">
            <a href="#/contact" data-route="/contact" class="btn-primary-modern">Ask a Question</a>
            <a href="#/admissions" data-route="/admissions" class="btn-secondary-modern">Admissions Info</a>
          </div>
        </section>
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

export default UI;


export default UI;
