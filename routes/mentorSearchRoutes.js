// mentorSearchRoutes.js
const express = require('express');
const { searchMentors } = require('../controllers/mentorController');
const { addMentorExperience, getMentorExperiences } = require('../controllers/mentorController');
const router = express.Router();

router.get('/search', searchMentors);
// Route for getting mentor experiences
router.get('/:National_ID/experiences', getMentorExperiences);

// Route for adding mentor experience
router.post('/:National_ID/experiences', addMentorExperience);
module.exports = router;