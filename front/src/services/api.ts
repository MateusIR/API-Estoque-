// Arquivo: src/services/api.ts
import axios from 'axios';
import type { AuthResponse } from '../types';

// REMOVIDO: import * as dotenv from 'dotenv';
// REMOVIDO: dotenv.config();

// Se estiver usando Vite (padrão atual), use import.meta.env.VITE_API_BASE_URL
// Se estiver usando Create React App, use process.env.REACT_APP_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

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

// ... (Mantenha o restante das exportações: authApi, itemApi, reportApi, userApi iguais ao original)
// Apenas copie o restante das funções exportadas (authApi, itemApi, etc) que já estavam no arquivo.
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