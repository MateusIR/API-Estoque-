import { Request, Response } from "express";
import UserService from "../services/UserService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "please-set-a-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";

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

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: "name, email e password são obrigatórios" });

      const existing = await UserService.findByEmail(email);
      if (existing) return res.status(409).json({ error: "Email já cadastrado" });

      const user = await UserService.create({ name, email, password });
      // não retornar password
      const { password: _p, ...safe } = (user as any);
      res.status(201).json(safe);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

      const user = await UserService.findByEmail(email);
      if (!user || !user.password) return res.status(401).json({ error: "Credenciais inválidas" });

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ error: "Credenciais inválidas" });

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET as string,
        { expiresIn: "6h" }
      );

      res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      });
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
