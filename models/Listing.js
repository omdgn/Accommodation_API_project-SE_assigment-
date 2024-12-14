const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  country: { type: String, required: true },

  city: { type: String, required: true },

  maxPeople: { type: Number, required: true },

  pricePerNight: { type: Number, required: true },

  hasBalcony: { type: Boolean, default: false },

  includesMeals: { type: Boolean, default: false },

  averageRating: { type: Number, default: 0 }

}, { timestamps: true }); //created-updated times

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;
