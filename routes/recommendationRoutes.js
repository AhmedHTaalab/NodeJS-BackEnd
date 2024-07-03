const express = require('express');
const { recommendCourses } = require('../utils/recommendation');
const router = express.Router();

router.get('/course/:student_id', async (req, res) => {
    const { student_id } = req.params;
    try {
        const recommendations = await recommendCourses(student_id);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;



