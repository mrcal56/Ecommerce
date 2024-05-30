import React from 'react';
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
import EditAccount from './components/EditAccount';  // Asegúrate de tener este componente

const ErrorComponent = () => (
  <div>
    <h1>Error: Component Not Found</h1>
  </div>
);

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
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/edit-account" element={<EditAccount />} />  {/* Ruta para editar cuenta */}
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
