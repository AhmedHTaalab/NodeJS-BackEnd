const eventEmitter = require('./eventEmitter');
const { wss } = require('../server'); // Import the WebSocket server instance

eventEmitter.on('notification', (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
});
