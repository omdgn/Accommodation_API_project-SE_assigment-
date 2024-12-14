const { listHostListingsService, deleteLowRatedListingsService } = require('../services/adminService');

// Hostların evlerini listeleme
const listHostListings = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; 
    try {
        const data = await listHostListingsService(Number(page), Number(limit));
        res.status(200).json({
            success: true,
            message: 'Hosts homes were listed successfully.',
            data: data.listings,
            total: data.totalCount,
            page: Number(page),
            limit: Number(limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3 kez 1 yıldız alan evleri silme
const deleteLowRatedListings = async (req, res) => {
    try {
        const deletedCount = await deleteLowRatedListingsService();
        res.status(200).json({ success: true, message: `${deletedCount} House/s with low scores were deleted.` });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    listHostListings,
    deleteLowRatedListings,
};
