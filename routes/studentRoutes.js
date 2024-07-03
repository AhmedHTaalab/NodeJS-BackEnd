const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/search', studentController.searchStudent);

module.exports = router;
