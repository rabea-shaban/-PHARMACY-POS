import { Role } from '@prisma/client';
import { authRepository, AuthRepository } from './auth.repository.js';
import { auditService, AuditService } from '../audit/audit.service.js';
import { usersService, UsersService } from '../users/users.service.js';
import { comparePassword } from '../../utils/password.util.js';
import { generateAccessToken } from '../../utils/jwt.util.js';
import { LoginDTO } from './auth.validator.js';
import { CreateUserDTO } from '../users/users.validator.js';
import { SafeUser, LoginResult } from '../../types/auth.types.js';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors.js';

export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository = authRepository,
    private readonly audit: AuditService = auditService,
    private readonly users: UsersService = usersService
  ) {}

  async login(input: LoginDTO): Promise<LoginResult> {
    const identifier = (input.phone || input.email || input.identifier || '').trim();
    if (!identifier) {
      throw new UnauthorizedError('Phone or email identifier is required');
    }

    const user = await this.authRepo.findByIdentifier(identifier);

    // Generic error message to prevent account enumeration
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const accessToken = generateAccessToken({
      id: user.id,
      role: user.role,
    });

    // Record login audit log
    await this.audit.logAction({
      userId: user.id,
      action: 'LOGIN',
      entity: 'users',
      entityId: user.id,
      metadata: { role: user.role, identifier },
    });

    return {
      user: safeUser,
      accessToken,
    };
  }

  async register(input: CreateUserDTO, actorId?: string, actorRole?: Role): Promise<SafeUser> {
    // 1. Initial bootstrapping: allow registering first PLATFORM_MANAGER if system has 0 users
    if (!actorRole) {
      const totalUsers = await this.authRepo.countUsers();
      if (totalUsers > 0) {
        throw new ForbiddenError('Staff registration is restricted. Only Super Admin or Pharmacy Manager can register staff members.');
      }
      // First user bootstrap
      actorRole = 'PLATFORM_MANAGER';
    }

    // 2. Delegate creation and business validation to UsersService
    return this.users.createUser(input, actorId || 'bootstrap-admin', actorRole);
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await this.authRepo.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User account not found or inactive');
    }
    return user;
  }
}

export const authService = new AuthService();
