# Pharmacy POS & Management System - Backend Foundation

A production-ready, clean, scalable, and secure backend foundation for a Pharmacy POS & Management System built with **Node.js**, **Express.js (v5)**, **TypeScript**, **Prisma 7**, and **MySQL**.

---

## 1. Technology Stack

- **Runtime:** Node.js (>= 20.x, tested on v25.x)
- **Framework:** Express.js (v5.x)
- **Language:** TypeScript (v5.x) with strict ESM configuration (`NodeNext`)
- **Database & ORM:** MySQL + Prisma 7 with `@prisma/adapter-mariadb`
- **Authentication & Security:** JWT via HttpOnly Cookies, `bcrypt`, `helmet`, `cors`, `zod`

---

## 2. Feature Modules Architecture

```
src/modules/
├── auth/          # Authentication, Login, Logout, Session verification
├── users/         # Staff Management & RBAC
├── health/        # Health Checks & Connectivity
├── audit/         # Centralized Audit Logging
├── customers/     # Customer Profiles & Purchase History
├── loyalty/       # Customer Loyalty Ledger & Automatic Tier Upgrades
├── categories/    # Medicine Categories
├── products/      # Products Catalog, Barcode Search & Stock Rollups
├── batches/       # Batches Management & Expiry Horizons
├── inventory/     # Immutable Inventory Ledger, FEFO & Adjustments
├── suppliers/     # Supplier Profiles & Procurement History
├── purchases/     # Purchase Invoices & Atomic Stock Receiving
├── sales/         # POS Checkout Engine & Invoice Lifecycle
├── payments/      # Payment Processing & Split Tender
├── discounts/     # Promotional & Tier Discounts
└── insurance/     # Insurance Providers & Copay Management
```

---

## 3. Environment Variables

Configured in `.env`:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# MySQL Database Configuration
DATABASE_URL="mysql://root:@localhost:3306/pharmacy_pos"

# JWT & Authentication Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=10

# Security & Rate Limiting
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=10
```

---

## 4. Running the Application

### Development Mode (with live reload)
```bash
npm run dev
```

### Production Build & Execution
```bash
# 1. Compile TypeScript to dist/
npm run build

# 2. Start production server
npm start
```

### Running Test Suites
```bash
npx tsx scripts/test-phase2-auth.ts
npx tsx scripts/test-pure-cookies.ts
npx tsx scripts/test-phase3-customers-loyalty.ts
npx tsx scripts/test-phase4-products-inventory.ts
npx tsx scripts/test-phase5-suppliers-purchases.ts
npx tsx scripts/test-phase6-sales.ts
```

---

## 5. API Endpoints & Verification

### Root Status Endpoint
- **URL:** `GET /`
- **Response (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "Pharmacy POS API is running"
  }
  ```

### Database Health Check Endpoint
- **URL:** `GET /api/v1/health`
- **Response (HTTP 200 - Connected):**
  ```json
  {
    "success": true,
    "message": "Backend and database are connected successfully",
    "database": "connected"
  }
  ```
