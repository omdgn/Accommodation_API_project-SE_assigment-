const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const { applyPagination } = require('../utils/pagination'); 

// Hostların evlerini listeleme servisi
const listHostListingsService = async (page, limit) => {
    const hosts = await User.find({ role: 'Host' }).select('_id username email');

    // Listing sorgusuna paging uygula
    const query = Listing.find({ hostId: { $in: hosts.map((host) => host._id) } }).select(
        'hostId country city pricePerNight averageRating'
    );

    const paginatedListings = await applyPagination(query, page, limit);
    const totalCount = await Listing.countDocuments({ hostId: { $in: hosts.map((host) => host._id) } });

    return { hosts, listings: paginatedListings, totalCount };
};

// 3 kez 1 yıldız alan evleri silme servisi
const deleteLowRatedListingsService = async () => {
    const lowRatedListings = await Review.aggregate([
        { $match: { rating: 1 } }, // Sadece 1 yıldız puanlar
        { $group: { _id: '$listingId', count: { $sum: 1 } } }, // listingId'ye göre grupla ve say
        { $match: { count: { $gte: 3 } } } // En az 3 kez 1 yıldız alanlar
    ]);

    if (!lowRatedListings || lowRatedListings.length === 0) {
        throw new Error('No low rated homes found to delete.');
    }

    const deleteResults = await Listing.deleteMany({ _id: { $in: lowRatedListings.map((listing) => listing._id) } });

    if (deleteResults.deletedCount === 0) {
        throw new Error('Deletion failed.');
    }

    return deleteResults.deletedCount;
};

module.exports = {
    listHostListingsService,
    deleteLowRatedListingsService,
};
