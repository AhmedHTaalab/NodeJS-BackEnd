// const express = require('express');
// const http = require('http');
// const bodyParser = require('body-parser');
// const WebSocket = require('ws');
// const authRoutes = require('./routes/authRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const groupMessageRoutes = require('./routes/groupMessageRoutes');
// const studentModel = require('./models/studentModel');
// const mentorModel = require('./models/mentorModel');
// const messageModel = require('./models/messageModel');
// const groupMessageModel = require('./models/groupMessageModel');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// app.use(bodyParser.json());

// app.use('/auth', authRoutes);
// app.use('/messages', messageRoutes);
// app.use('/groupMessages', groupMessageRoutes);

// wss.on('connection', (ws) => {
//     ws.on('message', async (message) => {
//         const parsedMessage = JSON.parse(message);
//         const { sender_id, receiver_id, content, type, track } = parsedMessage;

//         if (type === 'direct') {
//             const sender = await studentModel.findUserByNationalID(sender_id) || await mentorModel.findUserByNationalID(sender_id);
//             const receiver = await studentModel.findUserByNationalID(receiver_id) || await mentorModel.findUserByNationalID(receiver_id);

//             if (!sender || !receiver || sender.AreaOfInterest !== receiver.AreaOfInterest) {
//                 ws.send(JSON.stringify({ error: 'Sender and receiver must be in the same track' }));
//                 return;
//             }

//             const message = {
//                 sender_id,
//                 receiver_id,
//                 track: sender.AreaOfInterest,
//                 content,
//                 timestamp: new Date()
//             };

//             await messageModel.createMessage(message);
//         } else if (type === 'group') {
//             const sender = await studentModel.findUserByNationalID(sender_id);

//             if (!sender) {
//                 ws.send(JSON.stringify({ error: 'Sender not found' }));
//                 return;
//             }

//             const message = {
//                 sender_id,
//                 track: sender.AreaOfInterest,
//                 content,
//                 timestamp: new Date()
//             };

//             await groupMessageModel.createGroupMessage(message);
//         }

//         wss.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify(parsedMessage));
//             }
//         });
//     });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// const express = require('express');
// const http = require('http');
// const bodyParser = require('body-parser');
// const WebSocket = require('ws');
// const authRoutes = require('./routes/authRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const groupMessageRoutes = require('./routes/groupMessageRoutes');
// const recommendationRoutes = require('./routes/recommendationRoutes');
// const studentModel = require('./models/studentModel');
// const mentorModel = require('./models/mentorModel');
// const messageModel = require('./models/messageModel');
// const groupMessageModel = require('./models/groupMessageModel');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// app.use(bodyParser.json());

// app.use('/auth', authRoutes);
// app.use('/messages', messageRoutes);
// app.use('/groupMessages', groupMessageRoutes);
// app.use('/recommend', recommendationRoutes);

// wss.on('connection', (ws) => {
//     ws.on('message', async (message) => {
//         const parsedMessage = JSON.parse(message);
//         const { sender_id, receiver_id, content, type, track } = parsedMessage;

//         if (type === 'direct') {
//             const sender = await studentModel.findUserByNationalID(sender_id) || await mentorModel.findUserByNationalID(sender_id);
//             const receiver = await studentModel.findUserByNationalID(receiver_id) || await mentorModel.findUserByNationalID(receiver_id);

//             if (!sender || !receiver || sender.AreaOfInterest !== receiver.AreaOfInterest) {
//                 ws.send(JSON.stringify({ error: 'Sender and receiver must be in the same track' }));
//                 return;
//             }

//             const message = {
//                 sender_id,
//                 receiver_id,
//                 track: sender.AreaOfInterest,
//                 content,
//                 timestamp: new Date()
//             };

//             await messageModel.createMessage(message);
//         } else if (type === 'group') {
//             const sender = await studentModel.findUserByNationalID(sender_id);

//             if (!sender) {
//                 ws.send(JSON.stringify({ error: 'Sender not found' }));
//                 return;
//             }

//             const message = {
//                 sender_id,
//                 track: sender.AreaOfInterest,
//                 content,
//                 timestamp: new Date()
//             };

//             await groupMessageModel.createGroupMessage(message);
//         }

//         wss.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify(parsedMessage));
//             }
//         });
//     });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupMessageRoutes = require('./routes/groupMessageRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const internshipRecommendationRoutes = require('./routes/internshipRecommendationRoutes'); // Import the new internship recommendation routes
const internshipSearchRoutes = require('./routes/internshipSearchRoutes'); // Import the new internship search routes
const studentModel = require('./models/studentModel');
const mentorModel = require('./models/mentorModel');
const messageModel = require('./models/messageModel');
const groupMessageModel = require('./models/groupMessageModel');
const recruiterRoutes = require('./routes/recruiterRoutes'); // Import the new recruiter routes
const applyRoutes = require('./routes/applyRoutes'); // Make sure the path is correct
const enrollRoutes = require('./routes/enrollRoutes'); // Adjust the path as necessary
const paymentRoutes = require('./routes/paymentsRoutes'); // Ensure this path is correct
const takesRoutes = require('./routes/takesRoutes'); // Ensure this path is correct
const internshipRoutes = require('./routes/internshipRoutes'); // Import the new internship routes
const courseRoutes = require('./routes/courseRoutes'); // Import the new course routes
const mentorSearchRoutes = require('./routes/mentorSearchRoutes');
const userImageRoutes = require('./routes/userImageRoutes');
const userPdfRoutes = require('./routes/userPdfRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const meetingRoutes = require('./routes/meetingRoutes')
const studentRoutes = require('./routes/studentRoutes');

const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);


// const wss = new WebSocket.Server({ server });
app.use(bodyParser.json());
app.use(express.json());

app.use('/recruiter', recruiterRoutes);
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);
app.use('/groupMessages', groupMessageRoutes);
app.use('/recommend', recommendationRoutes);
app.use('/courses', searchRoutes);
app.use('/internships/recommend', internshipRecommendationRoutes); // Add the new internship recommendation route
app.use('/internships', internshipSearchRoutes); // Add the new internship search route
app.use('/apply', applyRoutes);
app.use('/enrollments', enrollRoutes);
app.use('/payments', paymentRoutes); // Add the payment routes
app.use('/takes', takesRoutes); // Add the takes routes
app.use('/internships', internshipRoutes); // Add the new internship routes
app.use('/courses', courseRoutes); // Add the new course routes
app.use('/mentors', mentorSearchRoutes);
app.use('/userImages', userImageRoutes);
app.use('/userPdfs', userPdfRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', bookingRoutes);
app.use('/auth', meetingRoutes);
app.use('/student', studentRoutes);




const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for join room event
    socket.on('joinRoom', async (track) => {
        socket.join(track);
        const messages = await groupMessageModel.getGroupMessages(track);
        socket.emit('initialMessages', messages);
    });

    // Listen for new message event
    socket.on('sendMessage', async (message) => {
        await groupMessageModel.createGroupMessage(message);
        io.to(message.track).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// wss.on('connection', (ws) => {
//     ws.on('message', async (message) => {
//         const parsedMessage = JSON.parse(message);
//         const { sender_id, receiver_id, content, type, track } = parsedMessage;

//         if (type === 'direct') {
//             const sender = await studentModel.findUserByNationalID(sender_id) || await mentorModel.findUserByNationalID(sender_id);
//             const receiver = await studentModel.findUserByNationalID(receiver_id) || await mentorModel.findUserByNationalID(receiver_id);

//             if (!sender || !receiver || sender.AreaOfInterest !== receiver.AreaOfInterest) {
//                 ws.send(JSON.stringify({ error: 'Sender and receiver must be in the same track' }));
//                 return;
//             }

//             const directMessage = {
//                 sender_id,
//                 receiver_id,
//                 track: sender.AreaOfInterest,
//                 content,
//                 timestamp: new Date()
//             };

//             await messageModel.createMessage(directMessage);
//             parsedMessage.timestamp = directMessage.timestamp; // Add timestamp to the parsed message
//         } else if (type === 'group') {
//             const sender = await studentModel.findUserByNationalID(sender_id);

//             if (!sender) {
//                 ws.send(JSON.stringify({ error: 'Sender not found' }));
//                 return;
//             }

//             const groupMessage = {
//                 sender_id,
//                 track: track,
//                 content,
//                 timestamp: new Date()
//             };

//             // Log before creating group message
//             console.log('Creating group message:', groupMessage);

//             await groupMessageModel.createGroupMessage(groupMessage);

//             // Log after creating group message
//             console.log('Group message created:', groupMessage);

//             // Add timestamp to the parsed message
//             parsedMessage.timestamp = groupMessage.timestamp;
//         }

//         // Ensure the message is broadcasted only once
//         const broadcastMessage = JSON.stringify(parsedMessage);

//         wss.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(broadcastMessage);
//             }
//         });
//     });
// });


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

