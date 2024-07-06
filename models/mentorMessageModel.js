const db = require('../config/db');

const createMessage = async (message) => {
    await db.query(
        'INSERT INTO Message (sender_id, receiver_id, track, content, timestamp) VALUES (?, ?, ?, ?, ?)',
        [message.sender_id, message.receiver_id, message.track, message.content, message.timestamp]
    );
};

const createMessageFromMentor = async (message) => {
    await db.query(
        'INSERT INTO Message (sender_id, receiver_id, track, content, timestamp) VALUES (?, ?, ?, ?, ?)',
        [message.sender_id, message.receiver_id, message.track, message.content, message.timestamp]
    );
};

// const getMessages = async (sender_id, receiver_id, track) => {
//     try {
//         const [rows] = await db.query(
//             'SELECT m.*, au.first_name, au.last_name ' +
//             'FROM Message m ' +
//             'JOIN AppUser au ON m.sender_id = au.National_ID ' +
//             'WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) ' +
//             'AND m.track = ? ' +
//             'ORDER BY m.timestamp ASC',
//             [sender_id, receiver_id, receiver_id, sender_id, track]
//         );

//         const groupedMessages = [];
//         let currentGroup = null;

//         for (const row of rows) {
//             if (currentGroup && currentGroup.sender_id === row.sender_id) {
//                 currentGroup.messages.push(row.content);
//             } else {
//                 if (currentGroup) {
//                     groupedMessages.push(currentGroup);
//                 }
//                 currentGroup = {
//                     sender_id: row.sender_id,
//                     first_name: row.first_name,
//                     last_name: row.last_name,
//                     messages: [row.content]
//                 };
//             }
//         }

//         if (currentGroup) {
//             groupedMessages.push(currentGroup);
//         }

//         return groupedMessages;
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//         throw new Error('DatabaseError: Unable to fetch messages');
//     }
// };


const getMessages = async (sender_id, receiver_id) => {
    try {
        const [rows] = await db.query(
            'SELECT m.*, s.first_name AS sender_first_name, s.last_name AS sender_last_name, ' +
            'r.first_name AS receiver_first_name, r.last_name AS receiver_last_name ' +
            'FROM Message m ' +
            'JOIN AppUser s ON m.sender_id = s.National_ID ' +
            'JOIN AppUser r ON m.receiver_id = r.National_ID ' +
            'WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) ' +
            'AND m.timestamp IS NOT NULL ' + // Exclude messages with null timestamp
            'ORDER BY m.timestamp ASC',
            [sender_id, receiver_id, receiver_id, sender_id]
        );

        return rows.map(row => ({
            sender_id: row.sender_id,
            receiver_id: row.receiver_id,
            content: row.content,
            sender_first_name: row.sender_first_name,
            sender_last_name: row.sender_last_name,
            receiver_first_name: row.receiver_first_name,
            receiver_last_name: row.receiver_last_name,
            timestamp: row.timestamp
        }));
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('DatabaseError: Unable to fetch messages');
    }
};


const getMessagesToMentor = async (mentorId) => {
    try {
        const [rows] = await db.query(
            'SELECT m.*, au.first_name, au.last_name ' +
            'FROM Message m ' +
            'JOIN AppUser au ON m.sender_id = au.National_ID ' +
            'WHERE m.receiver_id = ? ' +
            'ORDER BY m.timestamp ASC',
            [mentorId]
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
        console.error('Error fetching messages to mentor:', error);
        throw new Error('DatabaseError: Unable to fetch messages');
    }
};

module.exports = {
    createMessage,
    createMessageFromMentor,
    getMessages,
    getMessagesToMentor,
};
