import { authRepository } from './auth.repository.js';
import { auditService } from '../audit/audit.service.js';
import { usersService } from '../users/users.service.js';
import { comparePassword } from '../../utils/password.util.js';
import { generateAccessToken } from '../../utils/jwt.util.js';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors.js';
export class AuthService {
    authRepo;
    audit;
    users;
    constructor(authRepo = authRepository, audit = auditService, users = usersService) {
        this.authRepo = authRepo;
        this.audit = audit;
        this.users = users;
    }
    async login(input) {
        const identifier = (input.phone || input.email || input.identifier || '').trim();
        if (!identifier) {
            throw new UnauthorizedError('Phone or email identifier is required');
        }
        const user = await this.authRepo.findByIdentifier(identifier);
        // Generic error message to prevent account enumeration
        if (!user) {
            await this.audit.logAction({
                action: 'LOGIN',
                entity: 'auth',
                metadata: { status: 'FAILED', phone: identifier, reason: 'User not found' },
            });
            throw new UnauthorizedError('Invalid credentials');
        }
        if (!user.isActive) {
            await this.audit.logAction({
                userId: user.id,
                action: 'LOGIN',
                entity: 'auth',
                metadata: { status: 'FAILED', phone: identifier, reason: 'Account deactivated' },
            });
            throw new UnauthorizedError('Invalid credentials');
        }
        const isPasswordValid = await comparePassword(input.password, user.passwordHash);
        if (!isPasswordValid) {
            await this.audit.logAction({
                userId: user.id,
                action: 'LOGIN',
                entity: 'auth',
                metadata: { status: 'FAILED', phone: identifier, reason: 'Invalid password' },
            });
            throw new UnauthorizedError('Invalid credentials');
        }
        const safeUser = {
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
        // Record successful login audit log
        await this.audit.logAction({
            userId: user.id,
            action: 'LOGIN',
            entity: 'auth',
            entityId: user.id,
            metadata: { status: 'SUCCESS', role: user.role, identifier },
        });
        return {
            user: safeUser,
            accessToken,
        };
    }
    async register(input, actorId, actorRole) {
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
    async getMe(userId) {
        const user = await this.authRepo.findById(userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedError('User account not found or inactive');
        }
        return user;
    }
}
export const authService = new AuthService();
//# sourceMappingURL=auth.service.js.map