// const db = require('../config/db');
// const mentorModel = require('../models/mentorModel');

// const searchMentors = async (req, res) => {
//     const { JobTitle, AreaOfInterest, Company, first_name } = req.query;
//     console.log(`Received search request with criteria:`, req.query);

//     try {
//         // Build the SQL query
//         let sql = `
//             SELECT m.National_ID, u.first_name, u.last_name, m.JobTitle, m.Company, m.AreaOfInterest, m.No_of_Students, m.Price 
//             FROM Mentor AS m
//             JOIN AppUser AS u ON m.National_ID = u.National_ID
//             WHERE 1=1
//         `;
//         const params = [];

//         // Add conditions based on provided query parameters
//         if (JobTitle) {
//             sql += ' AND m.JobTitle LIKE ?';
//             params.push(`%${JobTitle}%`);
//         }
//         if (AreaOfInterest) {
//             sql += ' AND m.AreaOfInterest LIKE ?';
//             params.push(`%${AreaOfInterest}%`);
//         }
//         if (Company) {
//             sql += ' AND m.Company LIKE ?';
//             params.push(`%${Company}%`);
//         }
//         if (first_name) {
//             sql += ' AND u.first_name LIKE ?';
//             params.push(`%${first_name}%`);
//         }

//         // Execute the query
//         const [mentors] = await db.query(sql, params);
//         console.log('Filtered Mentors:', mentors);
        
//         res.status(200).json(mentors);
//     } catch (error) {
//         console.error('Error in searchMentors:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// const addMentorExperience = async (req, res) => {
//     const { National_ID } = req.params;
//     const { experience } = req.body;

//     try {
//         const result = await mentorModel.updateExperience(National_ID, experience);

//         if (result.affectedRows > 0) {
//             res.status(200).json({ message: 'Mentor experience added successfully' });
//         } else {
//             res.status(404).json({ error: 'Mentor not found or experience not added' });
//         }
//     } catch (error) {
//         console.error('Error adding mentor experience:', error);
//         res.status(500).json({ error: 'Failed to add mentor experience' });
//     }
// };
// const getMentorExperiences = async (req, res) => {
//     const { National_ID } = req.params;

//     try {
//         const experiences = await mentorModel.getMentorExperiences(National_ID);
//         res.status(200).json(experiences);
//     } catch (error) {
//         console.error('Error fetching mentor experiences:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = {
//     searchMentors,
//     addMentorExperience,
//     getMentorExperiences
// };


const db = require('../config/db');
const mentorModel = require('../models/mentorModel');

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

const updateAreaOfInterest = async (req, res) => {
    const { nationalID, areaOfInterest, action } = req.body;

    console.log('Request received:', { nationalID, areaOfInterest, action }); // Debug log

    try {
        let newAreaOfInterest;
        const currentAreaOfInterestData = await mentorModel.getTrackById(nationalID);
        const currentAreaOfInterest = currentAreaOfInterestData.AreaOfInterest ? currentAreaOfInterestData.AreaOfInterest.split(', ') : [];

        if (action === 'update' || action === 'delete') {
            // Overwrite the area of interest list with the new one
            newAreaOfInterest = areaOfInterest.join(', ');
        } else if (action === 'insert') {
            newAreaOfInterest = [...currentAreaOfInterest, ...areaOfInterest].filter((interest, index, self) => self.indexOf(interest) === index).join(', ');
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        console.log('Updating area of interest to:', newAreaOfInterest); // Debug log

        const result = await mentorModel.updateTrack(nationalID, newAreaOfInterest);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Area of interest updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating area of interest:', error); // Debug log
        res.status(500).json({ error: 'Failed to update area of interest' });
    }
};


const editExperience = async (req, res) => {
    const { National_ID, experience } = req.body;
    try {
        const result = await mentorModel.updateExperience(National_ID, experience);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Experience updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update experience' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteExperience = async (req, res) => {
    const { National_ID, experience } = req.body;
    try {
        const result = await mentorModel.deleteExperience(National_ID, experience);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Experience deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete experience' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    searchMentors,
    addMentorExperience,
    getMentorExperiences,
    updateAreaOfInterest,
    editExperience,
    deleteExperience,

};
