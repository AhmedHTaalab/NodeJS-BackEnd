const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.sendUserMentorMessage);
router.get('/conversation/:sender_id/:receiver_id', messageController.getUserMentorConversation);

module.exports = router;

