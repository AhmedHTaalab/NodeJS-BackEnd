// internshipRoutes.js
const express = require('express');
const { getInternshipByID,deleteInternship } = require('../controllers/internshipController');
const router = express.Router();

router.get('/:id', getInternshipByID);
router.delete('/:InternID', deleteInternship);

module.exports = router;
