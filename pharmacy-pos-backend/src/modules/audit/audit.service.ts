import { auditRepository, AuditRepository } from './audit.repository.js';
import { parseDateRange } from '../../utils/date.util.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import {
  CreateAuditLogDTO,
  AuditLogResponse,
  PaginatedAuditLogsResponse,
  AuditActivitySummaryResponse,
} from './audit.types.js';
import { AuditQueryDTO } from './audit.validator.js';
import { NotFoundError } from '../../utils/errors.js';

function parseJsonSafe(val?: string | null): any {
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

function formatAuditLog(raw: any): AuditLogResponse {
  return {
    id: raw.id,
    userId: raw.userId,
    userName: raw.user?.name || 'System / Anonymous',
    userRole: raw.user?.role || null,
    action: raw.action,
    entity: raw.entity,
    entityId: raw.entityId,
    oldData: parseJsonSafe(raw.oldData),
    newData: parseJsonSafe(raw.newData),
    metadata: parseJsonSafe(raw.metadata),
    createdAt: raw.createdAt,
  };
}

export class AuditService {
  constructor(private readonly repo: AuditRepository = auditRepository) {}

  async logAction(data: CreateAuditLogDTO) {
    return this.repo.log(data);
  }

  async getAuditLogs(filters: AuditQueryDTO): Promise<PaginatedAuditLogsResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);

    const { items, total } = await this.repo.findMany({
      page,
      limit,
      userId: filters.userId,
      action: filters.action,
      entity: filters.entity,
      entityId: filters.entityId,
      from: filters.from,
      to: filters.to,
    });

    return {
      items: items.map(formatAuditLog),
      pagination: getPaginationMeta(total, page, limit),
    };
  }

  async getAuditLogById(id: string): Promise<AuditLogResponse> {
    const log = await this.repo.findById(id);
    if (!log) {
      throw new NotFoundError(`Audit log with ID '${id}' not found`);
    }
    return formatAuditLog(log);
  }

  async getActivitySummary(from?: string, to?: string): Promise<AuditActivitySummaryResponse> {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (from || to) {
      const parsed = parseDateRange(from, to);
      startDate = parsed.startDate;
      endDate = parsed.endDate;
    }

    const summary = await this.repo.getSummary(startDate, endDate);

    return {
      ...(from || to ? { period: { from: from || '', to: to || '' } } : {}),
      ...summary,
    };
  }
}

export const auditService = new AuditService();
