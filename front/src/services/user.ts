import { userApi } from './api';
import type { User } from '../types';

export const userService = {
  async create(data: { name: string; email?: string }): Promise<User> {
    const response = await userApi.create(data);
    return response.data;
  },

  async list(): Promise<User[]> {
    const response = await userApi.list();
    return response.data;
  },

  async get(id: string): Promise<User> {
    const response = await userApi.get(id);
    return response.data;
  },

  async update(id: string, data: { name?: string; email?: string }): Promise<User> {
    const response = await userApi.update(id, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await userApi.delete(id);
  },
};