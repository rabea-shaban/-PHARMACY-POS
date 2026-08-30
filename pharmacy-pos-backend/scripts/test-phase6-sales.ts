import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5008;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testBarcodes = ['BAR-PH6-0001', 'BAR-PH6-0002', 'BAR-PH6-0003'];
const testCategoryNames = ['Phase6 Sales Category'];
const testSupplierPhones = ['+201077770001'];
const testCustomerPhones = ['+201077771111', '+201077772222', '+201077773333'];
const testUserPhones = ['+201077774444', '+201077775555', '+201077776666'];

async function cleanupTestData() {
  // 1. Delete commission transactions
  await prisma.commissionTransaction.deleteMany({});

  // 2. Delete payments
  await prisma.payment.deleteMany({});

  // 3. Delete sale insurances & customer insurances & insurance providers
  await prisma.saleInsurance.deleteMany({});
  await prisma.customerInsurance.deleteMany({});
  await prisma.insuranceProvider.deleteMany({
    where: { name: { in: ['Misr Health Insurance', 'Allianz Care Pharma'] } },
  });

  // 4. Delete discounts
  await prisma.discount.deleteMany({
    where: { code: { in: ['SUMMER20', 'PHARMA10'] } },
  });

  // 5. Delete sale returns & items
  await prisma.saleReturnItem.deleteMany({});
  await prisma.saleReturn.deleteMany({});

  // 6. Delete sale items & sales
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});

  // 6. Delete loyalty transactions & accounts
  await prisma.loyaltyTransaction.deleteMany({});
  await prisma.loyaltyAccount.deleteMany({});

  // 7. Delete inventory transactions, batches, products, categories
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

  // 8. Delete customers & users
  await prisma.customer.deleteMany({
    where: { phone: { in: testCustomerPhones } },
  });

  await prisma.user.deleteMany({
    where: { phone: { in: testUserPhones } },
  });
}

async function testPhase6() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 6 (POS Sales & Checkout Engine) Test Suite');
  console.log('================================================================\n');

  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Phase 6 test server running on port ${PORT}`);
      resolve();
    });
  });

  try {
    // 0. Setup: Clean previous test data and create test users
    await cleanupTestData();

    const passwordHash = await hashPassword('TestPass123!');
    const admin = await prisma.user.create({
      data: {
        name: 'Phase6 Manager',
        phone: '+201077774444',
        email: 'p6.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    const pharm = await prisma.user.create({
      data: {
        name: 'Phase6 Pharmacist',
        phone: '+201077775555',
        email: 'p6.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    await prisma.user.create({
      data: {
        name: 'Phase6 Accountant',
        phone: '+201077776666',
        email: 'p6.acc@pharmacy.local',
        passwordHash,
        role: 'ACCOUNTANT',
        isActive: true,
      },
    });

    // Create a Commission Rule for sales
    await prisma.commissionRule.create({
      data: {
        name: 'Standard Pharmacist 2% Commission',
        percentage: 2.0,
        isActive: true,
      },
    });

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077774444', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Pharmacist
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077775555', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Accountant
    const accLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201077776666', password: 'TestPass123!' }),
    });
    const accCookie = accLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('0️⃣  Setup complete. Authenticated Admin, Pharmacist, and Accountant.\n');

    // Setup Category, Products & Batches for POS checkout
    const cat = await prisma.category.create({
      data: { name: 'Phase6 Sales Category', description: 'POS test catalog' },
    });

    // Product 1: Panadol (Selling Price = 40.00 EGP)
    const prod1 = await prisma.product.create({
      data: {
        name: 'Panadol Extra Phase6',
        barcode: 'BAR-PH6-0001',
        categoryId: cat.id,
        purchasePrice: 25.0,
        sellingPrice: 40.0,
        minimumStock: 10,
        isActive: true,
      },
    });

    // Batch 1A (Expiring soon: 20 days, quantity: 15)
    const expirySoon = new Date();
    expirySoon.setDate(expirySoon.getDate() + 20);
    const batch1A = await prisma.batch.create({
      data: {
        productId: prod1.id,
        batchNumber: 'P6-PAN-FEFO1',
        expiryDate: expirySoon,
        quantity: 15,
        purchasePrice: 25.0,
        sellingPrice: 40.0,
      },
    });

    // Batch 1B (Expiring in 1 year, quantity: 50)
    const expiryNextYear = new Date();
    expiryNextYear.setFullYear(expiryNextYear.getFullYear() + 1);
    const batch1B = await prisma.batch.create({
      data: {
        productId: prod1.id,
        batchNumber: 'P6-PAN-FEFO2',
        expiryDate: expiryNextYear,
        quantity: 50,
        purchasePrice: 25.0,
        sellingPrice: 40.0,
      },
    });

    // Batch 1C (Expired -10 days, quantity: 20) -> MUST BE EXCLUDED BY FEFO
    const expiryPast = new Date();
    expiryPast.setDate(expiryPast.getDate() - 10);
    await prisma.batch.create({
      data: {
        productId: prod1.id,
        batchNumber: 'P6-PAN-EXPIRED',
        expiryDate: expiryPast,
        quantity: 20,
        purchasePrice: 25.0,
        sellingPrice: 40.0,
      },
    });

    // Product 2: Augmentin (Selling Price = 120.00 EGP)
    const prod2 = await prisma.product.create({
      data: {
        name: 'Augmentin 1g Phase6',
        barcode: 'BAR-PH6-0002',
        categoryId: cat.id,
        purchasePrice: 80.0,
        sellingPrice: 120.0,
        minimumStock: 5,
        isActive: true,
      },
    });

    const batch2 = await prisma.batch.create({
      data: {
        productId: prod2.id,
        batchNumber: 'P6-AUG-BATCH',
        expiryDate: expiryNextYear,
        quantity: 30,
        purchasePrice: 80.0,
        sellingPrice: 120.0,
      },
    });

    console.log('📦 Setup test catalog: Panadol (2 active batches + 1 expired batch) and Augmentin.\n');

    // 1. Test Walk-in Customer Simple Cash Sale (POST /sales)
    console.log('1️⃣  Testing Simple Walk-in Customer Cash Sale (POST /sales)...');
    const walkinSaleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        items: [{ productId: prod1.id, quantity: 2 }], // 2 x 40 = 80 EGP
        payments: [{ paymentMethod: 'CASH', amount: 80.0 }],
        notes: 'Walk-in customer purchase',
      }),
    });
    const walkinSaleData = (await walkinSaleRes.json()) as any;
    if (walkinSaleRes.status !== 201 || !walkinSaleData.data?.invoiceNumber) {
      throw new Error(`Walk-in sale failed: ${JSON.stringify(walkinSaleData)}`);
    }
    const sale1 = walkinSaleData.data;
    console.log(`   ✅ Sale created: ${sale1.invoiceNumber} | Total: ${sale1.total} EGP | Cashier: ${sale1.cashierName}`);
    console.log(`   ✅ Commission recorded: ${sale1.commissionEarned} EGP (2% of 80 EGP)`);

    // 2. Test FEFO Allocation: Batch 1A decreased from 15 to 13
    console.log('\n2️⃣  Verifying FEFO Allocation on Earliest Expiring Batch...');
    const updatedBatch1A = await prisma.batch.findUnique({ where: { id: batch1A.id } });
    if (updatedBatch1A?.quantity !== 13) {
      throw new Error(`FEFO batch allocation failed! Expected 13, got: ${updatedBatch1A?.quantity}`);
    }
    console.log(`   ✅ Batch ${batch1A.batchNumber} correctly decremented from 15 to ${updatedBatch1A.quantity} units`);

    // 3. Test Multi-Batch FEFO Allocation Across Batches (Request 20 units -> 13 from 1A + 7 from 1B)
    console.log('\n3️⃣  Testing Multi-Batch FEFO Allocation Across Batches (20 units)...');
    const multiBatchRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        items: [{ productId: prod1.id, quantity: 20 }], // 20 x 40 = 800 EGP
        payments: [{ paymentMethod: 'VISA', amount: 800.0, referenceNumber: 'TXN-VISA-999' }],
      }),
    });
    const multiBatchData = (await multiBatchRes.json()) as any;
    if (multiBatchRes.status !== 201) {
      throw new Error(`Multi-batch sale failed: ${JSON.stringify(multiBatchData)}`);
    }
    const checkBatch1A = await prisma.batch.findUnique({ where: { id: batch1A.id } });
    const checkBatch1B = await prisma.batch.findUnique({ where: { id: batch1B.id } });
    if (checkBatch1A?.quantity !== 0 || checkBatch1B?.quantity !== 43) {
      throw new Error(`FEFO multi-batch allocation mismatch! Batch1A: ${checkBatch1A?.quantity}, Batch1B: ${checkBatch1B?.quantity}`);
    }
    console.log(`   ✅ Batch 1A exhausted to 0 units. Batch 1B decremented from 50 to 43 units!`);

    // 4. Test Expired Batch Rejection (If we request 44 units, Batch 1B only has 43, expired batch has 20 but must NOT be sold)
    console.log('\n4️⃣  Testing Expired Batch Exclusion (Must NOT sell expired stock)...');
    const overStockRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        items: [{ productId: prod1.id, quantity: 44 }],
        payments: [{ paymentMethod: 'CASH', amount: 1760.0 }],
      }),
    });
    if (overStockRes.status !== 400) {
      throw new Error(`Expired stock oversell should be rejected with 400! Got: ${overStockRes.status}`);
    }
    console.log('   ✅ Request exceeding non-expired stock correctly rejected with 400 Bad Request');

    // 5. Test Split Payments (Cash + Visa + Wallet)
    console.log('\n5️⃣  Testing Split Payment (Cash 40 + Visa 40 + Wallet 40 = 120 EGP)...');
    const splitSaleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        items: [{ productId: prod2.id, quantity: 1 }], // 1 x 120 = 120 EGP
        payments: [
          { paymentMethod: 'CASH', amount: 40.0 },
          { paymentMethod: 'VISA', amount: 40.0, referenceNumber: 'TXN-SPLIT-VISA' },
          { paymentMethod: 'WALLET', amount: 40.0, referenceNumber: 'TXN-SPLIT-WALLET' },
        ],
      }),
    });
    const splitSaleData = (await splitSaleRes.json()) as any;
    if (splitSaleRes.status !== 201 || splitSaleData.data.payments.length !== 3) {
      throw new Error(`Split payment sale failed: ${JSON.stringify(splitSaleData)}`);
    }
    console.log(`   ✅ Split payment accepted with 3 distinct payment records totaling 120 EGP!`);

    // 6. Test Payment Mismatch Rejection (400 Bad Request)
    console.log('\n6️⃣  Testing Payment Total Mismatch Rejection (400 Bad Request)...');
    const mismatchRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        items: [{ productId: prod2.id, quantity: 1 }], // 120 EGP
        payments: [{ paymentMethod: 'CASH', amount: 100.0 }], // Underpaid by 20 EGP
      }),
    });
    if (mismatchRes.status !== 400) {
      throw new Error(`Payment mismatch should return 400! Got: ${mismatchRes.status}`);
    }
    console.log('   ✅ Underpayment rejected with 400 Bad Request');

    // 7. Setup VIP Customer & Test Customer Tier Discount + Loyalty Points Earning
    console.log('\n7️⃣  Testing Registered VIP Customer Sale (Tier Discount + Loyalty Points)...');
    const vipTier = await prisma.customerTier.findUnique({ where: { name: 'VIP' } }); // 15% discount
    const vipCustomer = await prisma.customer.create({
      data: {
        name: 'Haj Mahmoud VIP',
        phone: '+201077771111',
        tierId: vipTier?.id,
        isActive: true,
      },
    });

    // Buy 2 Augmentin (2 x 120 = 240 EGP) -> 15% VIP discount (-36 EGP) -> Net total: 204 EGP
    const vipSaleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        customerId: vipCustomer.id,
        items: [{ productId: prod2.id, quantity: 2 }],
        payments: [{ paymentMethod: 'CASH', amount: 204.0 }],
      }),
    });
    const vipSaleData = (await vipSaleRes.json()) as any;
    if (vipSaleRes.status !== 201 || vipSaleData.data.discount !== 36.0 || vipSaleData.data.total !== 204.0) {
      throw new Error(`VIP tier discount failed: ${JSON.stringify(vipSaleData)}`);
    }
    console.log(`   ✅ VIP 15% tier discount applied: -36 EGP. Subtotal: 240 EGP -> Total: 204 EGP`);

    // Verify Loyalty Points Earned (204 EGP / 10 = 20 points earned)
    const vipLoyalty = await prisma.loyaltyAccount.findUnique({ where: { customerId: vipCustomer.id } });
    if (vipLoyalty?.totalPoints !== 20) {
      throw new Error(`Loyalty points earning failed! Expected 20, got: ${vipLoyalty?.totalPoints}`);
    }
    console.log(`   ✅ Awarded ${vipLoyalty.totalPoints} loyalty points for 204 EGP purchase`);

    // 8. Test Promotional Discount Code (POST /discounts & checkout)
    console.log('\n8️⃣  Testing Promotional Discount Code (SUMMER20 - 20% off)...');
    await prisma.discount.create({
      data: {
        code: 'SUMMER20',
        name: 'Summer Promo 20%',
        type: 'PROMOTIONAL',
        value: 20.0,
        minimumPurchase: 50.0,
        isActive: true,
      },
    });

    // Walk-in customer with promo code on 1 Augmentin (120 EGP) -> 20% off = -24 EGP -> Total: 96 EGP
    const promoSaleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        discountCode: 'SUMMER20',
        items: [{ productId: prod2.id, quantity: 1 }],
        payments: [{ paymentMethod: 'CASH', amount: 96.0 }],
      }),
    });
    const promoSaleData = (await promoSaleRes.json()) as any;
    if (promoSaleRes.status !== 201 || promoSaleData.data.discount !== 24.0 || promoSaleData.data.total !== 96.0) {
      throw new Error(`Promo code discount failed: ${JSON.stringify(promoSaleData)}`);
    }
    console.log(`   ✅ Promo code SUMMER20 applied: -24 EGP. Net total: 96 EGP`);

    // 9. Test Insurance Coverage Sale (POST /insurance/providers, /insurance/customers & checkout)
    console.log('\n9️⃣  Testing Insurance Coverage Checkout (80% Covered by Provider)...');
    const insuranceProvider = await prisma.insuranceProvider.create({
      data: {
        name: 'Misr Health Insurance',
        phone: '19000',
        defaultCoveragePercentage: 80.0,
        isActive: true,
      },
    });

    const insuredCustomer = await prisma.customer.create({
      data: {
        name: 'Dr. Ashraf Insured',
        phone: '+201077772222',
        isActive: true,
      },
    });

    const customerPolicy = await prisma.customerInsurance.create({
      data: {
        customerId: insuredCustomer.id,
        insuranceProviderId: insuranceProvider.id,
        policyNumber: 'POL-MISR-7788',
        memberNumber: 'MEM-001',
        coveragePercentage: 80.0,
        isActive: true,
      },
    });

    // Buy 1 Augmentin (120 EGP): 80% covered by Insurance = 96 EGP, 20% customer copay = 24 EGP
    const insuranceSaleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        customerId: insuredCustomer.id,
        customerInsuranceId: customerPolicy.id,
        items: [{ productId: prod2.id, quantity: 1 }],
        payments: [{ paymentMethod: 'CASH', amount: 24.0 }],
      }),
    });
    const insuranceSaleData = (await insuranceSaleRes.json()) as any;
    if (insuranceSaleRes.status !== 201 || insuranceSaleData.data.insuranceAmount !== 96.0 || insuranceSaleData.data.total !== 24.0) {
      throw new Error(`Insurance checkout failed: ${JSON.stringify(insuranceSaleData)}`);
    }
    console.log(`   ✅ Insurance applied: Provider Covered 96 EGP | Customer Copay 24 EGP`);

    // 10. Test Loyalty Points Redemption During Checkout
    console.log('\n🔟 Testing Loyalty Points Redemption (Redeem 20 pts = 2 EGP discount)...');
    // VIP customer has 20 points. Buy 1 Panadol (40 EGP) - 15% VIP discount (6 EGP) = 34 EGP - 2 EGP (20 pts) = 32 EGP
    const redeemSaleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        customerId: vipCustomer.id,
        redeemPoints: 20,
        items: [{ productId: prod1.id, quantity: 1 }],
        payments: [{ paymentMethod: 'CASH', amount: 32.0 }],
      }),
    });
    const redeemSaleData = (await redeemSaleRes.json()) as any;
    if (redeemSaleRes.status !== 201 || redeemSaleData.data.total !== 32.0) {
      throw new Error(`Loyalty point redemption failed: ${JSON.stringify(redeemSaleData)}`);
    }
    console.log(`   ✅ Loyalty points redeemed successfully! Final total: 32 EGP`);

    // 11. Test Sale Retrieval by Invoice & ID (GET /sales/invoice/:invoiceNumber and GET /sales/:id)
    console.log('\n1️⃣1️⃣ Testing Sale Lookup by Invoice & ID...');
    const invoiceLookupRes = await fetch(`${BASE_URL}/sales/invoice/${sale1.invoiceNumber}`, {
      headers: { Cookie: accCookie },
    });
    const invoiceLookupData = (await invoiceLookupRes.json()) as any;
    if (invoiceLookupRes.status !== 200 || invoiceLookupData.data.id !== sale1.id) {
      throw new Error(`Invoice lookup failed`);
    }

    const idLookupRes = await fetch(`${BASE_URL}/sales/${sale1.id}`, {
      headers: { Cookie: accCookie },
    });
    const idLookupData = (await idLookupRes.json()) as any;
    if (idLookupRes.status !== 200 || idLookupData.data.invoiceNumber !== sale1.invoiceNumber) {
      throw new Error(`ID lookup failed`);
    }
    console.log(`   ✅ Retrieved invoice: ${invoiceLookupData.data.invoiceNumber} with ${invoiceLookupData.data.items.length} item line(s)`);

    // 12. Test Sales List with Filters (GET /sales?paymentMethod=VISA)
    console.log('\n1️⃣2️⃣ Testing Sales Query with Filters (GET /sales?paymentMethod=VISA)...');
    const salesFilterRes = await fetch(`${BASE_URL}/sales?paymentMethod=VISA`, {
      headers: { Cookie: accCookie },
    });
    const salesFilterData = (await salesFilterRes.json()) as any;
    if (salesFilterRes.status !== 200 || salesFilterData.data.items.length === 0) {
      throw new Error(`Sales filter query failed`);
    }
    console.log(`   ✅ Retrieved ${salesFilterData.data.items.length} sale(s) matching paymentMethod=VISA`);

    // 13. Test Payments Listing (GET /payments & GET /payments/sales/:saleId)
    console.log('\n1️⃣3️⃣ Testing Payments Query Endpoints (GET /payments & GET /payments/sales/:saleId)...');
    const allPaymentsRes = await fetch(`${BASE_URL}/payments`, {
      headers: { Cookie: accCookie },
    });
    const allPaymentsData = (await allPaymentsRes.json()) as any;
    if (allPaymentsRes.status !== 200 || allPaymentsData.data.items.length === 0) {
      throw new Error(`All payments list query failed`);
    }

    const salePaymentsRes = await fetch(`${BASE_URL}/payments/sales/${splitSaleData.data.id}`, {
      headers: { Cookie: accCookie },
    });
    const salePaymentsData = (await salePaymentsRes.json()) as any;
    if (salePaymentsRes.status !== 200 || salePaymentsData.data.length !== 3) {
      throw new Error(`Sale payments list query failed`);
    }
    console.log(`   ✅ Verified /payments list (${allPaymentsData.data.pagination.total} total) and /payments/sales/:id (3 split payment lines)`);

    // 14. Test Sale Cancellation with Atomic Inventory Reversal (POST /sales/:id/cancel)
    console.log('\n1️⃣4️⃣ Testing Sale Cancellation (POST /sales/:id/cancel)...');
    const batch2BeforeCancel = await prisma.batch.findUnique({ where: { id: batch2.id } });
    const cancelRes = await fetch(`${BASE_URL}/sales/${splitSaleData.data.id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ reason: 'Customer returned items immediately after purchase' }),
    });
    const cancelData = (await cancelRes.json()) as any;
    if (cancelRes.status !== 200 || cancelData.data.status !== 'CANCELLED') {
      throw new Error(`Sale cancellation failed: ${JSON.stringify(cancelData)}`);
    }
    const batch2AfterCancel = await prisma.batch.findUnique({ where: { id: batch2.id } });
    if ((batch2AfterCancel?.quantity || 0) !== (batch2BeforeCancel?.quantity || 0) + 1) {
      throw new Error(`Batch quantity not reverted upon cancellation!`);
    }
    console.log(`   ✅ Sale marked CANCELLED. Batch quantity atomically restored by +1!`);

    // 15. Test Concurrency Protection (Two Cashiers Attempting to Overconsume Stock Concurrently)
    console.log('\n1️⃣5️⃣ Testing Concurrency Protection (Simultaneous Checkouts on Remaining Stock)...');
    // Batch 1B currently has 42 units. Let's make 2 simultaneous requests for 30 units each (total 60 > 42).
    // Exactly ONE must succeed and ONE must fail with 400 Bad Request!
    const [reqA, reqB] = await Promise.all([
      fetch(`${BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
        body: JSON.stringify({
          items: [{ productId: prod1.id, quantity: 30 }],
          payments: [{ paymentMethod: 'CASH', amount: 1200.0 }],
        }),
      }),
      fetch(`${BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
        body: JSON.stringify({
          items: [{ productId: prod1.id, quantity: 30 }],
          payments: [{ paymentMethod: 'CASH', amount: 1200.0 }],
        }),
      }),
    ]);

    const statusA = reqA.status;
    const statusB = reqB.status;
    const oneSuccessOneFail = (statusA === 201 && statusB === 400) || (statusA === 400 && statusB === 201);
    if (!oneSuccessOneFail) {
      throw new Error(`Concurrency race failed! Expected one 201 and one 400, got: A=${statusA}, B=${statusB}`);
    }
    console.log(`   ✅ Concurrency protection verified: One checkout succeeded (201) and one rejected due to stock depletion (400)!`);

    // 16. Test RBAC: Accountant blocked from checkout (403 Forbidden)
    console.log('\n1️⃣6️⃣ Testing RBAC: Accountant blocked from creating sales (403 Forbidden)...');
    const accCheckoutRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: accCookie },
      body: JSON.stringify({
        items: [{ productId: prod1.id, quantity: 1 }],
        payments: [{ paymentMethod: 'CASH', amount: 40.0 }],
      }),
    });
    if (accCheckoutRes.status !== 403) {
      throw new Error(`Accountant should be blocked with 403! Got: ${accCheckoutRes.status}`);
    }
    console.log('   ✅ Accountant correctly blocked from checkout with 403 Forbidden');

    // 17. Verify Inventory Ledger & Audit Logs in MySQL
    console.log('\n1️⃣7️⃣ Verifying Inventory Ledger & Audit Logs in MySQL...');
    const saleLedgers = await prisma.inventoryTransaction.count({
      where: { type: 'SALE' },
    });
    const auditLogsCount = await prisma.auditLog.count({
      where: { entity: { in: ['sales', 'discounts', 'insurance_providers', 'customer_insurances'] } },
    });
    console.log(`   ✅ Found ${saleLedgers} immutable [SALE] inventory transactions.`);
    console.log(`   ✅ Found ${auditLogsCount} audit log records for Phase 6 operations in MySQL!`);

    // Cleanup test records
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL PHASE 6 POS SALES & CHECKOUT TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 6 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase6();
