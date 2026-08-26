import { CommissionsRepository } from './commissions.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateCommissionRuleDTO, UpdateCommissionRuleDTO } from './commissions.validator.js';
import { CommissionRuleResponse, CommissionTransactionQueryFilters, PaginatedCommissionTransactionsResponse, CommissionSummaryResponse } from './commissions.types.js';
export declare class CommissionsService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: CommissionsRepository, audit?: AuditService);
    getRules(): Promise<CommissionRuleResponse[]>;
    getRuleById(id: string): Promise<CommissionRuleResponse>;
    getActiveRule(): Promise<CommissionRuleResponse | null>;
    createRule(input: CreateCommissionRuleDTO, actorId?: string): Promise<CommissionRuleResponse>;
    updateRule(id: string, input: UpdateCommissionRuleDTO, actorId?: string): Promise<CommissionRuleResponse>;
    getTransactions(filters: CommissionTransactionQueryFilters): Promise<PaginatedCommissionTransactionsResponse>;
    getStaffTransactions(userId: string, filters: CommissionTransactionQueryFilters): Promise<PaginatedCommissionTransactionsResponse>;
    getSummary(startDate?: string, endDate?: string): Promise<CommissionSummaryResponse>;
}
export declare const commissionsService: CommissionsService;
