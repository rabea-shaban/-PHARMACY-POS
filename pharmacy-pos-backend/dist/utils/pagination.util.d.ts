import { PaginationMeta } from '../types/common.types.js';
export interface ParsedPagination {
    page: number;
    limit: number;
    skip: number;
}
export declare function parsePaginationParams(query: {
    page?: unknown;
    limit?: unknown;
}): ParsedPagination;
export declare function getPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
