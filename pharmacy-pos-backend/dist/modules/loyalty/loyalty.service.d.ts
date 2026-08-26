import { Role } from '@prisma/client';
import { LoyaltyRepository } from './loyalty.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { EarnPointsDTO, RedeemPointsDTO, AdjustPointsDTO, LoyaltyTransactionQueryDTO } from './loyalty.validator.js';
import { LoyaltySummaryResponse, PaginatedLoyaltyTransactionsResponse, CustomerTierResponse } from './loyalty.types.js';
export declare class LoyaltyService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: LoyaltyRepository, audit?: AuditService);
    getLoyaltySummary(customerId: string): Promise<LoyaltySummaryResponse>;
    getLoyaltyTransactions(customerId: string, filters: LoyaltyTransactionQueryDTO): Promise<PaginatedLoyaltyTransactionsResponse>;
    earnPoints(customerId: string, input: EarnPointsDTO, actorId?: string): Promise<{
        loyaltyAccountId: string;
        pointsEarned: number;
        newBalance: number;
        transactionId: string;
        upgradedTier: {
            id: string;
            name: string;
        } | null;
    }>;
    redeemPoints(customerId: string, input: RedeemPointsDTO, actorId?: string): Promise<{
        loyaltyAccountId: string;
        pointsRedeemed: number;
        newBalance: number;
        transactionId: string;
    }>;
    adjustPoints(customerId: string, input: AdjustPointsDTO, actorId?: string, actorRole?: Role): Promise<{
        loyaltyAccountId: string;
        pointsDelta: number;
        newBalance: number;
        transactionId: string;
        reason: string;
        upgradedTier: {
            id: string;
            name: string;
        } | null;
    }>;
    getCustomerTiers(): Promise<CustomerTierResponse[]>;
}
export declare const loyaltyService: LoyaltyService;
