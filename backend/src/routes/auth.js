const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);
const { signAccessToken, generateRefreshToken, hashToken, getRefreshExpiryDate } = require('../services/tokens');
const requireAuth = require('../middlewares/auth');

// POST /api/auth/login
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await knex('users').where({ email }).first();
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  if (!user.password_hash) return res.status(401).json({ error: 'invalid credentials' });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'invalid credentials' });
  // Fetch capabilities from role and embed in access token
  let caps = [];
  if (user.role_id) {
    const role = await knex('roles').where({ id: user.role_id }).first();
    if (role?.capabilities) {
      try { caps = JSON.parse(role.capabilities) || []; } catch { caps = []; }
    }
  }

  const payload = { id: user.id, email: user.email, role_id: user.role_id, capabilities: caps };
  const accessToken = signAccessToken(payload);

  // Create refresh token (store hash)
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getRefreshExpiryDate();
  await knex('refresh_tokens').insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    ip: req.ip,
    user_agent: req.headers['user-agent'] || null
  });
  return res.json({ accessToken, refreshToken });
});

// POST /api/auth/refresh
router.post('/refresh', authLimiter, async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  const tokenHash = hashToken(refreshToken);
  const row = await knex('refresh_tokens').where({ token_hash: tokenHash }).first();
  if (!row) return res.status(401).json({ error: 'invalid refresh token' });
  if (row.revoked_at) return res.status(401).json({ error: 'refresh token revoked' });
  if (new Date(row.expires_at) <= new Date()) return res.status(401).json({ error: 'refresh token expired' });

  const user = await knex('users').where({ id: row.user_id }).first();
  if (!user || user.active === 0) return res.status(401).json({ error: 'user inactive' });

  // Get capabilities
  let caps = [];
  if (user.role_id) {
    const role = await knex('roles').where({ id: user.role_id }).first();
    if (role?.capabilities) {
      try { caps = JSON.parse(role.capabilities) || []; } catch { caps = []; }
    }
  }

  // Rotate refresh token
  const newRefreshToken = generateRefreshToken();
  const newHash = hashToken(newRefreshToken);
  const expiresAt = getRefreshExpiryDate();
  await knex('refresh_tokens').where({ id: row.id }).update({
    revoked_at: knex.fn.now(),
    replaced_by_token_hash: newHash
  });
  await knex('refresh_tokens').insert({
    user_id: user.id,
    token_hash: newHash,
    expires_at: expiresAt,
    ip: req.ip,
    user_agent: req.headers['user-agent'] || null
  });

  const accessToken = signAccessToken({ id: user.id, email: user.email, role_id: user.role_id, capabilities: caps });
  return res.json({ accessToken, refreshToken: newRefreshToken });
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  const tokenHash = hashToken(refreshToken);
  await knex('refresh_tokens').where({ token_hash: tokenHash }).update({ revoked_at: knex.fn.now() });
  return res.json({ success: true });
});

// GET /api/auth/me - returns current user info and capabilities
router.get('/me', requireAuth, async (req, res) => {
  const user = await knex('users').where({ id: req.user.id }).first();
  if (!user) return res.status(404).json({ error: 'not found' });
  let caps = req.user.capabilities || [];
  if (!caps?.length && user.role_id) {
    const role = await knex('roles').where({ id: user.role_id }).first();
    if (role?.capabilities) { try { caps = JSON.parse(role.capabilities) || []; } catch { caps = []; } }
  }
  return res.json({
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    role_id: user.role_id,
    capabilities: caps
  });
});

module.exports = router;
