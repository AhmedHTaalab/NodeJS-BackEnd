// const groupMessageModel = require('../models/groupMessageModel');
// const studentModel = require('../models/studentModel');

// const sendGroupMessage = async (req, res) => {
//     const { sender_id, content } = req.body;

//     try {
//         const sender = await studentModel.findUserByNationalID(sender_id);

//         if (!sender) {
//             return res.status(400).json({ error: 'Sender not found' });
//         }

//         const message = {
//             sender_id,
//             track: sender.AreaOfInterest,
//             content,
//             timestamp: new Date()
//         };

//         await groupMessageModel.createGroupMessage(message);

//         res.status(201).json({ message: 'Group message sent successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to send group message' });
//     }
// };

// const getGroupMessages = async (req, res) => {
//     const { track } = req.params;

//     try {
//         const messages = await groupMessageModel.getGroupMessages(track);

//         res.status(200).json(messages);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to retrieve group messages' });
//     }
// };

// module.exports = {
//     sendGroupMessage,
//     getGroupMessages
// };


// const groupMessageModel = require('../models/groupMessageModel');
// const studentModel = require('../models/studentModel');

// const sendGroupMessage = async (req, res) => {
//     const { sender_id, content, track } = req.body; // Expecting track as a string

//     try {
//         const sender = await studentModel.findUserByNationalID(sender_id);

//         if (!sender) {
//             return res.status(400).json({ error: 'Sender not found' });
//         }

//         // Validate track if needed (ensure it exists in sender's AreaOfInterest or handle accordingly)

//         const message = {
//             sender_id,
//             track: track.trim(), // Trim to remove any leading/trailing spaces
//             content,
//             timestamp: new Date()
//         };

//         await groupMessageModel.createGroupMessage(message);

//         res.status(200).json({ message: 'Group message sent successfully' });
//     } catch (error) {
//         console.error('Error sending group message:', error);
//         res.status(500).json({ error: 'Failed to send group message' });
//     }
// };

// const getGroupMessages = async (req, res) => {
//     const { track } = req.params;

//     try {
//         const messages = await groupMessageModel.getGroupMessages(track);

//         res.status(200).json(messages);
//     } catch (error) {
//         console.error('Error retrieving group messages:', error);
//         res.status(500).json({ error: 'Failed to retrieve group messages' });
//     }
// };

// module.exports = {
//     sendGroupMessage,
//     getGroupMessages
// };

const groupMessageModel = require('../models/groupMessageModel');
const studentModel = require('../models/studentModel');

const sendGroupMessage = async (req, res) => {
    const { sender_id, content, track } = req.body; // Expecting track as a string

    try {
        const sender = await studentModel.findUserByNationalID(sender_id);

        if (!sender) {
            return res.status(400).json({ error: 'Sender not found' });
        }

        const message = {
            sender_id,
            track: track.trim(), // Trim to remove any leading/trailing spaces
            content,
            timestamp: new Date()
        };

        await groupMessageModel.createGroupMessage(message);

        res.status(200).json({ message: 'Group message sent successfully' });
    } catch (error) {
        console.error('Error sending group message:', error); // Log the error
        res.status(500).json({ error: 'Failed to send group message' });
    }
};

const getGroupMessages = async (req, res) => {
    const { track } = req.params;

    try {
        const messages = await groupMessageModel.getGroupMessages(track);

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving group messages:', error); // Log the error
        res.status(500).json({ error: 'Failed to retrieve group messages' });
    }
};

module.exports = {
    sendGroupMessage,
    getGroupMessages
};


