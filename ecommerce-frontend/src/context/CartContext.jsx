import React, { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'cart_items';

const initialState = {
  cartItems: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
  total: 0,
  totalItems: 0,
};

function recalcTotals(cartItems) {
  const total = cartItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (it.quantity || 0), 0
  );
  const totalItems = cartItems.reduce(
    (acc, it) => acc + (it.quantity || 0), 0
  );
  return { total, totalItems };
}

// Recalcula los totales del estado inicial al cargar desde localStorage
initialState.total = recalcTotals(initialState.cartItems).total;
initialState.totalItems = recalcTotals(initialState.cartItems).totalItems;

const cartReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_TO_CART': {
      const payload = action.payload || {};
      const productId = payload.productId || payload.product || payload._id || null;
      if (!productId) return state;

      const size = payload.size || null;
      const baseId = String(productId);
      const id = payload.id || (size ? `${baseId}-${size}` : baseId);
      const name = payload.name || payload.title || 'Producto';
      const price = Number(payload.price) || 0;
      const imageUrl = payload.imageUrl || payload.image || null;
      const quantityToAdd = Number(payload.quantity != null ? payload.quantity : 1);

      const existing = state.cartItems.find((it) => it.id === id);
      const cartItems = existing
        ? state.cartItems.map((it) =>
            it.id === id ? { ...it, quantity: it.quantity + quantityToAdd } : it
          )
        : [...state.cartItems, { id, product: productId, name, price, size, quantity: quantityToAdd, imageUrl }];

      const { total, totalItems } = recalcTotals(cartItems);
      return { ...state, cartItems, total, totalItems };
    }

    // ← NUEVO: actualizar cantidad directamente
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload || {};
      if (!id || quantity < 1) return state;

      const cartItems = state.cartItems.map((it) =>
        it.id === String(id) ? { ...it, quantity: Number(quantity) } : it
      );
      const { total, totalItems } = recalcTotals(cartItems);
      return { ...state, cartItems, total, totalItems };
    }

    case 'REMOVE_FROM_CART': {
      const p = action.payload || {};
      const id = p.id || p._id || p.productId || p.product || p || null;
      if (!id) return state;

      const cartItems = state.cartItems.filter((it) => it.id !== String(id));
      const { total, totalItems } = recalcTotals(cartItems);
      return { ...state, cartItems, total, totalItems };
    }

    case 'CLEAR_CART':
    case 'CHECKOUT':
      return { ...state, cartItems: [], total: 0, totalItems: 0 };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ← Sincroniza con localStorage en cada cambio del carrito
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const checkout = () => dispatch({ type: 'CHECKOUT' });

  return (
    <CartContext.Provider value={{ ...state, dispatch, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);