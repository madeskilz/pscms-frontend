const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment
require('dotenv').config();

// Initialize SQLite
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const { Model } = require('objection');
Model.knex(knex);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../storage/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Media files
app.use('/media', express.static(uploadDir));

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/posts', require('./src/routes/posts'));
app.use('/api/media', require('./src/routes/media'));
app.use('/api/settings', require('./src/routes/settings'));
app.use('/api/menus', require('./src/routes/menus'));
app.use('/api/analytics', require('./src/routes/analytics'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Serve static frontend files
const publicDir = path.resolve(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir, { index: false }));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes, media, and health
    if (req.path.startsWith('/api') || 
        req.path.startsWith('/media') || 
        req.path.startsWith('/health')) {
      return next();
    }
    
    // Serve index.html for client-side routing
    res.sendFile(path.join(publicDir, 'index.html'));
  });
} else {
  console.warn('Frontend build not found. Run build script first.');
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${publicDir}`);
  console.log(`💾 Database: ${knexConfig[process.env.NODE_ENV || 'development'].connection.filename}`);
});

module.exports = app;