import { BranchesRepository, BranchWithStats } from './branches.repository.js';
import { CreateBranchDTO, UpdateBranchDTO, BranchQueryDTO } from './branches.validator.js';
import { AuditService } from '../audit/audit.service.js';
import { Branch } from '@prisma/client';
export declare class BranchesService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: BranchesRepository, audit?: AuditService);
    getBranches(query: BranchQueryDTO): Promise<{
        items: BranchWithStats[];
        pagination: import("../../types/common.types.js").PaginationMeta;
    }>;
    getBranchById(id: string): Promise<BranchWithStats>;
    createBranch(data: CreateBranchDTO, actorId?: string): Promise<Branch>;
    updateBranch(id: string, data: UpdateBranchDTO, actorId?: string): Promise<Branch>;
    deleteBranch(id: string, actorId?: string): Promise<Branch>;
}
export declare const branchesService: BranchesService;
