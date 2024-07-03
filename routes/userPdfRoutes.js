const express = require('express');
const router = express.Router();
const userPdfController = require('../controllers/userPdfController');

router.post('/uploadUserPDF', userPdfController.uploadUserPDF);
router.get('/getUserPDF/:id', userPdfController.getUserPDFById);

module.exports = router;
