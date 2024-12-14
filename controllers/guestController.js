const {
    queryListingsService,
    bookStayService,
    deleteBookingService,
    reviewStayService,
    updateBookingStatusService 

} = require('../services/guestService');

// Listeleme sorgusu
const queryListings = async (req, res) => {
    const {
        country,
        city,
        maxPeople,
        dateFrom,
        dateTo,
        pricePerNight,
        hasBalcony,
        includesMeals,
        averageRating,
    } = req.query;
    const { page = 1, limit = 10 } = req.query; 

    try {
        const data = await queryListingsService({
            country,
            city,
            maxPeople,
            dateFrom,
            dateTo,
            pricePerNight,
            hasBalcony,
            includesMeals,
            averageRating,
            page: Number(page),
            limit: Number(limit),
        });
        res.status(200).json({
            success: true,
            message: 'Evler basariyle listelendi.',
            data: data.listings,
            total: data.totalCount,
            page: Number(page),
            limit: Number(limit),
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Rezervasyon yapma
const bookStay = async (req, res) => {
    const { listingId, dateFrom, dateTo, numberOfPeople, guestNames } = req.body;
    const guestId = req.user.id; // Authenticated user ID

    try {
        const newBooking = await bookStayService({ listingId, guestId, dateFrom, dateTo, numberOfPeople, guestNames, userEmail: req.user.email });
        res.status(201).json({ success: true, message: 'Rezervasyon basariyle tamamlandi.', data: newBooking });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    const { bookingId, guestId, newStatus } = req.body;

    try {
        const result = await updateBookingStatusService({ bookingId, guestId, newStatus });
        res.status(200).json({ success: true, message: 'Rezervasyon durumu basariyle güncellendi.', data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Rezervasyon silme
const deleteBooking = async (req, res) => {
    const { bookingId } = req.body;
    const guestId = req.user.id; // Kullanıcının kimliği
    const userEmail = req.user.email; // Kullanıcının e-posta adresi

    try {
        const deletedBooking = await deleteBookingService({ bookingId, guestId, userEmail });
        res.status(200).json({ 
            success: true, 
            message: 'Rezervasyon basariyle silindi. İade işlemi başlatildi.', 
            data: deletedBooking 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: `Rezervasyon silinirken bir hata oluştu: ${error.message}` 
        });
    }
};


// Yorum yapma
const reviewStay = async (req, res) => {
    const { bookingId, guestId, rating, comment } = req.body;

    try {
        const newReview = await reviewStayService({ bookingId, guestId, rating, comment });
        res.status(201).json({ success: true, message: 'Yorum basariyle eklendi.', data: newReview });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    queryListings,
    bookStay,
    deleteBooking,
    reviewStay,
    updateBookingStatus
};
