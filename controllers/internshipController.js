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


module.exports = {
    getInternshipByID,
    deleteInternship,
};
