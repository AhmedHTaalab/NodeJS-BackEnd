const db = require('../config/db');

// Function to get meetings by Mentor ID
const getMeetingsByMentorId = async (req, res) => {
    const mentorId = req.params.mentorId;

    try {
        // Execute SQL query with JOIN to get student names
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
        `;
        
        const [meetings] = await db.query(query, [mentorId]);

        // Check if meetings array is not empty
        if (meetings.length > 0) {
            const formattedMeetings = meetings.map(meeting => ({
                Student_Name: `${meeting.first_name} ${meeting.last_name}`,
                Date: meeting.Date,
                Time: meeting.Duration,
            }));

            res.status(200).json(formattedMeetings);
        } else {
            // Return 404 if no meetings found for the mentorId
            res.status(404).json({ message: 'No meetings found for this mentor.' });
        }
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Failed to fetch meetings.' });
    }
};

module.exports = {
    getMeetingsByMentorId,
};
