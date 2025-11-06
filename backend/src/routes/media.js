const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const requireAuth = require('../middlewares/auth');
const { requireCapability } = require('../middlewares/rbac');

// Determine dated subfolder YY/MM
function getDatedSubdir() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return path.join(yy, mm);
}

const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.cwd(), process.env.UPLOAD_DIR)
  : path.resolve(__dirname, '../../storage/uploads');

// Ensure base upload dir exists
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subdir = getDatedSubdir();
    const dest = path.join(uploadDir, subdir);
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

// GET /api/media - list
router.get('/', requireAuth, async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  const offset = (page - 1) * limit;
  const where = {};
  if (req.query.uploader) where.uploader_id = parseInt(req.query.uploader, 10);
  const rows = await knex('media').where(where).orderBy('created_at', 'desc').limit(limit).offset(offset);
  res.json({ data: rows, page, limit });
});

// POST /api/media/upload - single file upload
router.post('/upload', requireAuth, requireCapability('upload_media'), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file is required' });
  const file = req.file;
  const relPath = path.relative(uploadDir, file.path);
  const meta = { derivatives: [] };

  // Attempt image derivatives if image/*
  if ((file.mimetype || '').startsWith('image/')) {
    try {
      const parsed = path.parse(file.path);
      const sizes = [800, 400];
      for (const w of sizes) {
        const out = path.join(parsed.dir, `${parsed.name}_w${w}.webp`);
        await sharp(file.path).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
        meta.derivatives.push({ width: w, format: 'webp', path: path.relative(uploadDir, out) });
      }
    } catch (e) {
      // If sharp fails (unsupported format), proceed without derivatives
      meta.derivativesError = e.message;
    }
  }

  const [id] = await knex('media').insert({
    filename: file.originalname,
    path: relPath.replace(/\\/g, '/'),
    mime: file.mimetype,
    size: file.size,
    uploader_id: req.user?.id || null,
    meta: JSON.stringify(meta)
  });
  const created = await knex('media').where({ id }).first();
  res.status(201).json({ data: created });
});

module.exports = router;
