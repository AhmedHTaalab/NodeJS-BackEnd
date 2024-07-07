// const db = require('../config/db');

// // Function to get meetings by Mentor ID
// const getMeetingsByMentorId = async (req, res) => {
//     const mentorId = req.params.mentorId;

//     try {
//         // Execute SQL query with JOIN to get student names
//         const query = `
//             SELECT 
//                 bm.Date, 
//                 bm.Duration,
//                 au.first_name,
//                 au.last_name
//             FROM 
//                 bookingmeetings AS bm
//             JOIN 
//                 AppUser AS au
//             ON 
//                 bm.Student_ID = au.National_ID
//             WHERE 
//                 bm.Mentor_ID = ?
//         `;
        
//         const [meetings] = await db.query(query, [mentorId]);

//         // Check if meetings array is not empty
//         if (meetings.length > 0) {
//             const formattedMeetings = meetings.map(meeting => ({
//                 Student_Name: `${meeting.first_name} ${meeting.last_name}`,
//                 Date: meeting.Date,
//                 Time: meeting.Duration,
//             }));

//             res.status(200).json(formattedMeetings);
//         } else {
//             // Return 404 if no meetings found for the mentorId
//             res.status(404).json({ message: 'No meetings found for this mentor.' });
//         }
//     } catch (error) {
//         console.error('Error fetching meetings:', error);
//         res.status(500).json({ message: 'Failed to fetch meetings.' });
//     }
// };

// module.exports = {
//     getMeetingsByMentorId,
// };



// const db = require('../config/db');

// Function to get meetings by Mentor ID
// const getMeetingsByMentorId = async (req, res) => {
//     const mentorId = req.params.mentorId;

//     try {
//         // Execute SQL query with JOIN to get student names and order by date ascending
//         const query = `
//             SELECT 
//                 bm.Date, 
//                 bm.Duration,
//                 au.first_name,
//                 au.last_name
//             FROM 
//                 bookingmeetings AS bm
//             JOIN 
//                 AppUser AS au
//             ON 
//                 bm.Student_ID = au.National_ID
//             WHERE 
//                 bm.Mentor_ID = ?
//             ORDER BY 
//                 bm.Date ASC
//         `;
        
//         const [meetings] = await db.query(query, [mentorId]);

//         // Check if meetings array is not empty
//         if (meetings.length > 0) {
//             const formattedMeetings = meetings.map(meeting => ({
//                 Student_Name: `${meeting.first_name} ${meeting.last_name}`,
//                 Date: meeting.Date,
//                 Time: meeting.Duration,
//             }));

//             res.status(200).json(formattedMeetings);
//         } else {
//             // Return 404 if no meetings found for the mentorId
//             res.status(404).json({ message: 'No meetings found for this mentor.' });
//         }
//     } catch (error) {
//         console.error('Error fetching meetings:', error);
//         res.status(500).json({ message: 'Failed to fetch meetings.' });
//     }
// };

// module.exports = {
//     getMeetingsByMentorId,
// };


const db = require('../config/db');

// Function to get meetings by Mentor ID
const getMeetingsByMentorId = async (req, res) => {
    const mentorId = req.params.mentorId;

    try {
        // Get today's date without the time part
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Execute SQL query with JOIN to get student names and order by date ascending
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
                bm.Student_ID = au.National_ID
            WHERE 
                bm.Mentor_ID = ?
            ORDER BY 
                bm.Date ASC,
                bm.Duration ASC
        `;
        
        const [meetings] = await db.query(query, [mentorId]);

        // Filter out meetings with dates older than today
        const upcomingMeetings = meetings.filter(meeting => new Date(meeting.Date) >= today);

        // Check if upcoming meetings array is not empty
        if (upcomingMeetings.length > 0) {
            const formattedMeetings = upcomingMeetings.map(meeting => ({
                Student_Name: `${meeting.first_name} ${meeting.last_name}`,
                Date: meeting.Date,
                Time: meeting.Duration,
            }));

            res.status(200).json(formattedMeetings);
        } else {
            // Return 404 if no upcoming meetings found for the mentorId
            res.status(404).json({ message: 'No upcoming meetings found for this mentor.' });
        }
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Failed to fetch meetings.' });
    }
};

module.exports = {
    getMeetingsByMentorId,
};
