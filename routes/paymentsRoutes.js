const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// Endpoint to process payments
router.post('/process', paymentsController.processPayment);

module.exports = router;
