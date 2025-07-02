const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  buttonText: { type: String, default: 'Shop Now' },
  buttonLink: { type: String, default: '/products' },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 1, min: 1, max: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', AdvertisementSchema);