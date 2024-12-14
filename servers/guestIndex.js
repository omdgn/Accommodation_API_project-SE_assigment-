const express = require('express');
require('dotenv').config();
const connectDB = require('../config/db');
const guestRoutes = require('../routes/v1/guestRoutes');
const { connectRabbitMQ, startNotificationConsumer } = require('../config/rabbitmq');

const app = express();
app.use(express.json());
app.use('/api/v1/guest', guestRoutes);

// RabbitMQ bağlantısını başlat
connectRabbitMQ()
    .then(() => {
        console.log('RabbitMQ bağlantısı başarıyla sağlandı.');
        startNotificationConsumer(); // Notification Consumer'ı başlat
    })
    .catch((error) => {
        console.error('RabbitMQ bağlantısı başarısız:', error);
        process.exit(1); // Hata durumunda uygulamayı durdur
    });

connectDB();
const PORT = process.env.GUEST_SERVICE_PORT || 3002;
app.listen(PORT, () => console.log(`Guest Service running on port ${PORT}`));
