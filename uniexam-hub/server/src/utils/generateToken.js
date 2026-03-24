const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

module.exports = generateToken;
