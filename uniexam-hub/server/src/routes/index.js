const authRoutes = require('./auth.routes');
const departmentRoutes = require('./department.routes');
const examRoutes = require('./exam.routes');
const paymentRoutes = require('./payment.routes');
const userRoutes = require('./user.routes');
const leaderboardRoutes = require('./leaderboard.routes');

const router = require('express').Router();

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/exams', examRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;
