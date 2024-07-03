//recruiterModel
const db = require('../config/db');

const createRecruiter = async (recruiter) => {
    await db.query(
        'INSERT INTO Recruiter (National_ID, Company_Name, JobTitle) VALUES (?, ?, ?)',
        [recruiter.National_ID, recruiter.Company_Name, recruiter.JobTitle]
    );
};

const updateRecruiter = async (recruiter) => {
    const [result] = await db.query(
        'UPDATE Recruiter SET Company_Name = ?, JobTitle = ? WHERE National_ID = ?',
        [recruiter.Company_Name, recruiter.JobTitle, recruiter.National_ID]
    );
    return result.affectedRows;
};

const getRecruiterById = async (id) => {
    const query = `
        SELECT r.*, a.*
        FROM Recruiter r
        LEFT JOIN appuser a ON r.National_ID = a.National_ID
        WHERE r.National_ID = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0]; // Assuming National_ID is unique, so return the first row
};

module.exports = {
    createRecruiter,
    updateRecruiter,
    getRecruiterById
};
