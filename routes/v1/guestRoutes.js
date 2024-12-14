const express = require('express');
const { queryListings, bookStay, updateBookingStatus, deleteBooking, reviewStay } = require('../../controllers/guestController');
const { authenticateUser, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

// Listeleme sorgusu
router.get('/querylistings', queryListings);

// Rezervasyon yapma
router.post('/bookings', authenticateUser, authorizeRoles('Guest'), bookStay);

//Check işlemi
router.put('/bookingstatus', authenticateUser, authorizeRoles('Guest'), updateBookingStatus);

// Rezervasyon silme
router.delete('/deletebookings', authenticateUser, authorizeRoles('Guest'), deleteBooking);

// Yorum yapma
router.post('/reviews', authenticateUser, authorizeRoles('Guest'), reviewStay);

module.exports = router;
