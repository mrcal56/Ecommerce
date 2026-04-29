// src/components/ProductList.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useProducts } from '../services/products.query';
import useDebounce from '../hooks/useDebounce';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Skeleton from './Skeleton';
import './ProductList.css';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
      <rect width="100%" height="100%" fill="#e0e0e0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="28" fill="#555">Producto</text>
    </svg>
  `);

const fmtMXN = (v) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v || 0);

export default function ProductList({ onAddToCart }) {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const qc = useQueryClient();

  // estado de filtros
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const qDebounced = useDebounce(q, 400);
  const params = useMemo(() => ({ q: qDebounced || undefined, page, limit }), [qDebounced, page, limit]);

  const { data, isLoading, isError, error } = useProducts(params);

  // Normaliza defensivamente
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  const total = Number.isFinite(data?.total) ? data.total : items.length;
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    onAddToCart?.();
  };

  const viewDetails = (id) => navigate(`/product/${id}`);

  const prefetchProduct = (id) =>
    qc.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
      staleTime: 30_000
    });

  if (isLoading) {
    return (
      <div className="container">
        <h1>Productos</h1>
        <div className="grid-auto" style={{ marginTop: 12 }}>
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} h={220} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('ProductList error:', error);
    return (
      <div className="container">
        <h1>Productos</h1>
        <div className="alert alert-danger">No se pudieron cargar los productos.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Productos</h1>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Buscar productos…"
          aria-label="Buscar productos"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {total > 0 && (
        <p style={{ marginTop: -8, color: '#666' }}>
          Mostrando {items.length} de {total}
        </p>
      )}

      <div className="row">
        {items.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          items.map((product) => (
            <div key={product._id ?? product.id} className="col-md-4">
              <div
                className="card mb-4"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => prefetchProduct(product._id ?? product.id)}
              >
                <div onClick={() => viewDetails(product._id ?? product.id)}>
                  <img
                    src={product.imageUrl || FALLBACK_IMAGE}
                    className="card-img-top"
                    alt={product.name || 'Producto'}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    loading="lazy"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name ?? 'Producto'}</h5>
                    {product.description && <p className="card-text">{product.description}</p>}
                    <p className="card-text">{fmtMXN(product.price)} MXN</p>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => addToCart(product)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center my-3">
          <button
            className="btn btn-outline-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
