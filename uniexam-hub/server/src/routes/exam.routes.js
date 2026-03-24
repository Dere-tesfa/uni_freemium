const express = require('express');
const router = express.Router();
const {
  getAllExams,
  getExamById,
  createExam,
  submitExam,
  getExamResult,
} = require('../controllers/exam.controller');
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { validateExamSubmission } = require('../validators/exam.validator');

router.get('/', protect, getAllExams);
router.get('/:id', protect, getExamById);
router.post('/', protect, requireRole('admin'), createExam);
router.post('/:id/submit', protect, validateExamSubmission, submitExam);
router.get('/:id/result', protect, getExamResult);

module.exports = router;
