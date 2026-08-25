import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5010;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testBarcodes = ['BAR-PH8-0001', 'BAR-PH8-0002'];
const testCategoryNames = ['Phase8 Reporting Category'];
const testCustomerPhones = ['+201077771111'];
const testUserPhones = ['+201077772222', '+201077773333', '+201077774444'];
const testSupplierPhones = ['+201077775555'];

async function cleanupTestData() {
  // 1. Delete expenses
  await prisma.expense.deleteMany({
    where: { description: { contains: 'Phase8' } },
  });

  // 2. Delete commission rules & transactions
  await prisma.commissionTransaction.deleteMany({});
  await prisma.commissionRule.deleteMany({
    where: { name: { contains: 'Phase8' } },
  });

  // 3. Delete sale returns & items
  await prisma.saleReturnItem.deleteMany({});
  await prisma.saleReturn.deleteMany({});

  // 4. Delete sale items, payments, sales
  await prisma.payment.deleteMany({});
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});

  // 5. Delete purchase items & purchases
  await prisma.purchaseItem.deleteMany({});
  await prisma.purchase.deleteMany({
    where: { invoiceNumber: { contains: 'P8' } },
  });

  // 6. Delete suppliers
  await prisma.supplier.deleteMany({
    where: { phone: { in: testSupplierPhones } },
  });

  // 7. Delete loyalty transactions & accounts
  await prisma.loyaltyTransaction.deleteMany({});
  await prisma.loyaltyAccount.deleteMany({});

  // 8. Delete inventory transactions, batches, products, categories
  const products = await prisma.product.findMany({
    where: { barcode: { in: testBarcodes } },
    select: { id: true },
  });
  const productIds = products.map((p) => p.id);

  if (productIds.length > 0) {
    const batches = await prisma.batch.findMany({
      where: { productId: { in: productIds } },
      select: { id: true },
    });
    const batchIds = batches.map((b) => b.id);

    if (batchIds.length > 0) {
      await prisma.inventoryTransaction.deleteMany({
        where: { batchId: { in: batchIds } },
      });
      await prisma.batch.deleteMany({
        where: { id: { in: batchIds } },
      });
    }

    await prisma.product.deleteMany({
      where: { id: { in: productIds } },
    });
  }

  await prisma.category.deleteMany({
    where: { name: { in: testCategoryNames } },
  });

  // 9. Delete customers & users
  await prisma.customer.deleteMany({
    where: { phone: { in: testCustomerPhones } },
  });

  await prisma.user.deleteMany({
    where: { phone: { in: testUserPhones } },
  });
}

async function testPhase8() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 8 (Reporting, Dashboard & BI) Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 8 test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Clean & setup test users
    await cleanupTestData();

    const passwordHash = await hashPassword('TestPass123!');
    const admin = await prisma.user.create({
      data: {
        name: 'Phase8 Manager',
        phone: '+201077772222',
        email: 'p8.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    const pharm = await prisma.user.create({
      data: {
        name: 'Phase8 Pharmacist',
        phone: '+201077773333',
        email: 'p8.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    const acc = await prisma.user.create({
      data: {
        name: 'Phase8 Accountant',
        phone: '+201077774444',
        email: 'p8.acc@pharmacy.local',
        passwordHash,
        role: 'ACCOUNTANT',
        isActive: true,
      },
    });

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077772222', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Pharmacist
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077773333', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Accountant
    const accLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077774444', password: 'TestPass123!' }),
    });
    const accCookie = accLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('0️⃣  Setup complete. Authenticated Admin, Pharmacist, and Accountant.\n');

    // 1. Setup Rich Business Scenario Data (Catalog, Batches, Purchases, Sales, Returns, Expenses)
    console.log('📦 Setting up comprehensive test datasets for reporting...');

    const category = await prisma.category.create({
      data: { name: 'Phase8 Reporting Category', description: 'Analytics Catalog' },
    });

    const prod1 = await prisma.product.create({
      data: {
        name: 'Amoxicillin 500mg Phase8',
        barcode: 'BAR-PH8-0001',
        categoryId: category.id,
        purchasePrice: 30.0,
        sellingPrice: 50.0,
        minimumStock: 10,
        isActive: true,
      },
    });

    const prod2 = await prisma.product.create({
      data: {
        name: 'Brufen 400mg Phase8',
        barcode: 'BAR-PH8-0002',
        categoryId: category.id,
        purchasePrice: 20.0,
        sellingPrice: 35.0,
        minimumStock: 15,
        isActive: true,
      },
    });

    const futureExp = new Date();
    futureExp.setFullYear(futureExp.getFullYear() + 1);

    const expiringSoon = new Date();
    expiringSoon.setDate(expiringSoon.getDate() + 30);

    const batch1 = await prisma.batch.create({
      data: {
        productId: prod1.id,
        batchNumber: 'P8-AMX-01',
        expiryDate: futureExp,
        quantity: 50,
        purchasePrice: 30.0,
        sellingPrice: 50.0,
      },
    });

    const batch2 = await prisma.batch.create({
      data: {
        productId: prod2.id,
        batchNumber: 'P8-BRU-EXP',
        expiryDate: expiringSoon,
        quantity: 5, // Low stock + expiring soon
        purchasePrice: 20.0,
        sellingPrice: 35.0,
      },
    });

    const customer = await prisma.customer.create({
      data: {
        name: 'Mahmoud Analytics Customer',
        phone: '+201077771111',
        isActive: true,
      },
    });

    const supplier = await prisma.supplier.create({
      data: {
        name: 'Phase8 Alpha Pharma Supplier',
        phone: '+201077775555',
        isActive: true,
      },
    });

    // Create Purchase (500 EGP)
    const purchase = await prisma.purchase.create({
      data: {
        supplierId: supplier.id,
        createdById: admin.id,
        invoiceNumber: 'INV-PUR-P8-001',
        subtotal: 500.0,
        tax: 0,
        total: 500.0,
        paidAmount: 500.0,
        status: 'RECEIVED',
      },
    });

    // Create Sale (2 x Amoxicillin = 100 EGP)
    const sale = await prisma.sale.create({
      data: {
        invoiceNumber: 'INV-P8-SALE-001',
        userId: pharm.id,
        customerId: customer.id,
        subtotal: 100.0,
        tax: 0,
        total: 100.0,
        paidAmount: 100.0,
        status: 'COMPLETED',
        items: {
          create: {
            productId: prod1.id,
            batchId: batch1.id,
            quantity: 2,
            unitPrice: 50.0,
            total: 100.0,
          },
        },
        payments: {
          create: {
            paymentMethod: 'CASH',
            amount: 100.0,
            createdById: pharm.id,
          },
        },
      },
      include: { items: true },
    });

    // Create Sale Return (1 item returned = 50 EGP refund)
    await prisma.saleReturn.create({
      data: {
        returnNumber: 'RET-P8-001',
        saleId: sale.id,
        customerId: customer.id,
        processedById: pharm.id,
        reason: 'Wrong dosage',
        subtotal: 50.0,
        tax: 0,
        total: 50.0,
        items: {
          create: {
            saleItemId: sale.items[0].id,
            productId: prod1.id,
            batchId: batch1.id,
            quantity: 1,
            refundAmount: 50.0,
          },
        },
      },
    });

    // Create Commission Transaction (5 EGP earned, 2.5 EGP reversed)
    await prisma.commissionTransaction.create({
      data: {
        userId: pharm.id,
        saleId: sale.id,
        salesAmount: 100.0,
        commissionAmount: 5.0,
        commissionRate: 5.0,
      },
    });
    await prisma.commissionTransaction.create({
      data: {
        userId: pharm.id,
        saleId: sale.id,
        salesAmount: -50.0,
        commissionAmount: -2.5,
        commissionRate: 5.0,
      },
    });

    // Create Operating Expense (200 EGP)
    await prisma.expense.create({
      data: {
        amount: 200.0,
        category: 'ELECTRICITY',
        description: 'Phase8 Monthly Lighting',
        paymentMethod: 'CASH',
        createdById: admin.id,
      },
    });

    console.log('   ✅ Comprehensive test datasets ready!\n');

    // -------------------------------------------------------------
    // TEST 1: DASHBOARD OVERVIEW (GET /dashboard/overview)
    // -------------------------------------------------------------
    console.log('1️⃣  Testing Dashboard Overview (GET /api/v1/dashboard/overview)...');
    const dashRes = await fetch(`${BASE_URL}/dashboard/overview`, {
      headers: { Cookie: adminCookie },
    });
    const dashData = (await dashRes.json()) as any;
    if (dashRes.status !== 200 || !dashData.data?.sales) {
      throw new Error(`Dashboard overview failed: ${JSON.stringify(dashData)}`);
    }
    console.log(`   ✅ Dashboard Gross Sales: ${dashData.data.sales.grossSales} EGP | Net: ${dashData.data.sales.netSales} EGP | Invoices: ${dashData.data.sales.totalInvoices}`);
    console.log(`   ✅ Inventory Status: ${dashData.data.inventory.totalStockUnits} units | Value: ${dashData.data.inventory.derivableInventoryValue} EGP | Alerts: ${dashData.data.operationalAlerts.totalAlerts}`);

    // -------------------------------------------------------------
    // TEST 2: SALES REPORT (GET /reports/sales)
    // -------------------------------------------------------------
    console.log('\n2️⃣  Testing Sales Report (GET /api/v1/reports/sales)...');
    const salesRepRes = await fetch(`${BASE_URL}/reports/sales`, {
      headers: { Cookie: accCookie },
    });
    const salesRepData = (await salesRepRes.json()) as any;
    if (salesRepRes.status !== 200 || salesRepData.data.summary.totalGrossSales < 100) {
      throw new Error(`Sales report failed: ${JSON.stringify(salesRepData)}`);
    }
    console.log(`   ✅ Sales Report Gross: ${salesRepData.data.summary.totalGrossSales} EGP | Net: ${salesRepData.data.summary.netSales} EGP | Invoices: ${salesRepData.data.summary.invoiceCount}`);
    console.log(`   ✅ Top Selling Products identified: ${salesRepData.data.topSellingProducts.length}`);

    // -------------------------------------------------------------
    // TEST 3: PRODUCT PERFORMANCE REPORT (GET /reports/products)
    // -------------------------------------------------------------
    console.log('\n3️⃣  Testing Product Performance Report (GET /api/v1/reports/products)...');
    const prodRepRes = await fetch(`${BASE_URL}/reports/products`, {
      headers: { Cookie: pharmCookie },
    });
    const prodRepData = (await prodRepRes.json()) as any;
    if (prodRepRes.status !== 200 || !prodRepData.data?.summary) {
      throw new Error(`Product report failed: ${JSON.stringify(prodRepData)}`);
    }
    console.log(`   ✅ Evaluated ${prodRepData.data.summary.totalProductsEvaluated} products. Zero sales count: ${prodRepData.data.summary.zeroSalesCount}`);

    // -------------------------------------------------------------
    // TEST 4: INVENTORY REPORT (GET /reports/inventory)
    // -------------------------------------------------------------
    console.log('\n4️⃣  Testing Inventory Report (GET /api/v1/reports/inventory)...');
    const invRepRes = await fetch(`${BASE_URL}/reports/inventory`, {
      headers: { Cookie: pharmCookie },
    });
    const invRepData = (await invRepRes.json()) as any;
    if (invRepRes.status !== 200 || !invRepData.data?.health) {
      throw new Error(`Inventory report failed: ${JSON.stringify(invRepData)}`);
    }
    console.log(`   ✅ Total Stock: ${invRepData.data.summary.totalStockUnits} units | Low Stock Products: ${invRepData.data.health.lowStockProductsCount}`);

    // -------------------------------------------------------------
    // TEST 5: PURCHASE / SUPPLIER REPORT (GET /reports/purchases)
    // -------------------------------------------------------------
    console.log('\n5️⃣  Testing Purchases & Supplier Spend Report (GET /api/v1/reports/purchases)...');
    const purRepRes = await fetch(`${BASE_URL}/reports/purchases`, {
      headers: { Cookie: accCookie },
    });
    const purRepData = (await purRepRes.json()) as any;
    if (purRepRes.status !== 200 || purRepData.data.summary.totalPurchaseValue < 500) {
      throw new Error(`Purchase report failed: ${JSON.stringify(purRepData)}`);
    }
    console.log(`   ✅ Purchases Total Value: ${purRepData.data.summary.totalPurchaseValue} EGP across ${purRepData.data.summary.totalInvoices} invoice(s)`);
    console.log(`   ✅ Supplier Spending Breakdown: ${purRepData.data.supplierSpendingBreakdown[0]?.supplierName}: ${purRepData.data.supplierSpendingBreakdown[0]?.totalSpent} EGP`);

    // -------------------------------------------------------------
    // TEST 6: EXPENSE REPORT (GET /reports/expenses)
    // -------------------------------------------------------------
    console.log('\n6️⃣  Testing Expense Report (GET /api/v1/reports/expenses)...');
    const expRepRes = await fetch(`${BASE_URL}/reports/expenses`, {
      headers: { Cookie: accCookie },
    });
    const expRepData = (await expRepRes.json()) as any;
    if (expRepRes.status !== 200 || expRepData.data.summary.totalExpenses < 200) {
      throw new Error(`Expense report failed: ${JSON.stringify(expRepData)}`);
    }
    console.log(`   ✅ Total Operating Expenses: ${expRepData.data.summary.totalExpenses} EGP across ${expRepData.data.summary.expensesCount} record(s)`);

    // -------------------------------------------------------------
    // TEST 7: CUSTOMER & LOYALTY REPORT (GET /reports/customers)
    // -------------------------------------------------------------
    console.log('\n7️⃣  Testing Customer & Loyalty Report (GET /api/v1/reports/customers)...');
    const custRepRes = await fetch(`${BASE_URL}/reports/customers`, {
      headers: { Cookie: pharmCookie },
    });
    const custRepData = (await custRepRes.json()) as any;
    if (custRepRes.status !== 200 || !custRepData.data?.topCustomersByRevenue) {
      throw new Error(`Customer report failed: ${JSON.stringify(custRepData)}`);
    }
    console.log(`   ✅ Top Purchasing Customers: ${custRepData.data.topCustomersByRevenue.length} identified.`);

    // -------------------------------------------------------------
    // TEST 8: STAFF / COMMISSION REPORT (GET /reports/staff)
    // -------------------------------------------------------------
    console.log('\n8️⃣  Testing Staff Commission Performance Report (GET /api/v1/reports/staff)...');
    const staffRepRes = await fetch(`${BASE_URL}/reports/staff`, {
      headers: { Cookie: accCookie },
    });
    const staffRepData = (await staffRepRes.json()) as any;
    if (staffRepRes.status !== 200 || staffRepData.data.staffPerformance.length === 0) {
      throw new Error(`Staff report failed: ${JSON.stringify(staffRepData)}`);
    }
    console.log(`   ✅ Staff Performance evaluated for ${staffRepData.data.summary.totalStaffEvaluated} employee(s). Net Commission: ${staffRepData.data.summary.totalCommissionDistributed} EGP`);

    // -------------------------------------------------------------
    // TEST 9: FINANCIAL SUMMARY REPORT (GET /reports/financial-summary)
    // -------------------------------------------------------------
    console.log('\n9️⃣  Testing Financial Summary Report (GET /api/v1/reports/financial-summary)...');
    const finRepRes = await fetch(`${BASE_URL}/reports/financial-summary`, {
      headers: { Cookie: adminCookie },
    });
    const finRepData = (await finRepRes.json()) as any;
    if (finRepRes.status !== 200 || !finRepData.data?.metrics) {
      throw new Error(`Financial summary failed: ${JSON.stringify(finRepData)}`);
    }
    console.log(`   ✅ Financial Metrics: Gross: ${finRepData.data.metrics.grossSales} EGP | Net Sales: ${finRepData.data.metrics.netSales} EGP | Purchases: ${finRepData.data.metrics.receivedPurchasesCost} EGP | Expenses: ${finRepData.data.metrics.operatingExpenses} EGP`);

    // -------------------------------------------------------------
    // TEST 10: DATE FILTERING (?from=...&to=...)
    // -------------------------------------------------------------
    console.log('\n🔟 Testing Date Filtering on Reports (?from=...&to=...)...');
    const today = new Date().toISOString().slice(0, 10);
    const dateFilterRes = await fetch(`${BASE_URL}/reports/sales?from=${today}&to=${today}`, {
      headers: { Cookie: accCookie },
    });
    const dateFilterData = (await dateFilterRes.json()) as any;
    if (dateFilterRes.status !== 200 || dateFilterData.data.period.from !== today) {
      throw new Error(`Date filter failed: ${JSON.stringify(dateFilterData)}`);
    }
    console.log(`   ✅ Inclusive Date Filtering verified for period ${today} -> ${today}`);

    // -------------------------------------------------------------
    // TEST 11: INVALID DATE RANGE (from > to => 400 Bad Request)
    // -------------------------------------------------------------
    console.log('\n1️⃣1️⃣ Testing Invalid Date Range Rejection (from > to -> 400 Bad Request)...');
    const invalidDateRes = await fetch(`${BASE_URL}/reports/sales?from=2026-12-31&to=2026-01-01`, {
      headers: { Cookie: accCookie },
    });
    if (invalidDateRes.status !== 400) {
      throw new Error(`Invalid date range should return 400! Got: ${invalidDateRes.status}`);
    }
    console.log('   ✅ Invalid date range (from > to) correctly rejected with 400 Bad Request');

    // -------------------------------------------------------------
    // TEST 12: PAGINATION (?page=1&limit=5)
    // -------------------------------------------------------------
    console.log('\n1️⃣2️⃣ Testing Pagination on Reports (?page=1&limit=5)...');
    const paginationRes = await fetch(`${BASE_URL}/reports/products?page=1&limit=5`, {
      headers: { Cookie: pharmCookie },
    });
    const paginationData = (await paginationRes.json()) as any;
    if (paginationRes.status !== 200 || paginationData.data.pagination.limit !== 5) {
      throw new Error(`Pagination failed: ${JSON.stringify(paginationData)}`);
    }
    console.log(`   ✅ Verified pagination metadata: Page 1 | Limit 5 | Total: ${paginationData.data.pagination.total}`);

    // -------------------------------------------------------------
    // TEST 13: RBAC RESTRICTIONS (Pharmacist blocked from Financial & Staff Reports)
    // -------------------------------------------------------------
    console.log('\n1️⃣3️⃣ Testing RBAC: Pharmacist blocked from Financial & Staff Reports (403 Forbidden)...');
    const pharmFinRes = await fetch(`${BASE_URL}/reports/financial-summary`, {
      headers: { Cookie: pharmCookie },
    });
    if (pharmFinRes.status !== 403) {
      throw new Error(`Pharmacist should be blocked from financial summary with 403! Got: ${pharmFinRes.status}`);
    }

    const pharmStaffRes = await fetch(`${BASE_URL}/reports/staff`, {
      headers: { Cookie: pharmCookie },
    });
    if (pharmStaffRes.status !== 403) {
      throw new Error(`Pharmacist should be blocked from staff commission report with 403! Got: ${pharmStaffRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from /reports/financial-summary and /reports/staff with 403 Forbidden');

    // -------------------------------------------------------------
    // TEST 14: UNAUTHORIZED ACCESS (No cookie -> 401 Unauthorized)
    // -------------------------------------------------------------
    console.log('\n1️⃣4️⃣ Testing Unauthorized Access without Cookie (401 Unauthorized)...');
    const unauthRes = await fetch(`${BASE_URL}/dashboard/overview`);
    if (unauthRes.status !== 401) {
      throw new Error(`Unauthenticated request should return 401! Got: ${unauthRes.status}`);
    }
    console.log('   ✅ Unauthorized request correctly rejected with 401 Unauthorized');

    // Cleanup test records
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL PHASE 8 REPORTING & DASHBOARD TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 8 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase8();
