const express = require('express');
const { searchInternships } = require('../controllers/internshipSearchController');
const router = express.Router();

router.get('/search', searchInternships);

module.exports = router;
