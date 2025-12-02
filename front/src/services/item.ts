import {type Item } from '../types';

const BASE_URL = 'http://localhost:3333';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const itemService = {
  async create(data: { name: string; quantity: number; description?: string }): Promise<Item> {
    const response = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar item');
    }

    return response.json();
  },

  async list(): Promise<Item[]> {
    const response = await fetch(`${BASE_URL}/items`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao listar itens');
    }

    return response.json();
  },

  async get(id: string): Promise<Item> {
    const response = await fetch(`${BASE_URL}/items/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar item');
    }

    return response.json();
  },

  async update(id: string, data: { name?: string; quantity?: number; description?: string }): Promise<Item> {
    const response = await fetch(`${BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar item');
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao remover item');
    }
  },

  async adjustStock(id: string, data: { type: 'IN' | 'OUT'; quantity: number; userId: string }): Promise<Item> {
    const response = await fetch(`${BASE_URL}/items/${id}/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao ajustar estoque');
    }

    return response.json();
  },
};