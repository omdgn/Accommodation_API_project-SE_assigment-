const { insertListingService, deleteListingService } = require('../services/hostService');

// Insert home controller
const insertListing = async (req, res) => {
    const { country, city, maxPeople, pricePerNight, hasBalcony, includesMeals } = req.body;
    const hostId = req.user.id; // Authenticated hostId

    try {
        const newListing = await insertListingService({ hostId, country, city, maxPeople, pricePerNight, hasBalcony, includesMeals });
        res.status(201).json({ success: true, message: 'House added successfully.', data: newListing });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete home controller
const deleteListing = async (req, res) => {
    const { listingId } = req.body;
    const hostId = req.user.id; // Authenticated hostId

    try {
        const deletedListing = await deleteListingService({ listingId, hostId });
        res.status(200).json({ success: true, message: 'The house was deleted successfully.', data: deletedListing });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    insertListing,
    deleteListing,
};
