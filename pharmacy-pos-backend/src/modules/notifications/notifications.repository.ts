import { Prisma, NotificationType, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { NotificationQueryFilters } from './notifications.types.js';

export class NotificationsRepository {
  async findMany(filters: NotificationQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId: filters.userId,
    };

    if (filters.isRead !== undefined) {
      where.isRead = typeof filters.isRead === 'boolean' ? filters.isRead : String(filters.isRead) === 'true';
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async create(data: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.GENERAL,
      },
    });
  }

  async createMany(
    notifications: {
      userId: string;
      title: string;
      message: string;
      type: NotificationType;
    }[]
  ) {
    if (notifications.length === 0) return { count: 0 };
    return prisma.notification.createMany({
      data: notifications,
    });
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async findUserIdsByRoles(roles: Role[]): Promise<string[]> {
    const users = await prisma.user.findMany({
      where: {
        role: { in: roles },
        isActive: true,
      },
      select: { id: true },
    });
    return users.map((u) => u.id);
  }
}

export const notificationsRepository = new NotificationsRepository();
