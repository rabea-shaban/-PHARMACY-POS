export interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string | null;
  phone?: string | null;
  isMain: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    batches: number;
    sales: number;
  };
}

export interface BranchFormValues {
  name: string;
  code: string;
  address?: string | null;
  phone?: string | null;
  isMain?: boolean;
  isActive?: boolean;
}

export interface BranchQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isMain?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
