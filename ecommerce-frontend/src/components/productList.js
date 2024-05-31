import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductList.css';

const ProductList = ({ setShowFloatingCart }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setShowFloatingCart(true);
  };

  const viewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="row">
        {products.map((product) => (
          <div
            key={product._id}
            className="col-md-4"
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="card mb-4" onClick={() => viewDetails(product._id)} style={{ cursor: 'pointer' }}>
              <img src={product.imageUrl} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-price">${product.price} MXN</p>
                {hoveredProduct === product._id && (
                  <button
                    className="btn btn-primary add-to-cart-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
