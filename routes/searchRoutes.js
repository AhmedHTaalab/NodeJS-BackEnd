const express = require('express');
const router = express.Router();
const { searchCourses } = require('../controllers/searchController');

router.get('/search', searchCourses);

module.exports = router;
