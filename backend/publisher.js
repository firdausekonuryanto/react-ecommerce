const amqp = require('amqplib/callback_api');
const WebSocket = require('ws');
const queue = 'hello';
const wsPort = 5001; // WebSocket server port

// WebSocket client setup
const websocket = new WebSocket(`ws://localhost:${wsPort}`);

// When WebSocket connection is established
websocket.on('open', () => {
    console.log('WebSocket Client Connected');
});

// When WebSocket connection is closed
websocket.on('close', () => {
    console.log('WebSocket Client Disconnected');
});

amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(queue, {
            durable: false
        });

        const msg = `Message sent from publisher.js at :  ${new Date().toLocaleTimeString()}`;
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent '%s'", msg);
        
        websocket.send(msg);

        // Close connection after sending the message
        setTimeout(() => {
            connection.close();
            console.log(`Closed RabbitMQ connection after sending one message.`);
            process.exit(0);
        }, 500); // Wait for 500 milliseconds before closing (adjust as needed)
    });
});
