const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const requireAuth = require('../middlewares/auth');
const { requireCapability } = require('../middlewares/rbac');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup upload directory (same as media route)
const uploadDir = process.env.UPLOAD_DIR
    ? path.resolve(process.cwd(), process.env.UPLOAD_DIR)
    : path.resolve(__dirname, '../../storage/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dest = path.join(uploadDir, yy, mm);
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        const base = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9\-]+/g, '-');
        const unique = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
        cb(null, `${base || 'file'}-${unique}${ext}`);
    }
});
const upload = multer({ storage });

// GET /api/settings - list all settings (admin only)
router.get('/', requireAuth, requireCapability('manage_settings'), async (req, res) => {
    const rows = await knex('settings').select('key', 'value');
    const out = {};
    for (const r of rows) {
        try { out[r.key] = JSON.parse(r.value); } catch { out[r.key] = r.value; }
    }
    return res.json({ settings: out });
});

// GET /api/settings/:key
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  const row = await knex('settings').where({ key }).first();
  if (!row) return res.status(404).json({ error: 'not found' });
  return res.json({ key: row.key, value: row.value });
});

// PUT /api/settings/:key
router.put('/:key', requireAuth, requireCapability('manage_settings'), async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const exists = await knex('settings').where({ key }).first();
  if (exists) {
    await knex('settings').where({ key }).update({ value: JSON.stringify(value) });
  } else {
    await knex('settings').insert({ key, value: JSON.stringify(value) });
  }
  const updated = await knex('settings').where({ key }).first();
  return res.json({ key: updated.key, value: updated.value });
});

module.exports = router;

// POST /api/settings/logo - upload a site logo and save to settings
router.post('/logo', requireAuth, requireCapability('manage_settings'), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'file is required' });
        const file = req.file;
        const relPath = path.relative(uploadDir, file.path).replace(/\\/g, '/');

        // Insert into media table
        const meta = JSON.stringify({ uploadedBy: req.user?.id || null });
        const [id] = await knex('media').insert({
            filename: file.originalname,
            path: relPath,
            mime: file.mimetype,
            size: file.size,
            uploader_id: req.user?.id || null,
            meta
        });
        const mediaRow = await knex('media').where({ id }).first();

        // Upsert settings.logo with media reference and public URL
        const logoValue = {
            media_id: id,
            filename: file.originalname,
            url: `/media/${relPath}`
        };

        const exists = await knex('settings').where({ key: 'logo' }).first();
        if (exists) {
            await knex('settings').where({ key: 'logo' }).update({ value: JSON.stringify(logoValue) });
        } else {
            await knex('settings').insert({ key: 'logo', value: JSON.stringify(logoValue) });
        }

        return res.status(201).json({ key: 'logo', value: logoValue, media: mediaRow });
    } catch (err) {
        console.error('Logo upload error:', err);
        return res.status(500).json({ error: 'failed to upload logo' });
    }
});
