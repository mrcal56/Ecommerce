import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h1><Link to="/" className="text-white text-decoration-none">My E-commerce</Link></h1>
          <nav>
            {user && (
              <>
                {user.role === 'admin' && (
                  <Link to="/edit-products" className="btn btn-warning me-3">Edit Products</Link>
                )}
                <Link to="/edit-account" className="btn btn-info me-3">Edit Account</Link>
              </>
            )}
            <Link to="/cart" className="text-white me-3">Cart</Link>
            {!user ? (
              <>
                <Link to="/login" className="text-white me-3">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
