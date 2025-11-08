const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const requireAuth = require('../middlewares/auth');
const { requireCapability } = require('../middlewares/rbac');

// GET /api/menus/:name - returns menu items; priority: menus table, fallback to settings primary_menu
router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const menuRow = await knex('menus').where({ name }).first();
  if (menuRow) {
    let items = [];
    try { items = JSON.parse(menuRow.items) || []; } catch { items = []; }
    return res.json({ name, items });
  }
  if (name === 'primary') {
    const setting = await knex('settings').where({ key: 'primary_menu' }).first();
    if (setting) {
      try {
        const items = JSON.parse(setting.value) || [];
        return res.json({ name, items });
      } catch {}
    }
  }
  return res.json({ name, items: [] });
});

// PUT /api/menus/:name - update/create menu (requires manage_settings)
router.put('/:name', requireAuth, requireCapability('manage_settings'), async (req, res) => {
  const { name } = req.params;
  const { items } = req.body || {};
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' });
  const exists = await knex('menus').where({ name }).first();
  if (exists) {
    await knex('menus').where({ name }).update({ items: JSON.stringify(items) });
  } else {
    await knex('menus').insert({ name, items: JSON.stringify(items) });
  }
  const updated = await knex('menus').where({ name }).first();
  return res.json({ name: updated.name, items: JSON.parse(updated.items || '[]') });
});

module.exports = router;
