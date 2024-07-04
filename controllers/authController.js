// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const userModel = require('../models/userModel');
// const mentorModel = require('../models/mentorModel');
// const studentModel = require('../models/studentModel');
// const recruiterModel = require('../models/recruiterModel');

// exports.register = async (req, res) => {
//     const { National_ID, DoB, Email, Password, PhoneNumber, Gender, role,first_name,last_name, ...additionalData } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(Password, 10);
//         await userModel.createUser({
//             National_ID,
//             DoB,
//             Email,
//             Password: hashedPassword,
//             PhoneNumber,
//             Gender,
//             first_name,
//             last_name,
//         });

//         switch (role) {
//             case 'mentor':
//                 await mentorModel.createMentor({ National_ID, ...additionalData });
//                 break;
//             case 'student':
//                 await studentModel.createStudent({ National_ID, ...additionalData });
//                 break;
//             case 'recruiter':
//                 await recruiterModel.createRecruiter({ National_ID, ...additionalData });
//                 break;
//             default:
//                 throw new Error('Invalid role');
//         }

//         res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.login = async (req, res) => {
//     const { Email, Password } = req.body;
//     try {
//         const user = await userModel.findUserByEmail(Email);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         const isMatch = await bcrypt.compare(Password, user.Password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ National_ID: user.National_ID }, 'your_jwt_secret', { expiresIn: '1h' });
//         res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const mentorModel = require('../models/mentorModel');
const studentModel = require('../models/studentModel');
const recruiterModel = require('../models/recruiterModel');
const { sendVerificationEmail } = require('../services/emailService'); // Import the email service

exports.register = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, role, first_name, last_name, ...additionalData } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        await userModel.createUser({
            National_ID,
            DoB,
            Email,
            Password: hashedPassword,
            PhoneNumber,
            Gender,
            first_name,
            last_name,
        });

        switch (role) {
            case 'mentor':
                await mentorModel.createMentor({ National_ID, ...additionalData });
                break;
            case 'student':
                await studentModel.createStudent({ National_ID, ...additionalData });
                break;
            case 'recruiter':
                await recruiterModel.createRecruiter({ National_ID, ...additionalData });
                break;
            default:
                throw new Error('Invalid role');
        }

        // Generate a verification token (this could be a JWT or any other token)
        const verificationToken = jwt.sign({ Email }, 'your_jwt_secret', { expiresIn: '1d' });

        // Send verification email
        console.log('Sending verification email to:', Email);
        sendVerificationEmail(Email, verificationToken);

        res.status(201).json({ message: 'User created successfully. Verification email sent.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await userModel.findUserByEmail(Email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const role = await userModel.findRoleByNationalID(user.National_ID);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const token = jwt.sign({ National_ID: user.National_ID, role: role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, National_ID: user.National_ID, role: role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name, role, ...additionalData } = req.body;
    try {
        const user = await userModel.findUserByNationalID(National_ID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = Password ? await bcrypt.hash(Password, 10) : user.Password;
        const updatedUser = {
            National_ID,
            DoB: DoB || user.DoB,
            Email: Email || user.Email,
            Password: hashedPassword,
            PhoneNumber: PhoneNumber || user.PhoneNumber,
            Gender: Gender || user.Gender,
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name
        };
        const result = await userModel.updateUserProfile(updatedUser);

        if (role) {
            switch (role) {
                case 'mentor':
                    const mentor = { National_ID, ...additionalData };
                    await mentorModel.updateMentor(mentor);
                    break;
                case 'student':
                    const student = { National_ID, ...additionalData };
                    await studentModel.updateStudent(student);
                    break;
                case 'recruiter':
                    const recruiter = { National_ID, ...additionalData };
                    await recruiterModel.updateRecruiter(recruiter);
                    break;
                default:
                    throw new Error('Invalid role');
            }
        }

        if (result) {
            res.status(200).json({ message: 'Profile updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update profile' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserData = async (req, res) => {
    const { National_ID } = req.params;
    try {
        const userData = await userModel.getAllUserDataByNationalID(National_ID);
        if (!userData.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllMentors = async (req, res) => {
    try {
        // Query Mentor table to get all mentors
        const mentors = await mentorModel.getAllMentors();

        // Prepare response with user and mentor details
        const mentorDetails = await Promise.all(mentors.map(async (mentor) => {
            const userData = await userModel.findUserByNationalID(mentor.National_ID);
            return {
                National_ID: mentor.National_ID,
                DoB: userData.DoB,
                Email: userData.Email,
                PhoneNumber: userData.PhoneNumber,
                Gender: userData.Gender,
                role: 'mentor', // Assuming we are sending role as 'mentor' for all mentor requests
                first_name: userData.first_name,
                last_name: userData.last_name,
                JobTitle: mentor.JobTitle,
                No_of_Students: mentor.No_of_Students,
                Price: mentor.Price
            };
        }));

        res.status(200).json(mentorDetails);
    } catch (error) {
        console.error('Error fetching all mentors:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateSkills = async (req, res) => {
    const { nationalId, skills, action } = req.body;

    console.log('Request received:', { nationalId, skills, action }); // Debug log

    try {
        let newSkills;
        const currentSkillsData = await studentModel.getSkillsById(nationalId);
        const currentSkills = currentSkillsData.Skills ? currentSkillsData.Skills.split(', ') : [];

        if (action === 'update' || action === 'delete') {
            // Overwrite the skills list with the new one
            newSkills = skills.join(', ');
        } else if (action === 'insert') {
            newSkills = [...currentSkills, ...skills].filter((skill, index, self) => self.indexOf(skill) === index).join(', ');
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        console.log('Updating skills to:', newSkills); // Debug log

        const result = await studentModel.updateSkills(nationalId, newSkills);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Skills updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating skills:', error); // Debug log
        res.status(500).json({ error: 'Failed to update skills' });
    }
};

exports.updateAreaOfInterest = async (req, res) => {
    const { nationalID, areaOfInterest, action } = req.body;

    console.log('Request received:', { nationalID, areaOfInterest, action }); // Debug log

    try {
        let newAreaOfInterest;
        const currentAreaOfInterestData = await studentModel.getTrackById(nationalID);
        const currentAreaOfInterest = currentAreaOfInterestData.AreaOfInterest ? currentAreaOfInterestData.AreaOfInterest.split(', ') : [];

        if (action === 'update' || action === 'delete') {
            // Overwrite the area of interest list with the new one
            newAreaOfInterest = areaOfInterest.join(', ');
        } else if (action === 'insert') {
            newAreaOfInterest = [...currentAreaOfInterest, ...areaOfInterest].filter((interest, index, self) => self.indexOf(interest) === index).join(', ');
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        console.log('Updating area of interest to:', newAreaOfInterest); // Debug log

        const result = await studentModel.updateTrack(nationalID, newAreaOfInterest);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Area of interest updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating area of interest:', error); // Debug log
        res.status(500).json({ error: 'Failed to update area of interest' });
    }
};




exports.registerMentor = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name, JobTitle, AreaOfInterest, No_of_Students, Price } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        await userModel.createUser({
            National_ID,
            DoB,
            Email,
             // Password: hashedPassword,
             Password,
            PhoneNumber,
            Gender,
            first_name,
            last_name,
        });

        await mentorModel.createMentor({
            National_ID,
            JobTitle,
            AreaOfInterest,
            No_of_Students,
            Price,
        });

        const verificationToken = jwt.sign({ Email }, 'your_jwt_secret', { expiresIn: '1d' });
        console.log('Sending verification email to:', Email);
        sendVerificationEmail(Email, verificationToken);

        res.status(201).json({ message: 'Mentor registered successfully. Verification email sent.' });
    } catch (error) {
        console.error('Error during mentor registration:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.registerRecruiter = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name, Company_Name, JobTitle } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        await userModel.createUser({
            National_ID,
            DoB,
            Email,
             // Password: hashedPassword,
             Password,
            PhoneNumber,
            Gender,
            first_name,
            last_name,
        });

        await recruiterModel.createRecruiter({
            National_ID,
            Company_Name,
            JobTitle,
        });

        const verificationToken = jwt.sign({ Email }, 'your_jwt_secret', { expiresIn: '1d' });
        console.log('Sending verification email to:', Email);
        sendVerificationEmail(Email, verificationToken);

        res.status(201).json({ message: 'Recruiter registered successfully. Verification email sent.' });
    } catch (error) {
        console.error('Error during recruiter registration:', error);
        res.status(400).json({ error: error.message });
    }
};



exports.registerStudent = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name, AreaOfInterest, Skills, Level, University, Faculty, Country, City, ScheduleNational_ID } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        await userModel.createUser({
            National_ID,
            DoB,
            Email,
            // Password: hashedPassword,
            Password,
            PhoneNumber,
            Gender,
            first_name,
            last_name,
        });

        await studentModel.createStudent({
            National_ID,
            AreaOfInterest,
            Skills,
            Level,
            University,
            Faculty,
            Country,
            City,
            ScheduleNational_ID,
        });

        const verificationToken = jwt.sign({ Email }, 'your_jwt_secret', { expiresIn: '1d' });
        console.log('Sending verification email to:', Email);
        sendVerificationEmail(Email, verificationToken);

        res.status(201).json({ message: 'Student registered successfully. Verification email sent.' });
    } catch (error) {
        console.error('Error during student registration:', error);
        res.status(400).json({ error: error.message });
    }
};


exports.updateStudentProfile = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name, ...additionalData } = req.body;
    try {
        const user = await userModel.findUserByNationalID(National_ID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Merge current user data with the new data
        const updatedUser = {
            National_ID: National_ID || user.National_ID,
            DoB: DoB || user.DoB,
            Email: Email || user.Email,
            Password: Password ? await bcrypt.hash(Password, 10) : user.Password,
            PhoneNumber: PhoneNumber || user.PhoneNumber,
            Gender: Gender || user.Gender,
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            ...additionalData
        };

        const result = await userModel.updateUserProfile(updatedUser);

        if (additionalData) {
            const student = { National_ID, ...additionalData };
            await studentModel.updateStudent(student);
        }

        if (result) {
            res.status(200).json({ message: 'Student profile updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update student profile' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateMentorProfile = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name, ...additionalData } = req.body;
    try {
        const user = await userModel.findUserByNationalID(National_ID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = Password ? await bcrypt.hash(Password, 10) : user.Password;
        const updatedUser = {
            National_ID,
            DoB: DoB || user.DoB,
            Email: Email || user.Email,
            Password: hashedPassword,
            PhoneNumber: PhoneNumber || user.PhoneNumber,
            Gender: Gender || user.Gender,
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name
        };
        const result = await userModel.updateUserProfile(updatedUser);

        const mentor = { National_ID, ...additionalData };
        await mentorModel.updateMentor(mentor);

        if (result) {
            res.status(200).json({ message: 'Mentor profile updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update mentor profile' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRecruiterProfile = async (req, res) => {
    const { National_ID, DoB, Email, Password, PhoneNumber, Gender, first_name, last_name, ...additionalData } = req.body;
    try {
        const user = await userModel.findUserByNationalID(National_ID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = Password ? await bcrypt.hash(Password, 10) : user.Password;
        const updatedUser = {
            National_ID,
            DoB: DoB || user.DoB,
            Email: Email || user.Email,
            Password: hashedPassword,
            PhoneNumber: PhoneNumber || user.PhoneNumber,
            Gender: Gender || user.Gender,
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name
        };
        const result = await userModel.updateUserProfile(updatedUser);

        const recruiter = { National_ID, ...additionalData };
        await recruiterModel.updateRecruiter(recruiter);

        if (result) {
            res.status(200).json({ message: 'Recruiter profile updated successfully' });
        } else {
            res.status(400).json({ message: 'Failed to update recruiter profile' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
