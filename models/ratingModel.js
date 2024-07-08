// models/ratingModel.js

const db = require('../config/db');

// Insert or update a rating
const rateMentor = async ({ Student_ID, Mentor_ID, Rating, Comment }) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check if the student is enrolled with the mentor
        const [enrollmentCheck] = await connection.query(
            'SELECT * FROM Enroll WHERE Student_ID = ? AND Mentor_ID = ?',
            [Student_ID, Mentor_ID]
        );

        if (enrollmentCheck.length === 0) {
            throw new Error('Student is not enrolled with this mentor.');
        }

        // Check if the rating already exists
        const [existingRating] = await connection.query(
            'SELECT * FROM Ratings WHERE Student_ID = ? AND Mentor_ID = ?',
            [Student_ID, Mentor_ID]
        );

        if (existingRating.length === 0) {
            // Insert new rating
            const [result] = await connection.query(
                'INSERT INTO Ratings (Student_ID, Mentor_ID, Rating, Comment) VALUES (?, ?, ?, ?)',
                [Student_ID, Mentor_ID, Rating, Comment]
            );
            await connection.commit();
            return result;
        } else {
            // Update existing rating
            const [result] = await connection.query(
                'UPDATE Ratings SET Rating = ?, Comment = ? WHERE Student_ID = ? AND Mentor_ID = ?',
                [Rating, Comment, Student_ID, Mentor_ID]
            );
            await connection.commit();
            return result;
        }
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

// Get all mentors with ratings and comments
const getAllMentorRatings = async () => {
    try {
        const connection = await db.getConnection();
        const [ratings] = await connection.query(`
            SELECT r.*, m.jobtitle, au.first_name, au.last_name
            FROM Ratings r
            INNER JOIN Mentor m ON r.Mentor_ID = m.National_ID
            INNER JOIN AppUser au ON m.National_ID = au.National_ID
        `);
        connection.release();
        return ratings;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    rateMentor,
    getAllMentorRatings
};
