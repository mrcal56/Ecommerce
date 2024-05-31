import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems = [], dispatch } = useCart();

  const removeFromCart = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item._id} className="cart-item">
                <div className="cart-item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${item.price} MXN</span>
                  <button onClick={() => removeFromCart(item)} className="remove-button">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Cart;
