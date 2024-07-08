// // enrollModel.js
// const db = require('../config/db');

// const enrollStudentWithMentor = async ({ Student_ID, Mentor_ID }) => {
//     const [result] = await db.query(
//         'INSERT INTO Enroll (Student_ID, Mentor_ID) VALUES (?, ?)',
//         [Student_ID, Mentor_ID]
//     );
//     return result;
// };

// const rateMentor = async ({ Student_ID, Mentor_ID, Ratings }) => {
//     const [result] = await db.query(
//         'UPDATE Enroll SET Ratings = ? WHERE Student_ID = ? AND Mentor_ID = ?',
//         [Ratings, Student_ID, Mentor_ID]
//     );
//     return result;
// };

// const getStudentsByMentorID = async (Mentor_ID) => {
//     const [rows] = await db.query(
//         `SELECT  u.first_name, u.last_name, u.Email, s.Skills, s.Level, s.University, s.Faculty, s.Country, s.City 
//          FROM Student s
//          JOIN Enroll e ON s.National_ID = e.Student_ID
//          JOIN AppUser u ON s.National_ID = u.National_ID
//          WHERE e.Mentor_ID = ?`,
//         [Mentor_ID]
//     );
//     return rows; // Returns an array of student objects with their user details
// };

// module.exports = {
//     enrollStudentWithMentor,
//     rateMentor,
//     getStudentsByMentorID,
// };


// enrollModel.js
const db = require('../config/db');

const enrollStudentWithMentor = async ({ Student_ID, Mentor_ID }) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO Enroll (Student_ID, Mentor_ID) VALUES (?, ?)',
            [Student_ID, Mentor_ID]
        );

        await connection.query(
            'UPDATE Mentor SET No_of_Students = No_of_Students + 1 WHERE National_ID = ?',
            [Mentor_ID]
        );

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const checkEnrollment = async (Student_ID, Mentor_ID) => {
    const [result] = await db.query(
        'SELECT * FROM Enroll WHERE Student_ID = ? AND Mentor_ID = ?',
        [Student_ID, Mentor_ID]
    );
    return result.length > 0;
};

const rateMentor = async ({ Student_ID, Mentor_ID, Ratings }) => {
    const isEnrolled = await checkEnrollment(Student_ID, Mentor_ID);

    if (!isEnrolled) {
        throw new Error('Student is not enrolled with this mentor.');
    }

    const [existingRating] = await db.query(
        'SELECT * FROM Enroll WHERE Student_ID = ? AND Mentor_ID = ?',
        [Student_ID, Mentor_ID]
    );

    if (existingRating.length === 0) {
        // Insert new rating
        const [result] = await db.query(
            'INSERT INTO Enroll (Student_ID, Mentor_ID, Ratings) VALUES (?, ?, ?)',
            [Student_ID, Mentor_ID, Ratings]
        );
        return result;
    } else {
        // Update existing rating
        const [result] = await db.query(
            'UPDATE Enroll SET Ratings = ? WHERE Student_ID = ? AND Mentor_ID = ?',
            [Ratings, Student_ID, Mentor_ID]
        );
        return result;
    }
};


const getStudentsByMentorID = async (Mentor_ID) => {
    const [rows] = await db.query(
        `SELECT  u.first_name, u.last_name, u.Email, s.Skills, s.Level, s.University, s.Faculity, s.Country, s.City 
         FROM Student s
         JOIN Enroll e ON s.National_ID = e.Student_ID
         JOIN AppUser u ON s.National_ID = u.National_ID
         WHERE e.Mentor_ID = ?`,
        [Mentor_ID]
    );
    return rows; // Returns an array of student objects with their user details
};

module.exports = {
    enrollStudentWithMentor,
    rateMentor,
    getStudentsByMentorID,
    checkEnrollment,
};
