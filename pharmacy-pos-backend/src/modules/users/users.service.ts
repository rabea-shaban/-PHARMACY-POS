import { Role } from '@prisma/client';
import { usersRepository, UsersRepository } from './users.repository.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { hashPassword } from '../../utils/password.util.js';
import { getPaginationMeta } from '../../utils/pagination.util.js';
import { CreateUserDTO, UpdateUserDTO } from './users.validator.js';
import { SafeUser } from '../../types/auth.types.js';
import { PaginatedUsersResponse, UserQueryParams } from './users.types.js';
import { NotFoundError, ConflictError, ForbiddenError, BadRequestError } from '../../utils/errors.js';

export class UsersService {
  constructor(
    private readonly repo: UsersRepository = usersRepository,
    private readonly audit: AuditService = auditService
  ) {}

  async getUsers(params: UserQueryParams): Promise<PaginatedUsersResponse> {
    const { items, total } = await this.repo.findMany(params);
    const limit = Math.max(1, Number(params.limit) || 20);
    const page = Math.max(1, Number(params.page) || 1);
    const pagination = getPaginationMeta(total, page, limit);

    return {
      items,
      pagination,
    };
  }

  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID '${id}' not found`);
    }
    return user;
  }

  async createUser(input: CreateUserDTO, actorId: string, actorRole?: Role): Promise<SafeUser> {
    // 1. Role-Based Creation Hierarchy:
    // PLATFORM_MANAGER (Super Admin): Can create any role
    // PHARMACY_MANAGER (Admin): Can ONLY create PHARMACIST and ACCOUNTANT
    if (actorRole === 'PHARMACY_MANAGER') {
      if (input.role === 'PLATFORM_MANAGER' || input.role === 'PHARMACY_MANAGER') {
        throw new ForbiddenError('Pharmacy Manager can only create Pharmacist or Accountant accounts');
      }
    } else if (actorRole !== 'PLATFORM_MANAGER') {
      throw new ForbiddenError('Only Super Admin (Platform Manager) or Pharmacy Manager can create staff accounts');
    }

    // 2. Check duplicate phone
    const existingPhone = await this.repo.findByPhone(input.phone.trim());
    if (existingPhone) {
      throw new ConflictError(`Phone number '${input.phone}' is already registered to another staff member`);
    }

    // 3. Check duplicate email if provided
    if (input.email && input.email.trim()) {
      const existingEmail = await this.repo.findByEmail(input.email.trim());
      if (existingEmail) {
        throw new ConflictError(`Email address '${input.email}' is already registered to another staff member`);
      }
    }

    const passwordHash = await hashPassword(input.password);

    const newUser = await this.repo.create({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email ? input.email.trim() : null,
      passwordHash,
      role: input.role,
    });

    // Record audit log
    await this.audit.logAction({
      userId: actorId,
      action: 'CREATE',
      entity: 'users',
      entityId: newUser.id,
      newData: { name: newUser.name, phone: newUser.phone, role: newUser.role },
    });

    return newUser;
  }

  async updateUser(id: string, input: UpdateUserDTO, actorId: string, actorRole?: Role): Promise<SafeUser> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`User with ID '${id}' not found`);
    }

    // Role escalation check
    if (input.role && input.role === 'PLATFORM_MANAGER' && actorRole !== 'PLATFORM_MANAGER') {
      throw new ForbiddenError('Only a Platform Manager can promote a user to Platform Manager');
    }

    if (actorRole === 'PHARMACY_MANAGER' && (input.role === 'PLATFORM_MANAGER' || input.role === 'PHARMACY_MANAGER')) {
      throw new ForbiddenError('Pharmacy Manager cannot assign Manager roles');
    }

    // Uniqueness validation on phone
    if (input.phone && input.phone.trim() !== existing.phone) {
      const phoneTaken = await this.repo.findByPhone(input.phone.trim());
      if (phoneTaken && phoneTaken.id !== id) {
        throw new ConflictError(`Phone number '${input.phone}' is already registered to another user`);
      }
    }

    // Uniqueness validation on email
    if (input.email && input.email.trim() !== existing.email) {
      const emailTaken = await this.repo.findByEmail(input.email.trim());
      if (emailTaken && emailTaken.id !== id) {
        throw new ConflictError(`Email address '${input.email}' is already registered to another user`);
      }
    }

    const updateData: {
      name?: string;
      phone?: string;
      email?: string | null;
      passwordHash?: string;
      role?: Role;
      isActive?: boolean;
    } = {};

    if (input.name) updateData.name = input.name.trim();
    if (input.phone) updateData.phone = input.phone.trim();
    if (input.email !== undefined) updateData.email = input.email ? input.email.trim() : null;
    if (input.role) updateData.role = input.role;
    if (typeof input.isActive === 'boolean') updateData.isActive = input.isActive;

    if (input.password && input.password.trim()) {
      updateData.passwordHash = await hashPassword(input.password);
    }

    const updatedUser = await this.repo.update(id, updateData);

    // Record audit log
    await this.audit.logAction({
      userId: actorId,
      action: 'UPDATE',
      entity: 'users',
      entityId: id,
      oldData: { name: existing.name, phone: existing.phone, role: existing.role, isActive: existing.isActive },
      newData: { name: updatedUser.name, phone: updatedUser.phone, role: updatedUser.role, isActive: updatedUser.isActive },
    });

    return updatedUser;
  }

  async deleteUser(id: string, actorId: string): Promise<SafeUser> {
    if (id === actorId) {
      throw new BadRequestError('You cannot deactivate your own account');
    }

    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`User with ID '${id}' not found`);
    }

    // Soft delete to protect financial/POS audit integrity
    const deactivatedUser = await this.repo.softDelete(id);

    // Record audit log
    await this.audit.logAction({
      userId: actorId,
      action: 'DELETE',
      entity: 'users',
      entityId: id,
      metadata: { reason: 'Soft deactivation by administrator' },
    });

    return deactivatedUser;
  }
}

export const usersService = new UsersService();
