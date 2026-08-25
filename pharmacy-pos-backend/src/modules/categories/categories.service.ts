import { categoriesRepository, CategoriesRepository } from './categories.repository.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { CreateCategoryDTO, UpdateCategoryDTO } from './categories.validator.js';
import {
  CategoryResponse,
  CategoryQueryFilters,
  PaginatedCategoriesResponse,
} from './categories.types.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';

function formatCategory(raw: any): CategoryResponse {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    isActive: raw.isActive,
    productCount: raw._count?.products ?? 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class CategoriesService {
  constructor(
    private readonly repo: CategoriesRepository = categoriesRepository,
    private readonly audit: AuditService = auditService
  ) {}

  async getCategories(filters: CategoryQueryFilters): Promise<PaginatedCategoriesResponse> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const { items, total } = await this.repo.findMany(filters);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items: items.map(formatCategory),
      pagination,
    };
  }

  async getCategoryById(id: string): Promise<CategoryResponse> {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }
    return formatCategory(category);
  }

  async createCategory(input: CreateCategoryDTO, actorId?: string): Promise<CategoryResponse> {
    const name = input.name.trim();

    // Duplicate check
    const existing = await this.repo.findByName(name);
    if (existing) {
      throw new ConflictError(`Category with name '${name}' already exists`);
    }

    const created = await this.repo.create({
      name,
      description: input.description ? input.description.trim() : null,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'CREATE',
      entity: 'categories',
      entityId: created.id,
      newData: { name: created.name, description: created.description },
    });

    return formatCategory(created);
  }

  async updateCategory(id: string, input: UpdateCategoryDTO, actorId?: string): Promise<CategoryResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }

    if (input.name && input.name.trim() !== existing.name) {
      const name = input.name.trim();
      const duplicate = await this.repo.findByName(name);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictError(`Category with name '${name}' already exists`);
      }
    }

    const updateData: { name?: string; description?: string | null; isActive?: boolean } = {};
    if (input.name) updateData.name = input.name.trim();
    if (input.description !== undefined) updateData.description = input.description ? input.description.trim() : null;
    if (typeof input.isActive === 'boolean') updateData.isActive = input.isActive;

    const updated = await this.repo.update(id, updateData);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'UPDATE',
      entity: 'categories',
      entityId: id,
      oldData: { name: existing.name, isActive: existing.isActive },
      newData: { name: updated.name, isActive: updated.isActive },
    });

    return formatCategory(updated);
  }

  async deleteCategory(id: string, actorId?: string): Promise<CategoryResponse> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}' not found`);
    }

    // Soft delete to protect product relationships
    const deactivated = await this.repo.softDelete(id);

    // Record audit log
    await this.audit.logAction({
      userId: actorId || null,
      action: 'DELETE',
      entity: 'categories',
      entityId: id,
      metadata: { reason: 'Soft deactivation of category' },
    });

    return formatCategory(deactivated);
  }
}

export const categoriesService = new CategoriesService();
