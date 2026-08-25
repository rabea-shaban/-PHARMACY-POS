# 💼 PHARMACY POS — PHASE 9
# Financial Operations, Staff Commissions & Payroll Management Module

## 1. Executive Business Purpose

The **Phase 9 Payroll Management Layer** connects workforce management, sales operations, staff commission ledgers, and operating expenses into an authoritative, auditable compensation engine.

The module enables pharmacy management to:
- Establish structured compensation periods (e.g. Monthly).
- Capture historical **Salary Snapshots** at payroll generation time so subsequent employee raises do not alter historical closed settlements.
- Automatically aggregate commission earnings and return-reversals from authoritative `commission_transactions`.
- Server-side compute net payable compensation using **Decimal-safe calculations**.
- Enforce strict lifecycle states (`DRAFT` $\to$ `PENDING` $\to$ `PAID` / `CANCELLED`).
- Secure atomic payroll settlement into immutable financial records and operating expenses.

---

## 2. API Endpoints & RBAC Matrix

| Endpoint | Method | Allowed Staff Roles | Business Purpose |
|---|---|---|---|
| `/api/v1/payroll/summary` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Aggregated payroll metrics (total base salaries, commissions, bonuses, deductions, net paid & pending) |
| `/api/v1/payroll/generate` | `POST` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Calculate & generate payroll for a single employee for a specific period |
| `/api/v1/payroll/generate-period` | `POST` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Bulk generate payrolls for all active employees for a monthly period |
| `/api/v1/payroll` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | List & filter payroll records with pagination, period, employee, and status filters |
| `/api/v1/payroll/employee/:employeeId` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Historical list of all payrolls for a specific employee |
| `/api/v1/payroll/:id` | `GET` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Detailed breakdown of a specific payroll record |
| `/api/v1/payroll/:id` | `PATCH` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Adjust base salary, bonus, or deductions on unfinalized payrolls |
| `/api/v1/payroll/:id/approve` | `POST` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Approve payroll (`DRAFT` $\to$ `PENDING`) |
| `/api/v1/payroll/:id/pay` | `POST` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER`, `ACCOUNTANT` | Atomic settlement (`PENDING` $\to$ `PAID`), recording salary operating expense & timestamp |
| `/api/v1/payroll/:id/cancel` | `POST` | `PLATFORM_MANAGER`, `PHARMACY_MANAGER` | Cancel unfinalized payroll record (`CANCELLED`) |

---

## 3. Authoritative Payroll Formula & Calculation Logic

```
Net Payable = Base Salary + Net Commission + Bonuses - Deductions

Where:
  Net Commission = max(0, Commission Earned - Commission Reversed)
  Commission Earned = sum of all positive commission_transactions in period
  Commission Reversed = sum of all absolute negative commission_transactions in period
```

- **Zero Trust on Client Values:** All financial arithmetic is performed server-side using Decimal-safe math.
- **Overlapping Period Protection:** The system prevents creating multiple active payroll records for the same employee within overlapping dates (`409 Conflict`).

---

## 4. Salary Snapshot & Historical Immutability

1. **Salary Snapshot Strategy:** The employee's `baseSalary` is frozen at generation time. If an employee receives a salary increase later, historical payroll records remain untouched.
2. **Paid Payroll Immutability:** Once marked `PAID`, a payroll record cannot be edited, recalculated, cancelled, or paid again. Any re-payment attempt is rejected with `409 Conflict`.

---

## 5. Atomic Settlement & Operating Expense Integration

When a payroll record is settled via `POST /api/v1/payroll/:id/pay`:
1. The transaction checks that `status !== 'PAID'` and `status !== 'CANCELLED'`.
2. Updates `status = 'PAID'` and sets `paidAt = now()`.
3. Creates an immutable `Expense` record in the `expenses` table:
   - `category = 'SALARY'`
   - `amount = payroll.netSalary`
   - `paymentMethod = input.paymentMethod`
   - `description = Payroll settlement for [Employee] ([Period])`
4. Creates an `AuditLog` entry in MySQL.
5. All operations succeed atomically or rollback entirely via `prisma.$transaction()`.

---

## 6. Audit Logging

Every lifecycle action generates an audit trail in `audit_logs`:
- `CREATE`: Payroll generation (single or bulk period)
- `UPDATE`: Component adjustments (bonuses, deductions)
- `APPROVED`: State transition to `PENDING`
- `PAID`: Settlement completion with payment method and amount
- `CANCELLED`: Payroll cancellation with previous status preserved
