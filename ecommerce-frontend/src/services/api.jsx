import axios from 'axios';
import toast from 'react-hot-toast';


// Compatible con Vite y CRA (ambos entornos)
const BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  '/api'; // fallback: usa proxy de Vite




// Crea la instancia de Axios
const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adjuntar automáticamente el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales (401, 500, etc.)
api.interceptors.response.use(
  (r) => r,
  (e) => {
    const msg = e?.response?.data?.error || e.message || 'Error';
    toast.error(msg);
    return Promise.reject(e);
  }
);

export default api;
