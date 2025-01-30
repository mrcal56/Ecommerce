const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    sizes: [
      {
        size: { type: String, required: true }, // XS, S, M, L, XL, etc.
        stock: { type: Number, required: true, default: 0 }, // Stock de cada talla
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
