import { Request, Response } from "express";
import ReportService from "../services/ReportService.js";

class ReportController {
  async stockLevels(req: Request, res: Response) {
    try {
      const items = await ReportService.getStockLevels();
      res.json(items);
    } catch (err) {
      console.error("Erro stockLevels:", err);
      res.status(500).json({ error: "Erro ao buscar níveis de estoque" });
    }
  }

  async recentAdjustments(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      if (isNaN(limit) || limit <= 0 || limit > 100) {
        return res.status(400).json({ error: "escolha um numero de logs entre 1 - 100" });
      }

      const adjustments = await ReportService.getRecentAdjustments(limit);
      res.json(adjustments);
    } catch (err) {
      console.error("Erro recentAdjustments:", err);
      res.status(500).json({ error: "Erro ao buscar ajustes recentes" });
    }
  }

  async logs(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const logs = await ReportService.getLogs(limit);
      res.json({ limit: limit ?? 25, count: logs.length, data: logs });
    } catch (err: any) {
      console.error("Erro logs:", err);
      if (err.message === "escolha um numero de logs entre 1 - 100") {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro ao buscar logs" });
    }
  }
}

export default new ReportController();
