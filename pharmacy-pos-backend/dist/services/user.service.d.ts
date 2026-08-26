import { Role } from '@prisma/client';
import { UserRepository, UserFilterParams } from '../repositories/user.repository.js';
import { AuditRepository } from '../repositories/audit.repository.js';
import { CreateUserDTO, UpdateUserDTO } from '../validators/user.validator.js';
import { SafeUser, PaginatedResult } from '../types/index.js';
export declare class UserService {
    private readonly userRepo;
    private readonly auditRepo;
    constructor(userRepo?: UserRepository, auditRepo?: AuditRepository);
    getUsers(params: UserFilterParams): Promise<PaginatedResult<SafeUser>>;
    getUserById(id: string): Promise<SafeUser>;
    createUser(input: CreateUserDTO, actorId: string, actorRole?: Role): Promise<SafeUser>;
    updateUser(id: string, input: UpdateUserDTO, actorId: string, actorRole?: Role): Promise<SafeUser>;
    deleteUser(id: string, actorId: string): Promise<SafeUser>;
}
export declare const userService: UserService;
