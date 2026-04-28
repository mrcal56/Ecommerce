import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const EditProducts = () => {
  const [products, setProducts] = useState([]);       // siempre un array
  const [loading, setLoading] = useState(true);       // estado de carga
  const [error, setError] = useState(null);           // estado de error

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');  
        const items = Array.isArray(data) ? data : data?.items;
        if (Array.isArray(items)) {
          setProducts(items);
        } else {
          setProducts([]);
          setError('Respuesta inesperada del backend');
        }
      } catch (e) {
        setError('No fue posible cargar los productos');
        setProducts([]);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="container"><h1>Edit Products</h1><p>Cargando...</p></div>;
  if (error)   return <div className="container"><h1>Edit Products</h1><p>{error}</p></div>;

  return (
    <div className="container">
      <h1>Edit Products</h1>
      <div className="row">
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="col-md-4">
              <div className="card mb-4">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.name}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/fallback.png'; }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price}</p>
                  <Link to={`/edit-product/${product._id}`} className="btn btn-primary">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditProducts;
