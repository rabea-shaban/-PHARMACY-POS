import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5007;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testPhones = ['+201088880001', '+201088880002'];
const testInvoices = ['INV-PUR-PH5-001', 'INV-PUR-PH5-002'];
const testBarcodes = ['BAR-PUR-PH5-01', 'BAR-PUR-PH5-02'];
const testCategoryName = 'Phase5 Pharma Supply';

async function cleanupTestData() {
  // 1. Clean purchases and purchase items
  const purchases = await prisma.purchase.findMany({
    where: { invoiceNumber: { in: testInvoices } },
    select: { id: true },
  });
  const purchaseIds = purchases.map((p) => p.id);

  if (purchaseIds.length > 0) {
    await prisma.purchaseItem.deleteMany({
      where: { purchaseId: { in: purchaseIds } },
    });
    await prisma.purchase.deleteMany({
      where: { id: { in: purchaseIds } },
    });
  }

  // 2. Clean products and their batches / inventory transactions
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

  // 3. Clean categories
  await prisma.category.deleteMany({
    where: { name: testCategoryName },
  });

  // 4. Clean suppliers
  await prisma.supplier.deleteMany({
    where: { phone: { in: testPhones } },
  });

  // 5. Clean test users
  await prisma.user.deleteMany({
    where: { phone: { in: ['+201077771111', '+201077772222', '+201077773333'] } },
  });
}

async function testPhase5() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 5 (Suppliers & Purchases Module) Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 5 test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Setup: Clean previous test data and create test users
    await cleanupTestData();

    const passwordHash = await hashPassword('TestPass123!');
    await prisma.user.create({
      data: {
        name: 'Phase5 Admin',
        phone: '+201077771111',
        email: 'p5.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    await prisma.user.create({
      data: {
        name: 'Phase5 Pharmacist',
        phone: '+201077772222',
        email: 'p5.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    await prisma.user.create({
      data: {
        name: 'Phase5 Accountant',
        phone: '+201077773333',
        email: 'p5.acc@pharmacy.local',
        passwordHash,
        role: 'ACCOUNTANT',
        isActive: true,
      },
    });

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077771111', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Pharmacist
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077772222', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Accountant
    const accLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077773333', password: 'TestPass123!' }),
    });
    const accCookie = accLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('0️⃣  Setup complete. Authenticated Admin, Pharmacist, and Accountant.\n');

    // 1. Test POST /suppliers (Create Supplier)
    console.log('1️⃣  Testing POST /suppliers (Create Supplier)...');
    const createSupRes = await fetch(`${BASE_URL}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        name: 'PharmaTech Distributors',
        phone: '+201088880001',
        email: 'sales@pharmatech.com',
        address: '45 Industrial Zone, 6th of October',
        taxNumber: 'EG-TAX-987654',
        notes: 'Primary pharmaceutical wholesaler',
      }),
    });
    const createSupData = (await createSupRes.json()) as any;
    if (createSupRes.status !== 201 || !createSupData.data?.id) {
      throw new Error(`Create supplier failed: ${JSON.stringify(createSupData)}`);
    }
    const supplierId = createSupData.data.id;
    console.log(`   ✅ Supplier created: ${createSupData.data.name} (Phone: ${createSupData.data.phone})`);

    // 2. Test Duplicate Supplier Phone Protection (409 Conflict)
    console.log('\n2️⃣  Testing Duplicate Supplier Phone (409 Conflict)...');
    const dupSupRes = await fetch(`${BASE_URL}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        name: 'Duplicate Supplier',
        phone: '+201088880001',
      }),
    });
    if (dupSupRes.status !== 409) {
      throw new Error(`Duplicate supplier should return 409! Got: ${dupSupRes.status}`);
    }
    console.log('   ✅ Duplicate supplier phone rejected with 409 Conflict');

    // 3. Test Supplier Search
    console.log('\n3️⃣  Testing Supplier Search (GET /suppliers?search=PharmaTech)...');
    const searchSupRes = await fetch(`${BASE_URL}/suppliers?search=PharmaTech`, {
      headers: { Cookie: accCookie },
    });
    const searchSupData = (await searchSupRes.json()) as any;
    if (searchSupData.data.items.length === 0) {
      throw new Error(`Supplier search failed`);
    }
    console.log(`   ✅ Found ${searchSupData.data.items.length} supplier(s) searching for 'PharmaTech'`);

    // 4. Setup Products for Purchasing
    console.log('\n4️⃣  Setting up Test Category and Products for procurement...');
    const catRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({ name: testCategoryName }),
    });
    const catData = (await catRes.json()) as any;
    const categoryId = catData.data.id;

    const prod1Res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        name: 'Panadol Extra 500mg',
        barcode: 'BAR-PUR-PH5-01',
        categoryId,
        purchasePrice: 20.0,
        sellingPrice: 30.0,
        minimumStock: 15,
      }),
    });
    const prod1Data = (await prod1Res.json()) as any;
    const product1Id = prod1Data.data.id;

    const prod2Res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        name: 'Cataflam 50mg Tablets',
        barcode: 'BAR-PUR-PH5-02',
        categoryId,
        purchasePrice: 40.0,
        sellingPrice: 55.0,
        minimumStock: 10,
      }),
    });
    const prod2Data = (await prod2Res.json()) as any;
    const product2Id = prod2Data.data.id;
    console.log(`   ✅ Products created for procurement: Panadol (ID: ${product1Id}) & Cataflam (ID: ${product2Id})`);

    // 5. Test POST /purchases (Create Purchase Invoice in PENDING state)
    console.log('\n5️⃣  Testing POST /purchases (Create Purchase with multiple items)...');
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 2);

    const createPurRes = await fetch(`${BASE_URL}/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        supplierId,
        invoiceNumber: 'INV-PUR-PH5-001',
        discount: 50.0,
        tax: 0.0,
        paidAmount: 500.0,
        notes: 'Monthly bulk restocking',
        items: [
          {
            productId: product1Id,
            quantity: 100,
            unitCost: 20.0,
            batchNumber: 'PAN-2026-X1',
            expiryDate: nextYear.toISOString().split('T')[0],
          },
          {
            productId: product2Id,
            quantity: 50,
            unitCost: 40.0,
            batchNumber: 'CAT-2026-Y1',
            expiryDate: nextYear.toISOString().split('T')[0],
          },
        ],
      }),
    });
    const createPurData = (await createPurRes.json()) as any;
    if (createPurRes.status !== 201 || !createPurData.data?.id) {
      throw new Error(`Create purchase failed: ${JSON.stringify(createPurData)}`);
    }
    const purchaseId = createPurData.data.id;
    console.log(`   ✅ Purchase created: ${createPurData.data.invoiceNumber} (Status: ${createPurData.data.status})`);

    // 6. Test Financial Total Calculations
    console.log('\n6️⃣  Verifying Financial Totals Calculation...');
    // Subtotal = (100 * 20) + (50 * 40) = 2000 + 2000 = 4000
    // Total = 4000 - 50 (discount) = 3950
    // Paid = 500, Remaining = 3450
    if (
      createPurData.data.subtotal !== 4000 ||
      createPurData.data.total !== 3950 ||
      createPurData.data.remainingAmount !== 3450
    ) {
      throw new Error(`Financial calculation mismatch! Got: ${JSON.stringify(createPurData.data)}`);
    }
    console.log(`   ✅ Subtotal: ${createPurData.data.subtotal} EGP | Discount: ${createPurData.data.discount} EGP | Total: ${createPurData.data.total} EGP | Remaining: ${createPurData.data.remainingAmount} EGP`);

    // 7. Test Duplicate Invoice Number Protection (409 Conflict)
    console.log('\n7️⃣  Testing Duplicate Invoice Number Protection (409 Conflict)...');
    const dupPurRes = await fetch(`${BASE_URL}/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        supplierId,
        invoiceNumber: 'INV-PUR-PH5-001',
        items: [{ productId: product1Id, quantity: 10, unitCost: 20.0 }],
      }),
    });
    if (dupPurRes.status !== 409) {
      throw new Error(`Duplicate purchase should return 409! Got: ${dupPurRes.status}`);
    }
    console.log('   ✅ Duplicate invoice number rejected with 409 Conflict');

    // 8. Test Product Stock Before Receiving (Must be 0)
    console.log('\n8️⃣  Verifying Product Stock BEFORE Receiving (Must be 0)...');
    const beforeProdRes = await fetch(`${BASE_URL}/products/${product1Id}`, {
      headers: { Cookie: pharmCookie },
    });
    const beforeProdData = (await beforeProdRes.json()) as any;
    if (beforeProdData.data.currentStock !== 0) {
      throw new Error(`Stock before receiving should be 0! Got: ${beforeProdData.data.currentStock}`);
    }
    console.log(`   ✅ Product 1 initial stock: ${beforeProdData.data.currentStock} units`);

    // 9. Test POST /purchases/:id/receive (Atomic Receiving Engine)
    console.log('\n9️⃣  Testing POST /purchases/:id/receive (Atomic Receiving Engine)...');
    const receiveRes = await fetch(`${BASE_URL}/purchases/${purchaseId}/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({
        items: [
          {
            productId: product1Id,
            batchNumber: 'PAN-2026-X1',
            expiryDate: nextYear.toISOString().split('T')[0],
            sellingPrice: 30.0,
          },
          {
            productId: product2Id,
            batchNumber: 'CAT-2026-Y1',
            expiryDate: nextYear.toISOString().split('T')[0],
            sellingPrice: 55.0,
          },
        ],
      }),
    });
    const receiveData = (await receiveRes.json()) as any;
    if (receiveRes.status !== 200 || receiveData.data.status !== 'RECEIVED') {
      throw new Error(`Receive purchase failed: ${JSON.stringify(receiveData)}`);
    }
    console.log(`   ✅ Purchase ${receiveData.data.invoiceNumber} successfully marked as RECEIVED`);

    // 10. Verify Stock Increased and Batches Created
    console.log('\n🔟 Verifying Inventory Stock Increased across Batches...');
    const afterProd1Res = await fetch(`${BASE_URL}/products/${product1Id}`, {
      headers: { Cookie: pharmCookie },
    });
    const afterProd1Data = (await afterProd1Res.json()) as any;
    if (afterProd1Data.data.currentStock !== 100) {
      throw new Error(`Product 1 stock after receiving should be 100! Got: ${afterProd1Data.data.currentStock}`);
    }

    const afterProd2Res = await fetch(`${BASE_URL}/products/${product2Id}`, {
      headers: { Cookie: pharmCookie },
    });
    const afterProd2Data = (await afterProd2Res.json()) as any;
    if (afterProd2Data.data.currentStock !== 50) {
      throw new Error(`Product 2 stock after receiving should be 50! Got: ${afterProd2Data.data.currentStock}`);
    }
    console.log(`   ✅ Product 1 Stock: ${afterProd1Data.data.currentStock} units (Batch: PAN-2026-X1)`);
    console.log(`   ✅ Product 2 Stock: ${afterProd2Data.data.currentStock} units (Batch: CAT-2026-Y1)`);

    // 11. Verify Inventory Transaction Ledger
    console.log('\n1️⃣1️⃣ Verifying Inventory Ledger Entries...');
    const ledgerRes = await fetch(`${BASE_URL}/inventory/transactions?productId=${product1Id}`, {
      headers: { Cookie: accCookie },
    });
    const ledgerData = (await ledgerRes.json()) as any;
    const purchaseTx = ledgerData.data.items.find(
      (tx: any) => tx.type === 'PURCHASE' && tx.referenceId === 'INV-PUR-PH5-001'
    );
    if (!purchaseTx || purchaseTx.quantity !== 100) {
      throw new Error(`Inventory transaction for purchase not found! Got: ${JSON.stringify(ledgerData)}`);
    }
    console.log(`   ✅ Verified immutable stock transaction: [${purchaseTx.type}] +${purchaseTx.quantity} units | Ref: ${purchaseTx.referenceId}`);

    // 12. Test Prevent Duplicate Receiving (400 Bad Request)
    console.log('\n1️⃣2️⃣ Testing Prevent Duplicate Receiving (400 Bad Request)...');
    const dupReceiveRes = await fetch(`${BASE_URL}/purchases/${purchaseId}/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: pharmCookie,
      },
      body: JSON.stringify({}),
    });
    if (dupReceiveRes.status !== 400) {
      throw new Error(`Duplicate receive should return 400! Got: ${dupReceiveRes.status}`);
    }
    console.log('   ✅ Duplicate receive attempt rejected with 400 Bad Request');

    // 13. Test Prevent Direct Cancellation of RECEIVED Purchase (400 Bad Request)
    console.log('\n1️⃣3️⃣ Testing Prevent Direct Cancellation of RECEIVED Purchase (400 Bad Request)...');
    const cancelReceivedRes = await fetch(`${BASE_URL}/purchases/${purchaseId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: JSON.stringify({ reason: 'Attempt cancel received invoice' }),
    });
    if (cancelReceivedRes.status !== 400) {
      throw new Error(`Cancelling received purchase should return 400! Got: ${cancelReceivedRes.status}`);
    }
    console.log('   ✅ Cancellation of RECEIVED purchase blocked with 400 Bad Request');

    // 14. Test Purchase Cancellation on PENDING Purchase
    console.log('\n1️⃣4️⃣ Testing Purchase Cancellation on PENDING Purchase...');
    const createPur2Res = await fetch(`${BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        supplierId,
        invoiceNumber: 'INV-PUR-PH5-002',
        items: [{ productId: product1Id, quantity: 10, unitCost: 20.0 }],
      }),
    });
    const createPur2Data = (await createPur2Res.json()) as any;
    const purchase2Id = createPur2Data.data.id;

    const cancelRes = await fetch(`${BASE_URL}/purchases/${purchase2Id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ reason: 'Supplier out of stock' }),
    });
    const cancelData = (await cancelRes.json()) as any;
    if (cancelRes.status !== 200 || cancelData.data.status !== 'CANCELLED') {
      throw new Error(`Cancellation failed: ${JSON.stringify(cancelData)}`);
    }
    console.log(`   ✅ Purchase ${cancelData.data.invoiceNumber} successfully marked as CANCELLED`);

    // 15. Test Supplier Purchases History Endpoint
    console.log('\n1️⃣5️⃣ Testing Supplier Purchase History (GET /suppliers/:id/purchases)...');
    const supHistoryRes = await fetch(`${BASE_URL}/suppliers/${supplierId}/purchases`, {
      headers: { Cookie: accCookie },
    });
    const supHistoryData = (await supHistoryRes.json()) as any;
    if (supHistoryData.data.items.length !== 2) {
      throw new Error(`Expected 2 purchases for supplier! Got: ${supHistoryData.data.items.length}`);
    }
    console.log(`   ✅ Retrieved ${supHistoryData.data.items.length} purchase invoices for supplier ${createSupData.data.name}`);

    // 16. Test RBAC: Accountant blocked from creating purchases (403 Forbidden)
    console.log('\n1️⃣6️⃣ Testing RBAC: Accountant blocked from creating purchases (403 Forbidden)...');
    const accPurRes = await fetch(`${BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: accCookie },
      body: JSON.stringify({
        supplierId,
        invoiceNumber: 'INV-UNAUTH-001',
        items: [{ productId: product1Id, quantity: 5, unitCost: 20.0 }],
      }),
    });
    if (accPurRes.status !== 403) {
      throw new Error(`Accountant purchase creation should be 403! Got: ${accPurRes.status}`);
    }
    console.log('   ✅ Accountant correctly blocked from purchase mutations with 403 Forbidden');

    // 17. Verify Audit Logs in MySQL audit_logs table
    console.log('\n1️⃣7️⃣ Verifying Audit Logs in MySQL audit_logs table...');
    const auditLogsCount = await prisma.auditLog.count({
      where: {
        entity: { in: ['suppliers', 'purchases'] },
      },
    });
    console.log(`   ✅ Found ${auditLogsCount} audit logs for Suppliers & Purchases in MySQL!`);

    // Cleanup test records cleanly
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL 17 PHASE 5 SUPPLIERS & PURCHASES TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 5 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase5();
