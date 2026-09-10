import { Branch } from '@prisma/client';
import { CreateBranchDTO, UpdateBranchDTO, BranchQueryDTO } from './branches.validator.js';
export interface BranchWithStats extends Branch {
    _count?: {
        users: number;
        batches: number;
        sales: number;
    };
}
export declare class BranchesRepository {
    findAll(query?: BranchQueryDTO): Promise<{
        branches: BranchWithStats[];
        total: number;
    }>;
    findById(id: string): Promise<BranchWithStats | null>;
    findByCode(code: string): Promise<Branch | null>;
    findMainBranch(): Promise<Branch | null>;
    unsetAllMainBranches(): Promise<void>;
    create(data: CreateBranchDTO): Promise<Branch>;
    update(id: string, data: UpdateBranchDTO): Promise<Branch>;
    delete(id: string): Promise<Branch>;
}
export declare const branchesRepository: BranchesRepository;
