const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, lowercase: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, index: true },
  sizes: [{
    size: { type: String, required: true, trim: true },
    stock: { type: Number, default: 0, min: 0 }
  }],
  status: { type: String, enum: ['active', 'hidden', 'archived'], default: 'active', index: true }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
