import React from 'react';
import './App.css';
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
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';  // Import the FloatingCart component
import './App.css';

const ErrorComponent = () => (
  <div>
    <h1>Error: Component Not Found</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Header />
      <FloatingCart />  {/* Include the FloatingCart component */}
      <main className="py-3">
        <Routes>
          <Route path="/" element={<ProductList />} exact />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-products" element={<EditProducts />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/edit-account" element={<EditAccount />} />
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
      </main>
      <Footer /> {/* Incluir el componente Footer */}
    </Router>
  );
}

export default App;
