/**
 * Admissions Page Module
 */

export function renderAdmissionsPage(db) {
    // Query admissions-related posts from database
    const admissionPages = db.queryAll(
        `SELECT * FROM posts WHERE status = ? AND (type = ? OR slug LIKE ? OR title LIKE ?)`,
        ['published', 'page', '%admission%', '%Admission%']
    );

    return `
      <div class="page-container admissions-page">
        <div class="page-header">
          <h1>🎓 Admissions</h1>
          <p class="page-subtitle">Join our learning community and begin your educational journey</p>
        </div>

        <!-- Info Cards -->
        <div class="info-cards-grid">
          <div class="info-card gradient-blue">
            <div class="info-card-icon">📝</div>
            <h3>Application</h3>
            <p>Start your journey by completing our simple online application process.</p>
          </div>
          <div class="info-card gradient-purple">
            <div class="info-card-icon">📅</div>
            <h3>Timeline</h3>
            <p>Applications accepted year-round with rolling admissions for immediate enrollment.</p>
          </div>
          <div class="info-card gradient-green">
            <div class="info-card-icon">💰</div>
            <h3>Fees</h3>
            <p>Transparent fee structure with flexible payment plans and scholarship opportunities.</p>
          </div>
          <div class="info-card gradient-orange">
            <div class="info-card-icon">✅</div>
            <h3>Requirements</h3>
            <p>Simple documentation and entrance assessment for appropriate grade placement.</p>
          </div>
        </div>

        <!-- Admissions Pages/Posts -->
        ${admissionPages.length > 0 ? `
          <section class="content-section">
            <h2>Admissions Information</h2>
            <div class="modern-list">
              ${admissionPages.map(page => {
                const excerpt = page.content ? page.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '';
                const postDate = new Date(page.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                return `
                  <div class="modern-list-item">
                    <div class="list-item-icon">📄</div>
                    <div class="list-item-content">
                      <h3><a href="#/posts/${page.slug}" data-route="/posts/${page.slug}">${page.title}</a></h3>
                      <p class="list-item-meta">${postDate}</p>
                      ${excerpt ? `<p class="list-item-excerpt">${excerpt}</p>` : ''}
                      <a href="#/posts/${page.slug}" data-route="/posts/${page.slug}" class="read-more-link">Read More →</a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Admissions Process -->
        <section class="content-section">
          <h2>Admissions Process</h2>
          <div class="process-steps-modern">
            <div class="step-card">
              <div class="step-number-modern gradient-blue">1</div>
              <h3>Submit Application</h3>
              <p>Fill out the online application form or visit our admissions office to get started.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-purple">2</div>
              <h3>Assessment</h3>
              <p>Complete entrance examination and interview to determine appropriate grade level.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-green">3</div>
              <h3>Review</h3>
              <p>Admissions committee reviews application and assessment results within 5 business days.</p>
            </div>
            <div class="step-card">
              <div class="step-number-modern gradient-orange">4</div>
              <h3>Enrollment</h3>
              <p>Upon acceptance, complete enrollment forms and fee payment to secure your spot.</p>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section-modern">
          <div class="cta-content">
            <h2>Ready to Apply?</h2>
            <p>Start your child's educational journey with us today. Our admissions team is here to help!</p>
          </div>
          <div class="cta-buttons">
            <a href="#/contact" data-route="/contact" class="btn-primary-modern">Contact Admissions</a>
            <a href="#/faqs" data-route="/faqs" class="btn-secondary-modern">View FAQs</a>
          </div>
        </section>
      </div>
    `;
}
