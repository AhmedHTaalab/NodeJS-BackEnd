const internshipModel = require('../models/internshipModel');

const searchInternships = async (req, res) => {
    const { InternTitle, City, Country, Paid, CompanyName } = req.query;
    console.log(`Received search request with criteria:`, req.query);

    try {
        // Get all internships from the database
        const allInternships = await internshipModel.getAllInternships();
        console.log('All Internships:', allInternships);

        // Filter internships based on provided criteria
        const filteredInternships = allInternships.filter(internship => {
            const internTitleMatches = InternTitle ? internship.InternTitle.toLowerCase().includes(InternTitle.toLowerCase()) : true;
            const cityMatches = City ? internship.City.toLowerCase().includes(City.toLowerCase()) : true;
            const countryMatches = Country ? internship.Country.toLowerCase().includes(Country.toLowerCase()) : true;
            const paidMatches = Paid ? internship.Paid.toString().toLowerCase() === Paid.toString().toLowerCase() : true;
            const companyMatches = CompanyName ? internship.CompanyName.toLowerCase().includes(CompanyName.toLowerCase()) : true;

            return internTitleMatches && cityMatches && countryMatches && paidMatches && companyMatches;
        });

        console.log('Filtered Internships:', filteredInternships);
        res.status(200).json(filteredInternships);
    } catch (error) {
        console.error('Error in searchInternships:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    searchInternships,
};
