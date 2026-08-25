import { Role } from '../types/auth.types.js';
import { MODULE_PERMISSIONS } from '../config/permissions.js';

export interface AppRouteDefinition {
  path: string;
  isProtected: boolean;
  allowedRoles?: Role[];
}

export const APP_ROUTES: Record<string, AppRouteDefinition> = {
  LOGIN: {
    path: '/login',
    isProtected: false,
  },
  DASHBOARD: {
    path: '/dashboard',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.dashboard,
  },
  POS: {
    path: '/pos',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.pos,
  },
  PRODUCTS: {
    path: '/products',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.products,
  },
  PRODUCTS_NEW: {
    path: '/products/new',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  PRODUCTS_EDIT: {
    path: '/products/:id/edit',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  PRODUCTS_DETAILS: {
    path: '/products/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.products,
  },
  CATEGORIES: {
    path: '/categories',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  INVENTORY: {
    path: '/inventory',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.inventory,
  },
  INVENTORY_BATCHES: {
    path: '/inventory/batches',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.inventory,
  },
  INVENTORY_LOW_STOCK: {
    path: '/inventory/low-stock',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.inventory,
  },
  INVENTORY_EXPIRY: {
    path: '/inventory/expiry',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.inventory,
  },
  INVENTORY_TRANSACTIONS: {
    path: '/inventory/transactions',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.inventory,
  },
  PURCHASES: {
    path: '/purchases',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.purchases,
  },
  CUSTOMERS: {
    path: '/customers',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.customers,
  },
  SALES: {
    path: '/sales',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.sales,
  },
  RETURNS: {
    path: '/returns',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.returns,
  },
  EXPENSES: {
    path: '/expenses',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.expenses,
  },
  PAYROLL: {
    path: '/payroll',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.payroll,
  },
  REPORTS: {
    path: '/reports',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.reports,
  },
  NOTIFICATIONS: {
    path: '/notifications',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.notifications,
  },
  AUDIT: {
    path: '/audit',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.audit,
  },
  SETTINGS: {
    path: '/settings',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.settings,
  },
  USERS: {
    path: '/users',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.users,
  },
  FORBIDDEN: {
    path: '/forbidden',
    isProtected: true,
  },
};
