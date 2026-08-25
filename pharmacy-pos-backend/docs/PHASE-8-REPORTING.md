# 📊 PHARMACY POS — PHASE 8
# Business Intelligence, Reporting & Dashboard Analytics

## 1. Executive Business Purpose

The **Phase 8 Reporting & Dashboard Layer** transforms operational transactional data across all pharmacy modules into actionable business intelligence for executives, pharmacy managers, and accountants.

The analytics engine aggregates source-of-truth tables without creating duplicate summary tables, providing real-time visibility into:
- **Revenue & Cash Flow:** Gross sales, return deductions, net sales, operating expenses, and net operational movement.
- **Cost of Goods Sold (COGS) & Margins:** Batch-level cost valuation against sale revenue.
- **Inventory Health & Risk Horizons:** Derivable cost/retail inventory valuation, low-stock threshold alerts, and batch expiry horizons (expired vs expiring within 90 days).
- **Product Velocity:** Top-selling medicines vs slow-moving and zero-sales products.
- **Procurement & Supplier Spending:** Supplier purchase totals and invoice settlement status.
- **Customer Lifetime Value & Loyalty:** Purchasing frequencies, customer tier distributions, and loyalty reward velocity.
- **Staff Performance:** Cashier sales volume, commission distribution, and return reversals.

---

## 2. API Endpoints & RBAC Matrix

| Endpoint | Method | Allowed Roles | Business Purpose |
|---|---|---|---|
| `/api/v1/dashboard/overview` | `GET` | All Staff (`PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT`, `PHARMACIST`) | Top-level KPI overview (Gross/Net Sales, Inventory Units/Value, Active Customers, Operational Alerts) |
| `/api/v1/reports/sales` | `GET` | All Staff | Filterable sales report, payment methods, daily trends, top products/categories, and paginated invoices |
| `/api/v1/reports/products` | `GET` | All Staff | Product performance metrics, top sellers, slow-moving items ($\le 2$ sales), and zero-sales products |
| `/api/v1/reports/inventory` | `GET` | All Staff | Stock valuation (Cost & Retail), healthy vs expiring/expired stock units, low-stock items, and stock movements |
| `/api/v1/reports/purchases` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Procurement invoice totals, supplier spending breakdown, and procurement trends |
| `/api/v1/reports/expenses` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Operating expenses aggregated by category, payment method, and daily trend |
| `/api/v1/reports/customers` | `GET` | All Staff | Customer spend rankings, purchasing frequencies, and loyalty tier distribution |
| `/api/v1/reports/staff` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Staff sales volume, commission earned, commission reversed, and net commission payout |
| `/api/v1/reports/financial-summary` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | High-level executive financial reconciliation (Net Sales - Purchases - Expenses - Commissions) |

---

## 3. Metric Definitions & Formulas

1. **Gross Sales:** $\sum \text{Sale.total}$ for all sales where $\text{status} \neq \text{'CANCELLED'}$ in the period.
2. **Returns & Refunds:** $\sum \text{SaleReturn.total}$ recorded in the period.
3. **Net Sales:** $\max(0, \text{Gross Sales} - \text{Returns \& Refunds})$.
4. **Estimated Cost of Goods Sold (COGS):** $\sum (\text{SaleItem.quantity} \times \text{Batch.purchasePrice})$.
5. **Estimated Gross Margin:** $\text{Net Sales} - \text{Estimated COGS}$.
6. **Derivable Inventory Cost Value:** $\sum (\text{Batch.quantity} \times \text{Batch.purchasePrice})$ for all active batches ($\text{quantity} > 0$).
7. **Derivable Inventory Retail Value:** $\sum (\text{Batch.quantity} \times \text{Batch.sellingPrice})$ for all active batches ($\text{quantity} > 0$).
8. **Expiring Soon Stock:** Active batch quantities where $\text{now} < \text{expiryDate} \le \text{now} + 90\text{ days}$.
9. **Expired Stock:** Active batch quantities where $\text{expiryDate} \le \text{now}$.
10. **Slow-Moving Product Threshold:** Explicitly defined as products with $0 < \text{netQuantitySold} \le 2$ in the selected reporting period.
11. **Net Staff Commission:** $\text{Commission Earned} - \text{Commission Reversed}$.
12. **Net Operational Movement:** $\text{Net Sales} - \text{Received Purchases} - \text{Operating Expenses} - \text{Net Commissions}$.

---

## 4. Date Range & Inclusive Filtering Architecture

All reporting endpoints accept:
- `?from=YYYY-MM-DD` (Start of day: `00:00:00.000`)
- `?to=YYYY-MM-DD` (End of day: `23:59:59.999` — inclusive)
- If omitted, default to today's date range (`00:00:00.000` to `23:59:59.999`).
- Protection against invalid ranges:
  - If `from > to` $\to$ rejected with `400 Bad Request`.
  - Maximum query range capped at 5 years (1825 days).

---

## 5. Architectural Integrity & Security

- **Strict Repository Encapsulation:** Zero Prisma imports in controllers, services, routes, or middlewares. All data aggregation is handled within `DashboardRepository` and `ReportsRepository`.
- **RBAC Boundary Enforcement:** Operational roles (`PHARMACIST`) are strictly forbidden from accessing sensitive financial summaries (`/reports/financial-summary`), operating expenses (`/reports/expenses`), procurement costs (`/reports/purchases`), and staff payroll/commission data (`/reports/staff`).
- **HttpOnly Cookie Authentication:** All dashboard and reporting endpoints require authenticated staff sessions via HttpOnly JWT cookies.
