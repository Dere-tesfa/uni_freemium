const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

// @route   POST /api/auth/register
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   POST /api/auth/refresh
router.post('/refresh', refreshToken);

module.exports = router;
