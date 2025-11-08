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

    // Handle hash changes (routing)
    window.addEventListener('hashchange', () => {
      UI.render();
    });

    // Render initial view
    UI.render();

    console.log('[APP] Application ready');
    
    // Show helpful tip if database was just created
    const isNewDatabase = !localStorage.getItem('cms_database_initialized');
    if (isNewDatabase) {
      localStorage.setItem('cms_database_initialized', 'true');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 IMPORTANT: cms.db file has been auto-downloaded!');
      console.log('');
      console.log('To enable auto-loading on next visit:');
      console.log('1. Find cms.db in your Downloads folder');
      console.log('2. Move it to: /build/data/cms.db');
      console.log('3. Refresh the page');
      console.log('');
      console.log('The app will then load from file instead of localStorage');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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
