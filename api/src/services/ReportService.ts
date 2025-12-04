import prisma from "../infra/prisma.js";

class ReportService {

async delete(id: string) {
    return prisma.stockAdjustment.delete({ where: { id } });
  }

  async findById(id: string) {
    return prisma.stockAdjustment.findUnique({ where: { id } });
  }
  async update(id: string, data: { name?: string; quantity?: number; description?: string }) {
    return prisma.stockAdjustment.update({ where: { id }, data });
  }

  async getStockLevels() {
    return prisma.item.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    });
  }
  async getStockAdjustmentsByItemId(itemId: string, limit?: number) {
    return prisma.stockAdjustment.findMany({
      where: { itemId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async getRecentAdjustments(limit: number = 25) {
  return prisma.stockAdjustment.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 100),
    include: {
      item: true,
      user: { select: { id: true, name: true } }
    },
  });
}


  async getLogs(limit?: number) {
    if (limit === undefined) {
      limit = 25;
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new Error("escolha um numero de logs entre 1 - 100");
    }

    return prisma.requestLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export default new ReportService();
