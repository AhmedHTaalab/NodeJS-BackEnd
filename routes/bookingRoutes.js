const express = require('express');
const router = express.Router();
const { bookMeeting } = require('../controllers/bookingController');

router.post('/bookMeeting', bookMeeting);

module.exports = router;