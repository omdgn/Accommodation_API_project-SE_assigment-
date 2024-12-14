const Listing = require('../models/Listing');

const insertListingService = async ({ hostId, country, city, maxPeople, pricePerNight, hasBalcony, includesMeals }) => {
    const newListing = await Listing.create({
        hostId,
        country,
        city,
        maxPeople,
        pricePerNight,
        hasBalcony,
        includesMeals,
    });

    return newListing;
};

const deleteListingService = async ({ listingId, hostId }) => {
    // Aitlik kontrolü
    const deletedListing = await Listing.findOneAndDelete({ _id: listingId, hostId });

    if (!deletedListing) {
        throw new Error('The house was not found or you do not have permission.');
    }

    return deletedListing;
};

module.exports = {
    insertListingService,
    deleteListingService,
};
