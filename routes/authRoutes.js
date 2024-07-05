const express = require('express');
const { register, login, updateProfile, getUserData, getAllMentors , updateSkills,registerRecruiter, registerStudent, registerMentor, updateStudentProfile, updateMentorProfile, updateRecruiterProfile, updateAreaOfInterest,registerAdmin } = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/updateProfile', updateProfile);
router.get('/user/:National_ID', getUserData);
router.get('/mentors', getAllMentors);
router.put('/updateSkills', updateSkills);
router.post('/register/student', registerStudent);
router.post('/register/mentor', registerMentor);
router.post('/register/recruiter', registerRecruiter);
router.put('/updateStudentProfile', updateStudentProfile);
router.put('/updateMentorProfile', updateMentorProfile);
router.put('/updateRecruiterProfile', updateRecruiterProfile);
router.put('/updateTrack', updateAreaOfInterest);
router.post('/register/admin', registerAdmin);

module.exports = router;
