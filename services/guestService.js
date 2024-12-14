const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const calculateAverageRating = require('../utils/calculateAverageRating');
const { applyPagination } = require('../utils/pagination');
const { sendToQueue } = require('../config/rabbitmq');

// Listeleme sorgusu
const queryListingsService = async ({
    country,
    city,
    maxPeople,
    dateFrom,
    dateTo,
    pricePerNight,
    hasBalcony,
    includesMeals,
    averageRating,
    page,
    limit,
}) => {
    const bookedListings = await Booking.find({
        $or: [
            { dateFrom: { $lte: dateTo }, dateTo: { $gte: dateFrom } }, // Çakışan tarihler
        ],
    }).select('listingId');

    const query = {
        country,
        city,
        maxPeople: { $gte: maxPeople },
        _id: { $nin: bookedListings.map((b) => b.listingId) },
    };

    if (pricePerNight) query.pricePerNight = { $lte: pricePerNight };
    if (hasBalcony !== undefined) query.hasBalcony = hasBalcony;
    if (includesMeals !== undefined) query.includesMeals = includesMeals;
    if (averageRating) query.averageRating = { $gte: averageRating };

    const listingsQuery = Listing.find(query).select(
        'country city maxPeople pricePerNight hasBalcony includesMeals averageRating'
    );

    const listings = await applyPagination(listingsQuery, page, limit);
    const totalCount = await Listing.countDocuments(query);

    return { listings, totalCount };
};


// Rezervasyon yapma servisi
const bookStayService = async ({ listingId, guestId, dateFrom, dateTo, numberOfPeople, guestNames, userEmail  }) => {
    const listing = await Listing.findById(listingId);
    if (!listing) {
        throw new Error('Ev bulunamadi.');
    }

    if (numberOfPeople > listing.maxPeople) {
        throw new Error('Ev kapasitesinden fazla kişi rezerve edemezsiniz.');
    }

    const newBooking = await Booking.create({
        listingId,
        guestId,
        dateFrom,
        dateTo,
        numberOfPeople,
        guestNames,
        isCancelled: false,
        checkStatus: 'Pending'
    });

    // Ödeme mesajını RabbitMQ kuyruğuna gönder
    const paymentPayload = {
        bookingId: newBooking._id,
        amount: listing.pricePerNight * numberOfPeople,
        userEmail, // Kullanıcı e-postası
        paymentType: 'credit', // Varsayılan olarak kredi kartı
    };
    sendToQueue(process.env.PAYMENT_QUEUE, paymentPayload);

    console.log('Payment message sent to queue:', paymentPayload);

    return newBooking;
};

// Rezervasyon silme servisi
const deleteBookingService = async ({ bookingId, guestId, userEmail }) => {
    const booking = await Booking.findOneAndDelete({ _id: bookingId, guestId });
    if (!booking) {
        throw new Error('Rezervasyon bulunamadi veya silme yetkiniz yok.');
    }

    const listing = await Listing.findById(booking.listingId);
    if (!listing) {
        throw new Error('İlgili ev bilgisi bulunamadi.');
    }

    // İade mesajını RabbitMQ kuyruğuna gönder
    const refundPayload = {
        bookingId: booking._id,
        amount: listing.pricePerNight * booking.numberOfPeople,
        userEmail, // Kullanıcı e-postası
        refundReason: 'Rezervasyon iptali nedeniyle iade.', 
    };
    sendToQueue(process.env.REFUND_QUEUE, refundPayload);

    console.log('Refund message sent to queue:', refundPayload);

    return { 
        message: 'Rezervasyon başariyla silindi. İade işlemi başlatildi.', 
        refundDetails: refundPayload 
    };
};



const updateBookingStatusService = async ({ bookingId, guestId, newStatus }) => {
    const booking = await Booking.findOne({ _id: bookingId, guestId });
    if (!booking) {
        throw new Error('Rezervasyon bulunamadi veya yetkiniz yok.');
    }

    if (!['Positive', 'Negative'].includes(newStatus)) {
        throw new Error('Geçersiz check durumu.');
    }

    if (newStatus === 'Negative') {
        // Eğer durum Negative olarak değiştirildiyse, rezervasyonu sil
        await Booking.findByIdAndDelete(bookingId);
        return { message: 'Rezervasyon iptal edildi ve silindi.' };
    }

    // Durumu Positive olarak güncelle
    booking.checkStatus = newStatus;
    await booking.save();
    return booking;
};


// Yorum yapma ve puan verme servisi
const reviewStayService = async ({ bookingId, guestId, rating, comment }) => {
    const booking = await Booking.findOne({ _id: bookingId, guestId, checkStatus: 'Positive' });
    if (!booking) {
        throw new Error('Rezervasyon bulunamadi veya yorum yapma yetkiniz yok.');
    }

    const newReview = await Review.create({
        bookingId,
        guestId,
        listingId: booking.listingId,
        rating,
        comment
    });

    // Ortalama puanı güncelle
    const listingReviews = await Review.find({ listingId: booking.listingId });
    const averageRating = calculateAverageRating(listingReviews.map((r) => r.rating));
    await Listing.findByIdAndUpdate(booking.listingId, { averageRating });

    return newReview;
};

module.exports = {
    queryListingsService,
    bookStayService,
    deleteBookingService,
    reviewStayService,
    updateBookingStatusService
};
