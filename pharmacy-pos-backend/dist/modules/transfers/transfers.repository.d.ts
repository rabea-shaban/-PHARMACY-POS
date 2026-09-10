import { CreateTransferDTO, TransferQueryDTO } from './transfers.validator.js';
export declare const transferIncludes: {
    fromBranch: {
        select: {
            id: boolean;
            name: boolean;
            code: boolean;
            phone: boolean;
        };
    };
    toBranch: {
        select: {
            id: boolean;
            name: boolean;
            code: boolean;
            phone: boolean;
        };
    };
    requestedBy: {
        select: {
            id: boolean;
            name: boolean;
            role: boolean;
        };
    };
    approvedBy: {
        select: {
            id: boolean;
            name: boolean;
            role: boolean;
        };
    };
    dispatchedBy: {
        select: {
            id: boolean;
            name: boolean;
            role: boolean;
        };
    };
    receivedBy: {
        select: {
            id: boolean;
            name: boolean;
            role: boolean;
        };
    };
    items: {
        include: {
            product: {
                select: {
                    id: boolean;
                    name: boolean;
                    scientificName: boolean;
                    barcode: boolean;
                };
            };
            batch: {
                select: {
                    id: boolean;
                    batchNumber: boolean;
                    expiryDate: boolean;
                    quantity: boolean;
                    purchasePrice: boolean;
                    sellingPrice: boolean;
                };
            };
        };
    };
};
export declare class TransfersRepository {
    generateTransferNumber(): Promise<string>;
    findAll(query?: TransferQueryDTO): Promise<{
        transfers: any[];
        total: number;
    }>;
    findById(id: string): Promise<any | null>;
    findByTransferNumber(transferNumber: string): Promise<any | null>;
    create(data: CreateTransferDTO, requestedById: string): Promise<any>;
    approve(id: string, approvedById: string): Promise<any>;
    dispatchAtomic(id: string, dispatchedById: string): Promise<any>;
    receiveAtomic(id: string, receivedById: string): Promise<any>;
    reject(id: string, reason: string): Promise<any>;
    cancel(id: string): Promise<any>;
}
export declare const transfersRepository: TransfersRepository;
