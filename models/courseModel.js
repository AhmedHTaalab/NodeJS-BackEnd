// courseModel.js
const db = require('../config/db');

const createCourse = async (course) => {
    const [result] = await db.query(
        'INSERT INTO courses (CourseID, CourseName, Provider, Level, Duration, Paid, Link, TrackType, RoadMap) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [course.CourseID, course.CourseName, course.Provider, course.Level, course.Duration, course.Paid, course.Link, course.TrackType, course.RoadMap]
    );
    return result.insertId;
};

const getAllCourses = async () => {
    const [rows] = await db.query('SELECT * FROM courses');
    return rows;
};

const findCourseByID = async (CourseID) => {
    const [rows] = await db.query('SELECT * FROM courses WHERE CourseID = ?', [CourseID]);
    return rows[0];  // Return the first row (course object) or undefined if not found
};

module.exports = {
    createCourse,
    getAllCourses,
    findCourseByID,
};
