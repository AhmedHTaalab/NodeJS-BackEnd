const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController'); // Check path correctness

router.post('/createInternship', recruiterController.createInternship);
router.get('/:National_ID/internships', recruiterController.getInternshipsByRecruiter);
router.put('/internship', recruiterController.updateInternship);
router.get('/:id', recruiterController.getRecruiterByIdController);


module.exports = router;
