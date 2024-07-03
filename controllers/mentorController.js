const db = require('../config/db');

const searchMentors = async (req, res) => {
    const { JobTitle, AreaOfInterest, Company, first_name } = req.query;
    console.log(`Received search request with criteria:`, req.query);

    try {
        // Build the SQL query
        let sql = `
            SELECT m.National_ID, u.first_name, u.last_name, m.JobTitle, m.Company, m.AreaOfInterest, m.No_of_Students, m.Price 
            FROM Mentor AS m
            JOIN AppUser AS u ON m.National_ID = u.National_ID
            WHERE 1=1
        `;
        const params = [];

        // Add conditions based on provided query parameters
        if (JobTitle) {
            sql += ' AND m.JobTitle LIKE ?';
            params.push(`%${JobTitle}%`);
        }
        if (AreaOfInterest) {
            sql += ' AND m.AreaOfInterest LIKE ?';
            params.push(`%${AreaOfInterest}%`);
        }
        if (Company) {
            sql += ' AND m.Company LIKE ?';
            params.push(`%${Company}%`);
        }
        if (first_name) {
            sql += ' AND u.first_name LIKE ?';
            params.push(`%${first_name}%`);
        }

        // Execute the query
        const [mentors] = await db.query(sql, params);
        console.log('Filtered Mentors:', mentors);
        
        res.status(200).json(mentors);
    } catch (error) {
        console.error('Error in searchMentors:', error);
        res.status(500).json({ error: error.message });
    }
};

const addMentorExperience = async (req, res) => {
    const { National_ID } = req.params;
    const { experience } = req.body;

    try {
        const result = await mentorModel.updateExperience(National_ID, experience);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Mentor experience added successfully' });
        } else {
            res.status(404).json({ error: 'Mentor not found or experience not added' });
        }
    } catch (error) {
        console.error('Error adding mentor experience:', error);
        res.status(500).json({ error: 'Failed to add mentor experience' });
    }
};
const getMentorExperiences = async (req, res) => {
    const { National_ID } = req.params;

    try {
        const experiences = await mentorModel.getMentorExperiences(National_ID);
        res.status(200).json(experiences);
    } catch (error) {
        console.error('Error fetching mentor experiences:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    searchMentors,
    addMentorExperience,
    getMentorExperiences
};
