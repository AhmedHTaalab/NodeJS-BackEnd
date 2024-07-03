const db = require('../config/db');

const insertUserImage = async (userId, imageUrl) => {
    const [result] = await db.query(
        'INSERT INTO Images (user_id, image_url) VALUES (?, ?)',
        [userId, imageUrl]
    );
    return result.insertId;
};

const insertOrUpdateUserImage = async (userId, imageUrl) => {
    const [rows] = await db.query('SELECT * FROM Images WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
        // Update the existing image
        await db.query('UPDATE Images SET image_url = ? WHERE user_id = ?', [imageUrl, userId]);
    } else {
        // Insert a new image
        await db.query('INSERT INTO Images (user_id, image_url) VALUES (?, ?)', [userId, imageUrl]);
    }
};

const getUserImageById = async (id) => {
    const [rows] = await db.query('SELECT * FROM Images WHERE user_id = ?', [id]);
    return rows[0];
};

module.exports = {
    insertUserImage,
    insertOrUpdateUserImage,
    getUserImageById
};
