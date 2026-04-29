// src/components/ProductList.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useProducts } from '../services/products.query';
import useDebounce from '../hooks/useDebounce';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Skeleton from './Skeleton';

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

  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const qDebounced = useDebounce(q, 400);
  const params = useMemo(() => ({ q: qDebounced || undefined, page, limit }), [qDebounced, page, limit]);

  const { data, isLoading, isError, error } = useProducts(params);

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
      staleTime: 30_000,
    });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e' }}>Productos</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
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
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e' }}>Productos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          No se pudieron cargar los productos.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e' }}>Productos</h1>

      {/* Buscador */}
      <div className="mb-4">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-400 bg-white"
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
        <p className="text-sm text-gray-500 -mt-2 mb-4">
          Mostrando {items.length} de {total}
        </p>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="text-gray-500">No hay productos disponibles.</p>
        ) : (
          items.map((product) => (
            <div
              key={product._id ?? product.id}
              className="relative rounded-[20px] mb-5 transition-all duration-400 cursor-pointer group"
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.05)',
              }}
              onMouseEnter={() => prefetchProduct(product._id ?? product.id)}
            >
              {/* Botón "Agregar al carrito" — aparece en hover */}
              <button
                className="absolute top-4 left-4 z-10 hidden group-hover:block font-semibold px-5 py-2.5 rounded-[20px] cursor-pointer transition-all duration-300 hover:bg-[#1a1a2e] hover:text-white"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  color: '#1a1a2e',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                }}
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>

              {/* Imagen + info — clickeable para ir al detalle */}
              <div onClick={() => viewDetails(product._id ?? product.id)}>
                <img
                  src={product.imageUrl || FALLBACK_IMAGE}
                  alt={product.name || 'Producto'}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  loading="lazy"
                  className="w-full p-2.5 border-b border-black/5 rounded-t-[20px] transition-all duration-400"
                  style={{
                    // En hover el card sube — la imagen sigue dentro
                  }}
                />
                <div className="p-4 text-left">
                  <h5
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e' }}
                  >
                    {product.name ?? 'Producto'}
                  </h5>
                  {product.description && (
                    <p className="text-sm mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#4a4e69' }}>
                      {product.description}
                    </p>
                  )}
                  <p
                    className="text-xl font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', color: '#2a9d8f' }}
                  >
                    {fmtMXN(product.price)} MXN
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center my-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif', background: 'transparent' }}
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif', background: 'transparent' }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}