import { LoyaltyTransactionType, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { LoyaltyTransactionQueryFilters } from './loyalty.types.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

export class LoyaltyRepository {
  async findByCustomerId(customerId: string) {
    return prisma.loyaltyAccount.findUnique({
      where: { customerId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            tier: {
              select: {
                id: true,
                name: true,
                discountPercentage: true,
                minimumPoints: true,
                description: true,
                isActive: true,
              },
            },
          },
        },
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findTransactions(loyaltyAccountId: string, filters: LoyaltyTransactionQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const skip = (page - 1) * limit;
    const { type, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    const where: Prisma.LoyaltyTransactionWhereInput = {
      loyaltyAccountId,
    };

    if (type) {
      where.type = type;
    }

    const [items, total] = await Promise.all([
      prisma.loyaltyTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.loyaltyTransaction.count({ where }),
    ]);

    return { items, total };
  }

  async findAllTiers() {
    return prisma.customerTier.findMany({
      where: { isActive: true },
      orderBy: { minimumPoints: 'asc' },
    });
  }

  async applyPointsTransactionAtomic(params: {
    customerId: string;
    pointsDelta: number;
    type: LoyaltyTransactionType;
    reason?: string | null;
    referenceType?: string | null;
    referenceId?: string | null;
  }) {
    const { customerId, pointsDelta, type, reason, referenceType, referenceId } = params;

    return prisma.$transaction(async (tx) => {
      // 1. Fetch loyalty account
      let account = await tx.loyaltyAccount.findUnique({
        where: { customerId },
        include: { customer: true },
      });

      // If account doesn't exist, create it on demand
      if (!account) {
        const customer = await tx.customer.findUnique({ where: { id: customerId } });
        if (!customer) {
          throw new NotFoundError(`Customer with ID '${customerId}' not found`);
        }
        account = await tx.loyaltyAccount.create({
          data: {
            customerId,
            totalPoints: 0,
          },
          include: { customer: true },
        });
      }

      // 2. Compute new balance
      const newBalance = account.totalPoints + pointsDelta;
      if (newBalance < 0) {
        throw new BadRequestError(
          `Insufficient loyalty points. Current balance is ${account.totalPoints} points, requested redemption is ${Math.abs(pointsDelta)} points.`
        );
      }

      // 3. Update account balance
      const updatedAccount = await tx.loyaltyAccount.update({
        where: { id: account.id },
        data: { totalPoints: newBalance },
      });

      // 4. Create immutable transaction record
      const transaction = await tx.loyaltyTransaction.create({
        data: {
          loyaltyAccountId: account.id,
          points: pointsDelta,
          balanceAfter: newBalance,
          type,
          reason: reason || null,
          referenceType: referenceType || null,
          referenceId: referenceId || null,
        },
      });

      // 5. Automatic Tier Evaluation on Earn / Adjustment (Upgrade tier if qualified)
      let upgradedTier: { id: string; name: string } | null = null;
      if (pointsDelta > 0) {
        const activeTiers = await tx.customerTier.findMany({
          where: { isActive: true },
          orderBy: { minimumPoints: 'desc' },
        });

        // Find highest tier where minimumPoints <= newBalance
        const qualifiedTier = activeTiers.find((t) => newBalance >= t.minimumPoints);
        if (qualifiedTier && account.customer.tierId !== qualifiedTier.id) {
          await tx.customer.update({
            where: { id: customerId },
            data: { tierId: qualifiedTier.id },
          });
          upgradedTier = { id: qualifiedTier.id, name: qualifiedTier.name };
        }
      }

      return {
        account: updatedAccount,
        transaction,
        upgradedTier,
      };
    });
  }
}

export const loyaltyRepository = new LoyaltyRepository();
