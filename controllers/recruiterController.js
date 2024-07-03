const internshipsModel = require('../models/internshipModel');
const recruiterModel = require('../models/recruiterModel');


// Function to handle creating an internship, including the recruiter's National_ID
const createInternship = async (req, res) => {
    try {
        // Extract National_ID from the request body
        const { National_ID, ...internshipDetails } = req.body;

        // Ensure National_ID is provided
        if (!National_ID) {
            return res.status(400).send({ error: 'National_ID is required' });
        }

        // Include National_ID in the internship details
        const fullInternshipDetails = {
            ...internshipDetails,
            National_ID // Ensure this name matches the column name in your database
        };

        const internshipId = await internshipsModel.createInternship(fullInternshipDetails);
        res.status(201).send({ message: 'Internship created successfully', internshipId: internshipId });
    } catch (error) {
        res.status(500).send({ error: 'Failed to create internship', details: error.message });
    }
};

// Function to get all internships created by a specific recruiter
const getInternshipsByRecruiter = async (req, res) => {
    try {
        const { National_ID } = req.params;

        if (!National_ID) {
            return res.status(400).send({ error: 'National_ID is required' });
        }

        const internships = await internshipsModel.getInternshipsByRecruiter(National_ID);
        res.status(200).send(internships);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve internships', details: error.message });
    }
};



const updateInternship = async (req, res) => {
    try {
        const { National_ID, InternID, ...internshipDetails } = req.body;

        // Ensure National_ID and InternID are provided
        if (!National_ID || !InternID) {
            return res.status(400).send({ error: 'National_ID and InternID are required' });
        }

        const fullInternshipDetails = {
            ...internshipDetails,
            National_ID,
            InternID // Ensure this name matches the column name in your database
        };

        const affectedRows = await internshipsModel.updateInternship(fullInternshipDetails);
        if (affectedRows === 0) {
            return res.status(404).send({ message: 'Internship not found or not updated' });
        }

        res.status(200).send({ message: 'Internship updated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to update internship', details: error.message });
    }
};

const getRecruiterByIdController = async (req, res) => {
    try {
        const recruiterId = req.params.id;
        const recruiter = await recruiterModel.getRecruiterById(recruiterId);
        if (!recruiter) {
            return res.status(404).json({ message: 'Recruiter not found' });
        }
        res.json(recruiter);
    } catch (error) {
        console.error('Error fetching recruiter by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createInternship,
    getInternshipsByRecruiter,
    updateInternship,
    getRecruiterByIdController,
};
