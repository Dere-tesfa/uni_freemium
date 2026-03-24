const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/department.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/', protect, getAllDepartments);
router.get('/:id', protect, getDepartmentById);
router.post('/', protect, requireRole('admin'), createDepartment);
router.put('/:id', protect, requireRole('admin'), updateDepartment);
router.delete('/:id', protect, requireRole('admin'), deleteDepartment);

module.exports = router;
