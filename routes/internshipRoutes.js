// internshipRoutes.js
const express = require('express');
const { getInternshipByID,deleteInternship, deleteInternshipReruiter, searchInternshipsByTitle, getAllInternships } = require('../controllers/internshipController');
const router = express.Router();

router.get('/:id', getInternshipByID);
router.delete('/:InternID', deleteInternship);
router.delete('/recruiter/:internId', deleteInternshipReruiter);
router.get('/recruiter/search', searchInternshipsByTitle);




module.exports = router;
