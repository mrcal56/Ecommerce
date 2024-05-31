import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = ({ setShowFloatingCart }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const fetchResults = async () => {
        const response = await fetch(`http://localhost:5000/api/products/search?q=${searchTerm}`);
        const data = await response.json();
        setSearchResults(data);
      };

      fetchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearchToggle = () => {
    setShowSearchBox(!showSearchBox);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="menu-icon">
          <i className="fas fa-bars"></i>
          <div className="dropdown-menu">
            <Link to="/">Tienda</Link>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            {!user && (
              <>
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
          </div>
        </div>
        <Link to="/" className="logo">E-Commerce</Link>
      </div>
      <div className="header-center">
        <div className="search-container">
          <i className="fas fa-search search-icon" onClick={handleSearchToggle}></i>
          {showSearchBox && (
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <Link key={product._id} to={`/product/${product._id}`} className="search-result">
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="header-right">
        <Link to="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
        </Link>
        {user ? (
          <>
            <button className="btn-account" onClick={() => window.location.href = '/edit-account'}>Mi Cuenta</button>
            {user.role === 'admin' && <button className="btn-edit" onClick={() => window.location.href = '/edit-products'}>Editar Productos</button>}
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Iniciar Sesión</Link>
            <Link to="/register" className="btn-register">Registrarse</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
