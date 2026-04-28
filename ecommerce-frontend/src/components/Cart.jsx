import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";
import api from "../services/api";

const Cart = () => {
  const { cartItems = [], dispatch } = useCart();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || item.qty || 1),
    0
  );

  const removeFromCart = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const handleCheckoutClick = () => {
    if (!cartItems.length) {
      setMessage("Tu carrito está vacío.");
      return;
    }
    setShowForm(true);
    setMessage("");
  };

  const buildItemsPayload = () =>
    cartItems.map((item) => {
      // Intentamos obtener el ID real de producto
      const productId =
        item.product ||
        item._id ||
        (typeof item.id === "string" ? item.id.split("-")[0] : item.id);

      const qty = item.quantity || item.qty || 1;

      return {
        product: productId,
        qty,
        size: item.size || null,
      };
    });

  const handleMercadoPagoCheckout = async () => {
    try {
      setSubmitting(true);
      setMessage("");

      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");

      if (!token) {
        setMessage("Debes iniciar sesión para pagar con Mercado Pago.");
        setSubmitting(false);
        return;
      }

      if (!cartItems.length) {
        setMessage("Tu carrito está vacío.");
        setSubmitting(false);
        return;
      }

      // 🔹 Reutilizamos la misma lógica de items
      const items = buildItemsPayload();

      // 🔹 Usamos los mismos datos de envío que en handleSubmitOrder
      const shippingAddress = {
        line1: address,
        line2: `${name} ${lastName}`.trim(),
        city: "N/A",
        state: "N/A",
        zip: "N/A",
        country: "MX",
      };

      const idempotencyKey = `mp-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;

      // 1) Crear la orden en tu backend
      const { data: order } = await api.post(
        "/orders",
        { items, shippingAddress, idempotencyKey },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2) Crear preferencia de Mercado Pago para esa orden
      const { data: pref } = await api.post(
        "/payments/mercadopago/preference",
        { orderId: order._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 3) Redirigir al checkout de Mercado Pago
      if (pref.init_point) {
        window.location.href = pref.init_point;
      } else {
        setMessage("No se pudo obtener la URL de pago de Mercado Pago.");
      }
    } catch (error) {
      console.error("Error en checkout con Mercado Pago:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo iniciar el pago con Mercado Pago.";
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      if (!cartItems.length) {
        setMessage("Tu carrito está vacío.");
        setSubmitting(false);
        return;
      }

      const items = buildItemsPayload();
      const idempotencyKey = `order-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;

      // Dirección simplificada (puedes mapearla mejor si quieres)
      const shippingAddress = {
        line1: address,
        line2: `${name} ${lastName}`.trim(),
        city: "N/A",
        state: "N/A",
        zip: "N/A",
        country: "MX",
      };

      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");

      const { data: order } = await api.post(
        "/orders",
        { items, shippingAddress, idempotencyKey },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Orden creada correctamente.");
      clearCart();
      // Podrías pasar el ID de la orden a payment-status via querystring:
      navigate(`/order-success?orderId=${order._id}`);
    } catch (error) {
      console.error("Error creando la orden:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Error creando la orden";
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-container">
      <h1>Carrito</h1>

      {message && <p className="cart-message">{message}</p>}

      {!cartItems.length ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id || item._id} className="cart-item">
                <div className="cart-item-info">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  )}
                  <div>
                    <h4>{item.name}</h4>
                    {item.size && <p>Talla: {item.size}</p>}
                    <p>Cantidad: {item.quantity || item.qty || 1}</p>
                    <p>Precio: ${item.price} MXN</p>
                  </div>
                </div>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <span>Subtotal: ${subtotal.toFixed(2)} MXN</span>
          </div>

          {!showForm && (
            <button className="checkout-button" onClick={handleCheckoutClick}>
              Proceder al pago
            </button>
          )}

          {showForm && (
            <form className="checkout-form" onSubmit={handleSubmitOrder}>
              <h2>Datos de envío</h2>

              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Apellidos</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Calle, número, colonia..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Creando orden..."
                    : "Confirmar orden (sin pago en línea)"}
                </button>

                <button
                  type="button"
                  className="submit-button"
                  disabled={submitting}
                  onClick={handleMercadoPagoCheckout}
                >
                  {submitting ? "Redirigiendo..." : "Pagar con Mercado Pago"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
