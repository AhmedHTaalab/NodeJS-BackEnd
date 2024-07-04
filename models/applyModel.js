// applyModel.js
const db = require('../config/db');

const createApplication = async (applicationData) => {
    const [result] = await db.query(
        'INSERT INTO apply (National_ID, InternID) VALUES (?, ?)',
        [applicationData.National_ID, applicationData.InternID]
    );
    return result.insertId;
};

const getStudentsByInternshipID = async (InternID) => {
    const [rows] = await db.query(
        `SELECT u.first_name, u.last_name, u.Email, s.Skills, s.Level, s.University, s.Faculty, s.Country, s.City 
                
         FROM Student s
         JOIN Apply a ON s.National_ID = a.National_ID
         JOIN AppUser u ON s.National_ID = u.National_ID
         WHERE a.InternID = ?`,
        [InternID]
    );
    return rows; // Returns an array of combined student and user objects
};

const updateSaveStatus = async (applicationData) => {
    const [result] = await db.query(
        'UPDATE Apply SET save = ? WHERE National_ID = ? AND InternID = ?',
        [applicationData.save, applicationData.National_ID, applicationData.InternID]
    );
    return result;
};

const getSavedInternships = async (National_ID) => {
    const [rows] = await db.query(
        `SELECT i.* FROM internships i
         JOIN Apply a ON i.InternID = a.InternID
         WHERE a.National_ID = ? AND a.save = TRUE`,
        [National_ID]
    );
    return rows;
};

module.exports = {
    createApplication,
    getStudentsByInternshipID,
    updateSaveStatus,
    getSavedInternships,
};
