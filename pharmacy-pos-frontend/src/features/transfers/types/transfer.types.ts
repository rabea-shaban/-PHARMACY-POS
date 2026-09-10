export type TransferStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface TransferRequestItem {
  id: string;
  transferId: string;
  productId: string;
  batchId?: string | null;
  quantity: number;
  unitCost: number;
  notes?: string | null;
  product: {
    id: string;
    name: string;
    arabicName?: string | null;
    barcode?: string | null;
    unit?: string | null;
  };
  batch?: {
    id: string;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
  } | null;
}

export interface TransferRequest {
  id: string;
  transferNumber: string;
  fromBranchId: string;
  toBranchId: string;
  status: TransferStatus;
  requestedById: string;
  approvedById?: string | null;
  dispatchedById?: string | null;
  receivedById?: string | null;
  rejectionReason?: string | null;
  notes?: string | null;
  requestedAt: string;
  approvedAt?: string | null;
  dispatchedAt?: string | null;
  receivedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  fromBranch: {
    id: string;
    name: string;
    code: string;
    phone?: string | null;
  };
  toBranch: {
    id: string;
    name: string;
    code: string;
    phone?: string | null;
  };
  requestedBy: {
    id: string;
    name: string;
    role: string;
  };
  approvedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
  dispatchedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
  receivedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
  items: TransferRequestItem[];
}

export interface CreateTransferItemPayload {
  productId: string;
  batchId?: string | null;
  quantity: number;
  unitCost?: number;
  notes?: string | null;
}

export interface CreateTransferPayload {
  fromBranchId: string;
  toBranchId: string;
  notes?: string | null;
  items: CreateTransferItemPayload[];
}

export interface TransferQueryParams {
  page?: number;
  limit?: number;
  fromBranchId?: string;
  toBranchId?: string;
  branchId?: string;
  status?: TransferStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
