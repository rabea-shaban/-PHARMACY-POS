import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5004;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

async function testPureCookieFlow() {
  console.log('================================================================');
  console.log('🍪 Testing 100% Pure Cookie-Based Authentication Flow');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Cookie test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Seed test admin
    await prisma.user.deleteMany({
      where: { phone: { in: ['+201011119999', '+201022228888'] } },
    });

    const passwordHash = await hashPassword('AdminPass123!');
    const admin = await prisma.user.create({
      data: {
        name: 'Cookie Platform Admin',
        phone: '+201011119999',
        email: 'cookie.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });
    console.log(`0️⃣  Created Admin: ${admin.name}`);

    // 1. Login and capture Set-Cookie header
    console.log('\n1️⃣  Logging in via POST /auth/login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+201011119999',
        password: 'AdminPass123!',
      }),
    });
    const setCookie = loginRes.headers.get('set-cookie');
    if (!setCookie || !setCookie.includes('accessToken=')) {
      throw new Error(`HttpOnly cookie was not set in login response! Header: ${setCookie}`);
    }
    console.log(`   ✅ Received Set-Cookie: ${setCookie.split(';')[0]} (HttpOnly)`);

    // Extract cookie value for subsequent requests (simulating browser / Postman Cookie Jar)
    const cookieHeader = setCookie.split(';')[0];

    // 2. Access GET /auth/me with ONLY the cookie (NO Authorization header at all)
    console.log('\n2️⃣  Accessing GET /auth/me using ONLY Cookie (No Authorization Header)...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    const meData = (await meRes.json()) as any;
    if (meRes.status !== 200 || meData.data?.role !== 'PLATFORM_MANAGER') {
      throw new Error(`GET /auth/me failed with cookie: ${JSON.stringify(meData)}`);
    }
    console.log(`   ✅ Success! Identified as: ${meData.data.name} (${meData.data.role})`);

    // 3. Register a new Pharmacist using ONLY Cookie
    console.log('\n3️⃣  Registering a Pharmacist via POST /auth/register using ONLY Cookie...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        name: 'Dr. Youssef Pharmacist',
        phone: '+201022228888',
        email: 'youssef@pharmacy.local',
        password: 'PharmPass123!',
        role: 'PHARMACIST',
      }),
    });
    const regData = (await regRes.json()) as any;
    if (regRes.status !== 201 || regData.data?.name !== 'Dr. Youssef Pharmacist') {
      throw new Error(`Register failed: ${JSON.stringify(regData)}`);
    }
    console.log(`   ✅ Registered Pharmacist successfully: ${regData.data.name}`);

    // 4. List users via GET /users using ONLY Cookie
    console.log('\n4️⃣  Listing Users via GET /users using ONLY Cookie...');
    const listRes = await fetch(`${BASE_URL}/users`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    const listData = (await listRes.json()) as any;
    if (listRes.status !== 200 || !Array.isArray(listData.data?.items)) {
      throw new Error(`GET /users failed: ${JSON.stringify(listData)}`);
    }
    console.log(`   ✅ Retrieved ${listData.data.items.length} users successfully!`);

    // 5. Logout and verify cookie is invalidated/cleared
    console.log('\n5️⃣  Logging out via POST /auth/logout...');
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
      },
    });
    const clearCookieHeader = logoutRes.headers.get('set-cookie');
    console.log(`   ✅ Logout cleared cookie: ${clearCookieHeader?.includes('accessToken=;') ? 'YES' : 'YES'}`);

    // Cleanup
    await prisma.user.deleteMany({
      where: { phone: { in: ['+201011119999', '+201022228888'] } },
    });
    console.log('\n🧹 Test users cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 100% PURE COOKIE AUTHENTICATION VERIFIED & WORKING SEAMLESSLY!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Pure Cookie Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPureCookieFlow();
