import { reportApi } from './api';
import type { Item, StockAdjustment, RequestLog } from '../types';

export const reportService = {
  async getStockLevels(): Promise<Item[]> {
    const response = await reportApi.getStockLevels();
    return response.data;
  },

  async getRecentAdjustments(limit?: number): Promise<StockAdjustment[]> {
    const response = await reportApi.getRecentAdjustments(limit);
    return response.data;
  },

  async getLogs(limit?: number): Promise<RequestLog[]> {
    const response = await reportApi.getLogs(limit);
    return response.data.data;
  },
  async getAdjustmentsByItemId(itemId: string, limit?: number): Promise<StockAdjustment[]> {
    const response = await reportApi.findAdjustmentById(itemId, limit);
    return response.data;
  },
};