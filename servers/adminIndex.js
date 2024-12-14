const express = require('express');
require('dotenv').config();
const connectDB = require('../config/db');
const adminRoutes = require('../routes/v1/adminRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/admin', adminRoutes);

connectDB();
const PORT = process.env.ADMIN_SERVICE_PORT || 3003;
app.listen(PORT, () => console.log(`Admin Service running on port ${PORT}`));
