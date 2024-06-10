import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import './Cart.css';

const Cart = () => {
  const { cartItems = [], dispatch } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);

  const removeFromCart = (item) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders/checkout', {
        name,
        lastName,
        email,
        phone,
        address,
        items: cartItems,
      });

      alert('Payment order created successfully!');
      dispatch({ type: 'CHECKOUT' });
      setShowForm(false);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error creating the payment order. Please try again.');
    }
  };

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      setAddress(autocomplete.getPlace().formatted_address);
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
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
          <div className="cart-total">
            <button onClick={() => setShowForm(true)} className="checkout-button">Checkout</button>
          </div>
        </>
      )}

      {showForm && (
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h3>Delivery Information</h3>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              libraries={['places']}
            >
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Autocomplete>
            </LoadScript>
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Cart;
