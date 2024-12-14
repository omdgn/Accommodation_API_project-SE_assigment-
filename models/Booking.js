const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({

  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },

  dateFrom: { type: Date, required: true },

  dateTo: { type: Date, required: true },

  numberOfPeople: { type: Number, required: true },

  guestNames: { type: [String], required: true },

  isCancelled: { type: Boolean, default: false },

  checkStatus: { type: String, default: 'Pending', enum: ['Pending', 'Positive', 'Negative'] }

}, { timestamps: true }); //created-updated times

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
