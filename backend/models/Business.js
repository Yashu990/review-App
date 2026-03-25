const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  googleReviewLink: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logo: { type: String, default: '' }, // Stores Base64 Image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Business', BusinessSchema);
