import prisma from "../infra/prisma.js";

class ReportService {
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

  async getRecentAdjustments(limit: number = 20) {
    return prisma.stockAdjustment.findMany({
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
      include: { item: true },
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
