/**
 * PTA Page Module
 */

export function renderPTAPage(db) {
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
}
