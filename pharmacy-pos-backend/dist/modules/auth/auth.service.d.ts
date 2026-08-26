import { Role } from '@prisma/client';
import { AuthRepository } from './auth.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { UsersService } from '../users/users.service.js';
import { LoginDTO } from './auth.validator.js';
import { CreateUserDTO } from '../users/users.validator.js';
import { SafeUser, LoginResult } from '../../types/auth.types.js';
export declare class AuthService {
    private readonly authRepo;
    private readonly audit;
    private readonly users;
    constructor(authRepo?: AuthRepository, audit?: AuditService, users?: UsersService);
    login(input: LoginDTO): Promise<LoginResult>;
    register(input: CreateUserDTO, actorId?: string, actorRole?: Role): Promise<SafeUser>;
    getMe(userId: string): Promise<SafeUser>;
}
export declare const authService: AuthService;
