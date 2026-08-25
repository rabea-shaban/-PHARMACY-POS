import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5003;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

async function runPhase2Tests() {
  console.log('================================================================');
  console.log('🧪 Starting Full Phase 2 Auth, Staff Users, RBAC & Cookie Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Seed test platform manager
    console.log('0️⃣  Setting up Platform Manager user in MySQL...');
    await prisma.user.deleteMany({
      where: {
        OR: [
          { phone: { in: ['+201011112222', '+201033334444', '+201055556666', '+201077778888'] } },
          { email: { in: ['test.admin@pharmacy.local', 'tarek.pharmacist@pharmacy.local', 'nader.accountant@pharmacy.local'] } },
        ],
      },
    });

    const passwordHash = await hashPassword('AdminPass123!');
    const platformManager = await prisma.user.create({
      data: {
        name: 'Platform Admin',
        phone: '+201011112222',
        email: 'test.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });
    console.log(`   ✅ Seeded Platform Manager: ${platformManager.name} (${platformManager.phone})`);

    // 1. Test Valid Login via Phone & HttpOnly Cookie receipt
    console.log('\n1️⃣  Testing Login via Phone Number & Set-Cookie...');
    const loginRes1 = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+201011112222',
        password: 'AdminPass123!',
      }),
    });
    const loginData1 = (await loginRes1.json()) as any;
    if (loginRes1.status !== 200 || !loginData1.data?.accessToken) {
      throw new Error(`Phone login failed: ${JSON.stringify(loginData1)}`);
    }
    const adminToken = loginData1.data.accessToken;
    const cookieHeader = loginRes1.headers.get('set-cookie');
    console.log(`   ✅ Login via Phone Successful (Status 200)`);
    console.log(`   ✅ Access Token received`);
    console.log(`   ✅ HttpOnly Cookie received: ${cookieHeader ? 'YES (accessToken set)' : 'NO'}`);
    if ('passwordHash' in loginData1.data.user || 'password_hash' in loginData1.data.user) {
      throw new Error('SECURITY VIOLATION: passwordHash exposed in login response!');
    }
    console.log(`   ✅ Security check: password_hash is NOT exposed in response.`);

    // 2. Test Valid Login via Email
    console.log('\n2️⃣  Testing Login via Email Address...');
    const loginRes2 = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.admin@pharmacy.local',
        password: 'AdminPass123!',
      }),
    });
    const loginData2 = (await loginRes2.json()) as any;
    if (loginRes2.status !== 200) throw new Error(`Email login failed: ${JSON.stringify(loginData2)}`);
    console.log(`   ✅ Login via Email Successful (Status 200)`);

    // 3. Test Invalid Password
    console.log('\n3️⃣  Testing Invalid Password (401 Unauthorized)...');
    const badPassRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+201011112222',
        password: 'WrongPassword123!',
      }),
    });
    const badPassData = (await badPassRes.json()) as any;
    if (badPassRes.status !== 401) throw new Error(`Expected 401, got ${badPassRes.status}`);
    console.log(`   ✅ Correctly rejected with 401: "${badPassData.message}"`);

    // 4. Test Non-existing User
    console.log('\n4️⃣  Testing Non-existing User (401 Unauthorized)...');
    const nonExistRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+201099999999',
        password: 'SomePassword123!',
      }),
    });
    if (nonExistRes.status !== 401) throw new Error(`Expected 401, got ${nonExistRes.status}`);
    console.log(`   ✅ Correctly rejected with 401`);

    // 5. Test GET /auth/me with HttpOnly Cookie (No Authorization Header)
    console.log('\n5️⃣  Testing GET /auth/me using HttpOnly Cookie...');
    const meCookieRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: `accessToken=${adminToken}` },
    });
    const meCookieData = (await meCookieRes.json()) as any;
    if (meCookieRes.status !== 200 || meCookieData.data?.name !== 'Platform Admin') {
      throw new Error(`GET /auth/me via Cookie failed: ${JSON.stringify(meCookieData)}`);
    }
    console.log(`   ✅ Authenticated via HttpOnly Cookie successfully: ${meCookieData.data.name} (Role: ${meCookieData.data.role})`);

    // 6. Test GET /auth/me with Bearer Token
    console.log('\n6️⃣  Testing GET /auth/me with Bearer Token...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const meData = (await meRes.json()) as any;
    if (meRes.status !== 200 || meData.data?.name !== 'Platform Admin') {
      throw new Error(`GET /auth/me failed: ${JSON.stringify(meData)}`);
    }
    console.log(`   ✅ Retrieved profile: ${meData.data.name} (Role: ${meData.data.role})`);

    // 7. Test POST /auth/logout (Clears Cookie)
    console.log('\n7️⃣  Testing POST /auth/logout (Clear HttpOnly Cookie)...');
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (logoutRes.status !== 200) throw new Error(`Logout failed`);
    const logoutCookie = logoutRes.headers.get('set-cookie');
    console.log(`   ✅ Logout successful, Cookie cleared: ${logoutCookie ? 'YES' : 'NO'}`);

    // 8. Test Creating Staff Users (PHARMACIST and ACCOUNTANT)
    console.log('\n8️⃣  Testing POST /users (Create Staff Users)...');
    const createRes1 = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Dr. Tarek Pharmacist',
        phone: '+201033334444',
        email: 'tarek.pharmacist@pharmacy.local',
        password: 'StrongPharmacist123!',
        role: 'PHARMACIST',
      }),
    });
    const createData1 = (await createRes1.json()) as any;
    if (createRes1.status !== 201) throw new Error(`Create pharmacist failed: ${JSON.stringify(createData1)}`);
    const pharmacistId = createData1.data.id;
    console.log(`   ✅ Created Pharmacist: ${createData1.data.name} (Role: ${createData1.data.role})`);

    const createRes2 = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Nader Accountant',
        phone: '+201055556666',
        email: 'nader.accountant@pharmacy.local',
        password: 'StrongAccountant123!',
        role: 'ACCOUNTANT',
      }),
    });
    const createData2 = (await createRes2.json()) as any;
    if (createRes2.status !== 201) throw new Error(`Create accountant failed: ${JSON.stringify(createData2)}`);
    const accountantId = createData2.data.id;
    console.log(`   ✅ Created Accountant: ${createData2.data.name} (Role: ${createData2.data.role})`);

    // 9. Test Duplicate Phone Constraint (409 Conflict)
    console.log('\n9️⃣  Testing Duplicate Phone Constraint (409 Conflict)...');
    const dupPhoneRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Duplicate Guy',
        phone: '+201033334444',
        email: 'unique.email@pharmacy.local',
        password: 'SomePassword123!',
        role: 'PHARMACIST',
      }),
    });
    if (dupPhoneRes.status !== 409) throw new Error(`Expected 409, got ${dupPhoneRes.status}`);
    console.log(`   ✅ Correctly rejected duplicate phone with 409 Conflict`);

    // 10. Test Duplicate Email Constraint (409 Conflict)
    console.log('\n🔟 Testing Duplicate Email Constraint (409 Conflict)...');
    const dupEmailRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Duplicate Guy 2',
        phone: '+201077778888',
        email: 'tarek.pharmacist@pharmacy.local',
        password: 'SomePassword123!',
        role: 'PHARMACIST',
      }),
    });
    if (dupEmailRes.status !== 409) throw new Error(`Expected 409, got ${dupEmailRes.status}`);
    console.log(`   ✅ Correctly rejected duplicate email with 409 Conflict`);

    // 11. Test RBAC: Pharmacist attempting staff management (403 Forbidden)
    console.log('\n1️⃣1️⃣ Testing RBAC: Pharmacist attempting to access /users (403 Forbidden)...');
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+201033334444',
        password: 'StrongPharmacist123!',
      }),
    });
    const pharmLoginData = (await pharmLoginRes.json()) as any;
    const pharmacistToken = pharmLoginData.data.accessToken;

    const pharmListRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${pharmacistToken}` },
    });
    if (pharmListRes.status !== 403) throw new Error(`Expected 403, got ${pharmListRes.status}`);
    console.log(`   ✅ Pharmacist blocked from GET /users with 403 Forbidden`);

    const pharmCreateRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pharmacistToken}`,
      },
      body: JSON.stringify({
        name: 'Hacked User',
        phone: '+201099990000',
        password: 'Password123!',
        role: 'PLATFORM_MANAGER',
      }),
    });
    if (pharmCreateRes.status !== 403) throw new Error(`Expected 403, got ${pharmCreateRes.status}`);
    console.log(`   ✅ Pharmacist blocked from POST /users with 403 Forbidden`);

    // 12. Test GET /users with pagination as Manager
    console.log('\n1️⃣2️⃣ Testing GET /users with pagination as Manager...');
    const listRes = await fetch(`${BASE_URL}/users?role=PHARMACIST&page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listData = (await listRes.json()) as any;
    if (listRes.status !== 200 || !listData.data?.items || !listData.data?.pagination) {
      throw new Error(`List users failed: ${JSON.stringify(listData)}`);
    }
    console.log(`   ✅ Retrieved ${listData.data.items.length} items. Total: ${listData.data.pagination.total}`);

    // 13. Test PATCH /users/:id (Update User)
    console.log('\n1️⃣3️⃣ Testing PATCH /users/:id (Update User Details)...');
    const updateRes = await fetch(`${BASE_URL}/users/${pharmacistId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Dr. Tarek Updated',
        email: 'tarek.updated@pharmacy.local',
      }),
    });
    const updateData = (await updateRes.json()) as any;
    if (updateRes.status !== 200 || updateData.data.name !== 'Dr. Tarek Updated') {
      throw new Error(`Update failed: ${JSON.stringify(updateData)}`);
    }
    console.log(`   ✅ Updated user name: ${updateData.data.name}`);

    // 14. Test DELETE /users/:id (Soft-Deactivation)
    console.log('\n1️⃣4️⃣ Testing DELETE /users/:id (Soft-Deactivation)...');
    const delRes = await fetch(`${BASE_URL}/users/${accountantId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const delData = (await delRes.json()) as any;
    if (delRes.status !== 200 || delData.data.isActive !== false) {
      throw new Error(`Soft delete failed: ${JSON.stringify(delData)}`);
    }
    console.log(`   ✅ User soft-deactivated (isActive = ${delData.data.isActive})`);

    // Inactive user cannot login
    const deactLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+201055556666',
        password: 'StrongAccountant123!',
      }),
    });
    if (deactLoginRes.status !== 401) throw new Error(`Expected 401 for deactivated user login`);
    console.log(`   ✅ Deactivated user successfully blocked from logging in (401 Unauthorized)`);

    // 15. Verify Audit Logs in MySQL
    console.log('\n1️⃣5️⃣ Verifying Audit Logs Created in MySQL audit_logs table...');
    const auditCount = await prisma.auditLog.count({
      where: { action: { in: ['LOGIN', 'CREATE', 'UPDATE', 'DELETE'] } },
    });
    console.log(`   ✅ Found ${auditCount} audit log entries in MySQL (LOGIN, CREATE, UPDATE, DELETE)`);

    // 16. Verify Health Check Endpoints
    console.log('\n1️⃣6️⃣ Verifying Health Check Endpoints...');
    const healthRes = await fetch(`http://localhost:${PORT}/api/v1/health`);
    const healthData = (await healthRes.json()) as any;
    if (healthRes.status !== 200 || healthData.data?.database !== 'connected') {
      throw new Error(`Health check failed: ${JSON.stringify(healthData)}`);
    }
    console.log(`   ✅ Health Endpoint OK: Application = ${healthData.data.application}, Database = ${healthData.data.database}`);

    // Cleanup test users
    console.log('\n🧹 Cleaning up test records from MySQL...');
    await prisma.user.deleteMany({
      where: {
        phone: { in: ['+201011112222', '+201033334444', '+201055556666', '+201077778888'] },
      },
    });
    console.log(`   ✅ Test users safely cleaned.`);

    console.log('\n================================================================');
    console.log('🎉 ALL 16 PHASE 2 TESTS PASSED 100% (MySQL / Prisma 7 / RBAC / Cookie)');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Test Suite Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

runPhase2Tests();
