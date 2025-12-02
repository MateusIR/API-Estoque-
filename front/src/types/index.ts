export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  userId: string;
  quantity: number;
  type: 'IN' | 'OUT';
  createdAt: string;
  item?: Item;
  user?: Pick<User, 'id' | 'name'>;
}

export interface RequestLog {
  id: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ip?: string;
  userAgent?: string;
  body?: any;
  params?: any;
  query?: any;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}