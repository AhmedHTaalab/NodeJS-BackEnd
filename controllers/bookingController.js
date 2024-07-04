const Booking = require('../models/bookingModel');
const Student = require('../models/studentModel');
const db = require('../config/db');

const bookMeeting = async (req, res) => {
    const { Mentor_ID, Student_ID, Date, Duration } = req.body;

    try {
        // Check if student exists
        const student = await Student.findUserByNationalID(Student_ID);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Create booking
        await Booking.createBooking({ Mentor_ID, Student_ID, Date, Duration });

        res.status(200).json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error booking meeting:', error);
        res.status(500).json({ message: 'Failed to book meeting.' });
    }
};

// Function to get student bookings
const getStudentBookings = async (req, res) => {
    const { studentId } = req.params;

    try {
        // Fetch bookings for the student, including mentor's name
        const query = `
            SELECT 
                bm.Date, 
                bm.Duration, 
                au.first_name, 
                au.last_name
            FROM 
                bookingmeetings AS bm
            JOIN 
                AppUser AS au
            ON 
                bm.Mentor_ID = au.National_ID
            WHERE 
                bm.Student_ID = ?
        `;
        
        const [bookings] = await db.query(query, [studentId]);

        if (bookings.length > 0) {
            const formattedBookings = bookings.map(booking => ({
                Mentor_Name: `${booking.first_name} ${booking.last_name}`,
                Date: booking.Date,
                Time: booking.Duration,
            }));

            res.status(200).json(formattedBookings);
        } else {
            res.status(404).json({ message: 'No bookings found for this student.' });
        }
    } catch (error) {
        console.error('Error fetching student bookings:', error);
        res.status(500).json({ message: 'Failed to fetch student bookings.' });
    }
};
module.exports = {
    bookMeeting,
    getStudentBookings,
};
