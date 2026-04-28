import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditAccount = () => {
  const { user } = useAuth();

  const userId = useMemo(() => user?.id || user?._id || user?.sub || null, [user]);

  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
 
    const fetchUserData = async () => {
      if (!userId) {
        console.log('User or user ID is not defined:', user);
        return;
      }

      try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (!token) {
          setMessage('No hay token de sesión.');
          return;
        }

        const { data } = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(data?.name || data?.fullName || '');
        setEmail(data?.email || '');
        setMessage('');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Error obteniendo datos del usuario');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage('No se encontró el ID de usuario.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        setMessage('No hay token de sesión.');
        return;
      }

      const payload = { name, email };
      if (password && password.trim().length > 0) {
        payload.password = password.trim();
      }

      await api.put(`/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Cuenta actualizada correctamente');
      setPassword('');
    } catch (error) {
      console.error('Error updating account:', error);
      setMessage('Error actualizando la cuenta');
    }
  };

  if (!user) return <p>Loading...</p>;
  if (!userId) return <p>No se encontró el ID del usuario en la sesión.</p>;

  return (
    <div className="container">
      <h1>Edit Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">New Password (opcional)</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            placeholder="Deja vacío para no cambiar"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Account</button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default EditAccount;
