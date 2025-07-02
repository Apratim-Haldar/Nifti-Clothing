const mongoose = require('mongoose');

const ColorImageSchema = new mongoose.Schema({
  color: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: [{ type: String, required: true }],
  colors: [{ type: String }],
  colorImages: [ColorImageSchema],
  defaultColor: { type: String },
  imageUrl: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  gender: { type: String, required: true, enum: ['Men', 'Women', 'Unisex'] },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  isHero: { type: Boolean, default: false },
  heroImage: { type: String },
  heroTagline: { type: String }
}, { timestamps: true });

// Virtual field for stock status
ProductSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= this.lowStockThreshold) return 'Low Stock';
  return 'In Stock';
});

// Virtual field for low stock warning
ProductSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// Virtual field to get the display image for default color
ProductSchema.virtual('displayImage').get(function() {
  if (this.defaultColor && this.colorImages.length > 0) {
    const colorImage = this.colorImages.find(
      img => img.color.toLowerCase() === this.defaultColor.toLowerCase()
    );
    return colorImage ? colorImage.imageUrl : this.imageUrl;
  }
  return this.imageUrl;
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
