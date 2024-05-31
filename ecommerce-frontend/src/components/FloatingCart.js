import React from 'react';
import { useCart } from '../context/CartContext';
import './FloatingCart.css';

const FloatingCart = () => {
  const { cartItems = [], dispatch } = useCart();

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  return (
    <div className="floating-cart">
      <h5>Cart</h5>
      <ul>
        {cartItems.map(item => (
          <li key={item._id}>
            <img src={item.imageUrl} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>${item.price} MXN</p>
              <button onClick={() => removeFromCart(item)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <strong>Total:</strong> ${cartItems.reduce((total, item) => total + item.price, 0)} MXN
      </div>
      <button className="btn btn-primary">Checkout</button>
    </div>
  );
};

export default FloatingCart;
