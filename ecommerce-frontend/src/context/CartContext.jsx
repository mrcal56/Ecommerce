import React, { createContext, useReducer, useContext } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  total: 0,
  totalItems: 0,
};

function recalcTotals(cartItems) {
  const total = cartItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 0),
    0
  );
  const totalItems = cartItems.reduce(
    (acc, it) => acc + (it.quantity || 0),
    0
  );
  return { total, totalItems };
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const payload = action.payload || {};

      // Normalizamos el payload desde ProductDetail o ProductList
      const productId =
        payload.productId || payload.product || payload._id || null;

      if (!productId) return state;

      const size = payload.size || null;
      const baseId = String(productId);
      const id = payload.id || (size ? `${baseId}-${size}` : baseId);
      const name = payload.name || payload.title || 'Producto';
      const price = Number(payload.price) || 0;
      const imageUrl = payload.imageUrl || payload.image || null;
      const quantityToAdd = Number(
        payload.quantity != null ? payload.quantity : 1
      );

      const existing = state.cartItems.find((it) => it.id === id);

      let cartItems;
      if (existing) {
        cartItems = state.cartItems.map((it) =>
          it.id === id
            ? { ...it, quantity: it.quantity + quantityToAdd }
            : it
        );
      } else {
        const newItem = {
          id,
          product: productId,
          name,
          price,
          size,
          quantity: quantityToAdd,
          imageUrl,
        };
        cartItems = [...state.cartItems, newItem];
      }

      const { total, totalItems } = recalcTotals(cartItems);
      return { ...state, cartItems, total, totalItems };
    }

    case 'REMOVE_FROM_CART': {
      const p = action.payload || {};
      // Puede venir todo el objeto o solo el id
      const id =
        p.id || p._id || p.productId || p.product || p || null;
      if (!id) return state;

      const cartItems = state.cartItems.filter((it) => it.id !== String(id));
      const { total, totalItems } = recalcTotals(cartItems);
      return { ...state, cartItems, total, totalItems };
    }

    case 'CLEAR_CART':
    case 'CHECKOUT': {
      return { ...state, cartItems: [], total: 0, totalItems: 0 };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
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

export const useCart = () => useContext(CartContext);
