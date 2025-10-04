import type { Request, Response } from "express";
import ItemService from "../services/ItemService.js";

class ItemController {
  async create(req: Request, res: Response) {
    try {
      const { name, quantity, description } = req.body;
      if (!name || quantity === undefined) {
        return res.status(400).json({ error: "Nome e quantidade são obrigatórios" });
      }

      const item = await ItemService.create({ name, quantity, description });
      res.status(201).json(item);
    } catch (err: any) {
      console.error("Erro create item:", err);
      res.status(500).json({ error: err.message || "Erro ao criar item" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const items = await ItemService.findAll();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar itens" });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await ItemService.findById(id);
      if (!item) return res.status(404).json({ error: "Item não encontrado" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar item" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, quantity, description } = req.body;
      const item = await ItemService.update(id, { name, quantity, description });
      res.json(item);
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Item não encontrado" });
      }
      res.status(500).json({ error: "Erro ao atualizar item" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ItemService.delete(id);
      res.json({ message: "Item removido com sucesso" });
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Item não encontrado" });
      }
      res.status(500).json({ error: "Erro ao remover item" });
    }
  }

  async adjust(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { type, quantity, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    if (!["IN", "OUT"].includes(type)) {
      return res.status(400).json({ error: "Tipo deve ser 'IN' ou 'OUT'" });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Quantidade deve ser maior que zero" });
    }

    const updated = await ItemService.adjustStock(id, type, quantity, userId);
    res.json(updated);
  } catch (err: any) {
    console.error("Erro adjust stock:", err);
    res.status(400).json({ error: err.message });
  }
}

export default new ItemController();
