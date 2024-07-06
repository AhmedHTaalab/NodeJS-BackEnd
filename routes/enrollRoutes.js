// enrollRoutes.js
const express = require('express');
const router = express.Router();
const enrollController = require('../controllers/enrollController');

router.post('/enroll', enrollController.enrollStudent);
router.put('/rate', enrollController.updateRating);
router.get('/mentors/:Mentor_ID/students', enrollController.getStudentsForMentor); // New route to get students
router.get('/:Mentor_ID/students/count', enrollController.getEnrolledStudentsCount);
router.post('/check-enrollment', enrollController.checkEnrollment);
router.get('/:Mentor_ID/rating', enrollController.getMentorRating);

module.exports = router;
