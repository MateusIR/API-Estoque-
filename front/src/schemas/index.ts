import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const createItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  quantity: z.number().int().nonnegative('Quantidade deve ser >= 0'),
  description: z.string().optional(),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  quantity: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
});

export const adjustStockSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
  userId: z.string().uuid('userId deve ser um UUID válido'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;