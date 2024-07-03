// courseRoutes.js
const express = require('express');
const { getCourseByID } = require('../controllers/courseController');
const router = express.Router();

router.get('/:id', getCourseByID);

module.exports = router;
