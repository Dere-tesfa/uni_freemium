const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, requireRole('admin'), getAllUsers);
router.delete('/:id', protect, requireRole('admin'), deleteUser);

module.exports = router;
