
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export const createItemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  quantity: z.number().int().nonnegative("Quantidade deve ser >= 0"),
  description: z.string().optional(),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  quantity: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
});

export const adjustStockSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
  userId: z.string().uuid("userId deve ser um UUID válido"),
});

export const recentAdjustmentsQuerySchema = z.object({
  limit: z
    .string()
    .transform((s) => Number(s))
    .refine((n) => !isNaN(n) && n >= 1 && n <= 100, "limit deve ser um número entre 1 e 100")
    .optional(),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid("O ID fornecido na URL não é um UUID válido"),
});

export const updateReportSchema = z.object({
  name: z.string().min(1).optional(),
  quantity: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
});

export const logsQuerySchema = z.object({
  limit: z
    .string()
    .transform((s) => parseInt(s, 10))
    .refine((n) => !isNaN(n) && n >= 1 && n <= 100, "O limite deve ser um número entre 1 e 100")
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
