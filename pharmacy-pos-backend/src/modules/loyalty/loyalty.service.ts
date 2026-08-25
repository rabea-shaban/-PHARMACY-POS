import { Role } from '@prisma/client';
import { loyaltyRepository, LoyaltyRepository } from './loyalty.repository.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import {
  EarnPointsDTO,
  RedeemPointsDTO,
  AdjustPointsDTO,
  LoyaltyTransactionQueryDTO,
} from './loyalty.validator.js';
import {
  LoyaltySummaryResponse,
  PaginatedLoyaltyTransactionsResponse,
  CustomerTierResponse,
} from './loyalty.types.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';

export class LoyaltyService {
  constructor(
    private readonly repo: LoyaltyRepository = loyaltyRepository,
    private readonly audit: AuditService = auditService
  ) {}

  async getLoyaltySummary(customerId: string): Promise<LoyaltySummaryResponse> {
    const account = await this.repo.findByCustomerId(customerId);
    if (!account) {
      throw new NotFoundError(`Loyalty account for customer ID '${customerId}' not found`);
    }

    const tier = account.customer.tier
      ? {
          id: account.customer.tier.id,
          name: account.customer.tier.name,
          discountPercentage: Number(account.customer.tier.discountPercentage),
          minimumPoints: account.customer.tier.minimumPoints,
          description: account.customer.tier.description,
          isActive: account.customer.tier.isActive,
        }
      : null;

    return {
      customer: {
        id: account.customer.id,
        name: account.customer.name,
        phone: account.customer.phone,
      },
      tier,
      loyaltyAccount: {
        id: account.id,
        customerId: account.customerId,
        totalPoints: account.totalPoints,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
      recentTransactions: account.transactions.map((tx) => ({
        id: tx.id,
        points: tx.points,
        balanceAfter: tx.balanceAfter,
        type: tx.type,
        referenceType: tx.referenceType,
        referenceId: tx.referenceId,
        reason: tx.reason,
        createdAt: tx.createdAt,
      })),
    };
  }

  async getLoyaltyTransactions(
    customerId: string,
    filters: LoyaltyTransactionQueryDTO
  ): Promise<PaginatedLoyaltyTransactionsResponse> {
    const account = await this.repo.findByCustomerId(customerId);
    if (!account) {
      throw new NotFoundError(`Loyalty account for customer ID '${customerId}' not found`);
    }

    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findTransactions(account.id, filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map((tx) => ({
        id: tx.id,
        points: tx.points,
        balanceAfter: tx.balanceAfter,
        type: tx.type,
        referenceType: tx.referenceType,
        referenceId: tx.referenceId,
        reason: tx.reason,
        createdAt: tx.createdAt,
      })),
      pagination,
    };
  }

  async earnPoints(customerId: string, input: EarnPointsDTO, actorId?: string) {
    const result = await this.repo.applyPointsTransactionAtomic({
      customerId,
      pointsDelta: input.points,
      type: 'EARN',
      reason: input.reason || 'Points earned from purchase',
      referenceType: input.referenceType || null,
      referenceId: input.referenceId || null,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'loyalty_accounts',
      entityId: result.account.id,
      newData: {
        action: 'LOYALTY_EARN',
        pointsAdded: input.points,
        newBalance: result.account.totalPoints,
        upgradedTier: result.upgradedTier?.name || null,
      },
    });

    return {
      loyaltyAccountId: result.account.id,
      pointsEarned: input.points,
      newBalance: result.account.totalPoints,
      transactionId: result.transaction.id,
      upgradedTier: result.upgradedTier,
    };
  }

  async redeemPoints(customerId: string, input: RedeemPointsDTO, actorId?: string) {
    const result = await this.repo.applyPointsTransactionAtomic({
      customerId,
      pointsDelta: -input.points,
      type: 'REDEEM',
      reason: input.reason || 'Points redeemed for purchase discount',
      referenceType: input.referenceType || null,
      referenceId: input.referenceId || null,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'loyalty_accounts',
      entityId: result.account.id,
      newData: {
        action: 'LOYALTY_REDEEM',
        pointsRedeemed: input.points,
        newBalance: result.account.totalPoints,
      },
    });

    return {
      loyaltyAccountId: result.account.id,
      pointsRedeemed: input.points,
      newBalance: result.account.totalPoints,
      transactionId: result.transaction.id,
    };
  }

  async adjustPoints(customerId: string, input: AdjustPointsDTO, actorId?: string, actorRole?: Role) {
    // Only managers can manually adjust points
    if (actorRole !== 'PLATFORM_MANAGER' && actorRole !== 'PHARMACY_MANAGER') {
      throw new ForbiddenError('Only Pharmacy Managers and Platform Managers can manually adjust loyalty points');
    }

    const result = await this.repo.applyPointsTransactionAtomic({
      customerId,
      pointsDelta: input.points,
      type: 'ADJUSTMENT',
      reason: input.reason,
      referenceType: input.referenceType || 'MANUAL_ADJUSTMENT',
      referenceId: input.referenceId || null,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'loyalty_accounts',
      entityId: result.account.id,
      newData: {
        action: 'LOYALTY_ADJUSTMENT',
        pointsDelta: input.points,
        newBalance: result.account.totalPoints,
        reason: input.reason,
      },
    });

    return {
      loyaltyAccountId: result.account.id,
      pointsDelta: input.points,
      newBalance: result.account.totalPoints,
      transactionId: result.transaction.id,
      reason: input.reason,
      upgradedTier: result.upgradedTier,
    };
  }

  async getCustomerTiers(): Promise<CustomerTierResponse[]> {
    const tiers = await this.repo.findAllTiers();
    return tiers.map((t) => ({
      id: t.id,
      name: t.name,
      discountPercentage: Number(t.discountPercentage),
      minimumPoints: t.minimumPoints,
      description: t.description,
      isActive: t.isActive,
    }));
  }
}

export const loyaltyService = new LoyaltyService();
