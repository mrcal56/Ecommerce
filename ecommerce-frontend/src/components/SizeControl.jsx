import { useState } from 'react';
import { patchSizeStock } from '../services/products.query';

export default function SizeControl({ productId, size, stock, onChange }) {
  const [loading, setLoading] = useState(false);

  const applyDelta = async (delta) => {
    if (loading) return;
    if (delta < 0 && stock <= 0) return; // no bajar de 0
    try {
      setLoading(true);
      onChange(size, Math.max(0, stock + delta)); // actualización optimista
      const updated = await patchSizeStock(productId, size, delta); // confirma con API
      const newSize = (updated?.sizes || []).find(s => s.size === size);
      if (newSize) onChange(size, newSize.stock); // sincroniza con el servidor
    } catch (e) {
      onChange(size, stock); // revertir si falló
      console.error('No se pudo actualizar stock de talla', size, e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <span style={{ width: 28, display: 'inline-block', textAlign: 'center' }}>{size}</span>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => applyDelta(-1)}
        disabled={loading || stock <= 0}
      >
        −
      </button>
      <span style={{ minWidth: 28, display: 'inline-block', textAlign: 'center' }}>{stock}</span>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={() => applyDelta(+1)}
        disabled={loading}
      >
        +
      </button>
    </div>
  );
}
