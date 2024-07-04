const express = require('express');
const router = express.Router();
const { bookMeeting, getStudentBookings } = require('../controllers/bookingController');
const { updateScheduledNationalId } = require('../models/studentModel');


router.post('/bookMeeting', bookMeeting);
router.get('/bookings/:studentId', getStudentBookings);

// Route for updating scheduled mentor ID
router.put('/updateScheduledNationalID', async (req, res) => {
    const { Student_ID, Mentor_ID } = req.body;
    console.log('Received Student_ID:', Student_ID);
    console.log('Received Mentor_ID:', Mentor_ID);

    try {
        const updateResult = await updateScheduledNationalId(Student_ID, Mentor_ID);
        console.log('Update result:', updateResult);

        if (updateResult) {
            res.status(200).json({ message: 'Scheduled ID updated successfully!' });
        } else {
            res.status(500).json({ message: 'Failed to update Scheduled ID.' });
        }
    } catch (error) {
        console.error('Error updating scheduled mentor ID:', error);
        res.status(500).json({ message: 'Failed to update Scheduled ID.' });
    }
});

module.exports = router;