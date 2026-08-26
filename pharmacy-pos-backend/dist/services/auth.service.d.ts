import { Role } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository.js';
import { AuditRepository } from '../repositories/audit.repository.js';
import { LoginDTO } from '../validators/auth.validator.js';
import { CreateUserDTO } from '../validators/user.validator.js';
import { SafeUser } from '../types/index.js';
export interface LoginResult {
    user: SafeUser;
    accessToken: string;
}
export declare class AuthService {
    private readonly userRepo;
    private readonly auditRepo;
    constructor(userRepo?: UserRepository, auditRepo?: AuditRepository);
    login(input: LoginDTO): Promise<LoginResult>;
    register(input: CreateUserDTO, actorId?: string, actorRole?: Role): Promise<SafeUser>;
    getMe(userId: string): Promise<SafeUser>;
}
export declare const authService: AuthService;
