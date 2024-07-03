// applyRoutes.js
const express = require('express');
const router = express.Router();
const applyController = require('../controllers/applyController');

// Endpoint to create a new application
router.post('/internship', applyController.applyToInternship);
router.get('/internship/:InternID/students', applyController.getStudentsForInternship); // New route to get students
router.post('/save', applyController.saveInternship); // Route to save an internship
router.post('/unsave', applyController.unsaveInternship); // Route to unsave an internship
router.get('/saved/:National_ID', applyController.getSavedInternships); // Route to get saved internships

module.exports = router;
