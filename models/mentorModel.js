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

const getMentorExperiences = async (National_ID) => {
    const [experiences] = await db.query('SELECT * FROM mentor_experience WHERE National_ID = ?', [National_ID]);
    return experiences;
};

module.exports = {
    createMentor,
    updateMentor,
    getAllMentors,
    findUserByNationalID,
    searchMentors,
    updateExperience,
    getMentorExperiences
};