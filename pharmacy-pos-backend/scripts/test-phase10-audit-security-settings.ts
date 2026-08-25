import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import { auditService } from '../src/modules/audit/index.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5013;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testUserPhones = ['+201088881111', '+201088882222', '+201088883333'];

async function cleanupTestData() {
  // 1. Delete audit logs created during this test
  await prisma.auditLog.deleteMany({});

  // 2. Delete test users
  await prisma.user.deleteMany({
    where: { phone: { in: testUserPhones } },
  });
}

async function testPhase10AuditSecuritySettings() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 10 (Audit, Security & Settings) Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 10 test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Clean & setup test users
    await cleanupTestData();

    const passwordHash = await hashPassword('TestPass123!');
    const admin = await prisma.user.create({
      data: {
        name: 'Phase10 Admin Manager',
        phone: '+201088881111',
        email: 'p10sec.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    const pharm = await prisma.user.create({
      data: {
        name: 'Phase10 Staff Pharmacist',
        phone: '+201088882222',
        email: 'p10sec.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    const acc = await prisma.user.create({
      data: {
        name: 'Phase10 Staff Accountant',
        phone: '+201088883333',
        email: 'p10sec.acc@pharmacy.local',
        passwordHash,
        role: 'ACCOUNTANT',
        isActive: true,
      },
    });

    // -------------------------------------------------------------
    // PART A: SECURITY & AUTHENTICATION ACTIVITY LOGGING
    // -------------------------------------------------------------
    console.log('=== PART A: SECURITY & AUTHENTICATION ACTIVITY LOGGING ===');

    // 1. Test Failed Login Attempt (Invalid password)
    console.log('1️⃣  Testing Failed Login Attempt Recording...');
    const failedLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201088882222', password: 'WrongPassword999!' }),
    });
    if (failedLoginRes.status !== 401) {
      throw new Error(`Failed login should return 401! Got: ${failedLoginRes.status}`);
    }
    console.log('   ✅ Failed login attempt rejected with 401 Unauthorized.');

    // 2. Test Successful Login Attempts
    console.log('\n2️⃣  Testing Successful Login Attempt Recording...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201088881111', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201088882222', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    const accLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201088883333', password: 'TestPass123!' }),
    });
    const accCookie = accLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('   ✅ Authenticated Admin, Pharmacist, and Accountant.');

    // 3. Query Security Logs (GET /security/logs)
    console.log('\n3️⃣  Testing Query Security Logs (GET /api/v1/security/logs)...');
    const secLogsRes = await fetch(`${BASE_URL}/security/logs`, {
      headers: { Cookie: adminCookie },
    });
    const secLogsData = (await secLogsRes.json()) as any;
    if (secLogsRes.status !== 200 || secLogsData.data.items.length < 4) {
      throw new Error(`Security logs query failed: ${JSON.stringify(secLogsData)}`);
    }
    console.log(`   ✅ Retrieved ${secLogsData.data.items.length} security login log(s).`);

    // 4. Query Security Stats (GET /security/stats)
    console.log('\n4️⃣  Testing Security Stats & Failure Rate (GET /api/v1/security/stats)...');
    const secStatsRes = await fetch(`${BASE_URL}/security/stats`, {
      headers: { Cookie: adminCookie },
    });
    const secStatsData = (await secStatsRes.json()) as any;
    if (
      secStatsRes.status !== 200 ||
      secStatsData.data.failedLogins !== 1 ||
      secStatsData.data.successfulLogins !== 3
    ) {
      throw new Error(`Security stats mismatch: ${JSON.stringify(secStatsData)}`);
    }
    console.log(`   ✅ Security Stats: Total: ${secStatsData.data.totalLoginAttempts} | Success: ${secStatsData.data.successfulLogins} | Failed: ${secStatsData.data.failedLogins} | Failure Rate: ${secStatsData.data.failureRatePercentage}%`);

    // -------------------------------------------------------------
    // PART B: AUDIT LOGS & ACTIVITY TRACKING
    // -------------------------------------------------------------
    console.log('\n=== PART B: AUDIT LOGS & ACTIVITY TRACKING ===');

    // 5. Create Sensitive Business Activity Audit Logs
    console.log('5️⃣  Recording Sensitive Business Actions...');
    await auditService.logAction({
      userId: admin.id,
      action: 'UPDATE',
      entity: 'products',
      entityId: 'PROD-102',
      oldData: { price: 50.0 },
      newData: { price: 55.0 },
      metadata: { reason: 'Supplier price hike' },
    });

    await auditService.logAction({
      userId: pharm.id,
      action: 'INVENTORY_ADJUSTMENT',
      entity: 'batches',
      entityId: 'BATCH-AUG-01',
      oldData: { quantity: 100 },
      newData: { quantity: 70 },
      metadata: { reason: 'Damaged during unloading' },
    });

    // 6. Query Paginated Audit Logs (GET /audit-logs)
    console.log('\n6️⃣  Testing Query Audit Logs (GET /api/v1/audit-logs)...');
    const auditRes = await fetch(`${BASE_URL}/audit-logs?entity=products`, {
      headers: { Cookie: adminCookie },
    });
    const auditData = (await auditRes.json()) as any;
    if (auditRes.status !== 200 || auditData.data.items.length === 0) {
      throw new Error(`Audit logs query failed: ${JSON.stringify(auditData)}`);
    }
    const targetAuditId = auditData.data.items[0].id;
    console.log(`   ✅ Retrieved ${auditData.data.items.length} audit logs matching entity=products.`);

    // 7. Get Audit Log Detail (GET /audit-logs/:id)
    console.log('\n7️⃣  Testing Audit Log Detail (GET /api/v1/audit-logs/:id)...');
    const detailRes = await fetch(`${BASE_URL}/audit-logs/${targetAuditId}`, {
      headers: { Cookie: adminCookie },
    });
    const detailData = (await detailRes.json()) as any;
    if (detailRes.status !== 200 || detailData.data.oldData?.price !== 50) {
      throw new Error(`Audit detail mismatch: ${JSON.stringify(detailData)}`);
    }
    console.log(`   ✅ Verified Audit Record: Old Price: ${detailData.data.oldData.price} -> New Price: ${detailData.data.newData.price} | Actor: ${detailData.data.userName}`);

    // 8. Audit Activity Summary (GET /audit-logs/summary)
    console.log('\n8️⃣  Testing Audit Activity Summary (GET /api/v1/audit-logs/summary)...');
    const sumRes = await fetch(`${BASE_URL}/audit-logs/summary`, {
      headers: { Cookie: adminCookie },
    });
    const sumData = (await sumRes.json()) as any;
    if (sumRes.status !== 200 || sumData.data.totalLogsCount < 6) {
      throw new Error(`Audit summary failed: ${JSON.stringify(sumData)}`);
    }
    console.log(`   ✅ Total System Activity Records: ${sumData.data.totalLogsCount} across ${sumData.data.actionDistribution.length} distinct action types.`);

    // -------------------------------------------------------------
    // PART C: SYSTEM & BUSINESS SETTINGS
    // -------------------------------------------------------------
    console.log('\n=== PART C: SYSTEM & BUSINESS SETTINGS ===');

    // 9. Get Public Settings (GET /settings/public - No Auth)
    console.log('9️⃣  Testing Public Settings (GET /api/v1/settings/public)...');
    const pubRes = await fetch(`${BASE_URL}/settings/public`);
    const pubData = (await pubRes.json()) as any;
    if (pubRes.status !== 200 || !pubData.data.pharmacyName || !pubData.data.currency) {
      throw new Error(`Public settings failed: ${JSON.stringify(pubData)}`);
    }
    console.log(`   ✅ Public Settings: Pharmacy: "${pubData.data.pharmacyName}" | Currency: "${pubData.data.currency}" | Prefix: "${pubData.data.invoicePrefix}"`);

    // 10. Get All Settings (GET /settings)
    console.log('\n🔟 Testing Get All Settings (GET /api/v1/settings)...');
    const allRes = await fetch(`${BASE_URL}/settings`, {
      headers: { Cookie: accCookie },
    });
    const allData = (await allRes.json()) as any;
    if (allRes.status !== 200 || allData.data.items.length < 5) {
      throw new Error(`Get all settings failed: ${JSON.stringify(allData)}`);
    }
    console.log(`   ✅ Retrieved ${allData.data.items.length} configuration settings.`);

    // 11. Batch Update Settings (PATCH /settings)
    console.log('\n1️⃣1️⃣ Testing Batch Update Settings (PATCH /api/v1/settings)...');
    const updateRes = await fetch(`${BASE_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        settings: [
          { key: 'pharmacy_name', value: 'Al-Shifa Elite Pharmacy', isPublic: true },
          { key: 'low_stock_threshold', value: '15' },
          { key: 'loyalty_points_per_egp', value: '0.2' },
        ],
      }),
    });
    const updateData = (await updateRes.json()) as any;
    if (updateRes.status !== 200) {
      throw new Error(`Update settings failed: ${JSON.stringify(updateData)}`);
    }
    console.log(`   ✅ Updated ${updateData.data.items.length} system settings.`);

    // 12. Get Specific Setting (GET /settings/:key)
    console.log('\n1️⃣2️⃣ Testing Get Specific Setting (GET /api/v1/settings/:key)...');
    const getSingleRes = await fetch(`${BASE_URL}/settings/pharmacy_name`, {
      headers: { Cookie: accCookie },
    });
    const getSingleData = (await getSingleRes.json()) as any;
    if (getSingleRes.status !== 200 || getSingleData.data.value !== 'Al-Shifa Elite Pharmacy') {
      throw new Error(`Get single setting mismatch: ${JSON.stringify(getSingleData)}`);
    }
    console.log(`   ✅ Verified updated setting: pharmacy_name = "${getSingleData.data.value}"`);

    // 13. Update Single Setting (PATCH /settings/:key)
    console.log('\n1️⃣3️⃣ Testing Update Single Setting (PATCH /api/v1/settings/:key)...');
    const patchSingleRes = await fetch(`${BASE_URL}/settings/expiry_alert_days`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        value: '60',
        description: 'Updated batch expiry alert horizon',
      }),
    });
    const patchSingleData = (await patchSingleRes.json()) as any;
    if (patchSingleRes.status !== 200 || patchSingleData.data.value !== '60') {
      throw new Error(`Patch single setting failed: ${JSON.stringify(patchSingleData)}`);
    }
    console.log(`   ✅ Updated setting expiry_alert_days to 60 days.`);

    // -------------------------------------------------------------
    // PART D: RBAC & AUTHORIZATION BOUNDARIES
    // -------------------------------------------------------------
    console.log('\n=== PART D: RBAC & AUTHORIZATION BOUNDARIES ===');

    // 14. Pharmacist blocked from Audit Logs (403 Forbidden)
    console.log('1️⃣4️⃣ Testing RBAC: Pharmacist blocked from Audit Logs (403 Forbidden)...');
    const pharmAuditRes = await fetch(`${BASE_URL}/audit-logs`, {
      headers: { Cookie: pharmCookie },
    });
    if (pharmAuditRes.status !== 403) {
      throw new Error(`Pharmacist should be blocked from audit logs with 403! Got: ${pharmAuditRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from /audit-logs with 403 Forbidden.');

    // 15. Pharmacist blocked from Security Logs (403 Forbidden)
    console.log('\n1️⃣5️⃣ Testing RBAC: Pharmacist blocked from Security Logs (403 Forbidden)...');
    const pharmSecRes = await fetch(`${BASE_URL}/security/logs`, {
      headers: { Cookie: pharmCookie },
    });
    if (pharmSecRes.status !== 403) {
      throw new Error(`Pharmacist should be blocked from security logs with 403! Got: ${pharmSecRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from /security/logs with 403 Forbidden.');

    // 16. Pharmacist blocked from mutating Settings (403 Forbidden)
    console.log('\n1️⃣6️⃣ Testing RBAC: Pharmacist blocked from mutating Settings (403 Forbidden)...');
    const pharmSetRes = await fetch(`${BASE_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        settings: [{ key: 'pharmacy_name', value: 'Hacked Pharmacy' }],
      }),
    });
    if (pharmSetRes.status !== 403) {
      throw new Error(`Pharmacist should be blocked from settings mutation with 403! Got: ${pharmSetRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from settings mutations with 403 Forbidden.');

    // Cleanup test records
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL PHASE 10 AUDIT, SECURITY & SETTINGS TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 10 Audit/Security/Settings Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase10AuditSecuritySettings();
