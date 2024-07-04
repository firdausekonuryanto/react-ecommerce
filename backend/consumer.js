// const amqp = require('amqplib/callback_api');
// // Connect to RabbitMQ server
// // amqp.connect('amqp://localhost', (error0, connection) => {
// amqp.connect('amqp://localhost', (error0, connection) => {
//     if (error0) {
//         throw error0;
//     }

//   // Create a channel
// connection.createChannel((error1, channel) => {
//     if (error1) {
//         throw error1;
//     }

// const queue = 'hello';

// // Assert a queue into existence
// channel.assertQueue(queue, {
//     durable: false
// });

// console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

// // Consume messages from the queue
// channel.consume(queue, (msg) => {
//     console.log(" [x] Received %s", msg.content.toString());
// }, {
//     noAck: true
//     });
// });
// });

const amqp = require('amqplib/callback_api');

let messages = [];

// amqp.connect('amqp://localhost', (error0, connection) => {
    amqp.connect('amqp://192.168.1.9', (error0, connection) => {

    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
            messages.push(msg.content.toString());
        }, {
            noAck: true
        });
    });
});

const getMessages = () => messages;

module.exports = { getMessages };
