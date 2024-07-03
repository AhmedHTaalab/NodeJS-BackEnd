const express = require('express');
const router = express.Router();
const takesController = require('../controllers/takesController');



router.post('/enroll', takesController.enrollInCourse); // Route to enroll in a course
router.post('/save', takesController.saveCourse); // Route to save a course
router.post('/unsave', takesController.unsaveCourse); // Route to unsave a course
router.get('/saved/:National_ID', takesController.getSavedCourses);
router.get('/taken/:National_ID', takesController.getCoursesTakenByStudent);
router.get('/all', takesController.getAllCourses);
router.get('/notTaken/:National_ID', takesController.getCoursesNotTakenByStudent);
router.get('/issaved/:National_ID/:CourseID', takesController.checkIfCourseIsSaved);

module.exports = router;
