require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const { Model } = require('objection');
const fs = require('fs');

Model.knex(knex);

const app = express();
app.use(cors());
app.use(express.json());

// Ensure upload dir exists
const uploadDir = process.env.UPLOAD_DIR || path.resolve(__dirname, '../../storage/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Static media route
app.use('/media', express.static(uploadDir));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/media', require('./routes/media'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/analytics', require('./routes/analytics'));

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve frontend static build (public site)
const publicDir = path.resolve(__dirname, '../public');
if (fs.existsSync(publicDir)) {
    // Serve static assets
    app.use(express.static(publicDir, { index: false }));

    // SPA fallback for client-side routing (except /api and /media)
    app.get('*', (req, res, next) => {
        // Skip API routes and media
        if (req.path.startsWith('/api') || req.path.startsWith('/media') || req.path.startsWith('/health')) {
            return next();
        }
        // Serve index.html for all other routes
        res.sendFile(path.join(publicDir, 'index.html'));
    });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

module.exports = app;
