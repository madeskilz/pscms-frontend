const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const requireAuth = require('../middlewares/auth');
const { requireCapability } = require('../middlewares/rbac');

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
