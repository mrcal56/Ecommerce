import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState(''); // Nueva talla a agregar
  const [newStock, setNewStock] = useState(''); // Nuevo stock a agregar


  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setImageUrl(data.imageUrl);
      setSizes(data.sizes || []);
    };

    fetchProduct();
  }, [id]);

  // Agregar una nueva talla con stock
  const addSize = () => {
    if (newSize && newStock) {
      setSizes([...sizes, { size: newSize, stock: Number(newStock) }]);
      setNewSize('');
      setNewStock('');
    }
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Token guardado:", token);

    if (!token) {
      alert("No se encontró un token válido. Inicia sesión nuevamente.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          name,
          price,
          description,
          imageUrl,
          sizes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">
            Image URL
          </label>
          <input
            type="text"
            className="form-control"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

       {/* Sección de Tallas */}
       <div className="mb-3">
          <label className="form-label">Tallas Disponibles</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Talla (Ej: S, M, L)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value.toUpperCase())}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Stock"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
            />
            <button type="button" className="btn btn-success" onClick={addSize}>Añadir</button>
          </div>
        </div>

        {/* Lista de tallas agregadas */}
        {sizes.length > 0 && (
          <ul className="list-group mb-3">
            {sizes.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{item.size} - Stock: {item.stock}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSize(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}


        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
