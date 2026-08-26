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
  SUPPLIERS: {
    path: '/suppliers',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  SUPPLIERS_NEW: {
    path: '/suppliers/new',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  SUPPLIERS_EDIT: {
    path: '/suppliers/:id/edit',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  SUPPLIERS_DETAILS: {
    path: '/suppliers/:id',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT'],
  },
  PURCHASES: {
    path: '/purchases',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.purchases,
  },
  PURCHASES_NEW: {
    path: '/purchases/new',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  PURCHASES_DETAILS: {
    path: '/purchases/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.purchases,
  },
  CUSTOMERS: {
    path: '/customers',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.customers,
  },
  CUSTOMERS_NEW: {
    path: '/customers/new',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  CUSTOMERS_EDIT: {
    path: '/customers/:id/edit',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  CUSTOMERS_DETAILS: {
    path: '/customers/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.customers,
  },
  SALES: {
    path: '/sales',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.sales,
  },
  SALES_DETAILS: {
    path: '/sales/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.sales,
  },
  RETURNS: {
    path: '/returns',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.returns,
  },
  RETURNS_NEW: {
    path: '/returns/new',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST'],
  },
  RETURNS_DETAILS: {
    path: '/returns/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.returns,
  },
  EXPENSES: {
    path: '/expenses',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.expenses,
  },
  EXPENSES_NEW: {
    path: '/expenses/new',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT'],
  },
  EXPENSES_EDIT: {
    path: '/expenses/:id/edit',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
  },
  EXPENSES_DETAILS: {
    path: '/expenses/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.expenses,
  },
  PAYMENTS: {
    path: '/payments',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.payments,
  },
  FINANCE: {
    path: '/finance',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.finance,
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
  AUDIT_DETAILS: {
    path: '/audit/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.audit,
  },
  ACTIVITY: {
    path: '/activity',
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
  USERS_NEW: {
    path: '/users/new',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
  },
  USERS_EDIT: {
    path: '/users/:id/edit',
    isProtected: true,
    allowedRoles: ['PLATFORM_MANAGER', 'PHARMACY_MANAGER'],
  },
  USERS_DETAILS: {
    path: '/users/:id',
    isProtected: true,
    allowedRoles: MODULE_PERMISSIONS.users,
  },
  FORBIDDEN: {
    path: '/forbidden',
    isProtected: true,
  },
};
