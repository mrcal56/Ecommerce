import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './FloatingCart.css';

const FloatingCart = ({ onClose }) => {
  const { cartItems, dispatch } = useCart();

  const removeFromCart = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.floating-cart') && !event.target.closest('.add-to-cart-button')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="floating-cart">
      <h4>Shopping Cart</h4>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={`${item._id}-${index}`}>
                <div className="item-details">
                  <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                  <span>{item.name}</span>
                  <span>{item.quantity} x ${item.price} MXN</span>
                </div>
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic cierre la ventana
                    removeFromCart(item);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-subtotal">
            <span>Subtotal: ${subtotal.toFixed(2)} MXN</span>
          </div>
          <button className="checkout-button" onClick={() => window.location.href = '/cart'}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default FloatingCart;
