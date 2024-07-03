const db = require('../config/db');

const createMessage = async (message) => {
    await db.query(
        'INSERT INTO Message (sender_id, receiver_id, track, content, timestamp) VALUES (?, ?, ?, ?, ?)',
        [message.sender_id, message.receiver_id, message.track, message.content, message.timestamp]
    );
};

const getMessages = async (sender_id, receiver_id, track) => {
    const [rows] = await db.query(
        'SELECT * FROM Message WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND track = ? ORDER BY timestamp ASC',
        [sender_id, receiver_id, receiver_id, sender_id, track]
    );
    return rows;
};

module.exports = {
    createMessage,
    getMessages
};
