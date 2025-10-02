import prisma from "../infra/prisma";

class ItemService {
  async create(data: { name: string; quantity: number; description?: string }) {
    return prisma.item.create({ data });
  }

  async findAll() {
    return prisma.item.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string) {
    return prisma.item.findUnique({ where: { id } });
  }

  async update(id: string, data: { name?: string; quantity?: number; description?: string }) {
    return prisma.item.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.item.delete({ where: { id } });
  }

  async adjustStock(id: string, type: "IN" | "OUT", quantity: number) {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) throw new Error("Item não encontrado");

    if (type === "OUT" && item.quantity < quantity) {
      throw new Error("Quantidade insuficiente em estoque");
    }

    const newQuantity = type === "IN" ? item.quantity + quantity : item.quantity - quantity;

    const updated = await prisma.item.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    await prisma.stockAdjustment.create({
      data: { itemId: id, type, quantity },
    });

    return updated;
  }
}

export default new ItemService();
