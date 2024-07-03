const courseModel = require('../models/courseModel');

const searchCourses = async (req, res) => {
    const { CourseName, TrackType, Duration, Provider, RoadMap } = req.query;
    console.log(`Received search request with criteria:`, req.query);

    try {
        // Get all courses from the database
        const allCourses = await courseModel.getAllCourses();
        console.log('All Courses:', allCourses);

        // Filter courses based on provided criteria
        const filteredCourses = allCourses.filter(course => {
            const courseNameMatches = CourseName ? course.CourseName.toLowerCase().includes(CourseName.toLowerCase()) : true;
            const trackTypeMatches = TrackType ? course.TrackType.toLowerCase().includes(TrackType.toLowerCase()) : true;
            const durationMatches = Duration ? course.Duration.toLowerCase().includes(Duration.toLowerCase()) : true;
            const providerMatches = Provider ? course.Provider.toLowerCase().includes(Provider.toLowerCase()) : true;
            const roadmapMatches = RoadMap ? course.RoadMap.toLowerCase().includes(RoadMap.toLowerCase()) : true;

            return courseNameMatches && trackTypeMatches && durationMatches && providerMatches && roadmapMatches;
        });

        console.log('Filtered Courses:', filteredCourses);
        res.status(200).json(filteredCourses);
    } catch (error) {
        console.error('Error in searchCourses:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    searchCourses,
};
