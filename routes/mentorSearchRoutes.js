// mentorSearchRoutes.js
const express = require('express');
const { searchMentors } = require('../controllers/mentorController');
const { addMentorExperience, getMentorExperiences, updateAreaOfInterest,editExperience,deleteExperience } = require('../controllers/mentorController');
const router = express.Router();

router.get('/search', searchMentors);
// Route for getting mentor experiences
router.get('/:National_ID/experiences', getMentorExperiences);

// Route for adding mentor experience
router.post('/:National_ID/experiences', addMentorExperience);

router.put('/updatetrack', updateAreaOfInterest);

router.post('/edit-experience', editExperience);

// Route to delete experience
router.delete('/delete-experience', deleteExperience);

module.exports = router;