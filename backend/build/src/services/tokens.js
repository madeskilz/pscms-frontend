const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function signAccessToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getRefreshExpiryDate() {
  const days = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

module.exports = { signAccessToken, generateRefreshToken, hashToken, getRefreshExpiryDate };
