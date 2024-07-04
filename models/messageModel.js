const db = require('../config/db');

const createMessage = async (message) => {
    await db.query(
        'INSERT INTO Message (sender_id, receiver_id, track, content, timestamp) VALUES (?, ?, ?, ?, ?)',
        [message.sender_id, message.receiver_id, message.track, message.content, message.timestamp]
    );
};

// const getMessages = async (sender_id, receiver_id, track) => {
//     const [rows] = await db.query(
//         'SELECT * FROM Message WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND track = ? ORDER BY timestamp ASC',
//         [sender_id, receiver_id, receiver_id, sender_id, track]
//     );
//     return rows;
// };

const getMessages = async (sender_id, receiver_id, track) => {
    try {
        const [rows] = await db.query(
            'SELECT m.*, au.first_name, au.last_name ' +
            'FROM Message m ' +
            'JOIN AppUser au ON m.sender_id = au.National_ID ' +
            'WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) ' +
            'AND m.track = ? ' +
            'ORDER BY m.timestamp ASC',
            [sender_id, receiver_id, receiver_id, sender_id, track]
        );

        const groupedMessages = [];
        let currentGroup = null;

        for (const row of rows) {
            if (currentGroup && currentGroup.sender_id === row.sender_id) {
                currentGroup.messages.push(row.content);
            } else {
                if (currentGroup) {
                    groupedMessages.push(currentGroup);
                }
                currentGroup = {
                    sender_id: row.sender_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    messages: [row.content]
                };
            }
        }

        if (currentGroup) {
            groupedMessages.push(currentGroup);
        }

        return groupedMessages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('DatabaseError: Unable to fetch messages');
    }
};


module.exports = {
    createMessage,
    getMessages
};
