const express = require('express');
const router = express.Router();
const { getMeetingsByMentorId } = require('../controllers/meetingController');

router.get('/meetings/:mentorId', getMeetingsByMentorId);

module.exports = router;
