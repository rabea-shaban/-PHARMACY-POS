import { Prisma, WhatsAppStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { WhatsAppMessageQueryFilters } from './whatsapp.types.js';

export class WhatsAppRepository {
  private readonly defaultInclude = {
    customer: {
      select: {
        id: true,
        name: true,
        phone: true,
      },
    },
    sale: {
      select: {
        id: true,
        invoiceNumber: true,
        total: true,
      },
    },
  };

  async findMany(filters: WhatsAppMessageQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;

    const where: Prisma.WhatsAppMessageWhereInput = {};

    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.saleId) where.saleId = filters.saleId;
    if (filters.status) where.status = filters.status;
    if (filters.phone) {
      where.phone = { contains: filters.phone.trim() };
    }

    if (filters.from || filters.to) {
      where.createdAt = {
        ...(filters.from ? { gte: new Date(filters.from) } : {}),
        ...(filters.to ? { lte: new Date(filters.to) } : {}),
      };
    }

    const [items, total] = await Promise.all([
      prisma.whatsAppMessage.findMany({
        where,
        include: this.defaultInclude,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.whatsAppMessage.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.whatsAppMessage.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  async findBySaleId(saleId: string) {
    return prisma.whatsAppMessage.findFirst({
      where: { saleId },
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    customerId?: string | null;
    saleId?: string | null;
    phone: string;
    message: string;
    status?: WhatsAppStatus;
  }) {
    return prisma.whatsAppMessage.create({
      data: {
        customerId: data.customerId || null,
        saleId: data.saleId || null,
        phone: data.phone,
        message: data.message,
        status: data.status || WhatsAppStatus.PENDING,
      },
      include: this.defaultInclude,
    });
  }

  async update(
    id: string,
    data: {
      status?: WhatsAppStatus;
      providerMessageId?: string | null;
      errorMessage?: string | null;
      sentAt?: Date | null;
    }
  ) {
    return prisma.whatsAppMessage.update({
      where: { id },
      data,
      include: this.defaultInclude,
    });
  }
}

export const whatsAppRepository = new WhatsAppRepository();
