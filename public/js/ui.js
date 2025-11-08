/**
 * UI Module - Pure JavaScript DOM manipulation
 * Handles all UI rendering and interactions
 */

const UI = {
  currentView: 'public',
  currentUser: null,

  /**
   * Initialize UI
   */
  init() {
    this.checkAuth();
    this.setupEventListeners();
    this.render();
  },

  /**
   * Check authentication status
   */
  checkAuth() {
    const session = localStorage.getItem('cms_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
      } catch (e) {
        localStorage.removeItem('cms_session');
      }
    }
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
  render() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');

    if (hash.startsWith('/admin')) {
      if (!this.currentUser) {
        this.renderLogin();
        return;
      }
      this.renderAdmin(hash);
    } else {
      this.renderPublic(hash);
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
              <input type="email" id="email" name="email" required value="admin@school.test">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required value="ChangeMe123!">
            </div>
            <button type="submit" class="btn-primary">Login</button>
          </form>
          <p class="login-hint">Default: admin@school.test / ChangeMe123!</p>
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

    return `
      <div class="dashboard">
        <h1>Dashboard</h1>
        <div class="dashboard-stats">
          <div class="stat-card">
            <h3>${posts[0]?.count || 0}</h3>
            <p>Published Posts</p>
          </div>
          <div class="stat-card">
            <h3>${pages[0]?.count || 0}</h3>
            <p>Pages</p>
          </div>
          <div class="stat-card">
            <h3>${drafts[0]?.count || 0}</h3>
            <p>Drafts</p>
          </div>
          <div class="stat-card">
            <h3>${media[0]?.count || 0}</h3>
            <p>Media Files</p>
          </div>
        </div>
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <a href="#/admin/posts/new" data-route="/admin/posts/new" class="btn-primary">New Post</a>
          <a href="#/admin/pages/new" data-route="/admin/pages/new" class="btn-primary">New Page</a>
          <button data-action="export-db" class="btn-secondary">Export Database</button>
          <button data-action="import-db" class="btn-secondary">Import Database</button>
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
  renderPublic(hash) {
    const app = document.getElementById('app');
    const theme = this.getActiveTheme();
    
    // Public navigation
    const nav = this.renderPublicNav();
    
    let content = '';

    if (hash === '/' || hash === '') {
      content = this.renderHome();
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

    app.innerHTML = nav + `<main class="public-content">${content}</main>` + this.renderPublicFooter();
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

    return `
      <nav class="public-nav">
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

    return `
      <footer class="public-footer">
        <p>&copy; ${new Date().getFullYear()} ${title}. All rights reserved.</p>
      </footer>
    `;
  },

  /**
   * Render homepage
   */
  renderHome() {
    const hero = db.queryOne('SELECT value FROM settings WHERE key = ?', ['hero']);
    const features = db.queryOne('SELECT value FROM settings WHERE key = ?', ['features']);
    const posts = db.query(
      'SELECT * FROM posts WHERE type = ? AND status = ? ORDER BY created_at DESC LIMIT 3',
      ['post', 'published']
    );

    let heroData = { title: 'Welcome', subtitle: '', ctaText: 'Learn More', ctaLink: '/about' };
    let featuresData = [];

    try {
      if (hero) heroData = JSON.parse(hero.value);
      if (features) featuresData = JSON.parse(features.value);
    } catch (e) {}

    const featuresList = featuresData.map(f => `
      <div class="feature-card">
        <h3>${f.title}</h3>
        <p>${f.description}</p>
      </div>
    `).join('');

    const postsList = posts.map(p => `
      <div class="post-card">
        <h3><a href="#/posts/${p.slug}" data-route="/posts/${p.slug}">${p.title}</a></h3>
        <p>${p.content?.substring(0, 150)}...</p>
        <a href="#/posts/${p.slug}" data-route="/posts/${p.slug}" class="read-more">Read more →</a>
      </div>
    `).join('');

    return `
      <div class="home">
        <section class="hero">
          <h1>${heroData.title}</h1>
          <p>${heroData.subtitle}</p>
          <a href="#${heroData.ctaLink}" data-route="${heroData.ctaLink}" class="btn-primary">${heroData.ctaText}</a>
        </section>

        ${featuresList ? `
          <section class="features">
            <h2>Why Choose Us</h2>
            <div class="features-grid">
              ${featuresList}
            </div>
          </section>
        ` : ''}

        ${postsList ? `
          <section class="recent-posts">
            <h2>Latest News</h2>
            <div class="posts-grid">
              ${postsList}
            </div>
            <a href="#/posts" data-route="/posts" class="btn-secondary">View All Posts</a>
          </section>
        ` : ''}
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
   * Handle form submissions
   */
  async handleFormSubmit(formType, form) {
    const formData = new FormData(form);

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
          localStorage.setItem('cms_session', JSON.stringify(session));
          this.currentUser = session;
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
        alert('Post updated');
      } else {
        db.exec(
          'INSERT INTO posts (type, title, slug, content, status, author_id) VALUES (?, ?, ?, ?, ?, ?)',
          [data.type, data.title, data.slug, data.content, data.status, data.author_id]
        );
        alert('Post created');
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

      alert('Settings saved');
      this.render();
    }
  },

  /**
   * Handle actions
   */
  async handleAction(action, element) {
    if (action === 'logout') {
      localStorage.removeItem('cms_session');
      this.currentUser = null;
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
