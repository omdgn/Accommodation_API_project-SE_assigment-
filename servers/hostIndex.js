const express = require('express');
require('dotenv').config();
const connectDB = require('../config/db');
const hostRoutes = require('../routes/v1/hostRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/host', hostRoutes);

connectDB();
const PORT = process.env.HOST_SERVICE_PORT || 3001;
app.listen(PORT, () => console.log(`Host Service running on port ${PORT}`));
