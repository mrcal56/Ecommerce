import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching the product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/');
    } catch (error) {
      console.error("Error deleting the product:", error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img src={product.imageUrl} className="img-fluid" alt={product.name} />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p>${product.price}</p>
          <p>{product.description}</p>
          <button className="btn btn-primary me-2">Add to Cart</button>
          <button className="btn btn-danger" onClick={deleteProduct}>Delete Product</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
