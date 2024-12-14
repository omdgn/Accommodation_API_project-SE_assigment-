const express = require('express');
const { listHostListings, deleteLowRatedListings } = require('../../controllers/adminController');
const { authenticateUser, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

// Hostların evlerini listeleme rotası
router.get('/listings', authenticateUser, authorizeRoles('Admin'), listHostListings);

// Düşük puanlı evleri silme rotası
router.delete('/low-rated-listings', deleteLowRatedListings);

module.exports = router;
