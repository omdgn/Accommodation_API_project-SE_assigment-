const express = require('express');
const { insertListing, deleteListing } = require('../../controllers/hostController');
const { authenticateUser, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

// Insert home 
router.post('/listings', authenticateUser, authorizeRoles('Host'), insertListing);

// Delete home 
router.delete('/listingsdelete', authenticateUser, authorizeRoles('Host'), deleteListing);

module.exports = router;
