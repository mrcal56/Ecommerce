import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const normalizeSizesForUI = (arr) =>
  Array.isArray(arr)
    ? arr
        .map((s) =>
          typeof s === "string" ? { size: s.toUpperCase(), stock: 0 } : { size: String(s.size || "").toUpperCase(), stock: Number(s.stock) || 0 }
        )
        .filter((s) => s.size)
    : [];

const compactSizes = (arr) => {
  const map = new Map();
  for (const s of arr || []) {
    const key = String(s.size || "").toUpperCase();
    if (!key) continue;
    const prev = map.get(key) || 0;
    map.set(key, Math.max(0, prev + (Number(s.stock) || 0)));
  }
  return Array.from(map.entries()).map(([size, stock]) => ({ size, stock }));
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [newStock, setNewStock] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setName(data.name || "");
        setPrice(data.price ?? "");
        setDescription(data.description || "");
        setImageUrl(data.imageUrl || "");
        setSizes(normalizeSizesForUI(data.sizes || []));
      } catch (error) {
        console.error("Error obteniendo producto:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const addSize = async () => {
  const sizeKey = String(newSize || '').toUpperCase().trim();
  const qty = Number(newStock) || 0;
  if (!sizeKey || !qty) return;

    setSizes(prev => {
    const idx = prev.findIndex(s => s.size === sizeKey);
    if (idx >= 0) {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], stock: Math.max(0, copy[idx].stock + qty) };
      return copy;
    }
    return [...prev, { size: sizeKey, stock: Math.max(0, qty) }];
  });

  const { data } = await api.patch(`/products/${id}/sizes`, { size: sizeKey, delta: qty });

  // Sincronizar con lo que regresa el servidor
  const normalized = Array.isArray(data?.sizes)
    ? data.sizes.map(s => (typeof s === 'string' ? { size: s, stock: 0 } : s))
    : [];
  setSizes(normalized);
    setNewSize("");
    setNewStock("");
  };

  const applyDelta = async (sizeKey, delta) => {
  setSizes(prev => prev.map(s => s.size === sizeKey ? { ...s, stock: Math.max(0, s.stock + delta) } : s));
  const { data } = await api.patch(`/products/${id}/sizes`, { size: sizeKey, delta });
  setSizes((data?.sizes || []).map(s => (typeof s === 'string' ? { size: s, stock: 0 } : s)));
};


  const removeSize = (index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name,
        price: Number(price),
        description,
        imageUrl,
        sizes: compactSizes(sizes),
      };

      await api.put(`/products/${id}`, body);
      navigate("/edit-products");
    } catch (error) {
      console.error("Error updating the product:", error);
    }
  };

  return (
    <div className="container">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input id="price" type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input id="imageUrl" className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Tallas Disponibles</label>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder="Talla (S, M, L...)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value.toUpperCase())}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Stock (+/-)"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
            />
            <button type="button" className="btn btn-success" onClick={addSize}>Añadir</button>
          </div>
        </div>

        {sizes.length > 0 && (
          <ul className="list-group mb-3">
            {sizes.map((item, index) => (
              <li key={`${item.size}-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.size} - Stock: {item.stock}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSize(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="btn btn-primary">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
