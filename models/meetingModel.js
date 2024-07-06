// const db = require('../config/db');

// const createBooking = async (booking) => {
//     await db.query(
//         'INSERT INTO bookingmeetings (Mentor_ID, Student_ID, Date, Duration) VALUES (?, ?, ?, ?)',
//         [booking.Mentor_ID, booking.Student_ID, booking.Date, booking.Duration]
//     );
// };

// const getBookingsByStudentId = async (studentId) => {
//     const [rows] = await db.query(
//         'SELECT * FROM bookingmeetings WHERE Student_ID = ?',
//         [studentId]
//     );
//     return rows;
// };

// module.exports = {
//     createBooking,
//     getBookingsByStudentId,
// };

const db = require('../config/db');

const createBooking = async (booking) => {
    await db.query(
        'INSERT INTO bookingmeetings (Mentor_ID, Student_ID, Date, Duration) VALUES (?, ?, ?, ?)',
        [booking.Mentor_ID, booking.Student_ID, booking.Date, booking.Duration]
    );
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