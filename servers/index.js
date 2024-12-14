const express = require('express');
require('dotenv').config();
const connectDB = require('../config/db');

const registerRoutes = require('../routes/v1/registerRoutes');
const adminRoutes = require('../routes/v1/adminRoutes');
const hostRoutes = require('../routes/v1/hostRoutes');
const guestRoutes = require('../routes/v1/guestRoutes');

const app = express();
app.use(express.json());    //postmanda body'de JSON formatı ile görüntelemize yarar

//register and login auth/register(or login)
app.use('/api/v1/auth', registerRoutes);

app.use('/api/v1/admin', adminRoutes);

app.use('/api/v1/host', hostRoutes);

app.use('/api/v1/guest', guestRoutes);

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});


connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





