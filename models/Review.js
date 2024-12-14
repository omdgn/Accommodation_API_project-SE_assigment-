const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Rezervasyon ID
  
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Guest ID
  
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, // Ev ID
  
  rating: { type: Number, required: true, min: 1, max: 10 }, // Puan (1-5 arasında)
  
  comment: { type: String, required: true }, // Kullanıcı yorumu
  
  createdAt: { type: Date, default: Date.now } // Yorum tarihi
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
