import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/productList';
import ProductDetail from './components/productDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/addProduct';
import EditProducts from './components/EditProducts';
import EditProduct from './components/EditProduct';
import ChangePassword from './components/ChangePassword';
import EditAccount from './components/EditAccount';
import FloatingCart from './components/FloatingCart';
import PaymentStatus from './components/PaymentStatus'; // Nueva ruta
import Footer from './components/Footer';
import Servicios from './components/Servicios'; // Nueva ruta
import './App.css';

const App = () => {
  const [showFloatingCart, setShowFloatingCart] = useState(false);

  const handleShowFloatingCart = () => {
    setShowFloatingCart(true);
  };

  const handleCloseFloatingCart = () => {
    setShowFloatingCart(false);
  };

  return (
    <Router>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<ProductList onAddToCart={handleShowFloatingCart} />} exact />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-products" element={<EditProducts />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/edit-account" element={<EditAccount />} />
          <Route path="/payment-status" element={<PaymentStatus />} /> {/* Nueva ruta */}
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
        {showFloatingCart && <FloatingCart onClose={handleCloseFloatingCart} />}
      </main>
      <Footer />
    </Router>
  );
};

const ErrorComponent = () => (
  <div>
    <h1>Error: Component Not Found</h1>
  </div>
);

export default App;
