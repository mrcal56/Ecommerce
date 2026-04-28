import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MyOrders.css';

const statusLabels = {
  pending: 'Pendiente',
  paid: 'Pagada',
  canceled: 'Cancelada',
  shipped: 'Enviada',
};

const statusColors = {
  pending: '#ffc107',
  paid: '#28a745',
  canceled: '#dc3545',
  shipped: '#17a2b8',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setMessage('');

      const token =
        localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        setMessage('Debes iniciar sesión para ver tus órdenes.');
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data } = await api.get('/orders/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(Array.isArray(data) ? data : []);
      if (!data || data.length === 0) {
        setMessage('Aún no tienes órdenes.');
      }
    } catch (error) {
      console.error('Error fetching my orders:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Error obteniendo tus órdenes.';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/payment-status?orderId=${orderId}`);
  };

  // 🔹 Aplica filtro por estado
  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="my-orders-container">
      <h1>Mis órdenes</h1>

      {/* Filtros */}
      <div className="my-orders-filters">
        <label htmlFor="statusFilter">Estado:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="paid">Pagadas</option>
          <option value="canceled">Canceladas</option>
          <option value="shipped">Enviadas</option>
        </select>
      </div>

      {loading && <p>Cargando órdenes...</p>}
      {message && !loading && <p className="my-orders-message">{message}</p>}

      {!loading && filteredOrders.length > 0 && (
        <div className="my-orders-table-wrapper">
          <table className="my-orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Artículos</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                const itemsCount = (o.items || []).reduce(
                  (acc, it) => acc + (it.qty || 0),
                  0
                );
                const label = statusLabels[o.status] || o.status;
                const color = statusColors[o.status] || '#ffffff';

                return (
                  <tr key={o._id}>
                    <td className="my-orders-id">{o._id}</td>
                    <td>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : 'N/D'}
                    </td>
                    <td>
                      <span style={{ color, fontWeight: 'bold' }}>{label}</span>
                    </td>
                    <td>{itemsCount}</td>
                    <td>${(o.subtotal || 0).toFixed(2)} MXN</td>
                    <td>
                      <button
                        className="my-orders-details-btn"
                        onClick={() => handleViewDetails(o._id)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
