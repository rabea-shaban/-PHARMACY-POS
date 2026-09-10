import { TransfersRepository } from './transfers.repository.js';
import { CreateTransferDTO, RejectTransferDTO, TransferQueryDTO } from './transfers.validator.js';
import { AuditService } from '../audit/audit.service.js';
export declare class TransfersService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: TransfersRepository, audit?: AuditService);
    getTransfers(query: TransferQueryDTO): Promise<{
        items: any[];
        pagination: import("../../types/common.types.js").PaginationMeta;
    }>;
    getTransferById(id: string): Promise<any>;
    getTransferByNumber(transferNumber: string): Promise<any>;
    createTransfer(data: CreateTransferDTO, actorId?: string): Promise<any>;
    approveTransfer(id: string, actorId?: string): Promise<any>;
    dispatchTransfer(id: string, actorId?: string): Promise<any>;
    receiveTransfer(id: string, actorId?: string): Promise<any>;
    rejectTransfer(id: string, input: RejectTransferDTO, actorId?: string): Promise<any>;
    cancelTransfer(id: string, actorId?: string): Promise<any>;
}
export declare const transfersService: TransfersService;
