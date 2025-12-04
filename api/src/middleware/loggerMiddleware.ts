import { Request, Response, NextFunction } from "express";
import prisma from "../infra/prisma.js";

export async function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Rotas que serão logadas
  const targetRoutes = ['/auth', '/users', '/items'];

  const shouldLog = targetRoutes.some(route => req.originalUrl.startsWith(route));

  if (!shouldLog) {
    return next();
  }

  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    try {
      await prisma.requestLog.create({
        data: {
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          durationMs: duration,
        },
      });
    } catch (error) {
      console.error("Erro ao salvar log:", error);
    }
  });

  next();
}
