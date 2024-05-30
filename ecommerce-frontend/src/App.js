import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/productList'; // Asegúrate de que los nombres coincidan
import ProductDetail from './components/productDetail'; // Asegúrate de que los nombres coincidan
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/addProduct'; // Asegúrate de que los nombres coincidan
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
