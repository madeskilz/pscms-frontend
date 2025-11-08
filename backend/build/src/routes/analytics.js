const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const requireAuth = require('../middlewares/auth');

// GET /api/analytics/summary - basic counts
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const [{ c: posts }] = await knex('posts').where({ type: 'post' }).count({ c: '*' });
    const [{ c: pages }] = await knex('posts').where({ type: 'page' }).count({ c: '*' });
    const [{ c: media }] = await knex('media').count({ c: '*' });
    return res.json({ posts: Number(posts || 0), pages: Number(pages || 0), media: Number(media || 0) });
  } catch (e) {
    return res.status(500).json({ error: 'analytics_failed' });
  }
});

module.exports = router;
