const express = require('express');
const { recommendInternships } = require('../utils/internshipRecommendations');
const router = express.Router();

router.get('/:student_id', async (req, res) => {
    const { student_id } = req.params;
    try {
        const recommendations = await recommendInternships(student_id);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
