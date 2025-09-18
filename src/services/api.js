// src/services/api.ts
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

// Interceptor de requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;

    if (status === 401) {
      window.location.href = '/login?erro=token_ausente';
    } else if (status === 403) {
      window.location.href = '/login?erro=token_expirado';
    }

    return Promise.reject(error);
  }
);

export default api
