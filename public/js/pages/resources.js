/**
 * Resources Page Module
 */

export function renderResourcesPage(db) {
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
                const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '';
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
}
