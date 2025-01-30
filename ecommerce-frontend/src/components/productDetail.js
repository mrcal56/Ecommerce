import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Importa el contexto del carrito
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useCart(); // Contexto del carrito
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [stockAvailable, setStockAvailable] = useState(0); // Stock de la talla seleccionada
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
  // Selecciona automáticamente la primera talla con stock disponible
  if (data.sizes && data.sizes.length > 0) {
    const availableSize = data.sizes.find(size => size.stock > 0);
    if (availableSize) {
      setSelectedSize(availableSize.size);
      setStockAvailable(availableSize.stock);
    }
  }



      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeSelection = (size, stock) => {
    setSelectedSize(size);
    setStockAvailable(stock);
    setQuantity(1); // Reiniciar cantidad al cambiar de talla
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }

    if (stockAvailable === 0) {
      alert('Esta talla está agotada.');
      return;
    }



     // Enviar al carrito con talla y cantidad
     dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: `${product._id}-${selectedSize}`,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: selectedSize,
        quantity: quantity
      }
    });

    console.log(`Added to cart: ${product.name}, Size: ${selectedSize}, Quantity: ${quantity}`);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-container">
      {/* Izquierda: Título, Descripción y Precio */}
      <div className="product-detail-left">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-price">Precio: ${product.price}</p>
        <p className="product-description">{product.description}</p>
      </div>

      {/* Centro: Imagen del Producto */}
      <div className="product-detail-center">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </div>

      {/* Derecha: Selector de Tallas y Botón */}
      <div className="product-detail-right">
        <div className="size-selector">
          <h4>Talla</h4>
          <div className="sizes">
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map(({ size, stock }) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? 'active' : ''} ${stock === 0 ? 'out-of-stock' : ''}`}
                  onClick={() => handleSizeSelection(size, stock)}
                  disabled={stock === 0} // Deshabilita si no hay stock
                >
                  {size} {stock === 0 && ' (Agotado)'}
                </button>
              ))
            ) : (
              <p>No hay tallas disponibles</p>
            )}
          </div>
        </div>

        <div className="quantity-selector">
          <h4>Cantidad</h4>
          <div className="quantity-controls">
            <button
              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              className="quantity-button"
              disabled={stockAvailable <= 1} // Evita reducir más de 1 si solo queda 1 en stock
            >
              −
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < stockAvailable ? prev + 1 : prev))}
              className="quantity-button"
              disabled={quantity >= stockAvailable} // Evita que se supere el stock
            >
              +
            </button>
          </div>
        </div>

         <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={!selectedSize || stockAvailable === 0} // Deshabilita si no hay talla seleccionada o si no hay stock
        >
          {stockAvailable > 0 ? 'Añadir al carrito' : 'Agotado'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
