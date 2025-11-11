/**
 * Parents Page Module
 */

export function renderParentsPage(db) {
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
                const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '';
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
}
