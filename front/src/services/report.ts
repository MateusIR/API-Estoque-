import type { Item, StockAdjustment, RequestLog } from '../types';

const BASE_URL = 'http://localhost:3333';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const reportService = {
  async getStockLevels(): Promise<Item[]> {
    const response = await fetch(`${BASE_URL}/reports/stock-levels`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar níveis de estoque');
    }

    return response.json();
  },

  async getRecentAdjustments(limit?: number): Promise<StockAdjustment[]> {
    const url = new URL(`${BASE_URL}/reports/recent-adjustments`);
    if (limit) url.searchParams.set('limit', limit.toString());

    const response = await fetch(url.toString(), {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar ajustes recentes');
    }

    return response.json();
  },

  async getLogs(limit?: number): Promise<RequestLog[]> {
    const url = new URL(`${BASE_URL}/reports/logs`);
    if (limit) url.searchParams.set('limit', limit.toString());

    const response = await fetch(url.toString(), {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar logs');
    }

    const data = await response.json();
    return data.data;
  },
};