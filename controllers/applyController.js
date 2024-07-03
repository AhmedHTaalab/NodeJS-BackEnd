// applyController.js
const applyModel = require('../models/applyModel');
const studentModel = require('../models/studentModel');
const internshipModel = require('../models/internshipModel');

const applyToInternship = async (req, res) => {
    const { National_ID, InternID } = req.body;

    try {
        // Check if student exists
        const student = await studentModel.findUserByNationalID(National_ID);
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        // Check if internship exists
        const internship = await internshipModel.findInternshipByID(InternID);
        if (!internship) {
            return res.status(404).send({ error: 'Internship not found' });
        }

        // Create application
        const applicationId = await applyModel.createApplication({ National_ID, InternID });
        res.status(201).send({ message: 'Application submitted successfully', applicationId });
    } catch (error) {
        res.status(500).send({ error: 'Failed to submit application', details: error.message });
    }
};

const getStudentsForInternship = async (req, res) => {
    const { InternID } = req.params; // Assuming InternID is passed as a URL parameter

    try {
        const students = await applyModel.getStudentsByInternshipID(InternID);
        if (students.length === 0) {
            return res.status(404).send({ message: 'No students found for this internship' });
        }
        res.status(200).send(students);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve students', details: error.message });
    }
};

const saveInternship = async (req, res) => {
    const { National_ID, InternID } = req.body;

    try {
        await applyModel.updateSaveStatus({ National_ID, InternID, save: true });
        res.status(200).send({ message: 'Internship saved successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to save internship', details: error.message });
    }
};

const unsaveInternship = async (req, res) => {
    const { National_ID, InternID } = req.body;

    try {
        await applyModel.updateSaveStatus({ National_ID, InternID, save: false });
        res.status(200).send({ message: 'Internship unsaved successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to unsave internship', details: error.message });
    }
};

const getSavedInternships = async (req, res) => {
    const { National_ID } = req.params; // Assuming National_ID is passed as a URL parameter

    try {
        const internships = await applyModel.getSavedInternships(National_ID);
        if (internships.length === 0) {
            return res.status(404).send({ message: 'No saved internships found for this student' });
        }
        res.status(200).send(internships);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve saved internships', details: error.message });
    }
};


module.exports = {
    applyToInternship,
    getStudentsForInternship,
    saveInternship,
    unsaveInternship,
    getSavedInternships,
};
