import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamada al backend
      const { data } = await api.post('/auth/login', { email, password });
      console.log('Login response data:', data);

      const { accessToken, refreshToken } = data;
      login({ accessToken, refreshToken });

      if (!accessToken) {
        setMessage('No se recibió token del servidor.');
        return;
      }

      // Decodificar el JWT para obtener datos del usuario
      const user = parseJwt(accessToken);

      // Llamar al contexto con la información
      login({ user, accessToken, refreshToken });

      // Redirigir después de login
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Invalid email or password');
    }
  };

  // Función auxiliar para decodificar el payload del JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        {message && <p className="text-danger mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
