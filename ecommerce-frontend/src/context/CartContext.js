import React, { createContext, useReducer, useContext } from 'react';

// Crear contexto del carrito
const CartContext = createContext();


// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { _id, size, price, quantity } = action.payload;
      
      const existingItem = state.cartItems.find(
        item => item._id === _id && item.size === size
      );

      if (existingItem) {
        // Incrementa la cantidad si el producto y talla ya están en el carrito
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item._id === _id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          total: state.total + price * quantity,
          totalItems: state.totalItems + quantity, // Incrementa el total de productos
        };
      } else {
        // Agrega un nuevo producto con talla diferente
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload}],
          total: state.total + price * quantity,
          totalItems: state.totalItems + quantity, // Incrementa el total de productos
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const { _id, size, price } = action.payload;
      
      const itemToRemove = state.cartItems.find(
        item => item._id === _id && item.size === size
      );

      if (!itemToRemove) return state; // Si no existe, no hacer nada

      if (itemToRemove.quantity === 1) {
        // Si solo hay una unidad, se elimina del carrito
        return {
          ...state,
          cartItems: state.cartItems.filter(
            item => !(item._id === _id && item.size === size)
          ),
          total: state.total - price,
          totalItems: state.totalItems - 1, // 🔹 Restamos correctamente la cantidad

        };
      } else {
        // Reduce la cantidad del producto con la talla específica
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item._id === _id && item.size === size
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          total: state.total - price,
          totalItems: state.totalItems - 1, // Reduce el total de productos

        };
      }
    }

    case 'CHECKOUT':
      // Vaciar el carrito en el checkout
      return {
        ...state,
        cartItems: [],
        total: 0,
        totalItems: 0, // 
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
    totalItems: 0,
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
