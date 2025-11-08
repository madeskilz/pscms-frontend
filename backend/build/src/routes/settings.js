const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const requireAuth = require('../middlewares/auth');
const { requireCapability } = require('../middlewares/rbac');

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
