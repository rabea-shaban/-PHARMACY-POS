import { branchesRepository } from './branches.repository.js';
import { auditService } from '../audit/audit.service.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../utils/errors.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
export class BranchesService {
    repo;
    audit;
    constructor(repo = branchesRepository, audit = auditService) {
        this.repo = repo;
        this.audit = audit;
    }
    async getBranches(query) {
        const { branches, total } = await this.repo.findAll(query);
        return {
            items: branches,
            pagination: getPaginationMeta(total, query.page, query.limit),
        };
    }
    async getBranchById(id) {
        const branch = await this.repo.findById(id);
        if (!branch) {
            throw new NotFoundError(`Branch with ID '${id}' not found`);
        }
        return branch;
    }
    async createBranch(data, actorId) {
        const existing = await this.repo.findByCode(data.code);
        if (existing) {
            throw new ConflictError(`Branch with code '${data.code}' already exists`);
        }
        if (data.isMain) {
            await this.repo.unsetAllMainBranches();
        }
        const created = await this.repo.create(data);
        await this.audit.logAction({
            userId: actorId,
            action: 'BRANCH_CREATE',
            entity: 'Branch',
            entityId: created.id,
            newData: { name: created.name, code: created.code, isMain: created.isMain },
        });
        return created;
    }
    async updateBranch(id, data, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Branch with ID '${id}' not found`);
        }
        if (data.code && data.code !== existing.code) {
            const codeDuplicate = await this.repo.findByCode(data.code);
            if (codeDuplicate && codeDuplicate.id !== id) {
                throw new ConflictError(`Branch with code '${data.code}' already exists`);
            }
        }
        if (data.isMain && !existing.isMain) {
            await this.repo.unsetAllMainBranches();
        }
        const updated = await this.repo.update(id, data);
        await this.audit.logAction({
            userId: actorId,
            action: 'BRANCH_UPDATE',
            entity: 'Branch',
            entityId: updated.id,
            oldData: { name: existing.name, code: existing.code, isMain: existing.isMain, isActive: existing.isActive },
            newData: { name: updated.name, code: updated.code, isMain: updated.isMain, isActive: updated.isActive },
        });
        return updated;
    }
    async deleteBranch(id, actorId) {
        const existing = await this.repo.findById(id);
        if (!existing) {
            throw new NotFoundError(`Branch with ID '${id}' not found`);
        }
        if (existing.isMain) {
            throw new BadRequestError('Cannot deactivate the main branch');
        }
        const deactivated = await this.repo.delete(id);
        await this.audit.logAction({
            userId: actorId,
            action: 'BRANCH_UPDATE',
            entity: 'Branch',
            entityId: deactivated.id,
            oldData: { isActive: true },
            newData: { isActive: false },
        });
        return deactivated;
    }
}
export const branchesService = new BranchesService();
//# sourceMappingURL=branches.service.js.map