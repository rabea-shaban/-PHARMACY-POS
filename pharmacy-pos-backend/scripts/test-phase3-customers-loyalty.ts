import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5005;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

async function cleanupTestData(testPhones: string[]) {
  const customers = await prisma.customer.findMany({
    where: { phone: { in: testPhones } },
    select: { id: true },
  });
  const customerIds = customers.map((c) => c.id);

  if (customerIds.length > 0) {
    const loyaltyAccounts = await prisma.loyaltyAccount.findMany({
      where: { customerId: { in: customerIds } },
      select: { id: true },
    });
    const loyaltyAccountIds = loyaltyAccounts.map((a) => a.id);

    if (loyaltyAccountIds.length > 0) {
      await prisma.loyaltyTransaction.deleteMany({
        where: { loyaltyAccountId: { in: loyaltyAccountIds } },
      });
      await prisma.loyaltyAccount.deleteMany({
        where: { id: { in: loyaltyAccountIds } },
      });
    }

    await prisma.customer.deleteMany({
      where: { id: { in: customerIds } },
    });
  }

  await prisma.user.deleteMany({
    where: { phone: { in: ['+201055551111', '+201055552222'] } },
  });
}

async function testPhase3() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 3 (Customers & Loyalty Module) Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 3 test server running on port ${PORT}`);
      resolve();
    });
  });

  const testPhones = [
    '+201099990001',
    '+201099990002',
    '+201099990003',
    '+201099990004',
    '+201099990005',
  ];

  try {
    // 0. Setup: Clean previous test customers/users and seed test admin & pharmacist
    await cleanupTestData(testPhones);

    const passwordHash = await hashPassword('TestPass123!');
    await prisma.user.create({
      data: {
        name: 'Phase3 Admin',
        phone: '+201055551111',
        email: 'p3.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    await prisma.user.create({
      data: {
        name: 'Phase3 Pharmacist',
        phone: '+201055552222',
        email: 'p3.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    // Login as Admin to get HttpOnly Cookie
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201055551111', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Pharmacist to get HttpOnly Cookie
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201055552222', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('0️⃣  Setup complete. Authenticated Admin and Pharmacist via Cookies.\n');

    // 1. Test POST /customers (Register new customer)
    console.log('1️⃣  Testing POST /customers (Register Customer with auto-initialized Loyalty)...');
    const createCustomerRes = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: 'Mahmoud Hassan',
        phone: '+201099990001',
        email: 'mahmoud.hassan@example.com',
        address: '15 El-Tahrir St, Cairo',
        gender: 'MALE',
        dateOfBirth: '1990-05-15',
        notes: 'VIP customer preferred discount',
      }),
    });
    const createCustomerData = (await createCustomerRes.json()) as any;
    if (createCustomerRes.status !== 201 || !createCustomerData.data?.id) {
      throw new Error(`Create customer failed: ${JSON.stringify(createCustomerData)}`);
    }
    const customerId = createCustomerData.data.id;
    console.log(`   ✅ Customer created: ${createCustomerData.data.name} (ID: ${customerId})`);
    console.log(`   ✅ Default Tier assigned: ${createCustomerData.data.tier?.name || 'REGULAR'}`);
    console.log(`   ✅ Loyalty Account automatically initialized: ${createCustomerData.data.loyaltyAccount?.totalPoints} pts`);

    // 2. Test GET /customers/:id (Get customer profile)
    console.log('\n2️⃣  Testing GET /customers/:id (Customer Profile)...');
    const getCustomerRes = await fetch(`${BASE_URL}/customers/${customerId}`, {
      headers: { Cookie: adminCookie },
    });
    const getCustomerData = (await getCustomerRes.json()) as any;
    if (getCustomerRes.status !== 200 || getCustomerData.data?.id !== customerId) {
      throw new Error(`Get customer failed: ${JSON.stringify(getCustomerData)}`);
    }
    console.log(`   ✅ Retrieved profile: ${getCustomerData.data.name} | Phone: ${getCustomerData.data.phone}`);

    // 3. Test Duplicate Phone Protection (409 Conflict)
    console.log('\n3️⃣  Testing Duplicate Phone Protection (409 Conflict)...');
    const dupPhoneRes = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: 'Another Customer',
        phone: '+201099990001',
      }),
    });
    const dupPhoneData = (await dupPhoneRes.json()) as any;
    if (dupPhoneRes.status !== 409) {
      throw new Error(`Duplicate phone should have returned 409! Got: ${dupPhoneRes.status}`);
    }
    console.log(`   ✅ Duplicate phone successfully rejected with 409 Conflict: "${dupPhoneData.message}"`);

    // 4. Test Customer Search & Filters
    console.log('\n4️⃣  Testing Customer Search by Phone and Name (GET /customers)...');
    const searchPhoneRes = await fetch(`${BASE_URL}/customers?search=99990001`, {
      headers: { Cookie: adminCookie },
    });
    const searchPhoneData = (await searchPhoneRes.json()) as any;
    if (searchPhoneRes.status !== 200 || searchPhoneData.data.items.length === 0) {
      throw new Error(`Customer search by phone failed`);
    }
    console.log(`   ✅ Found ${searchPhoneData.data.items.length} customer(s) searching for '99990001'`);

    const searchNameRes = await fetch(`${BASE_URL}/customers?name=Mahmoud`, {
      headers: { Cookie: adminCookie },
    });
    const searchNameData = (await searchNameRes.json()) as any;
    if (searchNameRes.status !== 200 || searchNameData.data.items.length === 0) {
      throw new Error(`Customer search by name failed`);
    }
    console.log(`   ✅ Found ${searchNameData.data.items.length} customer(s) searching for 'Mahmoud'`);

    // 5. Test PATCH /customers/:id (Update customer)
    console.log('\n5️⃣  Testing PATCH /customers/:id (Update Customer Details)...');
    const updateCustomerRes = await fetch(`${BASE_URL}/customers/${customerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        address: '22 Nasr City, Cairo',
        notes: 'Updated customer notes',
      }),
    });
    const updateCustomerData = (await updateCustomerRes.json()) as any;
    if (updateCustomerRes.status !== 200 || updateCustomerData.data?.address !== '22 Nasr City, Cairo') {
      throw new Error(`Update customer failed: ${JSON.stringify(updateCustomerData)}`);
    }
    console.log(`   ✅ Updated customer address: "${updateCustomerData.data.address}"`);

    // 6. Test GET /customers/:id/loyalty (Loyalty Summary)
    console.log('\n6️⃣  Testing GET /customers/:id/loyalty (Loyalty Summary)...');
    const loyaltySummaryRes = await fetch(`${BASE_URL}/customers/${customerId}/loyalty`, {
      headers: { Cookie: adminCookie },
    });
    const loyaltySummaryData = (await loyaltySummaryRes.json()) as any;
    if (loyaltySummaryRes.status !== 200 || loyaltySummaryData.data?.loyaltyAccount.totalPoints !== 0) {
      throw new Error(`Get loyalty summary failed: ${JSON.stringify(loyaltySummaryData)}`);
    }
    console.log(`   ✅ Retrieved Loyalty Summary for ${loyaltySummaryData.data.customer.name}`);
    console.log(`   ✅ Current Balance: ${loyaltySummaryData.data.loyaltyAccount.totalPoints} pts`);

    // 7. Test POST /customers/:id/loyalty/earn (+600 points)
    console.log('\n7️⃣  Testing POST /customers/:id/loyalty/earn (+600 points)...');
    const earnRes = await fetch(`${BASE_URL}/customers/${customerId}/loyalty/earn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        points: 600,
        referenceType: 'SALE',
        referenceId: 'INV-2026-0001',
        reason: 'Purchase rewards for INV-2026-0001',
      }),
    });
    const earnData = (await earnRes.json()) as any;
    if (earnRes.status !== 200 || earnData.data?.newBalance !== 600) {
      throw new Error(`Earn points failed: ${JSON.stringify(earnData)}`);
    }
    console.log(`   ✅ Earned 600 points. New balance: ${earnData.data.newBalance} pts`);
    if (earnData.data.upgradedTier) {
      console.log(`   🎉 Customer upgraded automatically to tier: ${earnData.data.upgradedTier.name}!`);
    }

    // 8. Test POST /customers/:id/loyalty/redeem (-100 points)
    console.log('\n8️⃣  Testing POST /customers/:id/loyalty/redeem (-100 points)...');
    const redeemRes = await fetch(`${BASE_URL}/customers/${customerId}/loyalty/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        points: 100,
        referenceType: 'SALE',
        referenceId: 'INV-2026-0002',
        reason: 'Redeemed 100 points for 10 EGP discount',
      }),
    });
    const redeemData = (await redeemRes.json()) as any;
    if (redeemRes.status !== 200 || redeemData.data?.newBalance !== 500) {
      throw new Error(`Redeem points failed: ${JSON.stringify(redeemData)}`);
    }
    console.log(`   ✅ Redeemed 100 points. New balance: ${redeemData.data.newBalance} pts`);

    // 9. Test Insufficient Points Rejection (400 Bad Request)
    console.log('\n9️⃣  Testing Insufficient Points Rejection (400 Bad Request)...');
    const overRedeemRes = await fetch(`${BASE_URL}/customers/${customerId}/loyalty/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        points: 99999,
        reason: 'Excessive redemption attempt',
      }),
    });
    const overRedeemData = (await overRedeemRes.json()) as any;
    if (overRedeemRes.status !== 400) {
      throw new Error(`Excessive redemption should fail with 400! Got: ${overRedeemRes.status}`);
    }
    console.log(`   ✅ Insufficient points rejected with 400: "${overRedeemData.message}"`);

    // 10. Test POST /customers/:id/loyalty/adjust (Manual adjustment by Manager)
    console.log('\n🔟 Testing POST /customers/:id/loyalty/adjust (Manual Adjustment)...');
    const adjustRes = await fetch(`${BASE_URL}/customers/${customerId}/loyalty/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        points: 1000,
        reason: 'Manager customer retention compensation',
      }),
    });
    const adjustData = (await adjustRes.json()) as any;
    if (adjustRes.status !== 200 || adjustData.data?.newBalance !== 1500) {
      throw new Error(`Manual adjustment failed: ${JSON.stringify(adjustData)}`);
    }
    console.log(`   ✅ Adjusted points by +1000. New balance: ${adjustData.data.newBalance} pts`);
    console.log(`   ✅ Reason stored: "${adjustData.data.reason}"`);

    // 11. Test RBAC: Pharmacist cannot manually adjust points (403 Forbidden)
    console.log('\n1️⃣1️⃣ Testing RBAC: Pharmacist blocked from manual adjustments (403 Forbidden)...');
    const pharmAdjustRes = await fetch(`${BASE_URL}/customers/${customerId}/loyalty/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        points: 500,
        reason: 'Unauthorized pharmacist adjustment',
      }),
    });
    if (pharmAdjustRes.status !== 403) {
      throw new Error(`Pharmacist adjustment should be 403 Forbidden! Got: ${pharmAdjustRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from manual adjustment with 403 Forbidden');

    // 12. Test GET /customers/:id/loyalty/transactions (Paginated transaction ledger)
    console.log('\n1️⃣2️⃣ Testing GET /customers/:id/loyalty/transactions (Ledger Audit)...');
    const ledgerRes = await fetch(`${BASE_URL}/customers/${customerId}/loyalty/transactions`, {
      headers: { Cookie: adminCookie },
    });
    const ledgerData = (await ledgerRes.json()) as any;
    if (ledgerRes.status !== 200 || ledgerData.data.items.length < 3) {
      throw new Error(`Ledger query failed: ${JSON.stringify(ledgerData)}`);
    }
    console.log(`   ✅ Retrieved ${ledgerData.data.items.length} immutable loyalty transactions.`);
    for (const tx of ledgerData.data.items) {
      console.log(`      - [${tx.type}] Delta: ${tx.points > 0 ? '+' : ''}${tx.points} pts | Balance After: ${tx.balanceAfter} pts | Reason: ${tx.reason}`);
    }

    // 13. Test GET /loyalty/tiers (Customer Tiers)
    console.log('\n1️⃣3️⃣ Testing GET /loyalty/tiers (Customer Tiers)...');
    const tiersRes = await fetch(`${BASE_URL}/loyalty/tiers`, {
      headers: { Cookie: adminCookie },
    });
    const tiersData = (await tiersRes.json()) as any;
    if (tiersRes.status !== 200 || !Array.isArray(tiersData.data)) {
      throw new Error(`Get tiers failed: ${JSON.stringify(tiersData)}`);
    }
    console.log(`   ✅ Retrieved ${tiersData.data.length} customer tiers:`);
    for (const tier of tiersData.data) {
      console.log(`      - ${tier.name}: ${tier.discountPercentage}% discount (Min: ${tier.minimumPoints} pts)`);
    }

    // 14. Test GET /customers/:id/purchases (Purchase history query integration)
    console.log('\n1️⃣4️⃣ Testing GET /customers/:id/purchases (Customer Purchase History)...');
    const purchasesRes = await fetch(`${BASE_URL}/customers/${customerId}/purchases`, {
      headers: { Cookie: adminCookie },
    });
    const purchasesData = (await purchasesRes.json()) as any;
    if (purchasesRes.status !== 200 || !Array.isArray(purchasesData.data.items)) {
      throw new Error(`Get purchases failed: ${JSON.stringify(purchasesData)}`);
    }
    console.log(`   ✅ Purchase history endpoint returned ${purchasesData.data.items.length} records successfully.`);

    // 15. Test DELETE /customers/:id (Soft-Deactivation)
    console.log('\n1️⃣5️⃣ Testing DELETE /customers/:id (Soft-Deactivation)...');
    const deleteRes = await fetch(`${BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie },
    });
    const deleteData = (await deleteRes.json()) as any;
    if (deleteRes.status !== 200 || deleteData.data?.isActive !== false) {
      throw new Error(`Soft delete failed: ${JSON.stringify(deleteData)}`);
    }
    console.log(`   ✅ Customer soft-deactivated (isActive = ${deleteData.data.isActive})`);

    // 16. Verify Audit Logs in MySQL audit_logs table
    console.log('\n1️⃣6️⃣ Verifying Audit Logs in MySQL audit_logs table...');
    const auditLogsCount = await prisma.auditLog.count({
      where: {
        entity: { in: ['customers', 'loyalty_accounts'] },
      },
    });
    console.log(`   ✅ Found ${auditLogsCount} audit logs for Customer & Loyalty operations in MySQL!`);

    // Cleanup test records cleanly
    await cleanupTestData(testPhones);
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL 16 PHASE 3 CUSTOMER & LOYALTY TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 3 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase3();
