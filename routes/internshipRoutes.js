// internshipRoutes.js
const express = require('express');
const { getInternshipByID,deleteInternship, deleteInternshipReruiter } = require('../controllers/internshipController');
const router = express.Router();

router.get('/:id', getInternshipByID);
router.delete('/:InternID', deleteInternship);
router.delete('/recruiter/:internId', deleteInternshipReruiter);

module.exports = router;
