import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const updatedCartItems = [...state.cartItems, action.payload];
      const updatedTotal = updatedCartItems.reduce((total, item) => total + item.price, 0);
      return {
        ...state,
        cartItems: updatedCartItems,
        total: updatedTotal,
      };
    case 'REMOVE_FROM_CART':
      const filteredCartItems = state.cartItems.filter(item => item._id !== action.payload._id);
      const newTotal = filteredCartItems.reduce((total, item) => total + item.price, 0);
      return {
        ...state,
        cartItems: filteredCartItems,
        total: newTotal,
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const checkout = () => {
    alert('Proceeding to checkout...');
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, dispatch, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
