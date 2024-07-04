// internshipController.js
const internshipModel = require('../models/internshipModel');

const getInternshipByID = async (req, res) => {
    const { id } = req.params;

    try {
        const internship = await internshipModel.findInternshipByID(id);
        if (!internship) {
            return res.status(404).json({ error: 'Internship not found' });
        }
        res.status(200).json(internship);
    } catch (error) {
        console.error('Error in getInternshipByID:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteInternship = async (req, res) => {
    try {
        const { InternID } = req.params;
        const affectedRows = await internshipModel.deleteInternship(InternID);
        if (affectedRows === 0) {
            return res.status(404).send({ message: 'Internship not found.' });
        }
        res.status(200).send({ message: 'Internship deleted successfully.' });
    } catch (error) {
        console.error('Error deleting internship:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

const deleteInternshipReruiter = async (req, res) => {
    const { internId } = req.params;
    const { nationalId } = req.body;

    if (!nationalId) {
        return res.status(400).send({ message: 'National_ID is required' });
    }

    try {
        // Verify if the internship belongs to the recruiter
        const internship = await internshipModel.findInternshipByID(internId);
        if (!internship) {
            return res.status(404).send({ message: 'Internship not found' });
        }

        if (internship.National_ID !== nationalId) {
            return res.status(403).send({ message: 'Unauthorized to delete this internship' });
        }

        // Delete the internship
        const result = await internshipModel.deleteInternship(internId, nationalId);
        if (result > 0) {
            res.status(200).send({ message: 'Internship deleted successfully' });
        } else {
            res.status(400).send({ message: 'Failed to delete internship' });
        }
    } catch (error) {
        console.error('Error deleting internship:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};


module.exports = {
    getInternshipByID,
    deleteInternship,
    deleteInternshipReruiter
};
