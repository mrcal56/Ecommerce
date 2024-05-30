const mongoose = require('mongoose');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

// Crear el modelo de producto basado en el esquema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
