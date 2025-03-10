import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductList.css';

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        console.log("Productos recibidos:", response.data); // Verifica la respuesta del backend
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data.products && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error("Error: la respuesta del backend no contiene array de productos.");
        }
      } catch (error) {
        console.error("Error obteniendo productos:", error);
        setProducts([]); // Asegura que  al menos sea un array vacío
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    if (onAddToCart) {
      onAddToCart(); // Mostrar el carrito flotante si la función está disponible
    }
  };

  const viewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="row">
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="col-md-4">
              <div className="card mb-4" onClick={() => viewDetails(product._id)} style={{ cursor: 'pointer' }}>
                <img src={product.imageUrl} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">${product.price} MXN</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
