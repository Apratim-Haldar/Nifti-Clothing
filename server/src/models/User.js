const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isFirstLogin: { type: Boolean, default: true },
  affiliateCode: { type: String, unique: true, sparse: true },
  referredBy: { type: String },
  cart: [CartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);