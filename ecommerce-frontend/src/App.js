import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/productList'; // Cambio en el nombre del archivo
import ProductDetail from './components/productDetail'; // Cambio en el nombre del archivo
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/addProduct'; // Cambio en el nombre del archivo
import EditProducts from './components/EditProducts';
import EditProduct from './components/EditProduct';

function App() {
  return (
    <Router>
      <Header />
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
        </Routes>
      </main>
    </Router>
  );
}

export default App;
