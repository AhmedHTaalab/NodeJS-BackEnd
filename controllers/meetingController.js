const db = require('../config/db');

// Function to get meetings by Mentor ID
const getMeetingsByMentorId = async (req, res) => {
    const mentorId = req.params.mentorId;

    try {
        // Execute raw SQL query
        const query = `
            SELECT Mentor_ID, Student_ID, Date, Duration 
            FROM bookingmeetings 
            WHERE Mentor_ID = ?
        `;
        
        const [meetings] = await db.query(query, [mentorId]);

        // Check if meetings array is not empty
        if (meetings.length > 0) {
            const formattedMeetings = meetings.map(meeting => ({
                Mentor_ID: meeting.Mentor_ID,
                Student_ID: meeting.Student_ID,
                Date: meeting.Date,
                Duration: meeting.Duration
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