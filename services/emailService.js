const nodemailer = require('nodemailer');

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'techmate877@gmail.com', // Your email address
        pass: 'dwjq sezh stmu uwqr' // Use the app-specific password generated from Google
    }
});

// Function to send verification email
const sendVerificationEmail = (recipientEmail, token) => {
    const mailOptions = {
        from: 'techmate877@gmail.com',
        to: recipientEmail,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking the following link: 
               <a href="http://yourdomain.com/verify-email?token=${token}">Verify Email</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendVerificationEmail };

