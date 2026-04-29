import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../flammeB.png";
import api from "../services/api";

const Header = ({ setShowFloatingCart }) => {
  const { user, logout } = useAuth();
  const { cartItems, totalItems } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const fetchResults = async () => {
        const response = await api.get(`/products/search?q=${searchTerm}`);
        setSearchResults(response.data);
      };
      fetchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSelectProduct = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchBox(false);
  };

  const handleSearchToggle = () => setShowSearchBox(!showSearchBox);
  const handleLogout = () => logout();

  return (
    <header
      className="fixed top-0 w-full z-[1000] flex justify-between items-center px-5 h-[70px] border-b border-white/30"
      style={{
        background: 'rgba(116, 104, 104, 0.37)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.05)',
        color: '#1a1a2e',
      }}
    >
      {/* ── Izquierda — menú hamburguesa (solo móvil) ── */}
      <div className="header-left">
        <div className="group relative hidden md:hidden">
          {/* visible solo en mobile via CSS del grupo */}
        </div>

        {/* Hamburguesa visible en móvil */}
        <div className="relative md:hidden text-2xl cursor-pointer text-[#1a1a2e] mr-2 group">
          <i className="fas fa-bars"></i>
          <div className="hidden group-hover:block absolute top-[60px] left-[10px] bg-white/90 backdrop-blur border border-white/40 p-4 rounded-xl shadow-lg min-w-[160px] z-50">
            <Link to="/" className="block py-1 text-[#1a1a2e] no-underline hover:opacity-70">Tienda</Link>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="block py-1 text-[#1a1a2e] no-underline hover:opacity-70">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block py-1 text-[#1a1a2e] no-underline hover:opacity-70">Instagram</a>
            {user && (
              <>
                <Link to="/my-orders" className="block py-1 text-[#1a1a2e] no-underline hover:opacity-70">Mis órdenes</Link>
                <Link to="/edit-account" className="block py-1 text-[#1a1a2e] no-underline hover:opacity-70">Mi cuenta</Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="block py-1 text-[#1a1a2e] no-underline hover:opacity-70">Iniciar Sesión</Link>
                <Link to="/register" className="block py-1 text-[#1a1a2e] no-underline hover:opacity-70">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Centro — logo ── */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <Link to="/">
          <img src={logo} alt="Flamme" className="max-w-[160px] md:max-w-[90px] h-auto object-contain block" />
        </Link>
      </div>

      {/* ── Derecha — iconos y botones ── */}
      <div className="flex items-center gap-4 mr-4">

        {/* Buscador */}
        <div className="relative flex items-center text-xl cursor-pointer">
          <i className="fas fa-search text-[#1a1a2e]" onClick={handleSearchToggle}></i>
          {showSearchBox && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white w-[250px] p-2.5 rounded-md shadow-lg z-[1000]
                            max-md:w-screen max-md:left-0 max-md:translate-x-0 max-md:rounded-none max-md:top-[55px]">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm outline-none bg-gray-50 text-gray-800"
              />
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-[250px] overflow-y-auto rounded border border-gray-200">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={handleSelectProduct}
                      className="flex items-center p-2 border-b border-gray-200 no-underline text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-2.5"
                      />
                      <span className="text-sm">{product.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Carrito */}
        <Link to="/cart" className="relative flex items-center text-xl text-[#1a1a2e] no-underline">
          <i className="fas fa-shopping-cart text-[22px]"></i>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Botón admin — agregar producto (oculto en móvil) */}
        {user?.role === "admin" && (
          <Link
            to="/add-product"
            className="hidden md:inline-block font-semibold text-white px-4 py-2 rounded-full no-underline ml-4 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
              boxShadow: '0 4px 15px rgba(110,142,251,0.3)',
            }}
          >
            Agregar Producto
          </Link>
        )}

        {/* Botones de usuario */}
        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.href = "/edit-account"}
              className="font-semibold text-[#4a4e69] text-sm px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:text-[#1a1a2e] hover:bg-black/5"
              style={{ fontFamily: 'Outfit, sans-serif', border: 'none', background: 'transparent' }}
            >
              Mi Cuenta
            </button>
            <button
              onClick={() => window.location.href = "/my-orders"}
              className="font-semibold text-[#4a4e69] text-sm px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:text-[#1a1a2e] hover:bg-black/5"
              style={{ fontFamily: 'Outfit, sans-serif', border: 'none', background: 'transparent' }}
            >
              Mis órdenes
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => window.location.href = "/edit-products"}
                className="font-semibold text-[#4a4e69] text-sm px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:text-[#1a1a2e] hover:bg-black/5"
                style={{ fontFamily: 'Outfit, sans-serif', border: 'none', background: 'transparent' }}
              >
                Editar Productos
              </button>
            )}
            <button
              onClick={handleLogout}
              className="font-semibold text-[#4a4e69] text-sm px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:text-[#1a1a2e] hover:bg-black/5"
              style={{ fontFamily: 'Outfit, sans-serif', border: 'none', background: 'transparent' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="font-semibold text-[#4a4e69] text-sm px-3 py-1.5 rounded-xl no-underline transition-all hover:text-[#1a1a2e] hover:bg-black/5"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="font-semibold text-[#4a4e69] text-sm px-3 py-1.5 rounded-xl no-underline transition-all hover:text-[#1a1a2e] hover:bg-black/5"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;