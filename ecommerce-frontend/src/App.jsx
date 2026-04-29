import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import AddProduct from "./components/AddProduct";
import EditProducts from "./components/EditProducts";
import EditProduct from "./components/EditProduct";
import ChangePassword from "./components/ChangePassword";
import EditAccount from "./components/EditAccount";
import FloatingCart from "./components/FloatingCart";
import PaymentStatus from "./components/PaymentStatus";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminSizeManager from "./features/admin/AdminSizeManager";
import MyOrders from "./components/MyOrders";
import OrderSuccess from "./components/OrderSuccess";

import "./App.css";

import { useAuth } from "./context/AuthContext";
function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
}

function ErrorComponent() {
  return (
    <div className="container py-5">
      <h1>Error: Component Not Found</h1>
    </div>
  );
}

const App = () => {
  const [showFloatingCart, setShowFloatingCart] = useState(false);

  const handleShowFloatingCart = () => setShowFloatingCart(true);
  const handleCloseFloatingCart = () => setShowFloatingCart(false);

  return (
    <Router>
      <Header />
      <main className="main">
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={<ProductList onAddToCart={handleShowFloatingCart} />}
            />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/add-product"
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/edit-products"
              element={
                <AdminRoute>
                  <EditProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/edit-product/:id"
              element={
                <AdminRoute>
                  <EditProduct />
                </AdminRoute>
              }
            />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/edit-account" element={<EditAccount />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route
              path="/admin/sizes"
              element={
                <AdminRoute>
                  <AdminSizeManager />
                </AdminRoute>
              }
            />
            <Route path="*" element={<ErrorComponent />} />
          </Routes>
        </ErrorBoundary>

        {showFloatingCart && <FloatingCart onClose={handleCloseFloatingCart} />}
      </main>
      <Footer />
    </Router>
  );
};

export default App;
