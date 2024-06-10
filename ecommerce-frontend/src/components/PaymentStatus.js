import React, { useState } from 'react';
import axios from 'axios';
import './PaymentStatus.css';

const PaymentStatus = () => {
  const [paymentId, setPaymentId] = useState('');
  const [orders, setOrders] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${paymentId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching payment order:', error);
      alert('Error fetching payment order');
    }
  };

  return (
    <div className="payment-status-container">
      <h2>Check Payment Status</h2>
      <input
        type="text"
        placeholder="Enter Payment ID"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {orders.length > 0 && (
        <div className="order-details">
          <h3>Payment Details</h3>
          <ul>
            {orders.map(order => (
              <li key={order._id}>
                <p>Product: {order.product}</p>
                <p>Price: ${order.price} MXN</p>
                <p>Creation Date: {new Date(order.creationDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(order.dueDate).toLocaleDateString()}</p>
                <p>Status: {order.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
