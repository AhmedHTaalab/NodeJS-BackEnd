const express = require('express');
const router = express.Router();
const userImageController = require('../controllers/userImageController');

router.post('/uploadUserImage', userImageController.uploadUserImage);
router.get('/getUserImage/:id', userImageController.getUserImageById);

module.exports = router;
