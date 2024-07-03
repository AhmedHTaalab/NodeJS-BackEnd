const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.sendMessage);
router.get('/conversation/:sender_id/:receiver_id', messageController.getConversation);

module.exports = router;
