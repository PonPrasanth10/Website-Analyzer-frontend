import axios from 'axios';
import config from '../config/env.js';

const api = axios.create({ 
  baseURL: config.API_BASE_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('va_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('va_token');
      localStorage.removeItem('va_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
