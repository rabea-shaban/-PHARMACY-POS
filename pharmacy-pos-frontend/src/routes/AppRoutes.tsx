import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { setUser, clearUser, setCheckingAuth, setSessionExpired } from '../store/slices/authSlice.js';
import { setPublicSettings } from '../store/slices/settingsSlice.js';
import { authApi } from '../features/auth/api/authApi.js';
import { registerSessionExpiredHandler } from '../lib/api.js';
import { queryClient } from '../lib/queryClient.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { POSPage } from '../pages/POSPage.js';
import { ForbiddenPage } from '../pages/ForbiddenPage.js';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { ProtectedRoute } from '../components/common/ProtectedRoute.js';
import { RoleGuard } from '../components/common/RoleGuard.js';
import { AppLayout } from '../components/layout/AppLayout.js';
import { MODULE_PERMISSIONS, getDefaultRouteForRole } from '../config/permissions.js';

// F04: Products & Categories Pages
import { ProductsPage } from '../features/products/pages/ProductsPage.js';
import { CreateProductPage } from '../features/products/pages/CreateProductPage.js';
import { EditProductPage } from '../features/products/pages/EditProductPage.js';
import { ProductDetailsPage } from '../features/products/pages/ProductDetailsPage.js';
import { CategoriesPage } from '../features/categories/pages/CategoriesPage.js';

// F04: Inventory Pages
import { InventoryPage } from '../features/inventory/pages/InventoryPage.js';
import { BatchesPage } from '../features/inventory/pages/BatchesPage.js';
import { LowStockPage } from '../features/inventory/pages/LowStockPage.js';
import { ExpiryAlertsPage } from '../features/inventory/pages/ExpiryAlertsPage.js';
import { InventoryTransactionsPage } from '../features/inventory/pages/InventoryTransactionsPage.js';

// F05: Suppliers Pages
import { SuppliersPage } from '../features/suppliers/pages/SuppliersPage.js';
import { CreateSupplierPage } from '../features/suppliers/pages/CreateSupplierPage.js';
import { EditSupplierPage } from '../features/suppliers/pages/EditSupplierPage.js';
import { SupplierDetailsPage } from '../features/suppliers/pages/SupplierDetailsPage.js';

// F05: Purchases Pages
import { PurchasesPage } from '../features/purchases/pages/PurchasesPage.js';
import { CreatePurchasePage } from '../features/purchases/pages/CreatePurchasePage.js';
import { PurchaseDetailsPage } from '../features/purchases/pages/PurchaseDetailsPage.js';

// F06: Sales & POS Pages
import { SalesPage } from '../features/sales/pages/SalesPage.js';
import { SaleDetailsPage } from '../features/sales/pages/SaleDetailsPage.js';

// F07: Returns & Refunds Pages
import { ReturnsPage } from '../features/returns/pages/ReturnsPage.js';
import { CreateReturnPage } from '../features/returns/pages/CreateReturnPage.js';
import { ReturnDetailsPage } from '../features/returns/pages/ReturnDetailsPage.js';

// F08: Customers & Loyalty Pages
import { CustomersPage } from '../features/customers/pages/CustomersPage.js';
import { CreateCustomerPage } from '../features/customers/pages/CreateCustomerPage.js';
import { EditCustomerPage } from '../features/customers/pages/EditCustomerPage.js';
import { CustomerDetailsPage } from '../features/customers/pages/CustomerDetailsPage.js';

// F09: Expenses & Financial Management Pages
import { ExpensesPage } from '../features/expenses/pages/ExpensesPage.js';
import { CreateExpensePage } from '../features/expenses/pages/CreateExpensePage.js';
import { EditExpensePage } from '../features/expenses/pages/EditExpensePage.js';
import { ExpenseDetailsPage } from '../features/expenses/pages/ExpenseDetailsPage.js';
import { FinanceDashboardPage } from '../features/finance/pages/FinanceDashboardPage.js';
import { PaymentsLedgerPage } from '../features/finance/pages/PaymentsLedgerPage.js';

// F10: Users & Staff Management Pages
import { UsersPage } from '../features/users/pages/UsersPage.js';
import { CreateUserPage } from '../features/users/pages/CreateUserPage.js';
import { EditUserPage } from '../features/users/pages/EditUserPage.js';
import { UserDetailsPage } from '../features/users/pages/UserDetailsPage.js';

// F11: Audit Logs, Notifications & System Activity Pages
import { AuditLogsPage } from '../features/audit/pages/AuditLogsPage.js';
import { AuditDetailsPage } from '../features/audit/pages/AuditDetailsPage.js';
import { SystemActivityPage } from '../features/audit/pages/SystemActivityPage.js';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage.js';

// F12: Payroll & Staff Wages Pages
import { PayrollPage } from '../features/payroll/pages/PayrollPage.js';
import { CreatePayrollPage } from '../features/payroll/pages/CreatePayrollPage.js';
import { PayrollDetailsPage } from '../features/payroll/pages/PayrollDetailsPage.js';
import { SalarySlipPage } from '../features/payroll/pages/SalarySlipPage.js';

// F13: Staff Sales Commissions & Incentives Pages
import { CommissionsPage } from '../features/commissions/pages/CommissionsPage.js';
import { CommissionRulesPage } from '../features/commissions/pages/CommissionRulesPage.js';
import { CommissionStatementPage } from '../features/commissions/pages/CommissionStatementPage.js';

// F14: Comprehensive Reports & Analytics Pages
import { ReportsPage } from '../features/reports/pages/ReportsPage.js';

// F15: Insurance & Third-Party Claims Billing Pages
import { InsuranceProvidersPage } from '../features/insurance/pages/InsuranceProvidersPage.js';

// F16: System Settings, Tax Configuration & Pharmacy Branding Pages
import { SettingsPage } from '../features/settings/pages/SettingsPage.js';
import { usePublicSettings } from '../features/settings/hooks/useSettings.js';

export const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const { publicSettings } = useAppSelector((state) => state.settings);

  // Synchronize public pharmacy settings across the entire app
  const { data: publicSettingsData } = usePublicSettings();

  useEffect(() => {
    if (publicSettingsData) {
      dispatch(setPublicSettings(publicSettingsData));
    }
  }, [publicSettingsData, dispatch]);

  useEffect(() => {
    if (publicSettings.pharmacyName) {
      document.title = `${publicSettings.pharmacyName} — POS & Management`;
    }
  }, [publicSettings.pharmacyName]);

  // Register session expired handler for Axios 401 interceptor
  useEffect(() => {
    registerSessionExpiredHandler(() => {
      localStorage.removeItem('accessToken');
      dispatch(setSessionExpired(true));
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      navigate('/login', { replace: true });
    });
  }, [dispatch, navigate]);

  // Auth Bootstrap: Verify HttpOnly Session Cookie on application load
  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const user = await authApi.getMe();
        if (isMounted && user) {
          dispatch(setUser(user));
          queryClient.setQueryData(['currentUser'], user);
        }
      } catch {
        if (isMounted) {
          dispatch(clearUser());
        }
      } finally {
        if (isMounted) {
          dispatch(setCheckingAuth(false));
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const defaultDestination = getDefaultRouteForRole(role);

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                (location.state as any)?.from?.pathname && (location.state as any)?.from?.pathname !== '/login'
                  ? (location.state as any).from.pathname
                  : defaultDestination
              }
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Protected App Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={defaultDestination} replace />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.dashboard}>
              <DashboardPage />
            </RoleGuard>
          }
        />

        {/* POS Cashier */}
        <Route
          path="/pos"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.pos}>
              <POSPage />
            </RoleGuard>
          }
        />

        {/* Products Module */}
        <Route
          path="/products"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.products}>
              <ProductsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/products/new"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <CreateProductPage />
            </RoleGuard>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <EditProductPage />
            </RoleGuard>
          }
        />
        <Route
          path="/products/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.products}>
              <ProductDetailsPage />
            </RoleGuard>
          }
        />

        {/* Categories Module */}
        <Route
          path="/categories"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT']}>
              <CategoriesPage />
            </RoleGuard>
          }
        />

        {/* Inventory Module & Sub-routes */}
        <Route
          path="/inventory"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.inventory}>
              <InventoryPage />
            </RoleGuard>
          }
        />
        <Route
          path="/inventory/batches"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.inventory}>
              <BatchesPage />
            </RoleGuard>
          }
        />
        <Route
          path="/inventory/low-stock"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.inventory}>
              <LowStockPage />
            </RoleGuard>
          }
        />
        <Route
          path="/inventory/expiry"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.inventory}>
              <ExpiryAlertsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/inventory/transactions"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.inventory}>
              <InventoryTransactionsPage />
            </RoleGuard>
          }
        />

        {/* Suppliers Module (F05) */}
        <Route
          path="/suppliers"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT']}>
              <SuppliersPage />
            </RoleGuard>
          }
        />
        <Route
          path="/suppliers/new"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <CreateSupplierPage />
            </RoleGuard>
          }
        />
        <Route
          path="/suppliers/:id/edit"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <EditSupplierPage />
            </RoleGuard>
          }
        />
        <Route
          path="/suppliers/:id"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT']}>
              <SupplierDetailsPage />
            </RoleGuard>
          }
        />

        {/* Purchases Module (F05) */}
        <Route
          path="/purchases"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.purchases}>
              <PurchasesPage />
            </RoleGuard>
          }
        />
        <Route
          path="/purchases/new"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <CreatePurchasePage />
            </RoleGuard>
          }
        />
        <Route
          path="/purchases/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.purchases}>
              <PurchaseDetailsPage />
            </RoleGuard>
          }
        />

        {/* Forbidden Page (403) */}
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Customers & Loyalty Module (F08) */}
        <Route
          path="/customers"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.customers}>
              <CustomersPage />
            </RoleGuard>
          }
        />
        <Route
          path="/customers/new"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <CreateCustomerPage />
            </RoleGuard>
          }
        />
        <Route
          path="/customers/:id/edit"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <EditCustomerPage />
            </RoleGuard>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.customers}>
              <CustomerDetailsPage />
            </RoleGuard>
          }
        />
        {/* Sales Module (F06) */}
        <Route
          path="/sales"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.sales}>
              <SalesPage />
            </RoleGuard>
          }
        />
        <Route
          path="/sales/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.sales}>
              <SaleDetailsPage />
            </RoleGuard>
          }
        />
        {/* Returns & Refunds Module (F07) */}
        <Route
          path="/returns"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.returns}>
              <ReturnsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/returns/new"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST']}>
              <CreateReturnPage />
            </RoleGuard>
          }
        />
        <Route
          path="/returns/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.returns}>
              <ReturnDetailsPage />
            </RoleGuard>
          }
        />
        {/* Expenses Module (F09) */}
        <Route
          path="/expenses"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.expenses}>
              <ExpensesPage />
            </RoleGuard>
          }
        />
        <Route
          path="/expenses/new"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT']}>
              <CreateExpensePage />
            </RoleGuard>
          }
        />
        <Route
          path="/expenses/:id/edit"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER']}>
              <EditExpensePage />
            </RoleGuard>
          }
        />
        <Route
          path="/expenses/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.expenses}>
              <ExpenseDetailsPage />
            </RoleGuard>
          }
        />

        {/* Finance & Payments Module (F09) */}
        <Route
          path="/finance"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.finance}>
              <FinanceDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path="/payments"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.payments}>
              <PaymentsLedgerPage />
            </RoleGuard>
          }
        />
        {/* Payroll & Staff Wages Module (F12) */}
        <Route
          path="/payroll"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.payroll}>
              <PayrollPage />
            </RoleGuard>
          }
        />
        <Route
          path="/payroll/new"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.payroll}>
              <CreatePayrollPage />
            </RoleGuard>
          }
        />
        <Route
          path="/payroll/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.payroll}>
              <PayrollDetailsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/payroll/:id/slip"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.payroll}>
              <SalarySlipPage />
            </RoleGuard>
          }
        />
        {/* Staff Sales Commissions & Incentives Module (F13) */}
        <Route
          path="/commissions"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.commissions}>
              <CommissionsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/commissions/rules"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'ACCOUNTANT']}>
              <CommissionRulesPage />
            </RoleGuard>
          }
        />
        <Route
          path="/commissions/statement/:userId"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.commissions}>
              <CommissionStatementPage />
            </RoleGuard>
          }
        />
        <Route
          path="/reports"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.reports}>
              <ReportsPage />
            </RoleGuard>
          }
        />
        {/* Notifications Module (F11) */}
        <Route
          path="/notifications"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.notifications}>
              <NotificationsPage />
            </RoleGuard>
          }
        />

        {/* Audit Logs & System Activity Module (F11) */}
        <Route
          path="/audit"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.audit}>
              <AuditLogsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/audit/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.audit}>
              <AuditDetailsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/activity"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.audit}>
              <SystemActivityPage />
            </RoleGuard>
          }
        />
        {/* F15: Insurance & Third-Party Claims Billing Module */}
        <Route
          path="/insurance"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'ACCOUNTANT']}>
              <InsuranceProvidersPage />
            </RoleGuard>
          }
        />
        {/* F16: System Settings, Tax Configuration & Pharmacy Branding */}
        <Route
          path="/settings"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.settings}>
              <SettingsPage />
            </RoleGuard>
          }
        />
        {/* Users & Staff Management Module (F10) */}
        <Route
          path="/users"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.users}>
              <UsersPage />
            </RoleGuard>
          }
        />
        <Route
          path="/users/new"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER']}>
              <CreateUserPage />
            </RoleGuard>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <RoleGuard allowedRoles={['PLATFORM_MANAGER', 'PHARMACY_MANAGER']}>
              <EditUserPage />
            </RoleGuard>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RoleGuard allowedRoles={MODULE_PERMISSIONS.users}>
              <UserDetailsPage />
            </RoleGuard>
          }
        />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
