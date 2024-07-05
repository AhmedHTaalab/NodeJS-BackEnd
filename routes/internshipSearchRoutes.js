const express = require('express');
const { searchInternships, getAllInternships } = require('../controllers/internshipSearchController');
const router = express.Router();

router.get('/search', searchInternships);
router.get('/all', getAllInternships);

module.exports = router;
