import { Role } from '@prisma/client';
import { UsersRepository } from './users.repository.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateUserDTO, UpdateUserDTO } from './users.validator.js';
import { SafeUser } from '../../types/auth.types.js';
import { PaginatedUsersResponse, UserQueryParams } from './users.types.js';
export declare class UsersService {
    private readonly repo;
    private readonly audit;
    constructor(repo?: UsersRepository, audit?: AuditService);
    getUsers(params: UserQueryParams): Promise<PaginatedUsersResponse>;
    getUserById(id: string): Promise<SafeUser>;
    createUser(input: CreateUserDTO, actorId: string, actorRole?: Role): Promise<SafeUser>;
    updateUser(id: string, input: UpdateUserDTO, actorId: string, actorRole?: Role): Promise<SafeUser>;
    deleteUser(id: string, actorId: string): Promise<SafeUser>;
}
export declare const usersService: UsersService;
