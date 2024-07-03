const internshipModel = require('../models/internshipModel');
const studentModel = require('../models/studentModel');

// Helper function to create a word vector
const createWordVector = (text, vocabulary) => {
    if (!text) return new Array(vocabulary.length).fill(0);
    const words = text.split(' ');
    const vector = new Array(vocabulary.length).fill(0);
    words.forEach(word => {
        const index = vocabulary.indexOf(word);
        if (index !== -1) {
            vector[index] += 1;
        }
    });
    return vector;
};

// Function to build a vocabulary from student and internship attributes
const buildVocabulary = (student, internships) => {
    const vocabulary = new Set();
    if (student.AreaOfInterest) {
        student.AreaOfInterest.split(',').forEach(word => vocabulary.add(word));
    }
    internships.forEach(internship => {
        if (internship.InternTitle) {
            internship.InternTitle.split(' ').forEach(word => vocabulary.add(word));
        }
    });
    return Array.from(vocabulary);
};

// Function to vectorize student profile
const vectorizeStudentProfile = (student, vocabulary) => {
    const areaOfInterestVector = createWordVector(student.AreaOfInterest, vocabulary);
    const cityVector = createWordVector(student.City, vocabulary);
    const countryVector = createWordVector(student.Country, vocabulary);
    return [...areaOfInterestVector, ...cityVector, ...countryVector];
};

// Function to vectorize internship
const vectorizeInternship = (internship, vocabulary) => {
    const internTitleVector = createWordVector(internship.InternTitle, vocabulary);
    const cityVector = createWordVector(internship.City, vocabulary);
    const countryVector = createWordVector(internship.Country, vocabulary);
    return [...internTitleVector, ...cityVector, ...countryVector];
};

const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((acc, val, idx) => acc + val * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

const recommendInternships = async (student_id) => {
    const student = await studentModel.findUserByNationalID(student_id);
    if (!student) throw new Error('Student not found');

    const allInternships = await internshipModel.getAllInternships();

    const vocabulary = buildVocabulary(student, allInternships);

    const studentVector = vectorizeStudentProfile(student, vocabulary);

    const recommendations = allInternships.map(internship => {
        const internshipVector = vectorizeInternship(internship, vocabulary);
        const similarity = cosineSimilarity(studentVector, internshipVector);
        return { internship, similarity };
    });

    recommendations.sort((a, b) => b.similarity - a.similarity);

    return recommendations.map(recommendation => recommendation.internship).slice(0, 5);
};

module.exports = {
    recommendInternships,
};
