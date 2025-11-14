const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
    // Support bcrypt hashes (new) and legacy SHA-256 hex hashes (from static DB exports)
    let match = false;
    try {
        if (user.password_hash && user.password_hash.startsWith('$2')) {
            match = await bcrypt.compare(password, user.password_hash);
        } else if (user.password_hash) {
            // legacy SHA-256 hex stored in password_hash
            const sha = crypto.createHash('sha256').update(password).digest('hex');
            if (sha === user.password_hash) {
                match = true;
                // Upgrade stored hash to bcrypt for future logins
                try {
                    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
                    const newHash = await bcrypt.hash(password, saltRounds);
                    await knex('users').where({ id: user.id }).update({ password_hash: newHash });
                } catch (e) {
                    // Non-fatal - log and continue
                    console.warn('Failed to upgrade legacy password hash for user', user.id, e.message || e);
                }
            }
        }
    } catch (err) {
        console.error('Password compare error:', err);
    }
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

// PUT /api/auth/profile - update user profile
router.put('/profile', requireAuth, async (req, res) => {
  const { display_name } = req.body;
  if (!display_name || !display_name.trim()) {
    return res.status(400).json({ error: 'display_name is required' });
  }
  
  try {
    await knex('users')
      .where({ id: req.user.id })
      .update({ display_name: display_name.trim() });
    
    return res.json({ success: true, display_name: display_name.trim() });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/auth/change-password - change user password
router.post('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  
  try {
    const user = await knex('users').where({ id: req.user.id }).first();
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    
      // Verify current password (support bcrypt and legacy SHA-256)
      let match = false;
      try {
          if (user.password_hash && user.password_hash.startsWith('$2')) {
              match = await bcrypt.compare(currentPassword, user.password_hash);
          } else if (user.password_hash) {
              const sha = crypto.createHash('sha256').update(currentPassword).digest('hex');
              if (sha === user.password_hash) {
                  match = true;
                  // upgrade to bcrypt
                  try {
                      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
                      const newHash = await bcrypt.hash(currentPassword, saltRounds);
                      await knex('users').where({ id: user.id }).update({ password_hash: newHash });
                  } catch (e) { console.warn('Failed to upgrade legacy password hash during change-password', e.message || e); }
              }
          }
      } catch (e) {
          console.error('Password compare error:', e);
      }
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash and update new password
    const newHash = await bcrypt.hash(newPassword, 12);
    await knex('users')
      .where({ id: req.user.id })
      .update({ password_hash: newHash });
    
    // Revoke all refresh tokens for security
    await knex('refresh_tokens')
      .where({ user_id: req.user.id })
      .where('revoked_at', null)
      .update({ revoked_at: knex.fn.now() });
    
    return res.json({ success: true });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
