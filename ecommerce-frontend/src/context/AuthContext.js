import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1])); // Decodificar token para obtener datos del usuario
      userData.id = userData.id || userData._id; // Asegurar que el campo id esté presente
      console.log('Decoded user data from token:', userData); // Debugging
      setUser(userData);
    }
  }, []);

  const login = (userData, token) => {
    console.log('Logging in user:', userData); // Debugging
    localStorage.setItem('token', token);
    const decodedData = JSON.parse(atob(token.split('.')[1]));
    userData.id = decodedData.id; // Obtener id del token decodificado
    setUser(userData);
  };

  const logout = () => {
    console.log('Logging out user'); // Debugging
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
