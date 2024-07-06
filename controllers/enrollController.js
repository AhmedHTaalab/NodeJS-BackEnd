// enrollController.js
const enrollModel = require('../models/enrollModel');

const enrollStudent = async (req, res) => {
    try {
        const { Student_ID, Mentor_ID } = req.body;
        await enrollModel.enrollStudentWithMentor({ Student_ID, Mentor_ID });
        res.status(201).send({ message: 'Student enrolled with mentor successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to enroll student with mentor', details: error.message });
    }
};

const updateRating = async (req, res) => {
    try {
        const { Student_ID, Mentor_ID, Ratings } = req.body;
        await enrollModel.rateMentor({ Student_ID, Mentor_ID, Ratings });
        res.status(200).send({ message: 'Rating updated successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to update rating', details: error.message });
    }
};

const getStudentsForMentor = async (req, res) => {
    const { Mentor_ID } = req.params; // Assuming Mentor_ID is passed as a URL parameter

    try {
        const students = await enrollModel.getStudentsByMentorID(Mentor_ID);
        if (students.length === 0) {
            return res.status(404).send({ message: 'No students found for this mentor' });
        }
        res.status(200).send(students);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve students', details: error.message });
    }
};

const getEnrolledStudentsCount = async (req, res) => {
    const { Mentor_ID } = req.params;

    try {
        const students = await enrollModel.getStudentsByMentorID(Mentor_ID);

        // Calculate the number of enrolled students
        const enrolledCount = students.length;

        res.status(200).json({ mentor_id: Mentor_ID, enrolled_students_count: enrolledCount });
    } catch (error) {
        console.error('Error fetching enrolled students:', error);
        res.status(500).json({ error: 'Error fetching enrolled students' });
    }
};

const checkEnrollment = async (req, res) => {
    const { Student_ID, Mentor_ID } = req.body;

    try {
        const isEnrolled = await enrollModel.checkEnrollment(Student_ID, Mentor_ID);
        if (isEnrolled) {
            res.status(200).send({ enrolled: "Enrolled" });
        } else {
            res.status(404).send({ enrolled: "Not Enrolled"});
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to check enrollment status', details: error.message });
    }
};

const getMentorRating = async (req, res) => {
    const { Mentor_ID } = req.params;

    try {
        const rating = await enrollModel.getMentorRating(Mentor_ID);
        res.status(200).json({ mentor_id: Mentor_ID, mentor_rating: rating });
    } catch (error) {
        console.error('Error fetching mentor rating:', error);
        res.status(500).json({ error: 'Error fetching mentor rating' });
    }
};

module.exports = {
    enrollStudent,
    updateRating,
    getStudentsForMentor,
    getEnrolledStudentsCount,
    checkEnrollment,
    getMentorRating,

};
