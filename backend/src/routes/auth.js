const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const knex = require('knex')(require('../../knexfile')[process.env.NODE_ENV || 'development']);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await knex('users').where({ email }).first();
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  if (!user.password_hash) return res.status(401).json({ error: 'invalid credentials' });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'invalid credentials' });

  const payload = { id: user.id, email: user.email, role_id: user.role_id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '15m' });
  // Note: refresh token flow left as an exercise
  return res.json({ accessToken });
});

module.exports = router;
