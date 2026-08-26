import { userRepository } from '../repositories/user.repository.js';
import { auditRepository } from '../repositories/audit.repository.js';
import { comparePassword, hashPassword } from '../utils/password.util.js';
import { generateAccessToken } from '../utils/jwt.util.js';
import { UnauthorizedError, ForbiddenError, ConflictError } from '../utils/errors.js';
export class AuthService {
    userRepo;
    auditRepo;
    constructor(userRepo = userRepository, auditRepo = auditRepository) {
        this.userRepo = userRepo;
        this.auditRepo = auditRepo;
    }
    async login(input) {
        const identifier = (input.phone || input.email || input.identifier || '').trim();
        if (!identifier) {
            throw new UnauthorizedError('Phone or email identifier is required');
        }
        const user = await this.userRepo.findByIdentifier(identifier);
        // Generic error message to prevent user enumeration
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
        // Log successful staff login in audit trail
        await this.auditRepo.log({
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
    async register(input, actorId, actorRole) {
        // 1. If no authenticated actor: only allow if database has 0 users (initial bootstrapping)
        if (!actorRole) {
            const { total } = await this.userRepo.findMany({ page: 1, limit: 1 });
            if (total > 0) {
                throw new ForbiddenError('Staff registration is restricted. Only Super Admin or Pharmacy Manager can register staff members.');
            }
        }
        else {
            // 2. Role-Based Creation:
            // PLATFORM_MANAGER can create any role
            // PHARMACY_MANAGER can only create PHARMACIST and ACCOUNTANT
            if (actorRole === 'PHARMACY_MANAGER') {
                if (input.role === 'PLATFORM_MANAGER' || input.role === 'PHARMACY_MANAGER') {
                    throw new ForbiddenError('Pharmacy Manager can only register Pharmacist or Accountant accounts');
                }
            }
            else if (actorRole !== 'PLATFORM_MANAGER') {
                throw new ForbiddenError('Only Super Admin (Platform Manager) or Pharmacy Manager can register staff accounts');
            }
        }
        // Check duplicate phone
        const existingPhone = await this.userRepo.findByPhone(input.phone.trim());
        if (existingPhone) {
            throw new ConflictError(`Phone number '${input.phone}' is already registered to another staff member`);
        }
        // Check duplicate email
        if (input.email && input.email.trim()) {
            const existingEmail = await this.userRepo.findByEmail(input.email.trim());
            if (existingEmail) {
                throw new ConflictError(`Email address '${input.email}' is already registered to another staff member`);
            }
        }
        const passwordHash = await hashPassword(input.password);
        const newUser = await this.userRepo.create({
            name: input.name.trim(),
            phone: input.phone.trim(),
            email: input.email ? input.email.trim() : null,
            passwordHash,
            role: input.role,
        });
        // Record audit log
        await this.auditRepo.log({
            userId: actorId || newUser.id,
            action: 'CREATE',
            entity: 'users',
            entityId: newUser.id,
            newData: { name: newUser.name, phone: newUser.phone, role: newUser.role },
            metadata: { via: 'auth/register' },
        });
        return newUser;
    }
    async getMe(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedError('User account not found or inactive');
        }
        return user;
    }
}
export const authService = new AuthService();
//# sourceMappingURL=auth.service.js.map