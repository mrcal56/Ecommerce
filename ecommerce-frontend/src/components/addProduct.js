import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState([
    { size: 'XS', stock: 0 },
    { size: 'S', stock: 0 },
    { size: 'M', stock: 0 },
    { size: 'L', stock: 0 },
    { size: 'XL', stock: 0 },
  ]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Maneja el cambio de stock por talla
  const handleSizeChange = (index, stock) => {
    const updatedSizes = [...sizes];
    updatedSizes[index].stock = stock;
    setSizes(updatedSizes);
  };

  // Enviar producto al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        '${process.env.REACT_APP_API_URL}/api/products',
        { name, price, description, imageUrl, sizes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/'); // Redirigir tras añadir el producto
    } catch (error) {
      setError('Error al agregar el producto. Revisa la consola.');
      console.error('Error adding the product:', error);
    }
  };

  return (
    <div className="container">
      <h1>Añadir Producto</h1>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Precio</label>
          <input type="number" className="form-control" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripcion</label>
          <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Imagen URL</label>
          <input type="text" className="form-control" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
        </div>

        {/* Campos para cada talla y stock */}
        <div className="mb-3">
          <label className="form-label">Stock por Talla</label>
          {sizes.map((item, index) => (
            <div key={item.size} className="d-flex align-items-center mb-2">
              <span className="me-2">{item.size}:</span>
              <input
                type="number"
                className="form-control"
                style={{ width: '80px' }}
                value={item.stock}
                onChange={(e) => handleSizeChange(index, parseInt(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary">Añadir Producto</button>
      </form>

      {/* Botón adicional para agregar producto sin formulario */}
      <button className="btn btn-success mt-3" onClick={handleSubmit}>
        Quick Add Product
      </button>
    </div>
  );
};

export default AddProduct;
