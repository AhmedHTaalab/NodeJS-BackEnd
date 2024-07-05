//userModel

const db = require('../config/db');

const createUser = async (user) => {
    const [result] = await db.query(
        'INSERT INTO AppUser (National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user.National_ID, user.DoB, user.Email, user.Password, user.PhoneNumber, user.Gender, user.first_name, user.last_name]
    );
    return result.insertId;
};

const findUserByNationalID = async (National_ID) => {
    const [rows] = await db.query('SELECT * FROM AppUser WHERE National_ID = ?', [National_ID]);
    return rows[0];
};

const findUserByEmail= async (Email) => {
    const [rows] = await db.query('SELECT * FROM AppUser WHERE Email = ?', [Email]);
    return rows[0];
};

const findRoleByNationalID = async (nationalID) => {
    const studentQuery = 'SELECT * FROM Student WHERE National_ID = ?';
    const mentorQuery = 'SELECT * FROM Mentor WHERE National_ID = ?';
    const recruiterQuery = 'SELECT * FROM Recruiter WHERE National_ID = ?';
    const adminQuery = 'SELECT * FROM admin WHERE National_ID = ?';

    const [studentRows] = await db.query(studentQuery, [nationalID]);
    if (studentRows.length > 0) return 'student';

    const [mentorRows] = await db.query(mentorQuery, [nationalID]);
    if (mentorRows.length > 0) return 'mentor';

    const [recruiterRows] = await db.query(recruiterQuery, [nationalID]);
    if (recruiterRows.length > 0) return 'recruiter';

    const [adminRows] = await db.query(adminQuery, [nationalID]);
    if (adminRows.length > 0) return 'admin';

    return null;
};


const updateUserProfile = async (user) => {
    const [result] = await db.query(
        'UPDATE AppUser SET DoB = ?, Email = ?, Password = ?, PhoneNumber = ?, Gender = ?, first_name = ?, last_name = ? WHERE National_ID = ?',
        [user.DoB, user.Email, user.Password, user.PhoneNumber, user.Gender, user.first_name, user.last_name, user.National_ID]
    );
    return result.affectedRows;
};

const getAllUserDataByNationalID = async (National_ID) => {
    const [user] = await db.query('SELECT * FROM AppUser WHERE National_ID = ?', [National_ID]);
    const [mentor] = await db.query('SELECT * FROM Mentor WHERE National_ID = ?', [National_ID]);
    const [student] = await db.query('SELECT * FROM Student WHERE National_ID = ?', [National_ID]);
    const [recruiter] = await db.query('SELECT * FROM Recruiter WHERE National_ID = ?', [National_ID]);

    return {
        user: user[0],
        mentor: mentor[0],
        student: student[0],
        recruiter: recruiter[0]
    };
};

module.exports = {
    createUser,
    findUserByNationalID,
    updateUserProfile,
    findUserByEmail,
    getAllUserDataByNationalID,
    findRoleByNationalID,
};
