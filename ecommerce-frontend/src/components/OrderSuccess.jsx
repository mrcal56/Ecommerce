import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setMessage('No se encontró el ID de la orden en la URL.');
        return;
      }
      try {
        const token =
          localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (!token) {
          setMessage('Debes iniciar sesión para ver la orden.');
          return;
        }

        const { data } = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(data);
        setMessage('');
      } catch (error) {
        console.error('Error obteniendo la orden en OrderSuccess:', error);
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'No se pudo obtener la orden.';
        setMessage(msg);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="order-success-icon">🎉</div>
        <h1>¡Gracias por tu compra!</h1>

        {message && <p className="order-success-message">{message}</p>}

        {order && (
          <>
            <p>
              Tu número de orden es:
              <br />
              <span className="order-success-id">{order._id}</span>
            </p>

            <p>
              <strong>Estado:</strong> {order.status}
            </p>

            <p>
              <strong>Total:</strong> $
              {(order.subtotal || 0).toFixed(2)} MXN
            </p>

            <h3>Resumen de artículos</h3>
            <ul className="order-success-items">
              {order.items?.map((it, idx) => (
                <li key={idx}>
                  <span className="item-name">{it.name}</span>
                  {it.size && <span className="item-size">Talla: {it.size}</span>}
                  <span className="item-qty">x{it.qty}</span>
                  <span className="item-price">
                    ${it.price} MXN
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="order-success-actions">
          <button onClick={() => navigate('/')}>Seguir comprando</button>
          {orderId && (
            <>
              <button
                onClick={() =>
                  navigate(`/payment-status?orderId=${orderId}`)
                }
              >
                Ver estado de pago
              </button>
              <button onClick={() => navigate('/my-orders')}>
                Ver mis órdenes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
