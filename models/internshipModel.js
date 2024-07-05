const db = require('../config/db');

const createInternship = async (internship) => {
    const [result] = await db.query(
        'INSERT INTO internships (InternID, InternTitle, CompanyName, Link, InternReqNo, Paid, Date, Description, Duration, Requirements, City, Country, National_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [internship.InternID, internship.InternTitle, internship.CompanyName, internship.Link, internship.InternReqNo, internship.Paid, internship.Date, internship.Description, internship.Duration, internship.Requirements, internship.City, internship.Country, internship.National_ID]
    );
    return result.insertId;
};

const getAllInternships = async () => {
    console.log('Executing getAllInternships query...');
    try {
        const [rows] = await db.query('SELECT * FROM internships');
        console.log('Query executed successfully:', rows);
        if (rows.length === 0) {
            console.log('No internships found in the database.');
        }
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

// const getAllInternships = async () => {
//     console.log('Executing getAllInternships query...');
//     try {
//         const [rows] = await db.query('SELECT * FROM internships');
//         console.log('Query executed successfully:', rows);
//         return rows;
//     } catch (error) {
//         console.error('Error executing query:', error);
//         throw error;
//     }
// };

const findInternshipByID = async (InternID) => {
    const [rows] = await db.query('SELECT * FROM internships WHERE InternID = ?', [InternID]);
    return rows[0];  // Return the first row (internship object) or undefined if not found
};

const getInternshipsByRecruiter = async (National_ID) => {
    const [rows] = await db.query('SELECT * FROM internships WHERE National_ID = ?', [National_ID]);
    return rows;
};

const updateInternship = async (internship) => {
    const [result] = await db.query(
        'UPDATE internships SET InternTitle = ?, CompanyName = ?, Link = ?, InternReqNo = ?, Paid = ?, Date = ?, Description = ?, Duration = ?, Requirements = ?, City = ?, Country = ? WHERE InternID = ? AND National_ID = ?',
        [internship.InternTitle, internship.CompanyName, internship.Link, internship.InternReqNo, internship.Paid, internship.Date, internship.Description, internship.Duration, internship.Requirements, internship.City, internship.Country, internship.InternID, internship.National_ID]
    );
    return result.affectedRows;  // Returns the number of affected rows
};



const deleteInternship = async (InternID) => {
    const [result] = await db.query('DELETE FROM internships WHERE InternID = ?', [InternID]);
    return result.affectedRows;
};

const searchInternshipsByTitleAndRecruiter = async (title, national_id) => {
    const [rows] = await db.query(
        'SELECT * FROM internships WHERE InternTitle LIKE ? AND National_ID = ?',
        [`%${title}%`, national_id]
    );
    return rows;
};

const getAllInternshipsByRecruiter = async (nationalId) => {
    const [rows] = await db.query('SELECT * FROM internships WHERE National_ID = ?', [nationalId]);
    return rows;
};

module.exports = {
    createInternship,
    getAllInternships,
    findInternshipByID,
    getInternshipsByRecruiter,
    updateInternship,
    deleteInternship,
    searchInternshipsByTitleAndRecruiter,
    getAllInternshipsByRecruiter,
};