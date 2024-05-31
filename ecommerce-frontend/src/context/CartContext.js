import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_FROM_CART':
      const updatedCartItems = state.cartItems.filter(item => item._id !== action.payload._id);
      return {
        ...state,
        cartItems: updatedCartItems,
        total: state.total - action.payload.price,
      };
    case 'CHECKOUT':
      return {
        ...state,
        cartItems: [],
        total: 0,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const initialState = {
    cartItems: [],
    total: 0,
  };
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const checkout = () => {
    dispatch({ type: 'CHECKOUT' });
  };

  return (
    <CartContext.Provider value={{ ...state, dispatch, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
