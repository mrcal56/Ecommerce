import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts, usePatchSize } from '../../services/products.query.js';
import useDebounce from '../../hooks/useDebounce';
import api from '../../services/api';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
      <rect width="100%" height="100%" fill="#e0e0e0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="16" fill="#555">Producto</text>
    </svg>
  `);

const fmtMXN = (v) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v || 0);

export default function AdminSizeManager() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const qDebounced = useDebounce(q, 400);

  const params = useMemo(() => {
    const p = { page, limit };
    if (qDebounced) p.q = qDebounced;
    if (category) p.category = category;
    return p;
  }, [page, limit, qDebounced, category]);

  const { data, isLoading, isFetching } = useProducts(params);
  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  // Mutación optimista por talla
  const patchSize = usePatchSize();

  // Prefetch detalle para mejorar UX al pasar el mouse
  const prefetchProduct = (id) =>
    qc.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => api.get(`/products/${id}`).then((r) => r.data),
      staleTime: 30_000
    });

  return (
    <div className="container py-3">
      <h2 className="mb-3">Administración de Stock por Talla</h2>

      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-4">
          <label className="form-label">Buscar</label>
          <input
            className="form-control"
            placeholder="Nombre / descripción / sku"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            aria-label="Buscar productos"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Categoría</label>
          <input
            className="form-control"
            placeholder="Ej: Calzado, Playera…"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrar por categoría"
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Resultados</label>
          <div className="form-control-plaintext">
            {isFetching ? 'Actualizando…' : `${items.length} / ${total}`}
          </div>
        </div>

        <div className="col-md-3 text-end">
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente →
            </button>
          </div>
          <div className="small mt-1">Página {page} de {totalPages}</div>
        </div>
      </div>

      {isLoading ? (
        <p>Cargando…</p>
      ) : items.length === 0 ? (
        <div className="alert alert-info">No hay productos que coincidan con los filtros.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th style={{ width: 64 }}></th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Tallas (stock con +/−)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <AdminRow
                  key={p._id}
                  product={p}
                  patchSize={patchSize}
                  prefetch={() => prefetchProduct(p._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminRow({ product, patchSize, prefetch }) {
  // Edición masiva: delta para aplicar a todas las tallas
  const [bulkDelta, setBulkDelta] = useState(0);

  const sizes = Array.isArray(product?.sizes) ? product.sizes : [];

  const applyBulk = () => {
    const delta = Number(bulkDelta) || 0;
    if (delta === 0) return;
    // Aplica la mutación por cada talla
    sizes.forEach((s) => {
      patchSize.mutate({ id: product._id, size: s.size, delta });
    });
    setBulkDelta(0);
  };

  const onInc = (size) => patchSize.mutate({ id: product._id, size, delta: +1 });
  const onDec = (size) => patchSize.mutate({ id: product._id, size, delta: -1 });

  return (
    <tr onMouseEnter={prefetch}>
      <td>
        <img
          src={product.imageUrl || FALLBACK_IMAGE}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          alt={product.name}
          width={64}
          height={64}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          loading="lazy"
        />
      </td>
      <td>
        <div className="fw-semibold">{product.name}</div>
        <div className="text-muted small">{product.description?.slice(0, 80)}</div>
      </td>
      <td>{fmtMXN(product.price)}</td>
      <td>{product.category || '-'}</td>
      <td>
        {sizes.length === 0 ? (
          <span className="badge bg-secondary">Sin tallas</span>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {sizes.map(({ size, stock }) => (
              <SizePill
                key={size}
                size={size}
                stock={stock}
                onInc={() => onInc(size)}
                onDec={() => onDec(size)}
                pending={patchSize.isPending}
              />
            ))}
          </div>
        )}
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Δ"
            style={{ width: 90 }}
            value={bulkDelta}
            onChange={(e) => setBulkDelta(e.target.value)}
          />
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={applyBulk}
            disabled={patchSize.isPending || sizes.length === 0}
            title="Aplicar Δ a todas las tallas"
          >
            Aplicar Δ
          </button>
        </div>
      </td>
    </tr>
  );
}

function SizePill({ size, stock, onInc, onDec, pending }) {
  return (
    <div className="d-inline-flex align-items-center border rounded-pill px-2 py-1">
      <span className="me-2"><strong>{size}</strong></span>
      <div className="btn-group btn-group-sm" role="group" aria-label={`Ajustar stock talla ${size}`}>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onDec}
          disabled={pending}
          title="Disminuir stock"
        >
          −
        </button>
        <span style={{ minWidth: 36, textAlign: 'center' }}>{stock}</span>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onInc}
          disabled={pending}
          title="Aumentar stock"
        >
          +
        </button>
      </div>
    </div>
  );
}
