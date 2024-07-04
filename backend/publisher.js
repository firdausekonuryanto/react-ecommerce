const amqp = require('amqplib/callback_api');

// Connect to RabbitMQ server
// amqp.connect('amqp://localhost', (error0, connection) => {
  amqp.connect('amqp://192.168.1.9', (error0, connection) => {

  if (error0) {
    throw error0;
  }

  // Create a channel
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = 'hello';
    const msg = 'Hello World!';

    // Assert a queue into existence
    channel.assertQueue(queue, {
      durable: false
    });

    // Send a message to the queue
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  // Close the connection and exit
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});
