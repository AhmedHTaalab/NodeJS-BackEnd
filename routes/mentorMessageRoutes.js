const express = require('express');
const router = express.Router();
const mentorMessageController = require('../controllers/mentorMessageController');
const messageModel = require('../models/mentorMessageModel');


// Endpoint to send a message from mentor to student
router.post('/send', mentorMessageController.sendMessage);

// Endpoint to fetch conversation between mentor and student
router.get('/conversation/:sender_id/:receiver_id', mentorMessageController.getConversation);

// GET all messages sent to a mentor
router.get('/mentor-messages/:mentorId', async (req, res) => {
    const { mentorId } = req.params;

    try {
        const messages = await messageModel.getMessagesToMentor(mentorId);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Failed to retrieve messages for mentor:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

module.exports = router;
