import React from 'react';

const Cart = () => {
  // Simulación de productos en el carrito
  const cartItems = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    { id: 2, name: 'Product 2', price: 50, quantity: 1 },
  ];

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      <ul className="list-group">
        {cartItems.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            {item.name} (x{item.quantity})
            <span>${item.price * item.quantity}</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-3">Total: ${totalPrice}</h3>
      <button className="btn btn-primary mt-3">Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
