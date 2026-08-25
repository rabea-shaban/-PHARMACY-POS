import { prisma } from '../../lib/prisma.js';

export class AuthRepository {
  private readonly safeSelect = {
    id: true,
    name: true,
    phone: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async findByIdentifier(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ phone: identifier }, { email: identifier }],
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: this.safeSelect,
    });
  }

  async countUsers(): Promise<number> {
    return prisma.user.count();
  }
}

export const authRepository = new AuthRepository();
