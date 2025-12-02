import { itemApi } from './api';
import type { Item } from '../types';

export const itemService = {
  async create(data: { name: string; quantity: number; description?: string }): Promise<Item> {
    const response = await itemApi.create(data);
    return response.data;
  },

  async list(): Promise<Item[]> {
    const response = await itemApi.list();
    return response.data;
  },

  async get(id: string): Promise<Item> {
    const response = await itemApi.get(id);
    return response.data;
  },

  async update(id: string, data: { name?: string; quantity?: number; description?: string }): Promise<Item> {
    const response = await itemApi.update(id, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await itemApi.delete(id);
  },

  async adjustStock(id: string, data: { type: 'IN' | 'OUT'; quantity: number; userId: string }): Promise<Item> {
    const response = await itemApi.adjustStock(id, data);
    return response.data;
  },
};