const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { env } = require('../config/env');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, env.jwtSecret);

      // Get user from the token
      const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
      req.user = result.rows[0];

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      next();
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
