// courseController.js
const courseModel = require('../models/courseModel');

const getCourseByID = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await courseModel.findCourseByID(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error in getCourseByID:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCourseByID,
};
