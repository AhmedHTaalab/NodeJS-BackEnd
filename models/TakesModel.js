const db = require('../config/db');

const enrollStudentInCourse = async (National_ID, CourseID,) => {
    await db.query(
        'INSERT INTO takes (National_ID, CourseID) VALUES (?, ?)',
        [National_ID, CourseID]
    );
};

const getCoursesByStudentID = async (National_ID) => {
    const [rows] = await db.query('SELECT CourseID FROM takes WHERE National_ID = ?', [National_ID]);
    return rows.map(row => row.CourseID);
};

const enrollInCourse = async ({ National_ID, CourseID, save}) => {
    const [result] = await db.query(
        'INSERT INTO takes (National_ID, CourseID, save) VALUES (?, ?, ?)',
        [National_ID, CourseID, save]
    );
    return result;
};

const updateSaveStatus = async ({ National_ID, CourseID, save }) => {
    const [result] = await db.query(
        'UPDATE takes SET save = ? WHERE National_ID = ? AND CourseID = ?',
        [save, National_ID, CourseID]
    );
    return result;
};

const getSavedCourses = async (National_ID) => {

    const [rows] = await db.query(
        `SELECT c.* FROM courses c
         JOIN takes t ON c.CourseID = t.CourseID
         WHERE t.National_ID = ? AND t.save = TRUE`,
        [National_ID]
    );

    return rows;
};

const isCourseSaved = async (National_ID, CourseID) => {
    const [rows] = await db.query(
        'SELECT save FROM takes WHERE National_ID = ? AND CourseID = ?',
        [National_ID, CourseID]
    );

    if (rows.length === 0) {
        return false;
    }
    return rows[0].save === 1; // Assuming `save` is a boolean or 0/1
};


module.exports = {
    enrollInCourse,
    updateSaveStatus,
    getSavedCourses,
    enrollStudentInCourse,
    getCoursesByStudentID,
    isCourseSaved,
};
