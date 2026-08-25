import { auditRepository, AuditRepository } from './audit.repository.js';
import { CreateAuditLogDTO } from './audit.types.js';

export class AuditService {
  constructor(private readonly repo: AuditRepository = auditRepository) {}

  async logAction(data: CreateAuditLogDTO) {
    return this.repo.log(data);
  }
}

export const auditService = new AuditService();
