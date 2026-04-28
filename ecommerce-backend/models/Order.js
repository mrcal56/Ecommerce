// Carga Mongoose para definir el esquema
const mongoose = require('mongoose');

// Define el sub-esquema para items dentro de una orden
const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al producto
  name: String,        // Nombre del producto al momento de la compra
  price: Number,       // Precio unitario al momento de la compra
  size: String,        // Talla elegida por el usuario
  qty: { type: Number, min: 1 } // Cantidad mínima uno
}, { _id: false });    // Evita _id por cada item

// Define el esquema de orden
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  items: [itemSchema],          // Arreglo de items comprados
  subtotal: { type: Number, required: true }, // Suma de precios*qty
  status: { type: String, enum: ['pending', 'paid', 'canceled', 'shipped'], default: 'pending' }, // Estado de la orden
  payment: {                    // Información de pago
    provider: { type: String, default: 'mock' }, // Proveedor de pago referencial
    idempotencyKey: String,                       // Clave para evitar pagos duplicados
    txnId: String                                 // ID de transacción si aplica
  },
  shippingAddress: {            // Dirección de envío opcional
    line1: String, city: String, state: String, zip: String, country: String
  }
}, { timestamps: true });

// Exporta el modelo Order
module.exports = mongoose.model('Order', orderSchema);
