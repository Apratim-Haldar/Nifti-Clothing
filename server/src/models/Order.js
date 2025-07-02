const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    default: function() {
      // Generate a unique order number
      return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalAmount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bank_transfer', 'upi', 'card'],
    default: 'cash_on_delivery'
  },
  notes: { type: String }
}, { 
  timestamps: true 
});

// Pre-save hook to ensure unique order number
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    let orderNumber;
    let exists = true;
    
    // Keep generating until we get a unique one
    while (exists) {
      orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
      exists = await mongoose.model('Order').findOne({ orderNumber });
    }
    
    this.orderNumber = orderNumber;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);