// Importamos mongoose
const mongoose = require('mongoose');

// Definimos el esquema para los pedidos
const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    },
  ],
  totalPrice: { type: Number, required: true },
});

// Creamos el modelo de pedido basado en el esquema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
