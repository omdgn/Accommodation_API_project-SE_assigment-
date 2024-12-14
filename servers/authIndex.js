const express = require('express');
require('dotenv').config();
const connectDB = require('../config/db');
const registerRoutes = require('../routes/v1/registerRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/auth', registerRoutes);

connectDB();
const PORT = process.env.AUTH_SERVICE_PORT || 3004;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
