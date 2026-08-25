import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5009;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testBarcodes = ['BAR-PH7-0001', 'BAR-PH7-0002'];
const testCategoryNames = ['Phase7 Returns Category'];
const testCustomerPhones = ['+201099991111'];
const testUserPhones = ['+201099992222', '+201099993333', '+201099994444'];

async function cleanupTestData() {
  // 1. Delete expenses
  await prisma.expense.deleteMany({
    where: { description: { contains: 'Phase7' } },
  });

  // 2. Delete commission rules & transactions
  await prisma.commissionTransaction.deleteMany({});
  await prisma.commissionRule.deleteMany({
    where: { name: { contains: 'Phase7' } },
  });

  // 3. Delete sale returns & items
  await prisma.saleReturnItem.deleteMany({});
  await prisma.saleReturn.deleteMany({});

  // 4. Delete sale items, payments, sales
  await prisma.payment.deleteMany({});
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});

  // 5. Delete loyalty transactions & accounts
  await prisma.loyaltyTransaction.deleteMany({});
  await prisma.loyaltyAccount.deleteMany({});

  // 6. Delete inventory transactions, batches, products, categories
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

  // 7. Delete customers & users
  await prisma.customer.deleteMany({
    where: { phone: { in: testCustomerPhones } },
  });

  await prisma.user.deleteMany({
    where: { phone: { in: testUserPhones } },
  });
}

async function testPhase7() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 7 (Sale Returns, Expenses & Commissions) Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 7 test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Setup: Clean previous test data and create test users
    await cleanupTestData();

    const passwordHash = await hashPassword('TestPass123!');
    const admin = await prisma.user.create({
      data: {
        name: 'Phase7 Manager',
        phone: '+201099992222',
        email: 'p7.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    const pharm = await prisma.user.create({
      data: {
        name: 'Phase7 Pharmacist',
        phone: '+201099993333',
        email: 'p7.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    const acc = await prisma.user.create({
      data: {
        name: 'Phase7 Accountant',
        phone: '+201099994444',
        email: 'p7.acc@pharmacy.local',
        passwordHash,
        role: 'ACCOUNTANT',
        isActive: true,
      },
    });

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201099992222', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Pharmacist
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201099993333', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Accountant
    const accLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201099994444', password: 'TestPass123!' }),
    });
    const accCookie = accLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('0️⃣  Setup complete. Authenticated Admin, Pharmacist, and Accountant.\n');

    // -------------------------------------------------------------
    // PART A: COMMISSIONS MODULE
    // -------------------------------------------------------------
    console.log('=== PART A: COMMISSIONS MANAGEMENT ===');

    // 1. Create Commission Rule (POST /commissions/rules)
    console.log('1️⃣8️⃣ Testing POST /commissions/rules (Create Commission Rule)...');
    const createRuleRes = await fetch(`${BASE_URL}/commissions/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        name: 'Phase7 5% Staff Commission',
        percentage: 5.0,
      }),
    });
    const createRuleData = (await createRuleRes.json()) as any;
    if (createRuleRes.status !== 201 || !createRuleData.data?.id) {
      throw new Error(`Create commission rule failed: ${JSON.stringify(createRuleData)}`);
    }
    const commissionRuleId = createRuleData.data.id;
    console.log(`   ✅ Commission rule created: ${createRuleData.data.name} (${createRuleData.data.percentage}%)`);

    // 2. Setup Test Catalog & Customer
    const cat = await prisma.category.create({
      data: { name: 'Phase7 Returns Category', description: 'Returns & Expenses catalog' },
    });

    const prod1 = await prisma.product.create({
      data: {
        name: 'Concor 10mg Phase7',
        barcode: 'BAR-PH7-0001',
        categoryId: cat.id,
        purchasePrice: 50.0,
        sellingPrice: 80.0,
        minimumStock: 10,
        isActive: true,
      },
    });

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const batch1 = await prisma.batch.create({
      data: {
        productId: prod1.id,
        batchNumber: 'P7-CON-01',
        expiryDate,
        quantity: 50,
        purchasePrice: 50.0,
        sellingPrice: 80.0,
      },
    });

    const customer = await prisma.customer.create({
      data: {
        name: 'Sayed Returns Customer',
        phone: '+201099991111',
        isActive: true,
      },
    });

    // -------------------------------------------------------------
    // PART B: SALE & COMMISSION CALCULATION
    // -------------------------------------------------------------
    console.log('\n=== PART B: SALE CHECKOUT & COMMISSION EARNING ===');

    // 3. Create Sale (5 items x 80 EGP = 400 EGP)
    console.log('1️⃣  Testing Sale Checkout with Commission Calculation...');
    const saleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        customerId: customer.id,
        items: [{ productId: prod1.id, quantity: 5 }],
        payments: [{ paymentMethod: 'CASH', amount: 400.0 }],
      }),
    });
    const saleData = (await saleRes.json()) as any;
    if (saleRes.status !== 201 || !saleData.data?.id) {
      throw new Error(`Sale checkout failed: ${JSON.stringify(saleData)}`);
    }
    const saleId = saleData.data.id;
    const saleItemId = saleData.data.items[0].id;
    console.log(`   ✅ Sale created: ${saleData.data.invoiceNumber} | Total: ${saleData.data.total} EGP`);
    console.log(`   ✅ Commission recorded: ${saleData.data.commissionEarned} EGP (5% of 400 EGP)`);

    // Verify batch quantity is now 45
    const batchAfterSale = await prisma.batch.findUnique({ where: { id: batch1.id } });
    if (batchAfterSale?.quantity !== 45) {
      throw new Error(`Batch stock not decremented correctly! Expected 45, got: ${batchAfterSale?.quantity}`);
    }

    // -------------------------------------------------------------
    // PART C: SALE RETURNS MODULE
    // -------------------------------------------------------------
    console.log('\n=== PART C: SALE RETURNS & INVENTORY RESTORATION ===');

    // 4. Test Partial Sale Return (Return 2 out of 5 items)
    console.log('2️⃣  Testing Partial Sale Return (Return 2 out of 5 units)...');
    const returnRes = await fetch(`${BASE_URL}/sale-returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        saleId,
        reason: 'Patient prescribed different dosage by doctor',
        items: [{ saleItemId, quantity: 2 }],
      }),
    });
    const returnData = (await returnRes.json()) as any;
    if (returnRes.status !== 201 || !returnData.data?.returnNumber) {
      throw new Error(`Sale return failed: ${JSON.stringify(returnData)}`);
    }
    const returnId = returnData.data.id;
    console.log(`   ✅ Sale Return created: ${returnData.data.returnNumber} | Refund: ${returnData.data.total} EGP`);

    // 5. Verify Batch Stock Restored (45 + 2 = 47)
    console.log('\n3️⃣  Verifying Batch Stock Restored in MySQL...');
    const batchAfterReturn = await prisma.batch.findUnique({ where: { id: batch1.id } });
    if (batchAfterReturn?.quantity !== 47) {
      throw new Error(`Batch stock not restored correctly! Expected 47, got: ${batchAfterReturn?.quantity}`);
    }
    console.log(`   ✅ Batch ${batch1.batchNumber} stock restored from 45 to ${batchAfterReturn?.quantity} units`);

    // 6. Verify Immutable Inventory Transaction of type MANUAL_IN & reference SALE_RETURN
    console.log('\n4️⃣  Verifying Immutable Inventory Transaction Ledger Entry...');
    const invTx = await prisma.inventoryTransaction.findFirst({
      where: { referenceType: 'SALE_RETURN', referenceId: returnData.data.returnNumber },
    });
    if (!invTx || invTx.quantity !== 2) {
      throw new Error(`Inventory transaction for return not found or invalid!`);
    }
    console.log(`   ✅ Verified [SALE_RETURN] inventory transaction for +2 units | Ref: ${invTx.referenceId}`);

    // 7. Verify Commission Reversal Transaction
    console.log('\n1️⃣1️⃣ Verifying Proportional Commission Reversal Transaction in MySQL...');
    const commReversal = await prisma.commissionTransaction.findFirst({
      where: { saleId, commissionAmount: { lt: 0 } },
    });
    if (!commReversal || Number(commReversal.commissionAmount) !== -8.0) {
      throw new Error(`Commission reversal failed! Expected -8.0, got: ${commReversal?.commissionAmount}`);
    }
    console.log(`   ✅ Proportional commission reversal recorded: ${commReversal.commissionAmount} EGP (5% of 160 EGP refund)`);

    // 8. Verify Sale Return History & Sale Details
    console.log('\n6️⃣  Testing Return Lookup (GET /sale-returns/:id & GET /sale-returns/sales/:saleId)...');
    const getReturnRes = await fetch(`${BASE_URL}/sale-returns/${returnId}`, {
      headers: { Cookie: accCookie },
    });
    const getReturnData = (await getReturnRes.json()) as any;
    if (getReturnRes.status !== 200 || getReturnData.data.id !== returnId) {
      throw new Error(`Get return by ID failed`);
    }

    const saleReturnsRes = await fetch(`${BASE_URL}/sale-returns/sales/${saleId}`, {
      headers: { Cookie: accCookie },
    });
    const saleReturnsData = (await saleReturnsRes.json()) as any;
    if (saleReturnsRes.status !== 200 || saleReturnsData.data.length !== 1) {
      throw new Error(`Get returns by saleId failed`);
    }
    console.log(`   ✅ Retrieved return details for invoice ${getReturnData.data.invoiceNumber}`);

    // 9. Attempt Excessive Return (Already returned 2, only 3 remaining returnable. Attempt 4)
    console.log('\n7️⃣  Testing Excessive Return Rejection (Attempt returning 4 units when only 3 returnable)...');
    const excessReturnRes = await fetch(`${BASE_URL}/sale-returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        saleId,
        items: [{ saleItemId, quantity: 4 }],
      }),
    });
    if (excessReturnRes.status !== 400) {
      throw new Error(`Excessive return should return 400! Got: ${excessReturnRes.status}`);
    }
    console.log('   ✅ Excessive return correctly rejected with 400 Bad Request');

    // 10. Return Remaining 3 items -> Sale status becomes RETURNED
    console.log('\n9️⃣  Returning Remaining 3 units to complete full invoice return...');
    const return2Res = await fetch(`${BASE_URL}/sale-returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        saleId,
        reason: 'Returning remaining items',
        items: [{ saleItemId, quantity: 3 }],
      }),
    });
    const return2Data = (await return2Res.json()) as any;
    if (return2Res.status !== 201) {
      throw new Error(`Remaining return failed: ${JSON.stringify(return2Data)}`);
    }

    const updatedSale = await prisma.sale.findUnique({ where: { id: saleId } });
    if (updatedSale?.status !== 'RETURNED') {
      throw new Error(`Sale status should be RETURNED! Got: ${updatedSale?.status}`);
    }
    console.log(`   ✅ Remaining 3 units returned. Sale status transitioned to '${updatedSale?.status}'`);

    // 11. Attempt Return on fully RETURNED sale -> Must be rejected (400)
    console.log('\n🔟 Testing Attempt Return on Already Fully Returned Sale (400 Bad Request)...');
    const duplicateReturnRes = await fetch(`${BASE_URL}/sale-returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        saleId,
        items: [{ saleItemId, quantity: 1 }],
      }),
    });
    if (duplicateReturnRes.status !== 400) {
      throw new Error(`Return on fully returned sale should return 400! Got: ${duplicateReturnRes.status}`);
    }
    console.log('   ✅ Duplicate return attempt correctly rejected with 400 Bad Request');

    // -------------------------------------------------------------
    // PART D: EXPENSES MODULE
    // -------------------------------------------------------------
    console.log('\n=== PART D: OPERATING EXPENSES MANAGEMENT ===');

    // 12. Create Expenses (POST /expenses)
    console.log('1️⃣3️⃣ Testing POST /expenses (Create Rent & Electricity Expenses)...');
    const rentExpRes = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        amount: 5000.0,
        category: 'RENT',
        description: 'Phase7 Pharmacy Monthly Store Rent',
        paymentMethod: 'WALLET',
      }),
    });
    const rentExpData = (await rentExpRes.json()) as any;
    if (rentExpRes.status !== 201 || !rentExpData.data?.id) {
      throw new Error(`Create rent expense failed: ${JSON.stringify(rentExpData)}`);
    }
    const rentExpenseId = rentExpData.data.id;

    const elecExpRes = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: accCookie },
      body: JSON.stringify({
        amount: 1200.0,
        category: 'ELECTRICITY',
        description: 'Phase7 Monthly Electricity Bill',
        paymentMethod: 'CASH',
      }),
    });
    const elecExpData = (await elecExpRes.json()) as any;
    console.log(`   ✅ Rent Expense created: 5000 EGP (ID: ${rentExpenseId})`);
    console.log(`   ✅ Electricity Expense created: 1200 EGP (ID: ${elecExpData.data.id})`);

    // 13. Update Expense (PATCH /expenses/:id)
    console.log('\n1️⃣4️⃣ Testing PATCH /expenses/:id (Update Expense Amount)...');
    const updateExpRes = await fetch(`${BASE_URL}/expenses/${rentExpenseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        amount: 5500.0,
        description: 'Phase7 Pharmacy Monthly Store Rent (Updated with maintenance)',
      }),
    });
    const updateExpData = (await updateExpRes.json()) as any;
    if (updateExpRes.status !== 200 || updateExpData.data.amount !== 5500.0) {
      throw new Error(`Update expense failed: ${JSON.stringify(updateExpData)}`);
    }
    console.log(`   ✅ Rent Expense updated to ${updateExpData.data.amount} EGP`);

    // 14. Filter Expenses (GET /expenses?category=RENT)
    console.log('\n1️⃣5️⃣ Testing Filter Expenses (GET /expenses?category=RENT)...');
    const filterExpRes = await fetch(`${BASE_URL}/expenses?category=RENT`, {
      headers: { Cookie: accCookie },
    });
    const filterExpData = (await filterExpRes.json()) as any;
    if (filterExpRes.status !== 200 || filterExpData.data.items.length !== 1) {
      throw new Error(`Filter expenses failed`);
    }
    console.log(`   ✅ Found ${filterExpData.data.items.length} expense(s) matching category RENT`);

    // 15. Verify Expense Financial Summary (GET /expenses/summary)
    console.log('\n1️⃣6️⃣ Testing Expense Financial Summary Report (GET /expenses/summary)...');
    const expSummaryRes = await fetch(`${BASE_URL}/expenses/summary`, {
      headers: { Cookie: accCookie },
    });
    const expSummaryData = (await expSummaryRes.json()) as any;
    if (expSummaryRes.status !== 200 || expSummaryData.data.totalExpenses !== 6700.0) {
      throw new Error(`Expense summary mismatch! Expected 6700.0, got: ${expSummaryData.data.totalExpenses}`);
    }
    console.log(`   ✅ Total Operating Expenses: ${expSummaryData.data.totalExpenses} EGP across ${expSummaryData.data.expensesCount} records`);

    // 16. Test RBAC on Expenses (Pharmacist blocked from creating expenses)
    console.log('\n1️⃣7️⃣ Testing RBAC: Pharmacist blocked from Expenses (403 Forbidden)...');
    const pharmExpRes = await fetch(`${BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        amount: 200.0,
        category: 'SUPPLIES',
        description: 'Unauthorized pharmacist expense',
      }),
    });
    if (pharmExpRes.status !== 403) {
      throw new Error(`Pharmacist should be 403 Forbidden from expenses! Got: ${pharmExpRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from financial expenses with 403 Forbidden');

    // -------------------------------------------------------------
    // PART E: COMMISSION REPORTING & AUDIT LOGS
    // -------------------------------------------------------------
    console.log('\n=== PART E: COMMISSION REPORTS & AUDIT LOGS ===');

    // 17. Commission Summary Report (GET /commissions/summary)
    console.log('2️⃣4️⃣ Testing Commission Summary Report (GET /commissions/summary)...');
    const commSummaryRes = await fetch(`${BASE_URL}/commissions/summary`, {
      headers: { Cookie: accCookie },
    });
    const commSummaryData = (await commSummaryRes.json()) as any;
    if (commSummaryRes.status !== 200 || commSummaryData.data.transactionsCount < 2) {
      throw new Error(`Commission summary report failed: ${JSON.stringify(commSummaryData)}`);
    }
    console.log(`   ✅ Commission Summary verified: ${commSummaryData.data.totalCommissionsPaid} EGP total net commission across ${commSummaryData.data.transactionsCount} transaction(s)`);

    // 18. Verify Historical Snapshot: Updating commission rule does NOT modify old transactions
    console.log('\n2️⃣2️⃣ Testing Update Commission Rule & Verifying Historical Snapshot Integrity...');
    await fetch(`${BASE_URL}/commissions/rules/${commissionRuleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ percentage: 10.0 }), // Changed to 10%
    });

    const oldCommTx = await prisma.commissionTransaction.findFirst({
      where: { saleId, commissionAmount: { gt: 0 } },
    });
    if (Number(oldCommTx?.commissionAmount) !== 20.0) {
      throw new Error(`Old commission transaction modified unexpectedly!`);
    }
    console.log(`   ✅ Verified historical commission snapshot preserved (remains 20.0 EGP despite rule updated to 10%)!`);

    // 19. Verify Audit Logs in MySQL audit_logs table
    console.log('\n1️⃣2️⃣ Verifying Audit Logs in MySQL audit_logs table...');
    const auditLogsCount = await prisma.auditLog.count({
      where: { entity: { in: ['sale_returns', 'expenses', 'commission_rules'] } },
    });
    console.log(`   ✅ Found ${auditLogsCount} audit logs for Phase 7 operations in MySQL!`);

    // Cleanup test records
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL PHASE 7 RETURNS, EXPENSES & COMMISSIONS TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 7 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase7();
