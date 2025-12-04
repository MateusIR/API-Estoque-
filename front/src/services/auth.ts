import { authApi } from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.login(credentials);
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Falha na autenticação';

      throw new Error(msg);
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.register(credentials);
      return response.data;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Erro ao registrar';

      throw new Error(msg);
    }
  },
};
