import prisma from "../infra/prisma.js";

class UserService {
  async create(data: { name: string; email?: string }) {
    return prisma.user.create({ data });
  }

  async findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserService();
