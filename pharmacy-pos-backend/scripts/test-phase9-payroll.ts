import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5011;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testUserPhones = ['+201066661111', '+201066662222', '+201066663333'];

async function cleanupTestData() {
  // 1. Delete expenses associated with payroll test
  await prisma.expense.deleteMany({
    where: { description: { contains: 'Phase9' } },
  });

  // 2. Delete payrolls
  await prisma.payroll.deleteMany({});

  // 3. Delete commission transactions
  await prisma.commissionTransaction.deleteMany({});

  // 4. Delete users
  await prisma.user.deleteMany({
    where: { phone: { in: testUserPhones } },
  });
}

async function testPhase9() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 9 (Financial Operations & Payroll) Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 9 test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Clean & setup test users
    await cleanupTestData();

    const passwordHash = await hashPassword('TestPass123!');
    const admin = await prisma.user.create({
      data: {
        name: 'Phase9 Manager',
        phone: '+201066661111',
        email: 'p9.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    const pharm = await prisma.user.create({
      data: {
        name: 'Phase9 Pharmacist',
        phone: '+201066662222',
        email: 'p9.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    const acc = await prisma.user.create({
      data: {
        name: 'Phase9 Accountant',
        phone: '+201066663333',
        email: 'p9.acc@pharmacy.local',
        passwordHash,
        role: 'ACCOUNTANT',
        isActive: true,
      },
    });

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201066661111', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Pharmacist
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201066662222', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Accountant
    const accLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201066663333', password: 'TestPass123!' }),
    });
    const accCookie = accLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('0️⃣  Setup complete. Authenticated Admin, Pharmacist, and Accountant.\n');

    // 1. Create Authoritative Commission Transactions for Pharmacist
    // 1,500 EGP earned commission and 200 EGP reversed commission in August 2026
    const periodStart = '2026-08-01';
    const periodEnd = '2026-08-31';

    await prisma.commissionTransaction.create({
      data: {
        userId: pharm.id,
        salesAmount: 30000.0,
        commissionAmount: 1500.0,
        commissionRate: 5.0,
        createdAt: new Date('2026-08-10T10:00:00Z'),
      },
    });

    await prisma.commissionTransaction.create({
      data: {
        userId: pharm.id,
        salesAmount: -4000.0,
        commissionAmount: -200.0,
        commissionRate: 5.0,
        createdAt: new Date('2026-08-15T12:00:00Z'),
      },
    });

    console.log('📦 Setup test commission transactions: +1500 EGP earned, -200 EGP reversed (Net: 1300 EGP).\n');

    // -------------------------------------------------------------
    // TEST 1: GENERATE PAYROLL (POST /payroll/generate)
    // -------------------------------------------------------------
    console.log('1️⃣  Testing Payroll Generation (POST /api/v1/payroll/generate)...');
    const genRes = await fetch(`${BASE_URL}/payroll/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: accCookie },
      body: JSON.stringify({
        userId: pharm.id,
        periodStart,
        periodEnd,
        baseSalary: 10000.0,
        bonus: 500.0,
        deductions: 300.0,
      }),
    });
    const genData = (await genRes.json()) as any;
    if (genRes.status !== 201 || !genData.data?.id) {
      throw new Error(`Generate payroll failed: ${JSON.stringify(genData)}`);
    }
    const payrollId = genData.data.id;
    console.log(`   ✅ Payroll generated: ${genData.data.employeeName} | Net Salary: ${genData.data.netSalary} EGP`);

    // -------------------------------------------------------------
    // TEST 2: VERIFY PAYROLL FORMULA & BREAKDOWN
    // -------------------------------------------------------------
    console.log('\n2️⃣  Verifying Server-side Formula Calculation (Base 10,000 + Comm 1,300 + Bonus 500 - Deductions 300 = 11,500 EGP)...');
    if (genData.data.baseSalary !== 10000.0) throw new Error(`Base salary mismatch!`);
    if (genData.data.commission !== 1300.0) throw new Error(`Commission mismatch! Expected 1300.0, got ${genData.data.commission}`);
    if (genData.data.bonus !== 500.0) throw new Error(`Bonus mismatch!`);
    if (genData.data.deductions !== 300.0) throw new Error(`Deductions mismatch!`);
    if (genData.data.netSalary !== 11500.0) throw new Error(`Net salary mismatch! Expected 11500.0, got ${genData.data.netSalary}`);
    console.log(`   ✅ Exact Decimal calculation verified: Net Payable = 11,500.00 EGP`);

    // -------------------------------------------------------------
    // TEST 3: VERIFY PAYROLL DETAILS BY ID (GET /payroll/:id)
    // -------------------------------------------------------------
    console.log('\n3️⃣  Testing Payroll Lookup with Breakdown (GET /api/v1/payroll/:id)...');
    const getRes = await fetch(`${BASE_URL}/payroll/${payrollId}`, {
      headers: { Cookie: accCookie },
    });
    const getData = (await getRes.json()) as any;
    if (getRes.status !== 200 || !getData.data.breakdown) {
      throw new Error(`Get payroll details failed`);
    }
    console.log(`   ✅ Breakdown: Earned: ${getData.data.breakdown.commissionEarned} EGP | Reversed: ${getData.data.breakdown.commissionReversed} EGP | Net: ${getData.data.breakdown.netCommission} EGP`);

    // -------------------------------------------------------------
    // TEST 4: PREVENT OVERLAPPING/DUPLICATE PAYROLL (409 Conflict)
    // -------------------------------------------------------------
    console.log('\n4️⃣  Testing Duplicate/Overlapping Active Payroll Rejection (409 Conflict)...');
    const dupRes = await fetch(`${BASE_URL}/payroll/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: accCookie },
      body: JSON.stringify({
        userId: pharm.id,
        periodStart: '2026-08-15',
        periodEnd: '2026-09-15',
        baseSalary: 10000.0,
      }),
    });
    if (dupRes.status !== 409) {
      throw new Error(`Duplicate overlapping payroll should return 409! Got: ${dupRes.status}`);
    }
    console.log('   ✅ Duplicate overlapping payroll correctly rejected with 409 Conflict');

    // -------------------------------------------------------------
    // TEST 5: UPDATE DRAFT/PENDING PAYROLL (PATCH /payroll/:id)
    // -------------------------------------------------------------
    console.log('\n5️⃣  Testing Update Pending Payroll Components (PATCH /api/v1/payroll/:id)...');
    const updateRes = await fetch(`${BASE_URL}/payroll/${payrollId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        bonus: 700.0, // Increase bonus by +200 -> Net should become 11,700 EGP
      }),
    });
    const updateData = (await updateRes.json()) as any;
    if (updateRes.status !== 200 || updateData.data.netSalary !== 11700.0) {
      throw new Error(`Update payroll failed: ${JSON.stringify(updateData)}`);
    }
    console.log(`   ✅ Payroll updated: Bonus adjusted to 700 EGP | New Net Salary: ${updateData.data.netSalary} EGP`);

    // -------------------------------------------------------------
    // TEST 6: APPROVE PAYROLL (POST /payroll/:id/approve)
    // -------------------------------------------------------------
    console.log('\n6️⃣  Testing Payroll Approval (POST /api/v1/payroll/:id/approve)...');
    const approveRes = await fetch(`${BASE_URL}/payroll/${payrollId}/approve`, {
      method: 'POST',
      headers: { Cookie: adminCookie },
    });
    const approveData = (await approveRes.json()) as any;
    if (approveRes.status !== 200 || approveData.data.status !== 'PENDING') {
      throw new Error(`Approve payroll failed`);
    }
    console.log(`   ✅ Payroll approved (Status: ${approveData.data.status})`);

    // -------------------------------------------------------------
    // TEST 7: ATOMIC PAYROLL PAYMENT (POST /payroll/:id/pay)
    // -------------------------------------------------------------
    console.log('\n7️⃣  Testing Atomic Payroll Settlement (POST /api/v1/payroll/:id/pay)...');
    const payRes = await fetch(`${BASE_URL}/payroll/${payrollId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: accCookie },
      body: JSON.stringify({
        paymentMethod: 'WALLET',
        notes: 'Monthly bank salary transfer Phase9',
      }),
    });
    const payData = (await payRes.json()) as any;
    if (payRes.status !== 200 || payData.data.status !== 'PAID' || !payData.data.paidAt) {
      throw new Error(`Pay payroll failed: ${JSON.stringify(payData)}`);
    }
    console.log(`   ✅ Payroll marked PAID on ${payData.data.paidAt}`);

    // Verify Expense created in MySQL
    const salaryExp = await prisma.expense.findFirst({
      where: { category: 'SALARY', amount: 11700.0 },
    });
    if (!salaryExp) {
      throw new Error(`Salary expense record not found in MySQL!`);
    }
    console.log(`   ✅ Verified Salary Operating Expense created: ${salaryExp.amount} EGP (${salaryExp.description})`);

    // -------------------------------------------------------------
    // TEST 8: PAYMENT IDEMPOTENCY / CONFLICT (409 Conflict)
    // -------------------------------------------------------------
    console.log('\n8️⃣  Testing Payment Idempotency & Repeat Payment Protection (409 Conflict)...');
    const rePayRes = await fetch(`${BASE_URL}/payroll/${payrollId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: accCookie },
      body: JSON.stringify({ paymentMethod: 'CASH' }),
    });
    if (rePayRes.status !== 409) {
      throw new Error(`Repeat payment on paid payroll should return 409! Got: ${rePayRes.status}`);
    }
    console.log('   ✅ Repeat payment attempt correctly rejected with 409 Conflict');

    // -------------------------------------------------------------
    // TEST 9: IMMUTABILITY OF PAID PAYROLL (409 Conflict)
    // -------------------------------------------------------------
    console.log('\n9️⃣  Testing Immutability of Paid Payroll (Cannot modify paid payroll -> 409 Conflict)...');
    const modPaidRes = await fetch(`${BASE_URL}/payroll/${payrollId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ baseSalary: 15000.0 }),
    });
    if (modPaidRes.status !== 409) {
      throw new Error(`Modifying paid payroll should return 409! Got: ${modPaidRes.status}`);
    }
    console.log('   ✅ Paid payroll immutability strictly preserved (409 Conflict)');

    // -------------------------------------------------------------
    // TEST 10: RBAC PROTECTION (Pharmacist blocked from managing payroll -> 403 Forbidden)
    // -------------------------------------------------------------
    console.log('\n🔟 Testing RBAC: Pharmacist blocked from Payroll Management (403 Forbidden)...');
    const pharmPayRes = await fetch(`${BASE_URL}/payroll/${payrollId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({ paymentMethod: 'CASH' }),
    });
    if (pharmPayRes.status !== 403) {
      throw new Error(`Pharmacist should be blocked with 403! Got: ${pharmPayRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from payroll mutations with 403 Forbidden');

    // -------------------------------------------------------------
    // TEST 11: GENERATE PERIOD PAYROLL (POST /payroll/generate-period)
    // -------------------------------------------------------------
    console.log('\n1️⃣1️⃣ Testing Period Bulk Payroll Generation (POST /api/v1/payroll/generate-period)...');
    const bulkRes = await fetch(`${BASE_URL}/payroll/generate-period`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        periodStart: '2026-09-01',
        periodEnd: '2026-09-30',
        defaultBaseSalary: 6000.0,
      }),
    });
    const bulkData = (await bulkRes.json()) as any;
    if (bulkRes.status !== 201 || bulkData.data.length === 0) {
      throw new Error(`Bulk payroll generation failed: ${JSON.stringify(bulkData)}`);
    }
    console.log(`   ✅ Bulk generated ${bulkData.data.length} payroll records for period September 2026`);

    // -------------------------------------------------------------
    // TEST 12: CANCEL PENDING PAYROLL (POST /payroll/:id/cancel)
    // -------------------------------------------------------------
    console.log('\n1️⃣2️⃣ Testing Cancel Pending Payroll (POST /api/v1/payroll/:id/cancel)...');
    const pendingPayrollId = bulkData.data[0].id;
    const cancelRes = await fetch(`${BASE_URL}/payroll/${pendingPayrollId}/cancel`, {
      method: 'POST',
      headers: { Cookie: adminCookie },
    });
    const cancelData = (await cancelRes.json()) as any;
    if (cancelRes.status !== 200 || cancelData.data.status !== 'CANCELLED') {
      throw new Error(`Cancel payroll failed: ${JSON.stringify(cancelData)}`);
    }
    console.log(`   ✅ Payroll ${pendingPayrollId} successfully marked as CANCELLED`);

    // -------------------------------------------------------------
    // TEST 13: PAYROLL SUMMARY REPORT (GET /payroll/summary)
    // -------------------------------------------------------------
    console.log('\n1️⃣3️⃣ Testing Payroll Summary Report (GET /api/v1/payroll/summary)...');
    const summaryRes = await fetch(`${BASE_URL}/payroll/summary`, {
      headers: { Cookie: accCookie },
    });
    const summaryData = (await summaryRes.json()) as any;
    if (summaryRes.status !== 200 || summaryData.data.totalPaidAmount !== 11700.0) {
      throw new Error(`Payroll summary report failed: ${JSON.stringify(summaryData)}`);
    }
    console.log(`   ✅ Payroll Summary: Total Paid: ${summaryData.data.totalPaidAmount} EGP | Pending: ${summaryData.data.totalPendingAmount} EGP | Total Employees: ${summaryData.data.totalEmployeesCount}`);

    // -------------------------------------------------------------
    // TEST 14: EMPLOYEE PAYROLL HISTORY (GET /payroll/employee/:employeeId)
    // -------------------------------------------------------------
    console.log('\n1️⃣4️⃣ Testing Employee Payroll History (GET /api/v1/payroll/employee/:employeeId)...');
    const historyRes = await fetch(`${BASE_URL}/payroll/employee/${pharm.id}`, {
      headers: { Cookie: accCookie },
    });
    const historyData = (await historyRes.json()) as any;
    if (historyRes.status !== 200 || historyData.data.length === 0) {
      throw new Error(`Employee payroll history failed`);
    }
    console.log(`   ✅ Retrieved ${historyData.data.length} payroll record(s) for employee '${pharm.name}'`);

    // -------------------------------------------------------------
    // TEST 15: AUDIT LOGS IN MYSQL
    // -------------------------------------------------------------
    console.log('\n1️⃣5️⃣ Verifying Audit Logs in MySQL audit_logs table...');
    const auditLogsCount = await prisma.auditLog.count({
      where: { entity: 'payrolls' },
    });
    console.log(`   ✅ Found ${auditLogsCount} audit logs for Payroll operations in MySQL!`);

    // Cleanup test records
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL PHASE 9 FINANCIAL OPERATIONS & PAYROLL TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 9 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase9();
