/**
 * FAQs Page Module
 */

export function renderFAQsPage(db) {
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
                const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '';
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
}
