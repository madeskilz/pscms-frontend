/**
 * Calendar Page Module
 */

export function renderCalendarPage(db) {
    // Get all published posts for calendar/events
    const allPosts = db.queryAll(
        'SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC LIMIT 50',
        ['published']
    );

    // Group posts by month
    const postsByMonth = {};
    allPosts.forEach(post => {
        const date = new Date(post.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        if (!postsByMonth[monthKey]) {
            postsByMonth[monthKey] = {
                name: monthName,
                posts: []
            };
        }
        postsByMonth[monthKey].posts.push(post);
    });

    // Get current month for banner
    const now = new Date();
    const currentMonth = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return `
      <div class="page-container calendar-page">
        <div class="page-header">
          <h1>📅 School Calendar</h1>
          <p class="page-subtitle">Important dates, events, and activities throughout the year</p>
        </div>

        <!-- Current Month Banner -->
        <div class="current-month-banner">
          <div class="month-indicator">
            <span class="month-label">Current Month</span>
            <h2>${currentMonth}</h2>
          </div>
        </div>

        <!-- Events Timeline -->
        ${Object.keys(postsByMonth).length > 0 ? Object.entries(postsByMonth).map(([monthKey, monthData]) => `
          <section class="month-section-modern">
            <div class="month-header-sticky">
              <h2>📆 ${monthData.name}</h2>
              <span class="event-count">${monthData.posts.length} event${monthData.posts.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div class="timeline-list">
              ${monthData.posts.map(post => {
                const postDate = new Date(post.created_at);
                const dayNum = postDate.getDate();
                const dayName = postDate.toLocaleDateString('en-US', { weekday: 'short' });
                const isToday = postDate.toDateString() === now.toDateString();
                const excerpt = post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : '';
                
                return `
                  <div class="timeline-item">
                    <div class="timeline-date">
                      <div class="date-circle ${isToday ? 'today' : ''}">
                        <span class="day-number">${dayNum}</span>
                        <span class="day-name">${dayName}</span>
                      </div>
                      ${isToday ? '<span class="today-badge">Today</span>' : ''}
                    </div>
                    <div class="timeline-card">
                      <h3><a href="#/posts/${post.slug}" data-route="/posts/${post.slug}">${post.title}</a></h3>
                      ${excerpt ? `<p class="event-excerpt">${excerpt}</p>` : ''}
                      <a href="#/posts/${post.slug}" data-route="/posts/${post.slug}" class="read-more-link">Read More →</a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        `).join('') : `
          <section class="content-section">
            <div class="empty-state">
              <p>📅 No events scheduled at this time. Check back soon for updates!</p>
            </div>
          </section>
        `}
      </div>
    `;
}
