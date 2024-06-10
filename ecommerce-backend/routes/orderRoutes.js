const express = require('express');
const router = express.Router();
const PaymentOrder = require('../models/PaymentOrder');

router.post('/checkout', async (req, res) => {
  const { name, lastName, email, phone, address, items } = req.body;

  const paymentId = `PAY-${Date.now()}`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const paymentOrders = items.map(item => ({
    product: item.name,
    creationDate: new Date(),
    dueDate,
    price: item.price,
    status: 'pending',
    paymentId,
  }));

  try {
    await PaymentOrder.insertMany(paymentOrders);
    res.status(200).json({ message: 'Payment order created successfully', paymentId });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

router.get('/orders/:paymentId', async (req, res) => {
  try {
    const orders = await PaymentOrder.find({ paymentId: req.params.paymentId });
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Payment order not found' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching payment order:', error);
    res.status(500).json({ message: 'Error fetching payment order' });
  }
});

module.exports = router;
