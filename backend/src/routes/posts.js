const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const requireAuth = require('../middlewares/auth');
const { requireCapability } = require('../middlewares/rbac');

// GET /api/posts
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
  const offset = (page - 1) * limit;
  // Only return published content for public listing
  const type = req.query.type || undefined;
  let query = knex('posts').where({ status: 'published' });
  if (type) query = query.andWhere({ type });
  const rows = await query.orderBy('created_at', 'desc').limit(limit).offset(offset);
  return res.json({ data: rows, page, limit });
});

// GET /api/posts/:slug
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  // Only allow fetching published post/page by slug publicly
  const row = await knex('posts').where({ slug, status: 'published' }).first();
  if (!row) return res.status(404).json({ error: 'not found' });
  return res.json({ data: row });
});

// GET /api/posts/all - admin listing (drafts + published)
router.get('/admin/all', requireAuth, requireCapability('publish_post'), async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
  const offset = (page - 1) * limit;
  const type = req.query.type || undefined;
  let query = knex('posts');
  if (type) query = query.where({ type });
  const rows = await query.orderBy('created_at', 'desc').limit(limit).offset(offset);
  return res.json({ data: rows, page, limit });
});

// POST /api/posts (requires auth)
router.post('/', requireAuth, requireCapability('create_post'), async (req, res) => {
  // Basic capability check could be added here
  const body = req.body;
  const [id] = await knex('posts').insert({
    title: body.title || null,
    content: body.content || null,
    slug: body.slug || null,
    author_id: req.user?.id || null,
    type: body.type || 'post',
    status: body.status || 'draft',
    meta: body.meta || null
  });
  const created = await knex('posts').where({ id }).first();
  return res.status(201).json({ data: created });
});

// PUT /api/posts/:id (publish/update)
router.put('/:id', requireAuth, requireCapability('publish_post'), async (req, res) => {
  const { id } = req.params;
  const body = req.body || {};
  await knex('posts').where({ id }).update({
    title: body.title,
    content: body.content,
    slug: body.slug,
    status: body.status,
    meta: body.meta,
    updated_at: knex.fn.now()
  });
  const updated = await knex('posts').where({ id }).first();
  if (!updated) return res.status(404).json({ error: 'not found' });
  return res.json({ data: updated });
});

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, requireCapability('publish_post'), async (req, res) => {
  const { id } = req.params;
  const del = await knex('posts').where({ id }).del();
  if (!del) return res.status(404).json({ error: 'not found' });
  return res.json({ success: true });
});

module.exports = router;
