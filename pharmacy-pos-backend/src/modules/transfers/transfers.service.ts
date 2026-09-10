import { transfersRepository, TransfersRepository } from './transfers.repository.js';
import { CreateTransferDTO, RejectTransferDTO, TransferQueryDTO } from './transfers.validator.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';

export class TransfersService {
  constructor(
    private readonly repo: TransfersRepository = transfersRepository,
    private readonly audit: AuditService = auditService
  ) {}

  async getTransfers(query: TransferQueryDTO) {
    const { transfers, total } = await this.repo.findAll(query);
    return {
      items: transfers,
      pagination: getPaginationMeta(total, query.page, query.limit),
    };
  }

  async getTransferById(id: string) {
    const transfer = await this.repo.findById(id);
    if (!transfer) {
      throw new NotFoundError(`Transfer request with ID '${id}' not found`);
    }
    return transfer;
  }

  async getTransferByNumber(transferNumber: string) {
    const transfer = await this.repo.findByTransferNumber(transferNumber);
    if (!transfer) {
      throw new NotFoundError(`Transfer request with number '${transferNumber}' not found`);
    }
    return transfer;
  }

  async createTransfer(data: CreateTransferDTO, actorId?: string) {
    if (!actorId) {
      throw new BadRequestError('User authentication required to initiate transfer');
    }

    const created = await this.repo.create(data, actorId);

    await this.audit.logAction({
      userId: actorId,
      action: 'TRANSFER_REQUEST',
      entity: 'TransferRequest',
      entityId: created.id,
      newData: {
        transferNumber: created.transferNumber,
        fromBranchId: created.fromBranchId,
        toBranchId: created.toBranchId,
        itemsCount: created.items?.length || 0,
      },
    });

    return created;
  }

  async approveTransfer(id: string, actorId?: string) {
    if (!actorId) {
      throw new BadRequestError('User authentication required to approve transfer');
    }

    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Transfer request with ID '${id}' not found`);
    }

    if (existing.status !== 'PENDING') {
      throw new BadRequestError(`Cannot approve transfer with status '${existing.status}'`);
    }

    const approved = await this.repo.approve(id, actorId);

    await this.audit.logAction({
      userId: actorId,
      action: 'TRANSFER_APPROVE',
      entity: 'TransferRequest',
      entityId: approved.id,
      oldData: { status: existing.status },
      newData: { status: approved.status },
    });

    return approved;
  }

  async dispatchTransfer(id: string, actorId?: string) {
    if (!actorId) {
      throw new BadRequestError('User authentication required to dispatch transfer');
    }

    const dispatched = await this.repo.dispatchAtomic(id, actorId);

    await this.audit.logAction({
      userId: actorId,
      action: 'TRANSFER_DISPATCH',
      entity: 'TransferRequest',
      entityId: dispatched.id,
      newData: {
        status: dispatched.status,
        transferNumber: dispatched.transferNumber,
        fromBranch: dispatched.fromBranch?.name,
        toBranch: dispatched.toBranch?.name,
      },
    });

    return dispatched;
  }

  async receiveTransfer(id: string, actorId?: string) {
    if (!actorId) {
      throw new BadRequestError('User authentication required to receive transfer');
    }

    const received = await this.repo.receiveAtomic(id, actorId);

    await this.audit.logAction({
      userId: actorId,
      action: 'TRANSFER_RECEIVE',
      entity: 'TransferRequest',
      entityId: received.id,
      newData: {
        status: received.status,
        transferNumber: received.transferNumber,
        fromBranch: received.fromBranch?.name,
        toBranch: received.toBranch?.name,
      },
    });

    return received;
  }

  async rejectTransfer(id: string, input: RejectTransferDTO, actorId?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Transfer request with ID '${id}' not found`);
    }

    if (existing.status !== 'PENDING' && existing.status !== 'APPROVED') {
      throw new BadRequestError(`Cannot reject transfer with status '${existing.status}'`);
    }

    const rejected = await this.repo.reject(id, input.reason);

    await this.audit.logAction({
      userId: actorId,
      action: 'TRANSFER_REJECT',
      entity: 'TransferRequest',
      entityId: rejected.id,
      oldData: { status: existing.status },
      newData: { status: rejected.status, reason: input.reason },
    });

    return rejected;
  }

  async cancelTransfer(id: string, actorId?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Transfer request with ID '${id}' not found`);
    }

    if (existing.status !== 'PENDING' && existing.status !== 'APPROVED') {
      throw new BadRequestError(`Cannot cancel transfer with status '${existing.status}'`);
    }

    const cancelled = await this.repo.cancel(id);

    await this.audit.logAction({
      userId: actorId,
      action: 'TRANSFER_CANCEL',
      entity: 'TransferRequest',
      entityId: cancelled.id,
      oldData: { status: existing.status },
      newData: { status: cancelled.status },
    });

    return cancelled;
  }
}

export const transfersService = new TransfersService();
