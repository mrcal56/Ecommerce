import React, { createContext, useReducer, useContext } from 'react';

// Crear contexto del carrito
const CartContext = createContext();

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item._id === action.payload._id);
      if (existingItem) {
        // Incrementar la cantidad si el producto ya está en el carrito
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          total: state.total + action.payload.price,
        };
      } else {
        // Añadir el producto al carrito si no está presente
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price,
        };
      }
    case 'REMOVE_FROM_CART':
      const itemToRemove = state.cartItems.find(item => item._id === action.payload._id);
      if (itemToRemove.quantity === 1) {
        // Eliminar el producto del carrito si su cantidad es 1
        const updatedCartItems = state.cartItems.filter(item => item._id !== action.payload._id);
        return {
          ...state,
          cartItems: updatedCartItems,
          total: state.total - action.payload.price,
        };
      } else {
        // Reducir la cantidad del producto en el carrito
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item._id === action.payload._id ? { ...item, quantity: item.quantity - 1 } : item
          ),
          total: state.total - action.payload.price,
        };
      }
    case 'CHECKOUT':
      // Vaciar el carrito en el checkout
      return {
        ...state,
        cartItems: [],
        total: 0,
      };
    default:
      return state;
  }
};

// Proveedor del contexto del carrito
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

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
  return useContext(CartContext);
};
