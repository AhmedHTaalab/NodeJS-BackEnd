// const db = require('../config/db');

// const createGroupMessage = async (message) => {
//     await db.query(
//         'INSERT INTO GroupMessage (sender_id, track, content, timestamp) VALUES (?, ?, ?, ?)',
//         [message.sender_id, message.track, message.content, message.timestamp]
//     );
// };

// const getGroupMessages = async (track) => {
//     const [rows] = await db.query(
//         'SELECT * FROM GroupMessage WHERE track = ? ORDER BY timestamp ASC',
//         [track]
//     );
//     return rows;
// };

// module.exports = {
//     createGroupMessage,
//     getGroupMessages
// };


const db = require('../config/db');

const createGroupMessage = async (message) => {
    try {
        await db.query(
            'INSERT INTO GroupMessage (sender_id, track, content, timestamp) VALUES (?, ?, ?, ?)',
            [message.sender_id, message.track, message.content, message.timestamp]
        );
        console.log('Message inserted:', message); // Added logging
    } catch (error) {
        console.error('Error creating group message:', error);
        throw new Error('DatabaseError: Unable to create group message');
    }
};

// const getGroupMessages = async (track) => {
//     try {
//         const [rows] = await db.query(
//             'SELECT * FROM GroupMessage WHERE track = ? ORDER BY timestamp ASC',
//             [track]
//         );
//         return rows;
//     } catch (error) {
//         console.error('Error fetching group messages:', error);
//         throw new Error('DatabaseError: Unable to fetch group messages');
//     }
// };


// const getGroupMessages = async (track) => {
//     try {
//         const [rows] = await db.query(
//             `SELECT gm.*, au.first_name, au.last_name
//              FROM GroupMessage gm
//              JOIN AppUser au ON gm.sender_id = au.National_ID
//              WHERE gm.track = ?
//              ORDER BY gm.timestamp ASC`,
//             [track]
//         );
//         return rows;
//     } catch (error) {
//         console.error('Error fetching group messages:', error);
//         throw new Error('DatabaseError: Unable to fetch group messages');
//     }
// };



const getGroupMessages = async (track) => {
    try {
        const [rows] = await db.query(
            `SELECT gm.*, au.first_name, au.last_name
             FROM GroupMessage gm
             JOIN AppUser au ON gm.sender_id = au.National_ID
             WHERE gm.track = ?
             ORDER BY gm.timestamp ASC`,
            [track]
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
        console.error('Error fetching group messages:', error);
        throw new Error('DatabaseError: Unable to fetch group messages');
    }
};



// const createGroupMessage = async (message) => {
//     try {
//         const { sender_id, track, content } = message;
//         console.log('Creating message:', { sender_id, track, content }); // Log the message details

//         const [result] = await db.query(
//             'INSERT INTO GroupMessage (sender_id, track, content) VALUES (?, ?, ?)',
//             [sender_id, track, content]
//         );

//         if (result.affectedRows === 0) {
//             throw new Error('DatabaseError: Unable to create group message - No rows affected');
//         }

//         return result;
//     } catch (error) {
//         console.error('Error creating group message:', error.message); // Log the error message
//         throw new Error('DatabaseError: Unable to create group message');
//     }
// };


module.exports = {
    createGroupMessage,
    getGroupMessages
};

