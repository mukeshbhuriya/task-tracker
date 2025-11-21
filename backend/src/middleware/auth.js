const jwt = require('jsonwebtoken');
const { Token, User } = require('../models');

const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const found = await Token.findOne({ where: { token }});
    if (found) return res.status(401).json({ error: 'Token revoked' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_this_to_a_strong_secret');
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};

module.exports = { authMiddleware, adminOnly };
