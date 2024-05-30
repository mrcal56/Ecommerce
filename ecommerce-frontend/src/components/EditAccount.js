import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditAccount = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        console.log('User or user ID is not defined:', user); // Debugging
        return;
      }

      try {
        const token = localStorage.getItem('token');
        console.log('Fetching data for user ID:', user.id); // Debugging
        const { data } = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched user data:', data); // Debugging
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Error fetching user data');
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Updating user data:', { name, email, password }); // Debugging
      await axios.put(`http://localhost:5000/api/users/${user.id}`, {
        name,
        email,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Account updated successfully');
    } catch (error) {
      console.error('Error updating account:', error);
      setMessage('Error updating account');
    }
  };

  if (!user) return <p>Loading...</p>; // Mostrar mensaje de carga mientras se obtiene el user

  return (
    <div className="container">
      <h1>Edit Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            autoComplete="email"
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Account</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default EditAccount;
