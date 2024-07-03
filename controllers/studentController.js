const studentModel = require('../models/studentModel');

const searchStudent = async (req, res) => {
    try {
        const { firstName, lastName } = req.query;
        if (!firstName) {
            return res.status(400).send({ error: 'First name is required.' });
        }
        const students = await studentModel.searchStudentByFullName(firstName, lastName);
        if (students.length === 0) {
            return res.status(404).send({ message: 'Student not found.' });
        }
        res.status(200).send(students);
    } catch (error) {
        console.error('Error searching for student:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
};

module.exports = {
    searchStudent,
};
