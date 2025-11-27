import { Request, Response } from "express";
import ReportService from "../services/ReportService.js";


// o create aqui é automático pelo  adjust no item
class ReportController {
  async delete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await ReportService.delete(id);
    res.json({ message: "report removido com sucesso" });
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao remover report" });
  }
}

async get(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const stockAdjustment = await ReportService.findById(id);
    if (!stockAdjustment) return res.status(404).json({ error: "report não encontrado" });
    res.json(stockAdjustment);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar report" });
  }
}
async update(req: Request, res: Response) { //sei lá kkkk
  try {
    const { id } = req.params;
    const { name, quantity, description } = req.body;
    const stockAdjustment = await ReportService.update(id, { name, quantity, description });
    res.json(stockAdjustment);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "report não encontrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar report" });
  }
}

  async stockLevels(req: Request, res: Response) {
    try {
      const items = await ReportService.getStockLevels();
      res.json(items);
    } catch (err) {
      console.error("Erro stockLevels:", err);
      res.status(500).json({ error: "Erro ao buscar níveis de estoque" });
    }
  }

  async recentAdjustments(req: Request, res: Response) { // get all
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
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
