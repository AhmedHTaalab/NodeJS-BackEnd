const ratingModel = require('../models/ratingModel');
const db = require('../config/db');


// Rate a mentor
const rateMentor = async (req, res) => {
    try {
        const { Student_ID, Mentor_ID, Rating, Comment } = req.body;
        await ratingModel.rateMentor({ Student_ID, Mentor_ID, Rating, Comment });
        res.status(200).json({ message: 'Rating updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update rating', details: error.message });
    }
};
// Get all mentors with ratings and additional information
const getMentorsWithRatings = async (req, res) => {
    try {
        // Fetch ratings with mentor information including first_name and last_name
        const query = `
            SELECT r.Rating_ID, r.Student_ID, r.Mentor_ID, r.Rating, r.Comment, 
       au.first_name, au.last_name, m.jobtitle, 
       COUNT(e.Student_ID) AS No_of_Students, AVG(r.Rating) AS averageRating
FROM Ratings r
INNER JOIN Mentor m ON r.Mentor_ID = m.National_ID
INNER JOIN AppUser au ON m.National_ID = au.National_ID
LEFT JOIN Enroll e ON m.National_ID = e.Mentor_ID
GROUP BY r.Rating_ID, r.Student_ID, r.Mentor_ID, r.Rating, r.Comment, 
         au.first_name, au.last_name, m.jobtitle;

        `;
        
        const [mentors] = await db.query(query);

        res.status(200).json(mentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to load mentors with ratings', details: error.message });
    }
};
module.exports = {
    rateMentor,
    getMentorsWithRatings,
};
