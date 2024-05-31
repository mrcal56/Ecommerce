import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { cartItems = [] } = useCart();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/search?q=${searchTerm}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button">☰</button>
        <Link to="/" className="brand-logo">
          E-commerce
        </Link>
      </div>
      <div className="header-center">
        <ul className="nav-links">
          <li><Link to="/">Tienda</Link></li>
          <li><a href="https://facebook.com">Facebook</a></li>
          <li><a href="https://twitter.com">Twitter</a></li>
        </ul>
      </div>
      <div className="header-right">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
        <Link to="/cart" className="cart-icon">
          🛒 <span className="cart-count">{cartItems.length}</span>
        </Link>
        {user ? (
          <>
            <Link to="/edit-account">Mi Cuenta</Link>
            {user.role === 'admin' && <Link to="/edit-products">Editar Productos</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
      {searchResults.length > 0 && (
        <div className="search-results">
          <ul>
            {searchResults.map(result => (
              <li key={result._id}>
                <Link to={`/product/${result._id}`}>{result.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
