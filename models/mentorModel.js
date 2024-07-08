// //mentorModel.js
// const db = require('../config/db');

// const createMentor = async (mentor) => {
//     await db.query(
//         'INSERT INTO Mentor (National_ID, JobTitle, AreaOfInterest, No_of_Students, Price) VALUES (?, ?, ?, ?, ?)',
//         [mentor.National_ID, mentor.JobTitle, mentor.AreaOfInterest, mentor.No_of_Students, mentor.Price]
//     );
// };

// const updateMentor = async (mentor) => {
//     const [result] = await db.query(
//         'UPDATE Mentor SET JobTitle = ?, AreaOfInterest = ?, No_of_Students = ?, Price = ?, Company = ? WHERE National_ID = ?',
//         [mentor.JobTitle, mentor.AreaOfInterest, mentor.No_of_Students, mentor.Price,  mentor.Company, mentor.National_ID]
//     );
//     return result.affectedRows;
// };

// const getAllMentors = async () => {
//     const [mentors] = await db.query('SELECT * FROM Mentor');
//     return mentors;
// };

// const findUserByNationalID = async (National_ID) => {
//     const [rows] = await db.query('SELECT * FROM Mentor WHERE National_ID = ?', [National_ID]);
//     return rows[0];
// };

// const searchMentors = async ({ JobTitle, AreaOfInterest, Company, first_name }) => {
//     let sql = `
//         SELECT u.first_name, u.last_name, m.*
//         FROM Mentor AS m 
//         JOIN AppUser AS u ON m.National_ID = u.National_ID
//         WHERE 1 = 1
//     `;
//     const params = [];

//     if (JobTitle) {
//         sql += ' AND m.JobTitle LIKE ?';
//         params.push('%' + JobTitle + '%');
//     }
//     if (AreaOfInterest) {
//         sql += ' AND m.AreaOfInterest LIKE ?';
//         params.push('%' + AreaOfInterest + '%');
//     }
//     if (Company) {
//         sql += ' AND m.Company LIKE ?';
//         params.push('%' + Company + '%');
//     }
//     if (first_name) {
//         sql += ' AND u.first_name LIKE ?';
//         params.push('%' + first_name + '%');
//     }

//     const [mentors] = await db.query(sql, params);
//     return mentors;
// };

// const updateExperience = async (National_ID, experience) => {
//     const [result] = await db.query(
//         'INSERT INTO mentor_experience (National_ID, Experience) VALUES (?, ?) ON DUPLICATE KEY UPDATE Experience = VALUES(Experience)',
//         [National_ID, experience]
//     );
//     return result;
// };

// const getMentorExperiences = async (National_ID) => {
//     const [experiences] = await db.query('SELECT * FROM mentor_experience WHERE National_ID = ?', [National_ID]);
//     return experiences;
// };

// module.exports = {
//     createMentor,
//     updateMentor,
//     getAllMentors,
//     findUserByNationalID,
//     searchMentors,
//     updateExperience,
//     getMentorExperiences
// };




//mentorModel.js
const db = require('../config/db');

const createMentor = async (mentor) => {
    await db.query(
        'INSERT INTO Mentor (National_ID, JobTitle, AreaOfInterest, No_of_Students, Price) VALUES (?, ?, ?, ?, ?)',
        [mentor.National_ID, mentor.JobTitle, mentor.AreaOfInterest, mentor.No_of_Students, mentor.Price]
    );
};

const updateMentor = async (mentor) => {
    const [result] = await db.query(
        'UPDATE Mentor SET JobTitle = ?, AreaOfInterest = ?, No_of_Students = ?, Price = ?, Company = ? WHERE National_ID = ?',
        [mentor.JobTitle, mentor.AreaOfInterest, mentor.No_of_Students, mentor.Price,  mentor.Company, mentor.National_ID]
    );
    return result.affectedRows;
};

const getAllMentors = async () => {
    const [mentors] = await db.query('SELECT * FROM Mentor');
    return mentors;
};

const findUserByNationalID = async (National_ID) => {
    const [rows] = await db.query('SELECT * FROM Mentor WHERE National_ID = ?', [National_ID]);
    return rows[0];
};

const searchMentors = async ({ JobTitle, AreaOfInterest, Company, first_name }) => {
    let sql = `
        SELECT u.first_name, u.last_name, m.*
        FROM Mentor AS m 
        JOIN AppUser AS u ON m.National_ID = u.National_ID
        WHERE 1 = 1
    `;
    const params = [];

    if (JobTitle) {
        sql += ' AND m.JobTitle LIKE ?';
        params.push('%' + JobTitle + '%');
    }
    if (AreaOfInterest) {
        sql += ' AND m.AreaOfInterest LIKE ?';
        params.push('%' + AreaOfInterest + '%');
    }
    if (Company) {
        sql += ' AND m.Company LIKE ?';
        params.push('%' + Company + '%');
    }
    if (first_name) {
        sql += ' AND u.first_name LIKE ?';
        params.push('%' + first_name + '%');
    }

    const [mentors] = await db.query(sql, params);
    return mentors;
};

const updateExperience = async (National_ID, experience) => {
    const [result] = await db.query(
        'INSERT INTO mentor_experience (National_ID, Experience) VALUES (?, ?) ON DUPLICATE KEY UPDATE Experience = VALUES(Experience)',
        [National_ID, experience]
    );
    return result;
};

const deleteExperience = async (National_ID, experience) => {
    const [result] = await db.query(
        'DELETE FROM mentor_experience WHERE National_ID = ? AND Experience = ?',
        [National_ID, experience]
    );
    return result;
};


const getMentorExperiences = async (National_ID) => {
    const [experiences] = await db.query('SELECT * FROM mentor_experience WHERE National_ID = ?', [National_ID]);
    return experiences;
};


const getTrackById = async (nationalId) => {
    const [rows] = await db.query('SELECT AreaOfInterest FROM Mentor WHERE National_ID = ?', [nationalId]);
    return rows[0];
};

const updateTrack = async (nationalId, areaOfInterest) => {
    const [result] = await db.query(
        'UPDATE Mentor SET AreaOfInterest = ? WHERE National_ID = ?',
        [areaOfInterest, nationalId]
    );
    return result;
};


const deleteMentorById = async (mentorId) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Delete from Enroll table where Mentor_ID is the mentor being deleted
        await connection.query('DELETE FROM Enroll WHERE Mentor_ID = ?', [mentorId]);

        // Delete from Ratings table where Mentor_ID is the mentor being deleted
        await connection.query('DELETE FROM Ratings WHERE Mentor_ID = ?', [mentorId]);

        // Delete from Mentor table
        const [result] = await connection.query('DELETE FROM Mentor WHERE National_ID = ?', [mentorId]);

        if (result.affectedRows === 0) {
            throw new Error('Mentor not found');
        }

        await connection.commit();
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    createMentor,
    updateMentor,
    getAllMentors,
    findUserByNationalID,
    searchMentors,
    updateExperience,
    getMentorExperiences,
    getTrackById,
    updateTrack,
    deleteExperience,
    deleteMentorById,
};