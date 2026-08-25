import { PaginationMeta } from '../types/common.types.js';

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

export function parsePaginationParams(query: { page?: unknown; limit?: unknown }): ParsedPagination {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function getPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
  };
}
