import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct, usePatchSize } from '../services/products.query.js';
import { useAuth } from '../context/AuthContext'; 
import './ProductDetail.css';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
      <rect width="100%" height="100%" fill="#e0e0e0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial" font-size="28" fill="#555">Producto</text>
    </svg>
  `);

const fmtMXN = (v) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v || 0);

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { user } = useAuth?.() || {};               
  const isAdmin = user?.role === 'admin';               

  const { data: product, isLoading, isError } = useProduct(id);
  const sizes = useMemo(() => product?.sizes ?? [], [product]);

  const patchSize = usePatchSize();

  // Estado UI (selección de talla / cantidad)
  const [selectedSize, setSelectedSize] = useState(null);
  const [stockAvailable, setStockAvailable] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (sizes.length > 0) {
      const available = sizes.find((s) => (s?.stock ?? 0) > 0) || sizes[0];
      setSelectedSize(available?.size ?? null);
      setStockAvailable(Math.max(0, available?.stock ?? 0));
      setQuantity(available?.stock > 0 ? 1 : 0);
    } else {
      setSelectedSize(null);
      setStockAvailable(0);
      setQuantity(0);
    }
  }, [sizes]);

  const handleSizeSelection = (size, stock) => {
    setSelectedSize(size);
    setStockAvailable(stock);
    setQuantity(stock > 0 ? 1 : 0);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) return alert('Selecciona una talla antes de agregar al carrito.');
    if (stockAvailable <= 0) return alert('Esta talla está agotada.');
    if (quantity <= 0) return alert('La cantidad debe ser al menos 1.');

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: `${product._id}-${selectedSize}`,
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: selectedSize,
        quantity
      }
    });
  };

  // Admin: handlers para +/-
  const incSize = (size) => patchSize.mutate({ id: product._id, size, delta: +1 });
  const decSize = (size) => patchSize.mutate({ id: product._id, size, delta: -1 });

  if (isLoading) return <div className="product-detail-container">Cargando…</div>;
  if (isError || !product) return <div className="product-detail-container">Producto no encontrado.</div>;

  return (
    <div className="product-detail-container">
      {/* Izquierda: Título, Descripción y Precio */}
      <div className="product-detail-left">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">Precio: {fmtMXN(product.price)}</p>
        {product.description && <p className="product-description">{product.description}</p>}
      </div>

      {/* Centro: Imagen del Producto */}
      <div className="product-detail-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
      </div>

      <div className="product-detail-right">
        <div className="size-selector">
          <h4>Talla</h4>
          <div className="sizes">
            {sizes.length > 0 ? (
              sizes.map(({ size, stock }) => {
                const selected = selectedSize === size;
                return (
                  <div key={size} className="d-flex align-items-center gap-2 mb-2">
                    <button
                      className={`size-button ${selected ? 'active' : ''} ${stock === 0 ? 'out-of-stock' : ''}`}
                      onClick={() => handleSizeSelection(size, stock)}
                      disabled={stock === 0}
                      aria-pressed={selected}
                      aria-label={`Talla ${size}${stock === 0 ? ' agotada' : ''}`}
                    >
                      {size} {stock === 0 && ' (Agotado)'}
                    </button>

                    {/* Controles visibles solo para admin */}
                    {isAdmin && (
                      <div className="btn-group btn-group-sm" role="group" aria-label={`Ajustar stock talla ${size}`}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => decSize(size)}
                          disabled={patchSize.isPending}
                          title="Disminuir stock"
                        >
                          −
                        </button>
                        <span style={{ minWidth: 36, textAlign: 'center' }}>
                          {stock}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => incSize(size)}
                          disabled={patchSize.isPending}
                          title="Aumentar stock"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No hay tallas disponibles</p>
            )}
          </div>
        </div>

        {/* Cantidad (limitada por stock de la talla seleccionada) */}
        <div className="quantity-selector">
          <h4>Cantidad</h4>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              className="quantity-button"
              disabled={stockAvailable <= 1 || quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < stockAvailable ? prev + 1 : prev))}
              className="quantity-button"
              disabled={quantity >= stockAvailable}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
          {selectedSize && (
            <small className="text-muted">Stock disponible para {selectedSize}: {stockAvailable}</small>
          )}
        </div>

        <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={!selectedSize || stockAvailable === 0 || quantity <= 0}
        >
          {stockAvailable > 0 ? 'Añadir al carrito' : 'Agotado'}
        </button>
      </div>
    </div>
  );
}
