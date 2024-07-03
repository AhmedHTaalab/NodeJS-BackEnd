const messageModel = require('../models/messageModel');
const studentModel = require('../models/studentModel');
const mentorModel = require('../models/mentorModel');
const userModel = require('../models/userModel');

const sendMessage = async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;

    try {
        // Verify if both sender and receiver are in the same track
        const sender = await studentModel.findUserByNationalID(sender_id) || await mentorModel.findUserByNationalID(sender_id);
        const receiver = await studentModel.findUserByNationalID(receiver_id) || await mentorModel.findUserByNationalID(receiver_id);

        if (!sender || !receiver) {
            console.error('Sender or receiver not found');
            return res.status(400).json({ error: 'Sender or receiver not found' });
        }

        // if (sender.AreaOfInterest !== receiver.AreaOfInterest) {
        //     console.error('Sender and receiver are not in the same track');
        //     return res.status(400).json({ error: 'Sender and receiver must be in the same track' });
        // }

        const message = {
            sender_id,
            receiver_id,
            track: sender.AreaOfInterest,
            content,
            timestamp: new Date()
        };

        await messageModel.createMessage(message);

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

const getConversation = async (req, res) => {
    const { sender_id, receiver_id } = req.params;

    try {
        // Verify if both sender and receiver are in the same track
        const sender = await studentModel.findUserByNationalID(sender_id) || await mentorModel.findUserByNationalID(sender_id);
        const receiver = await studentModel.findUserByNationalID(receiver_id) || await mentorModel.findUserByNationalID(receiver_id);

        if (!sender || !receiver) {
            console.error('Sender or receiver not found');
            return res.status(400).json({ error: 'Sender or receiver not found' });
        }

        if (sender.AreaOfInterest !== receiver.AreaOfInterest) {
            console.error('Sender and receiver are not in the same track');
            return res.status(400).json({ error: 'Sender and receiver must be in the same track' });
        }

        const messages = await messageModel.getMessages(sender_id, receiver_id, sender.AreaOfInterest);

        res.status(200).json(messages);
    } catch (error) {
        console.error('Failed to retrieve conversation:', error);
        res.status(500).json({ error: 'Failed to retrieve conversation' });
    }
};

module.exports = {
    sendMessage,
    getConversation
};
