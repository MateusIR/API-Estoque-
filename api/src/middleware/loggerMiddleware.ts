import { Request, Response, NextFunction } from "express";
import prisma from "../infra/prisma.js";

export async function requestLogger(req: Request, res: Response, next: NextFunction) {

  // Rotas que devem ser logadas (mas com regras especiais)
  const targetRoutes = ['/auth', '/users', '/items', '/reports'];

  const startsWithTarget = targetRoutes.some(route =>
    req.originalUrl.startsWith(route)
  );

  // Se não é rota monitorada, segue direto
  if (!startsWithTarget) {
    return next();
  }

  
  if (
    req.method === "GET" &&
    (req.originalUrl.startsWith("/items") || req.originalUrl.startsWith("/reports") || req.originalUrl.startsWith("/users"))
  ) {
    return next();
  }

  // Caso contrário, loga normalmente
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
