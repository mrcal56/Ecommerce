// src/components/PaymentStatus.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './PaymentStatus.css';
import api from '../services/api';

const statusColors = {
  pending: '#f1c40f',   // amarillo
  paid: '#2ecc71',      // verde
  canceled: '#e74c3c',  // rojo
  shipped: '#3498db',   // azul
};

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const fetchOrder = async (id) => {
    if (!id) {
      setMessage('Ingresa un ID de orden.');
      setOrder(null);
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setOrder(null);

      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'No se encontró la orden o hubo un error.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    fetchOrder(orderId.trim());
  };

  const handlePayClick = async () => {
    if (!order?._id) return;

    try {
      setPaying(true);
      setMessage('');

      const { data } = await api.post(`/orders/${order._id}/pay`, {
        provider: 'mock',
        reference: `WEB-${Date.now()}`,
      });

      setOrder(data);
      setMessage('Pago registrado correctamente ✔');
    } catch (error) {
      console.error('Error paying order:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'No se pudo procesar el pago.';
      setMessage(msg);
    } finally {
      setPaying(false);
    }
  };

  // Si venimos desde el carrito con ?orderId=...
  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : null;

  const statusColor = order?.status
    ? statusColors[order.status] || '#ffffff'
    : '#ffffff';

  return (
    <div className="payment-status-container">
      <h1>Estado de la orden</h1>

      <div className="search-section">
        <label htmlFor="orderId">ID de la orden</label>
        <input
          id="orderId"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Ej. 6659f2b1..."
        />
        <button onClick={handleSearchClick} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {message && <p className="payment-message">{message}</p>}

      {order && (
        <div className="order-details">
          <h2>Orden {order._id}</h2>

          {formattedDate && (
            <p>
              <strong>Fecha de creación:</strong> {formattedDate}
            </p>
          )}

          <p>
            <strong>Estado:</strong>{' '}
            <span style={{ color: statusColor, fontWeight: 'bold' }}>
              {order.status}
            </span>
          </p>

          {order.payment && (
            <>
              <p>
                <strong>Proveedor de pago:</strong> {order.payment.provider}
              </p>
              {order.payment.txnId && (
                <p>
                  <strong>Transacción:</strong> {order.payment.txnId}
                </p>
              )}
              {order.payment.idempotencyKey && (
                <p>
                  <strong>IdempotencyKey:</strong> {order.payment.idempotencyKey}
                </p>
              )}
            </>
          )}

          <p>
            <strong>Subtotal:</strong> $
            {(order.subtotal || 0).toFixed(2)} MXN
          </p>

          <h3>Artículos</h3>
          <ul className="order-items">
            {(order.items || []).map((it, idx) => (
              <li key={idx}>
                <p><strong>{it.name}</strong></p>
                {it.size && <p>Talla: {it.size}</p>}
                <p>Cantidad: {it.qty}</p>
                <p>Precio unitario: ${it.price} MXN</p>
              </li>
            ))}
          </ul>

          {order.shippingAddress && (
            <>
              <h3>Dirección de envío</h3>
              <p>{order.shippingAddress.line1}</p>
              <p>
                {order.shippingAddress.city || 'N/A'},{' '}
                {order.shippingAddress.state || 'N/A'}{' '}
                {order.shippingAddress.zip || 'N/A'}
              </p>
              <p>{order.shippingAddress.country || 'N/A'}</p>
            </>
          )}

          {order.status !== 'paid' && (
            <button
              className="pay-button"
              onClick={handlePayClick}
              disabled={paying}
            >
              {paying ? 'Procesando pago...' : 'Marcar como pagada (mock)'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
