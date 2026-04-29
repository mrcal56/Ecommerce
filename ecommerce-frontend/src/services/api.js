import axios from 'axios';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_URL || '/api' || process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (r) => r,
  (e) => {
    const data = e?.response?.data;

    const msg =
      typeof data?.error === 'string'
        ? data.error
        : data?.error?.message ||
          data?.message ||
          e.message ||
          'Error';

    toast.error(String(msg));

    return Promise.reject(e);
  }
);

export default api;