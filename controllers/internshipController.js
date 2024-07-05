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

const searchInternshipsByTitle = async (req, res) => {
    try {
        const { title, national_id } = req.query;

        if (!national_id) {
            return res.status(400).json({ error: 'National ID is required' });
        }

        let internships;
        if (!title) {
            internships = await internshipModel.getAllInternshipsByRecruiter(national_id);
        } else {
            internships = await internshipModel.searchInternshipsByTitleAndRecruiter(title, national_id);
        }

        res.json(internships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// const searchInternships = async (req, res) => {
//     const { InternTitle, City, Country, Paid, CompanyName } = req.query;
//     console.log(`Received search request with criteria:`, req.query);

//     try {
//         // Get all internships from the database
//         const allInternships = await internshipModel.getAllInternships();
//         console.log('All Internships:', allInternships);

//         // Filter internships based on provided criteria
//         const filteredInternships = allInternships.filter(internship => {
//             const internTitleMatches = InternTitle ? internship.InternTitle.toLowerCase().includes(InternTitle.toLowerCase()) : true;
//             const cityMatches = City ? internship.City.toLowerCase().includes(City.toLowerCase()) : true;
//             const countryMatches = Country ? internship.Country.toLowerCase().includes(Country.toLowerCase()) : true;
//             const paidMatches = Paid ? internship.Paid.toString().toLowerCase() === Paid.toString().toLowerCase() : true;
//             const companyMatches = CompanyName ? internship.CompanyName.toLowerCase().includes(CompanyName.toLowerCase()) : true;

//             return internTitleMatches && cityMatches && countryMatches && paidMatches && companyMatches;
//         });

//         console.log('Filtered Internships:', filteredInternships);
//         res.status(200).json(filteredInternships);
//     } catch (error) {
//         console.error('Error in searchInternships:', error);
//         res.status(500).json({ error: error.message });
//     }
// };




module.exports = {
    getInternshipByID,
    deleteInternship,
    deleteInternshipReruiter,
    searchInternshipsByTitle,

};
