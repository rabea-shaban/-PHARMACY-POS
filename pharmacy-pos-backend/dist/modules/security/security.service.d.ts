import { SecurityRepository } from './security.repository.js';
import { PaginatedSecurityLogsResponse, SecurityStatsResponse } from './security.types.js';
import { SecurityQueryDTO } from './security.validator.js';
export declare class SecurityService {
    private readonly repo;
    constructor(repo?: SecurityRepository);
    getLoginLogs(filters: SecurityQueryDTO): Promise<PaginatedSecurityLogsResponse>;
    getStats(from?: string, to?: string): Promise<SecurityStatsResponse>;
}
export declare const securityService: SecurityService;
