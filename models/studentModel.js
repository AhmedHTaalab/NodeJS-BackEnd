//studentModel
const db = require('../config/db');

const createStudent = async (student) => {
    await db.query(
        'INSERT INTO Student (National_ID, AreaOfInterest, Skills, Level, University, Faculty, Country, City, ScheduleNational_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [student.National_ID, student.AreaOfInterest, student.Skills, student.Level, student.University, student.Faculty, student.Country, student.City, student.ScheduleNational_ID]
    );
};

const updateStudent = async (student) => {
    const [result] = await db.query(
        'UPDATE Student SET Level = ?, University = ?, Faculty = ?, Country = ?, City = ?, ScheduleNational_ID = ? WHERE National_ID = ?',
        [student.Level, student.University, student.Faculty, student.Country, student.City, student.ScheduleNational_ID, student.National_ID]
    );
    return result.affectedRows;
};


const findUserByNationalID = async (National_ID) => {
    const [rows] = await db.query('SELECT * FROM Student WHERE National_ID = ?', [National_ID]);
    return rows[0];
};

const updateSkills = async (nationalId, skills) => {
    const [result] = await db.query(
        'UPDATE Student SET Skills = ? WHERE National_ID = ?',
        [skills, nationalId]
    );
    return result;
};

const getSkillsById = async (nationalId) => {
    const [rows] = await db.query('SELECT Skills FROM Student WHERE National_ID = ?', [nationalId]);
    return rows[0];
};

const getTrackById = async (nationalId) => {
    const [rows] = await db.query('SELECT AreaOfInterest FROM Student WHERE National_ID = ?', [nationalId]);
    return rows[0];
};

const updateTrack = async (nationalId, areaOfInterest) => {
    const [result] = await db.query(
        'UPDATE Student SET AreaOfInterest = ? WHERE National_ID = ?',
        [areaOfInterest, nationalId]
    );
    return result;
};

const updateScheduledNationalId = async (Student_ID, Mentor_ID) => {
    try {
        const [result] = await db.query(
            'UPDATE Student SET ScheduleNational_ID = ? WHERE National_ID = ?',
            [Mentor_ID, Student_ID]
        );
        return result.affectedRows > 0; // Check if update was successful
    } catch (error) {
        console.error('Error updating scheduled mentor ID:', error);
        throw error;
    }
};


const searchStudentByFullName = async (firstName, lastName = null) => {
    let query = `
        SELECT AppUser.first_name, AppUser.last_name, AppUser.email,Student.* 
        FROM Student
        JOIN Enroll  ON Student.National_ID = Enroll.Student_ID
        JOIN AppUser ON Student.National_ID = AppUser.National_ID
        WHERE LOWER(AppUser.first_name) = LOWER(?)`;

    const params = [firstName];

    if (lastName) {
        query += ` AND LOWER(AppUser.last_name) = LOWER(?)`;
        params.push(lastName);
    }

    const [rows] = await db.query(query, params);
    return rows;
};

module.exports = {
    createStudent,
    updateStudent,
    findUserByNationalID,
    updateSkills,
    getSkillsById,
    updateScheduledNationalId,
    getTrackById,
    updateTrack,
    searchStudentByFullName,
};
