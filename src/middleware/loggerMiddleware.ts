import { Request, Response, NextFunction } from "express";
import prisma from "../infra/prisma";

export async function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;
    try {
      await prisma.requestLog.create({
        data: {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          duration,
        },
      });
    } catch (err) {
      console.error("Erro ao salvar log:", err);
    }
  });

  next();
  

}
