import { Request, Response } from "express";
import UserService from "../services/UserService.js";

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;
      if (!name) return res.status(400).json({ error: "Nome é obrigatório" });
      const user = await UserService.create({ name, email });
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await UserService.findAll();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const user = await UserService.update(id, { name, email });
      res.json(user);
    } catch (err: any) {
      if (err.code === "P2025") return res.status(404).json({ error: "Usuário não encontrado" });
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UserService.delete(id);
      res.json({ message: "Usuário removido com sucesso" });
    } catch (err: any) {
      if (err.code === "P2025") return res.status(404).json({ error: "Usuário não encontrado" });
      res.status(500).json({ error: err.message });
    }
  }
}

export default new UserController();
