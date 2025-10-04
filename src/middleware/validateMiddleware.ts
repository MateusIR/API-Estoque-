import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({ error: "Validation error", details: errors });
    }

    req.body = parseResult.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.query);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({ error: "Validation error", details: errors });
    }
    req.query = parseResult.data;
    next();
  };
}
