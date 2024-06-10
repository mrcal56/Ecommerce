// models/PaymentOrder.js
const mongoose = require('mongoose');

const paymentOrderSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'expired'],
    default: 'pending',
  },
  paymentId: {
    type: String,
    required: true,
  },
});

const PaymentOrder = mongoose.model('PaymentOrder', paymentOrderSchema);

module.exports = PaymentOrder;
