import axios from 'axios';
import type { AuthResponse } from '../types';
import * as dotenv from 'dotenv';

dotenv.config();
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3333';

// Cria uma instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Tratar erros de autenticação
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      const message = error.response.data?.error || 'Erro na requisição';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Erro de conexão com o servidor'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;

// Funções auxiliares para serviços específicos
export const authApi = {
  login: (credentials: { email: string; password: string }): Promise<{ data: AuthResponse }> =>
    api.post('/auth/login', credentials),
  
  register: (credentials: { name: string; email: string; password: string }): Promise<{ data: AuthResponse }> =>
    api.post('/auth/register', credentials),
};

export const itemApi = {
  create: (data: { name: string; quantity: number; description?: string }) =>
    api.post('/items', data),
  
  list: () => api.get('/items'),
  
  get: (id: string) => api.get(`/items/${id}`),
  
  update: (id: string, data: { name?: string; quantity?: number; description?: string }) =>
    api.put(`/items/${id}`, data),
  
  delete: (id: string) => api.delete(`/items/${id}`),
  
  adjustStock: (id: string, data: { type: 'IN' | 'OUT'; quantity: number; userId: string }) =>
    api.post(`/items/${id}/adjust`, data),
};

export const reportApi = {
  getStockLevels: () => api.get('/reports/stock-levels'),
  
  getRecentAdjustments: (limit?: number) =>
    api.get('/reports/recent-adjustments', { params: { limit } }),
  
  getLogs: (limit?: number) =>
    api.get('/reports/logs', { params: { limit } }),
};

export const userApi = {
  list: () => api.get('/users'),
  
  get: (id: string) => api.get(`/users/${id}`),
  
  create: (data: { name: string; email?: string }) =>
    api.post('/users', data),
  
  update: (id: string, data: { name?: string; email?: string }) =>
    api.put(`/users/${id}`, data),
  
  delete: (id: string) => api.delete(`/users/${id}`),
};