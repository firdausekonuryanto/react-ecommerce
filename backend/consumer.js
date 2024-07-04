const amqp = require('amqplib/callback_api');

let messages = [];
const username = 'userx';
const password = 'aka';
const connectionString = `amqp://${username}:${password}@192.168.1.9`;

amqp.connect(connectionString, (error0, connection) => {
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
