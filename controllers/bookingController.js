const Booking = require('../models/bookingModel');
const Student = require('../models/studentModel');
const Mentor = require('../models/mentorModel');

const bookMeeting = async (req, res) => {
    const { Mentor_ID, Student_ID, Date, Duration } = req.body;

    try {
        await Booking.createBooking({ Mentor_ID, Student_ID, Date, Duration });

        // Update student's scheduled mentor ID
        await Student.updateScheduledNationalId(Student_ID, Mentor_ID);

        res.status(200).json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error booking meeting:', error);
        res.status(500).json({ message: 'Failed to book meeting.' });
    }
};

module.exports = {
    bookMeeting,
};