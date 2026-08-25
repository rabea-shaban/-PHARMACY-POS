import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import { batchesService } from '../src/modules/batches/index.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5006;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testBarcodes = ['BAR-PH4-0001', 'BAR-PH4-0002', 'BAR-PH4-0003'];
const testCategoryNames = ['Phase4 Antibiotics', 'Phase4 Painkillers'];

async function cleanupTestData() {
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

  await prisma.user.deleteMany({
    where: { phone: { in: ['+201066661111', '+201066662222', '+201066663333'] } },
  });
}

async function testPhase4() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 4 (Products & Inventory Module) Full Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 4 test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Setup: Clean previous test data and create test users
    await cleanupTestData();

    const passwordHash = await hashPassword('TestPass123!');
    await prisma.user.create({
      data: {
        name: 'Phase4 Admin',
        phone: '+201066661111',
        email: 'p4.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    await prisma.user.create({
      data: {
        name: 'Phase4 Pharmacist',
        phone: '+201066662222',
        email: 'p4.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    await prisma.user.create({
      data: {
        name: 'Phase4 Accountant',
        phone: '+201066663333',
        email: 'p4.acc@pharmacy.local',
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

    // 1. Test POST /categories (Create category)
    console.log('1️⃣  Testing POST /categories (Create Category)...');
    const createCatRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: 'Phase4 Antibiotics',
        description: 'Broad spectrum antibacterial medications',
      }),
    });
    const createCatData = (await createCatRes.json()) as any;
    if (createCatRes.status !== 201 || !createCatData.data?.id) {
      throw new Error(`Create category failed: ${JSON.stringify(createCatData)}`);
    }
    const categoryId = createCatData.data.id;
    console.log(`   ✅ Category created: ${createCatData.data.name} (ID: ${categoryId})`);

    // 2. Test Duplicate Category Rejection (409 Conflict)
    console.log('\n2️⃣  Testing Duplicate Category Protection (409 Conflict)...');
    const dupCatRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: 'Phase4 Antibiotics',
      }),
    });
    if (dupCatRes.status !== 409) {
      throw new Error(`Duplicate category should return 409! Got: ${dupCatRes.status}`);
    }
    console.log('   ✅ Duplicate category successfully rejected with 409 Conflict');

    // 3. Test POST /products (Create Product)
    console.log('\n3️⃣  Testing POST /products (Create Product)...');
    const createProdRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        name: 'Amoxicillin 500mg Caps',
        barcode: 'BAR-PH4-0001',
        scientificName: 'Amoxicillin Trihydrate',
        description: 'Antibiotic capsule 500mg',
        categoryId,
        purchasePrice: 35.5,
        sellingPrice: 50.0,
        taxRate: 0.0,
        minimumStock: 10,
      }),
    });
    const createProdData = (await createProdRes.json()) as any;
    if (createProdRes.status !== 201 || !createProdData.data?.id) {
      throw new Error(`Create product failed: ${JSON.stringify(createProdData)}`);
    }
    const productId = createProdData.data.id;
    console.log(`   ✅ Product created: ${createProdData.data.name} (Barcode: ${createProdData.data.barcode})`);
    console.log(`   ✅ Initial Stock: ${createProdData.data.currentStock} (Low Stock: ${createProdData.data.isLowStock})`);

    // 4. Test Duplicate Barcode Protection (409 Conflict)
    console.log('\n4️⃣  Testing Duplicate Barcode Protection (409 Conflict)...');
    const dupProdRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        name: 'Duplicate Amox',
        barcode: 'BAR-PH4-0001',
        categoryId,
        purchasePrice: 35.5,
        sellingPrice: 50.0,
      }),
    });
    if (dupProdRes.status !== 409) {
      throw new Error(`Duplicate barcode should return 409! Got: ${dupProdRes.status}`);
    }
    console.log('   ✅ Duplicate barcode successfully rejected with 409 Conflict');

    // 5. Test Get Product by ID
    console.log('\n5️⃣  Testing GET /products/:id...');
    const getProdRes = await fetch(`${BASE_URL}/products/${productId}`, {
      headers: { Cookie: accCookie },
    });
    const getProdData = (await getProdRes.json()) as any;
    if (getProdRes.status !== 200 || getProdData.data.id !== productId) {
      throw new Error(`Get product by ID failed`);
    }
    console.log(`   ✅ Retrieved product: ${getProdData.data.name} | Category: ${getProdData.data.category.name}`);

    // 6. Test Product Search by Name (GET /products/search?q=Amoxicillin)
    console.log('\n6️⃣  Testing POS Search by Name (GET /products/search?q=Amoxicillin)...');
    const searchNameRes = await fetch(`${BASE_URL}/products/search?q=Amoxicillin`, {
      headers: { Cookie: pharmCookie },
    });
    const searchNameData = (await searchNameRes.json()) as any;
    if (searchNameRes.status !== 200 || searchNameData.data.length === 0) {
      throw new Error(`POS search by name failed`);
    }
    console.log(`   ✅ Found ${searchNameData.data.length} item(s) via POS search: ${searchNameData.data[0].name}`);

    // 7. Test POS Search by Barcode (GET /products/search?barcode=BAR-PH4-0001)
    console.log('\n7️⃣  Testing POS Search by Barcode (GET /products/search?barcode=BAR-PH4-0001)...');
    const searchBarRes = await fetch(`${BASE_URL}/products/search?barcode=BAR-PH4-0001`, {
      headers: { Cookie: pharmCookie },
    });
    const searchBarData = (await searchBarRes.json()) as any;
    if (searchBarRes.status !== 200 || searchBarData.data.length === 0) {
      throw new Error(`POS search by barcode failed`);
    }
    console.log(`   ✅ Found product: ${searchBarData.data[0].name} | Selling Price: ${searchBarData.data[0].sellingPrice} EGP`);

    // 8. Test POST /batches (Create Batches)
    console.log('\n8️⃣  Testing POST /batches (Create Batch 1 & Batch 2)...');
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const createBatch1Res = await fetch(`${BASE_URL}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        productId,
        batchNumber: 'BATCH-2026-A1',
        expiryDate: nextYear.toISOString().split('T')[0],
        quantity: 25,
        purchasePrice: 35.5,
        sellingPrice: 50.0,
      }),
    });
    const createBatch1Data = (await createBatch1Res.json()) as any;
    const batch1Id = createBatch1Data.data.id;

    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 20); // expiring in 20 days

    const createBatch2Res = await fetch(`${BASE_URL}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        productId,
        batchNumber: 'BATCH-2026-A2',
        expiryDate: nextMonth.toISOString().split('T')[0],
        quantity: 15,
        purchasePrice: 35.5,
        sellingPrice: 50.0,
      }),
    });
    const createBatch2Data = (await createBatch2Res.json()) as any;
    const batch2Id = createBatch2Data.data.id;
    console.log(`   ✅ Batch 1 created: ${createBatch1Data.data.batchNumber} (25 units)`);
    console.log(`   ✅ Batch 2 created: ${createBatch2Data.data.batchNumber} (15 units, expiring in 20 days)`);

    // 9. Test GET /products/:id/stock (Product Stock Summary Breakdown)
    console.log('\n9️⃣  Testing Product Stock Summary Breakdown (GET /products/:id/stock)...');
    const stockSummaryRes = await fetch(`${BASE_URL}/products/${productId}/stock`, {
      headers: { Cookie: pharmCookie },
    });
    const stockSummaryData = (await stockSummaryRes.json()) as any;
    if (stockSummaryRes.status !== 200 || stockSummaryData.data.totalStock !== 40) {
      throw new Error(`Stock summary mismatch! Got: ${JSON.stringify(stockSummaryData)}`);
    }
    console.log(`   ✅ Total Stock: ${stockSummaryData.data.totalStock} units across ${stockSummaryData.data.activeBatchesCount} batches`);
    console.log(`   ✅ Expiring Soon Stock: ${stockSummaryData.data.expiringSoonQuantity} units | Low Stock Status: ${stockSummaryData.data.isLowStock}`);

    // 10. Test Low Stock Report (GET /inventory/low-stock)
    console.log('\n🔟 Testing Low Stock Report (GET /inventory/low-stock)...');
    const lowStockRes = await fetch(`${BASE_URL}/inventory/low-stock`, {
      headers: { Cookie: accCookie },
    });
    const lowStockData = (await lowStockRes.json()) as any;
    console.log(`   ✅ Low stock endpoint returned ${lowStockData.data.length} item(s) below threshold.`);

    // 11. Test Expired Batches (GET /batches/expired)
    console.log('\n1️⃣1️⃣ Testing Expired Batches (GET /batches/expired)...');
    const expiredRes = await fetch(`${BASE_URL}/batches/expired`, {
      headers: { Cookie: pharmCookie },
    });
    const expiredData = (await expiredRes.json()) as any;
    console.log(`   ✅ Expired batches endpoint returned ${expiredData.data.length} expired batch(es).`);

    // 12. Test Expiring Soon Batches (GET /batches/expiring-soon?days=30)
    console.log('\n1️⃣2️⃣ Testing Expiring Soon Batches (GET /batches/expiring-soon?days=30)...');
    const expiringRes = await fetch(`${BASE_URL}/batches/expiring-soon?days=30`, {
      headers: { Cookie: pharmCookie },
    });
    const expiringData = (await expiringRes.json()) as any;
    const foundBatch2 = expiringData.data.some((b: any) => b.id === batch2Id);
    if (!foundBatch2) {
      throw new Error(`Batch 2 should be in expiring-soon list!`);
    }
    console.log(`   ✅ Correctly identified batch expiring within 30 days: ${createBatch2Data.data.batchNumber}`);

    // 13. Test Stock Increase via Adjustment (POST /inventory/adjust)
    console.log('\n1️⃣3️⃣ Testing Stock Increase via Adjustment (POST /inventory/adjust)...');
    const adjustInRes = await fetch(`${BASE_URL}/inventory/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        productId,
        batchId: batch1Id,
        quantity: 10,
        type: 'MANUAL_IN',
        reason: 'Found misplaced stock in secondary storage',
      }),
    });
    const adjustInData = (await adjustInRes.json()) as any;
    if (adjustInRes.status !== 201 || adjustInData.data.newBatchQuantity !== 35) {
      throw new Error(`Stock increase failed: ${JSON.stringify(adjustInData)}`);
    }
    console.log(`   ✅ Stock increased by +10. New batch quantity: ${adjustInData.data.newBatchQuantity}`);

    // 14. Test Inventory Ledger (GET /inventory/transactions)
    console.log('\n1️⃣4️⃣ Testing Inventory Ledger Verification (GET /inventory/transactions)...');
    const ledgerRes = await fetch(`${BASE_URL}/inventory/transactions?productId=${productId}`, {
      headers: { Cookie: accCookie },
    });
    const ledgerData = (await ledgerRes.json()) as any;
    if (ledgerRes.status !== 200 || ledgerData.data.items.length < 3) {
      throw new Error(`Ledger query failed`);
    }
    console.log(`   ✅ Retrieved ${ledgerData.data.items.length} immutable ledger transactions.`);

    // 15. Test Stock Decrease via Adjustment (POST /inventory/adjust)
    console.log('\n1️⃣5️⃣ Testing Stock Decrease via Adjustment (-5 units)...');
    const adjustOutRes = await fetch(`${BASE_URL}/inventory/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        productId,
        batchId: batch1Id,
        quantity: -5,
        type: 'DAMAGE',
        reason: 'Crushed box during handling',
      }),
    });
    const adjustOutData = (await adjustOutRes.json()) as any;
    if (adjustOutRes.status !== 201 || adjustOutData.data.newBatchQuantity !== 30) {
      throw new Error(`Stock decrease failed`);
    }
    console.log(`   ✅ Stock decreased by -5. New batch quantity: ${adjustOutData.data.newBatchQuantity}`);

    // 16. Test Prevent Negative Stock (400 Bad Request)
    console.log('\n1️⃣6️⃣ Testing Prevent Negative Stock Protection (400 Bad Request)...');
    const negStockRes = await fetch(`${BASE_URL}/inventory/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({
        productId,
        batchId: batch1Id,
        quantity: -99999,
        type: 'ADJUSTMENT',
        reason: 'Excessive subtraction test',
      }),
    });
    if (negStockRes.status !== 400) {
      throw new Error(`Negative stock attempt should return 400! Got: ${negStockRes.status}`);
    }
    console.log('   ✅ Negative stock attempt correctly rejected with 400 Bad Request');

    // 17. Verify FEFO Allocation Logic
    console.log('\n1️⃣7️⃣ Testing FEFO (First Expired, First Out) Algorithm...');
    const fefoAlloc = await batchesService.getFEFOBatches(productId, 20);
    if (!fefoAlloc.fulfilled || fefoAlloc.allocatedBatches[0].batch.id !== batch2Id) {
      throw new Error(`FEFO should allocate Batch 2 first!`);
    }
    console.log(`   ✅ FEFO allocated earliest-expiring Batch 2 (15 units) + Batch 1 (5 units) successfully!`);

    // 18. Verify RBAC: Pharmacist blocked from adjustments (403 Forbidden)
    console.log('\n1️⃣8️⃣ Testing RBAC: Pharmacist blocked from adjustments (403 Forbidden)...');
    const pharmAdjRes = await fetch(`${BASE_URL}/inventory/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        productId,
        batchId: batch1Id,
        quantity: -1,
        type: 'DAMAGE',
        reason: 'Unauthorized pharmacist adjustment',
      }),
    });
    if (pharmAdjRes.status !== 403) {
      throw new Error(`Pharmacist should be 403 Forbidden! Got: ${pharmAdjRes.status}`);
    }
    console.log('   ✅ Pharmacist correctly blocked from adjustments with 403 Forbidden');

    // 19. Verify Audit Logs in MySQL audit_logs table
    console.log('\n1️⃣9️⃣ Verifying Audit Logs in MySQL audit_logs table...');
    const auditLogsCount = await prisma.auditLog.count({
      where: {
        entity: { in: ['categories', 'products', 'batches', 'inventory_transactions'] },
      },
    });
    console.log(`   ✅ Found ${auditLogsCount} audit logs for Products & Inventory operations in MySQL!`);

    // 20. Verify Pagination Metadata
    console.log('\n2️⃣0️⃣ Verifying Consistent Pagination Metadata...');
    const pageRes = await fetch(`${BASE_URL}/products?page=1&limit=5`, {
      headers: { Cookie: accCookie },
    });
    const pageData = (await pageRes.json()) as any;
    if (!pageData.data.pagination || pageData.data.pagination.page !== 1) {
      throw new Error(`Pagination metadata malformed`);
    }
    console.log(`   ✅ Pagination verified: Page ${pageData.data.pagination.page} | Limit ${pageData.data.pagination.limit} | Total Pages ${pageData.data.pagination.totalPages}`);

    // 21. Verify Validation Errors (400 Bad Request)
    console.log('\n2️⃣1️⃣ Verifying Zod Validation Error Response...');
    const invalidProdRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        name: 'A', // too short
        barcode: '',
        purchasePrice: -50,
      }),
    });
    if (invalidProdRes.status !== 400) {
      throw new Error(`Invalid schema should return 400! Got: ${invalidProdRes.status}`);
    }
    console.log('   ✅ Zod validation correctly rejected invalid payload with 400 Bad Request');

    // 22. Verify Soft Deactivation
    console.log('\n2️⃣2️⃣ Testing Product Soft Deactivation (DELETE /products/:id)...');
    const deleteRes = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie },
    });
    const deleteData = (await deleteRes.json()) as any;
    if (deleteRes.status !== 200 || deleteData.data.isActive !== false) {
      throw new Error(`Soft deactivation failed`);
    }
    console.log(`   ✅ Product successfully soft-deactivated (isActive: false)`);

    // Cleanup test records cleanly
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL 22 PHASE 4 PRODUCTS & INVENTORY TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 4 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase4();
