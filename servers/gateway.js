const express = require('express');
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

// Auth service
app.use('/api/v1/auth', proxy(`http://localhost:${process.env.AUTH_SERVICE_PORT}`, {
    proxyReqPathResolver: (req) => `/api/v1/auth${req.url}` // Endpoint'i yönlendirme
}));

// Host service
app.use('/api/v1/host', proxy(`http://localhost:${process.env.HOST_SERVICE_PORT}`, {
    proxyReqPathResolver: (req) => `/api/v1/host${req.url}`,
}));

// Guest service
app.use('/api/v1/guest', proxy(`http://localhost:${process.env.GUEST_SERVICE_PORT}`, {
    proxyReqPathResolver: (req) => `/api/v1/guest${req.url}`,
}));

// Admin service
app.use('/api/v1/admin', proxy(`http://localhost:${process.env.ADMIN_SERVICE_PORT}`, {
    proxyReqPathResolver: (req) => `/api/v1/admin${req.url}`,
}));

const PORT = process.env.GATEWAY_PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
