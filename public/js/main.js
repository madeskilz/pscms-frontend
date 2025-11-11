/**
 * Main Application Entry Point
 * Coordinates database initialization and UI rendering
 */

(async function() {
  console.log('[APP] Starting application...');

  // Show loading indicator
  document.getElementById('app').innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Loading School CMS...</p>
      <p class="loading-detail">Initializing database...</p>
    </div>
  `;

  try {
    // Initialize database
    await db.init();
    
    // Initialize UI
    UI.init();

      // Expose UI methods to window for calendar interactions
      window.app = {
          handleCalendarDateClick: (dateKey) => UI.handleCalendarDateClick(dateKey),
          changeCalendarMonth: (direction) => UI.changeCalendarMonth(direction)
      };

    // Handle hash changes (routing)
    window.addEventListener('hashchange', () => {
      UI.render();
    });

    // Render initial view
    UI.render();

    console.log('[APP] Application ready');
    console.log('[APP] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[APP] 🗄️  FILE-ONLY MODE: No localStorage used');
    console.log('[APP] ⚠️  All changes exist in memory until exported');
    console.log('[APP] 💾 Use Admin → Export Database to save your work');
    console.log('[APP] 📁 Place cms.db in /dist/db/ to persist data');
    console.log('[APP] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check if database file exists
    const hasDbFile = await checkDatabaseFileExists();
    if (!hasDbFile) {
      // Show visual notification for file-only mode
      showDatabaseSetupNotification();
    } else {
      console.log('[APP] ✓ Database loaded from file successfully');
    }
  } catch (error) {
    console.error('[APP] Failed to start:', error);
    document.getElementById('app').innerHTML = `
      <div class="error">
        <h1>Failed to load application</h1>
        <p>${error.message}</p>
        <button onclick="location.reload()">Reload</button>
      </div>
    `;
  }
})();

/**
 * Check if database file exists
 */
async function checkDatabaseFileExists() {
    const paths = ['db/cms.sqlite', 'db/cms.db', 'db/sqlite.db', 'db/app.sqlite'];
  for (const path of paths) {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      if (response.ok) return true;
    } catch (e) {}
  }
  return false;
}

/**
 * Show notification about database file setup
 */
function showDatabaseSetupNotification() {
  const notification = document.createElement('div');
  notification.className = 'db-notification';
  notification.innerHTML = `
    <button class="close-btn" onclick="this.parentElement.remove()">×</button>
    <h4>🗄️ File-Only Mode</h4>
    <p><strong>No database file detected.</strong> The app is running in memory.</p>
    <p><strong>⚠️ IMPORTANT:</strong> No localStorage - all admin data is file-based!</p>
    <ol>
      <li>Login to Admin → go to <strong>Database</strong></li>
      <li>Click <strong>Export Database</strong> to download <code>cms.db</code></li>
      <li>Place <code>cms.db</code> in <code>/dist/db/</code></li>
      <li>Refresh this page</li>
    </ol>
    <p style="font-size:0.85rem;margin-top:10px;opacity:0.9;background:rgba(255,255,255,0.1);padding:8px;border-radius:4px;">
      💡 Changes exist only in memory until you export and replace the file in /dist/db/
    </p>
    <button onclick="this.parentElement.remove()">Got it!</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-dismiss after 45 seconds (longer for file-only warning)
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }
  }, 45000);
}
