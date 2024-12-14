const amqp = require('amqplib');

let channel; // Kanal referansı
let connection; // Bağlantı referansı

// RabbitMQ bağlantısını başlatır ve kuyrukları oluşturur
const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
    channel = await connection.createChannel();

    // Kuyrukları oluştur
    await channel.assertQueue(process.env.PAYMENT_QUEUE, { durable: true });
    await channel.assertQueue(process.env.REFUND_QUEUE, { durable: true });
    await channel.assertQueue(process.env.NOTIFICATION_QUEUE, { durable: true });

    console.log('RabbitMQ Connected and Queues Initialized');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

// Kanalın mevcut olduğunu doğrular ve döndürür
const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

// Mesaj gönderme fonksiyonu
const sendToQueue = (queueName, message) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
};

// RabbitMQ bağlantısını kapatır
const closeRabbitMQ = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('RabbitMQ Connection Closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
};

const consumeFromQueue = async (queueName, processMessage) => {
  if (!channel) {
      throw new Error('RabbitMQ bağlantisi hazir değil.');
  }

  await channel.consume(queueName, async (message) => {
      if (message !== null) {
          console.log(`Message received from ${queueName}:`, message.content.toString());
          await processMessage(JSON.parse(message.content.toString()));
          channel.ack(message);
      }
  });
};

const processNotification = async (notification) => {
  console.log(`Sending email to ${notification.userEmail}...`);
  console.log(`Email content: Payment successful. Detaylar: ${JSON.stringify(notification)}`);
  // Burada gerçek bir e-posta gönderim servisi entegre edilebilir.
};

const startNotificationConsumer = async () => {
  await consumeFromQueue(process.env.NOTIFICATION_QUEUE, processNotification);
};

module.exports = {
  connectRabbitMQ,
  getChannel,
  sendToQueue,
  consumeFromQueue,
  startNotificationConsumer,
};

