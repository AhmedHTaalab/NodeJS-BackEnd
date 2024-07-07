const db = require('../config/db');

// const createBooking = async (booking) => {
//     await db.query(
//         'INSERT INTO bookingmeetings (Mentor_ID, Student_ID, Date, Duration) VALUES (?, ?, ?, ?)',
//         [booking.Mentor_ID, booking.Student_ID, booking.Date, booking.Duration]
//     );
// };


// const createBooking = async (booking) => {
//     // Get today's date without the time part
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Convert booking date to Date object
//     const bookingDate = new Date(booking.Date);

//     // Check if the booking date is in the past
//     if (bookingDate < today) {
//         throw new Error('Cannot book a meeting for a past date.');
//     }

//     // Insert the booking if the date is valid
//     await db.query(
//         'INSERT INTO bookingmeetings (Mentor_ID, Student_ID, Date, Duration) VALUES (?, ?, ?, ?)',
//         [booking.Mentor_ID, booking.Student_ID, booking.Date, booking.Duration]
//     );
// };

// module.exports = {
//     createBooking,
// };


const createBooking = async (booking) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(booking.Date);
    if (bookingDate < today) {
        throw new Error('Cannot book a meeting for a past date.');
    }

    // Check for existing booking with the same date and duration
    const existingBookingQuery = `
        SELECT 
            *
        FROM 
            bookingmeetings
        WHERE 
            Mentor_ID = ? AND 
            Date = ? AND 
            Duration = ?
    `;
    
    const [existingBookings] = await db.query(existingBookingQuery, [booking.Mentor_ID, booking.Date, booking.Duration]);

    if (existingBookings.length > 0) {
        return { success: false, message: 'The selected date and time are already booked.' };
    }

    // Insert the booking if the date is valid and not already booked
    await db.query(
        'INSERT INTO bookingmeetings (Mentor_ID, Student_ID, Date, Duration) VALUES (?, ?, ?, ?)',
        [booking.Mentor_ID, booking.Student_ID, booking.Date, booking.Duration]
    );

    return { success: true, message: 'Booking successful!' };
};



const getBookingsByStudentId = async (studentId) => {
    const [rows] = await db.query(
        'SELECT * FROM bookingmeetings WHERE Student_ID = ?',
        [studentId]
    );
    return rows;
};

module.exports = {
    createBooking,
    getBookingsByStudentId,
};