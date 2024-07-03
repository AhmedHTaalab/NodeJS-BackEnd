//utils/recommendations.js

const courseModel = require('../models/courseModel');
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

// Function to build a vocabulary from student and course attributes
const buildVocabulary = (student, courses) => {
    const vocabulary = new Set();
    if (student.AreaOfInterest) {
        student.AreaOfInterest.split(',').forEach(word => vocabulary.add(word));
    }
    if (student.Skills) {
        student.Skills.split(',').forEach(word => vocabulary.add(word));
    }
    courses.forEach(course => {
        if (course.CourseName) {
            course.CourseName.split(' ').forEach(word => vocabulary.add(word));
        }
        if (course.TrackType) {
            course.TrackType.split(' ').forEach(word => vocabulary.add(word));
        }
    });
    return Array.from(vocabulary);
};

// Function to vectorize student profile
const vectorizeStudentProfile = (student, vocabulary) => {
    const areaOfInterestVector = createWordVector(student.AreaOfInterest, vocabulary);
    const skillsVector = createWordVector(student.Skills, vocabulary);
    return [...areaOfInterestVector, ...skillsVector];
};

// Function to vectorize course
const vectorizeCourse = (course, vocabulary) => {
    const courseNameVector = createWordVector(course.CourseName, vocabulary);
    const trackTypeVector = createWordVector(course.TrackType, vocabulary);
    return [...courseNameVector, ...trackTypeVector];
};

const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((acc, val, idx) => acc + val * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

const recommendCourses = async (student_id) => {
    const student = await studentModel.findUserByNationalID(student_id);
    if (!student) throw new Error('Student not found');

    const allCourses = await courseModel.getAllCourses();

    const vocabulary = buildVocabulary(student, allCourses);

    const studentVector = vectorizeStudentProfile(student, vocabulary);

    const recommendations = allCourses.map(course => {
        const courseVector = vectorizeCourse(course, vocabulary);
        const similarity = cosineSimilarity(studentVector, courseVector);
        return { course, similarity };
    });

    recommendations.sort((a, b) => b.similarity - a.similarity);

    return recommendations.map(recommendation => recommendation.course).slice(0, 5);
};

module.exports = {
    recommendCourses,
};
