const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboard.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/leaderboard
router.get('/', protect, getLeaderboard);

module.exports = router;
