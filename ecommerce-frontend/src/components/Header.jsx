import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Header.css";
import logo from "../flammeB.png";
import api from "../services/api";

const Header = ({ setShowFloatingCart }) => {
  const { user, logout } = useAuth();
  const { cartItems, totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);

  //const searchBoxRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      const fetchResults = async () => {
        const response = await api.get(`/products/search?q=${searchTerm}`);
        const data = response.data;
        setSearchResults(data);
      };

      fetchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSelectProduct = () => {
    setSearchTerm(""); // Borra el término de búsqueda
    setSearchResults([]); // Limpia los resultados
    setShowSearchBox(false); // Oculta la caja de búsqueda
  };

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
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            {user && (
              <>
                <Link to="/my-orders">Mis órdenes</Link>
                <Link to="/edit-account">Mi cuenta</Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor central del logo */}
      <div className="header-center">
        <Link to="/" className="logo">
          <img src={logo} alt="Flamme" className="logo-image" />
        </Link>
      </div>

      <div className="header-center"></div>
      <div className="header-right">
        {/* Icono de búsqueda */}

        <div className="search-container">
          <i
            className="fas fa-search search-icon"
            onClick={handleSearchToggle}
          ></i>
          {showSearchBox && (
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="search-result"
                      onClick={handleSelectProduct}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="search-result-img"
                      />
                      <span className="search-result-name">{product.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Carrito de compras */}
        <Link to="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>

        {/* Botón "Agregar Producto" solo para administradores */}
        {user && user.role === "admin" && (
          <Link to="/add-product" className="btn-add-product">
            Agregar Producto
          </Link>
        )}

        {/* Botones de usuario */}
        {user ? (
          <>
            <button
              className="btn-account"
              onClick={() => (window.location.href = "/edit-account")}
            >
              Mi Cuenta
            </button>

            <button
              className="btn-orders"
              onClick={() => (window.location.href = "/my-orders")}
            >
              Mis órdenes
            </button>

            {user.role === "admin" && (
              <button
                className="btn-edit"
                onClick={() => (window.location.href = "/edit-products")}
              >
                Editar Productos
              </button>
            )}

            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn-register">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
