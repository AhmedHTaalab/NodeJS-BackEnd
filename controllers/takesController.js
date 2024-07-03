const takesModel = require('../models/TakesModel');
const courseModel = require('../models/courseModel');


const enrollInCourse = async (req, res) => {
    const { National_ID, CourseID } = req.body;

    try {
        await takesModel.enrollInCourse({ National_ID, CourseID });
        res.status(201).send({ message: 'Student enrolled in course successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to enroll in course', details: error.message });
    }
};

const saveCourse = async (req, res) => {
    const { National_ID, CourseID } = req.body;

    try {
        await takesModel.enrollInCourse({ National_ID, CourseID, save: true });
        res.status(200).send({ message: 'Course saved successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save course', details: error.message });
    }
};

const unsaveCourse = async (req, res) => {
    const { National_ID, CourseID } = req.body;

    try {
        await takesModel.updateSaveStatus({ National_ID, CourseID, save: false });
        res.status(200).send({ message: 'Course unsaved successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to unsave course', details: error.message });
    }
};

const getSavedCourses = async (req, res) => {
    const { National_ID } = req.params; // Assuming National_ID is passed as a URL parameter

    try {
        const courses = await takesModel.getSavedCourses(National_ID);
        if (courses.length === 0) {
            return res.status(404).send({ message: 'No saved courses found for this student' });
        }
        res.status(200).send(courses);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve saved courses', details: error.message });
    }
};


const getCoursesTakenByStudent = async (req, res) => {
    const { National_ID } = req.params;

    try {
        // Get CourseIDs that the student takes
        const courseIDs = await takesModel.getCoursesByStudentID(National_ID);

        // Fetch details of each course
        const courses = [];
        for (let courseId of courseIDs) {
            const course = await courseModel.findCourseByID(courseId);
            if (course) {
                courses.push(course);
            }
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error('Error in getCoursesTakenByStudent:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.getAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error in getAllCourses:', error);
        res.status(500).json({ error: error.message });
    }
};

const getCoursesNotTakenByStudent = async (req, res) => {
    const { National_ID } = req.params;

    try {
        // Get CourseIDs that the student takes
        const courseIDsTaken = await takesModel.getCoursesByStudentID(National_ID);

        // Get all courses
        const allCourses = await courseModel.getAllCourses();

        // Filter courses that the student hasn't taken
        const coursesNotTaken = allCourses.filter(course => !courseIDsTaken.includes(course.CourseID));

        res.status(200).json(coursesNotTaken);
    } catch (error) {
        console.error('Error in getCoursesNotTakenByStudent:', error);
        res.status(500).json({ error: error.message });
    }
};

const checkIfCourseIsSaved = async (req, res) => {
    const { National_ID, CourseID } = req.params;

    try {
        const isSaved = await takesModel.isCourseSaved(National_ID, CourseID);
        res.status(200).json({ isSaved });
    } catch (error) {
        console.error('Error in checkIfCourseIsSaved:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    enrollInCourse,
    saveCourse,
    unsaveCourse,
    getSavedCourses,
    getCoursesTakenByStudent,
    getAllCourses,
    getCoursesNotTakenByStudent,
    checkIfCourseIsSaved,
};


