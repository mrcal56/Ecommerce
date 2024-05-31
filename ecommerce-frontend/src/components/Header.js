import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useCart();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/products/search?q=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-button">
            <i className="fas fa-bars"></i>
          </button>
          <Link to="/" className="navbar-logo">
            E-commerce
          </Link>
          <Link to="/" className="navbar-item">
            Tienda
          </Link>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="navbar-item">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="navbar-item">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="navbar-center">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
          {searchResults.length > 0 && (
            <div className="search-results">
              <ul>
                {searchResults.map((product) => (
                  <li key={product._id}>
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="navbar-right">
          <Link to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </Link>
          {user ? (
            <>
              <button className="navbar-button" onClick={() => navigate('/edit-account')}>
                Mi Cuenta
              </button>
              {user.role === 'admin' && (
                <button className="navbar-button" onClick={() => navigate('/edit-products')}>
                  Editar Productos
                </button>
              )}
              <button className="navbar-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="navbar-button">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
