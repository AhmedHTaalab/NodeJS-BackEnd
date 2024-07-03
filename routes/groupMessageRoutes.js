const express = require('express');
const router = express.Router();
const groupMessageController = require('../controllers/groupMessageController');

router.post('/send', groupMessageController.sendGroupMessage);
router.get('/messages/:track', groupMessageController.getGroupMessages);

module.exports = router;
