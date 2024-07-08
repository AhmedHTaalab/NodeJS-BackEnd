// routes/ratingRoutes.js

const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// Rate a mentor
router.post('/rate-mentor', ratingController.rateMentor);
// Get all mentors with ratings and comments
router.get('/all-mentor-ratings', ratingController.getMentorsWithRatings);

module.exports = router;
