const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, getPurchases } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/checkout', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/purchases', protect, getPurchases);

module.exports = router;
