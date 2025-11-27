import prisma from "../infra/prisma.js";
import bcrypt from "bcryptjs";

class UserService {
 async create(data: { name: string; email?: string; password?: string }) {
  const payload: any = {
    name: data.name,
    email: data.email,
  };

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(data.password, salt);
  }

  return prisma.user.create({
    data: payload,
  });
}

  async findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserService();
