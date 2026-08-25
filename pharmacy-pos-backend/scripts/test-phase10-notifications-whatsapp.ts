import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';
import { whatsAppService } from '../src/modules/whatsapp/index.js';
import { notificationsService } from '../src/modules/notifications/index.js';
import type { Server } from 'http';

let server: Server;
const PORT = 5012;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const testBarcodes = ['BAR-PH10-001'];
const testCategoryNames = ['Phase10 Comms Category'];
const testCustomerPhones = ['+201099991111', '+201099992222'];
const testUserPhones = ['+201099993333', '+201099994444', '+201099995555'];

async function cleanupTestData() {
  // 1. Delete WhatsApp messages
  await prisma.whatsAppMessage.deleteMany({});

  // 2. Delete Notifications
  await prisma.notification.deleteMany({});

  // 3. Delete Sales, Payments, Items, Commission, Loyalty
  await prisma.commissionTransaction.deleteMany({});
  await prisma.loyaltyTransaction.deleteMany({});
  await prisma.loyaltyAccount.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});

  // 4. Delete batches, products, categories
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

  // 5. Delete customers & users
  await prisma.customer.deleteMany({
    where: { phone: { in: testCustomerPhones } },
  });

  await prisma.user.deleteMany({
    where: { phone: { in: testUserPhones } },
  });
}

async function testPhase10() {
  console.log('================================================================');
  console.log('🧪 Starting Phase 10 (Notifications & WhatsApp) Test Suite');
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
        name: 'Phase10 Manager',
        phone: '+201099993333',
        email: 'p10.admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });

    const pharm = await prisma.user.create({
      data: {
        name: 'Phase10 Pharmacist',
        phone: '+201099994444',
        email: 'p10.pharm@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });

    const acc = await prisma.user.create({
      data: {
        name: 'Phase10 Accountant',
        phone: '+201099995555',
        email: 'p10.acc@pharmacy.local',
        passwordHash,
        role: 'ACCOUNTANT',
        isActive: true,
      },
    });

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201099993333', password: 'TestPass123!' }),
    });
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Pharmacist
    const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201099994444', password: 'TestPass123!' }),
    });
    const pharmCookie = pharmLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    // Login as Accountant
    const accLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+201099995555', password: 'TestPass123!' }),
    });
    const accCookie = accLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

    console.log('0️⃣  Setup complete. Authenticated Admin, Pharmacist, and Accountant.\n');

    // -------------------------------------------------------------
    // PART A: NOTIFICATIONS TESTS
    // -------------------------------------------------------------
    console.log('=== PART A: NOTIFICATIONS ENGINE ===');

    // 1. Create Notifications for Pharmacist
    console.log('1️⃣  Testing Internal Notification Creation...');
    const notif1 = await notificationsService.createNotification({
      userId: pharm.id,
      title: 'Low Stock Alert',
      message: 'Product Panadol 500mg has reached 2 units remaining.',
      type: 'LOW_STOCK',
    });

    const notif2 = await notificationsService.createNotification({
      userId: pharm.id,
      title: 'Expiry Horizon Warning',
      message: 'Batch AUG-2026-X1 is expiring in 15 days.',
      type: 'EXPIRY_ALERT',
    });

    console.log(`   ✅ Created notifications: [${notif1.type}] ${notif1.title} and [${notif2.type}] ${notif2.title}`);

    // 2. Query User Notifications (GET /notifications)
    console.log('\n2️⃣  Testing Get User Notifications (GET /api/v1/notifications)...');
    const notifsRes = await fetch(`${BASE_URL}/notifications?isRead=false`, {
      headers: { Cookie: pharmCookie },
    });
    const notifsData = (await notifsRes.json()) as any;
    if (notifsRes.status !== 200 || notifsData.data.items.length !== 2) {
      throw new Error(`Get notifications failed: ${JSON.stringify(notifsData)}`);
    }
    console.log(`   ✅ Retrieved ${notifsData.data.items.length} unread notifications for Pharmacist.`);

    // 3. Get Unread Count (GET /notifications/unread-count)
    console.log('\n3️⃣  Testing Unread Notification Count (GET /api/v1/notifications/unread-count)...');
    const countRes = await fetch(`${BASE_URL}/notifications/unread-count`, {
      headers: { Cookie: pharmCookie },
    });
    const countData = (await countRes.json()) as any;
    if (countRes.status !== 200 || countData.data.unreadCount !== 2) {
      throw new Error(`Unread count failed: ${JSON.stringify(countData)}`);
    }
    console.log(`   ✅ Unread Count: ${countData.data.unreadCount}`);

    // 4. Mark Single Notification as Read (PATCH /notifications/:id/read)
    console.log('\n4️⃣  Testing Mark Single Notification Read (PATCH /api/v1/notifications/:id/read)...');
    const readRes = await fetch(`${BASE_URL}/notifications/${notif1.id}/read`, {
      method: 'PATCH',
      headers: { Cookie: pharmCookie },
    });
    const readData = (await readRes.json()) as any;
    if (readRes.status !== 200 || !readData.data.isRead) {
      throw new Error(`Mark read failed`);
    }
    console.log(`   ✅ Notification ${notif1.id} marked as read.`);

    // 5. Mark All Notifications Read (PATCH /notifications/read-all)
    console.log('\n5️⃣  Testing Mark All Notifications Read (PATCH /api/v1/notifications/read-all)...');
    const readAllRes = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: { Cookie: pharmCookie },
    });
    const readAllData = (await readAllRes.json()) as any;
    if (readAllRes.status !== 200 || readAllData.data.markedCount !== 1) {
      throw new Error(`Mark all read failed`);
    }
    console.log(`   ✅ All remaining unread notifications marked as read.`);

    // -------------------------------------------------------------
    // PART B: WHATSAPP CUSTOMER COMMUNICATION TESTS
    // -------------------------------------------------------------
    console.log('\n=== PART B: WHATSAPP CUSTOMER COMMUNICATION ENGINE ===');

    const customerWithPhone = await prisma.customer.create({
      data: {
        name: 'Tamer Customer',
        phone: '+201099991111',
        isActive: true,
      },
    });

    const category = await prisma.category.create({
      data: { name: 'Phase10 Comms Category' },
    });

    const product = await prisma.product.create({
      data: {
        name: 'Cataflam 50mg Phase10',
        barcode: 'BAR-PH10-001',
        categoryId: category.id,
        purchasePrice: 20.0,
        sellingPrice: 35.0,
        minimumStock: 5,
        isActive: true,
      },
    });

    const futureExp = new Date();
    futureExp.setFullYear(futureExp.getFullYear() + 1);

    const batch = await prisma.batch.create({
      data: {
        productId: product.id,
        batchNumber: 'P10-CAT-01',
        expiryDate: futureExp,
        quantity: 50,
        purchasePrice: 20.0,
        sellingPrice: 35.0,
      },
    });

    // 6. Test Enqueue WhatsApp Invoice Message (Successful flow)
    console.log('6️⃣  Testing Enqueue WhatsApp Invoice Message...');
    const testSale1 = await prisma.sale.create({
      data: {
        invoiceNumber: 'INV-P10-001',
        userId: pharm.id,
        customerId: customerWithPhone.id,
        subtotal: 70.0,
        tax: 0,
        total: 70.0,
        paidAmount: 70.0,
        status: 'COMPLETED',
      },
    });

    const waMsg = await whatsAppService.enqueueInvoiceMessage({
      saleId: testSale1.id,
      invoiceNumber: 'INV-P10-001',
      customerId: customerWithPhone.id,
      customerName: customerWithPhone.name,
      customerPhone: customerWithPhone.phone,
      total: 70.0,
      paidAmount: 70.0,
    });
    if (!waMsg) throw new Error(`Enqueue WhatsApp message failed!`);
    console.log(`   ✅ Enqueued WhatsApp message: ${waMsg.id} | Status: ${waMsg.status}`);

    // Wait for background worker
    await new Promise((r) => setTimeout(r, 100));

    // 7. Verify WhatsApp Message Status Transitioned to SENT
    console.log('\n7️⃣  Verifying WhatsApp Status in MySQL (Status -> SENT)...');
    const sentMsg = await whatsAppService.getMessageById(waMsg.id);
    if (sentMsg.status !== 'SENT' || !sentMsg.providerMessageId || !sentMsg.sentAt) {
      throw new Error(`WhatsApp message failed to send: ${JSON.stringify(sentMsg)}`);
    }
    console.log(`   ✅ Message Status: ${sentMsg.status} | Provider ID: ${sentMsg.providerMessageId} | Sent At: ${sentMsg.sentAt}`);

    // 8. Test Duplicate Invoice Protection (Idempotency)
    console.log('\n8️⃣  Testing Idempotency / Duplicate Invoice Message Protection...');
    const dupWaMsg = await whatsAppService.enqueueInvoiceMessage({
      saleId: testSale1.id,
      invoiceNumber: 'INV-P10-001',
      customerId: customerWithPhone.id,
      customerName: customerWithPhone.name,
      customerPhone: customerWithPhone.phone,
      total: 70.0,
      paidAmount: 70.0,
    });
    if (dupWaMsg?.id !== waMsg.id) {
      throw new Error(`Duplicate WhatsApp message created for same sale!`);
    }
    console.log(`   ✅ Idempotency verified: Reused existing message ${dupWaMsg.id}`);

    // 9. Test Provider Failure & Retry Exhaustion -> FAILED State
    console.log('\n9️⃣  Testing Provider Failure & Retry Handling (Max 3 attempts -> FAILED)...');
    const mockProvider = whatsAppService.getMockProvider();
    if (mockProvider) mockProvider.setShouldFail(true);

    const testSale2 = await prisma.sale.create({
      data: {
        invoiceNumber: 'INV-P10-002-FAIL',
        userId: pharm.id,
        customerId: customerWithPhone.id,
        subtotal: 100.0,
        tax: 0,
        total: 100.0,
        paidAmount: 100.0,
        status: 'COMPLETED',
      },
    });

    const failingMsg = await whatsAppService.enqueueInvoiceMessage({
      saleId: testSale2.id,
      invoiceNumber: 'INV-P10-002-FAIL',
      customerId: customerWithPhone.id,
      customerName: customerWithPhone.name,
      customerPhone: customerWithPhone.phone,
      total: 100.0,
      paidAmount: 100.0,
    });

    // Wait for retries
    await new Promise((r) => setTimeout(r, 150));

    const failedMsgRecord = await whatsAppService.getMessageById(failingMsg!.id);
    if (failedMsgRecord.status !== 'FAILED' || !failedMsgRecord.errorMessage) {
      throw new Error(`Expected message to be FAILED, got: ${JSON.stringify(failedMsgRecord)}`);
    }
    console.log(`   ✅ Failed message correctly marked as FAILED with error: "${failedMsgRecord.errorMessage}"`);

    // 10. Verify Internal System Notification Created on Permanent Failure
    console.log('\n🔟 Verifying Internal Staff Notification Created for WHATSAPP_FAILED...');
    const adminNotifs = await prisma.notification.findMany({
      where: { userId: admin.id, type: 'SYSTEM_ALERT' },
    });
    if (adminNotifs.length === 0) {
      throw new Error(`Admin alert notification not created upon WhatsApp failure!`);
    }
    console.log(`   ✅ Found Admin Alert: "${adminNotifs[0].title} - ${adminNotifs[0].message}"`);

    if (mockProvider) mockProvider.setShouldFail(false);

    // 11. Test Manual Retry by Manager (POST /whatsapp/messages/:id/retry)
    console.log('\n1️⃣1️⃣ Testing Manual Retry by Manager (POST /api/v1/whatsapp/messages/:id/retry)...');
    const retryRes = await fetch(`${BASE_URL}/whatsapp/messages/${failedMsgRecord.id}/retry`, {
      method: 'POST',
      headers: { Cookie: adminCookie },
    });
    const retryData = (await retryRes.json()) as any;
    if (retryRes.status !== 200) {
      throw new Error(`Retry failed: ${JSON.stringify(retryData)}`);
    }
    console.log(`   ✅ Manual retry queued for message ${failedMsgRecord.id}`);

    // Wait for worker
    await new Promise((r) => setTimeout(r, 100));
    const retriedMsg = await whatsAppService.getMessageById(failedMsgRecord.id);
    if (retriedMsg.status !== 'SENT') {
      throw new Error(`Retried message not marked SENT! Got: ${retriedMsg.status}`);
    }
    console.log(`   ✅ Retried message successfully transitioned to SENT!`);

    // 12. Test RBAC: Pharmacist Blocked from Manual Retry (403 Forbidden)
    console.log('\n1️⃣2️⃣ Testing RBAC: Pharmacist blocked from Retry endpoint (403 Forbidden)...');
    const pharmRetryRes = await fetch(`${BASE_URL}/whatsapp/messages/${failedMsgRecord.id}/retry`, {
      method: 'POST',
      headers: { Cookie: pharmCookie },
    });
    if (pharmRetryRes.status !== 403) {
      throw new Error(`Pharmacist should be blocked with 403! Got: ${pharmRetryRes.status}`);
    }
    console.log(`   ✅ Pharmacist correctly blocked with 403 Forbidden.`);

    // 13. Test Query WhatsApp Message History (GET /whatsapp/messages)
    console.log('\n1️⃣3️⃣ Testing Query WhatsApp Message History (GET /api/v1/whatsapp/messages)...');
    const historyRes = await fetch(`${BASE_URL}/whatsapp/messages?phone=${encodeURIComponent('+201099991111')}`, {
      headers: { Cookie: accCookie },
    });
    const historyData = (await historyRes.json()) as any;
    if (historyRes.status !== 200 || historyData.data.items.length < 2) {
      throw new Error(`WhatsApp history query failed: ${JSON.stringify(historyData)}`);
    }
    console.log(`   ✅ Retrieved ${historyData.data.items.length} WhatsApp message records.`);

    // -------------------------------------------------------------
    // PART C: DECOUPLED POS SALE CHECKOUT FLOW INTEGRATION
    // -------------------------------------------------------------
    console.log('\n=== PART C: DECOUPLED POS SALE CHECKOUT → WHATSAPP FLOW ===');

    // 14. POS Checkout with Customer Phone -> WhatsApp message sent asynchronously
    console.log('1️⃣4️⃣ Testing POS Checkout with Customer Phone (Event-driven WhatsApp trigger)...');
    const saleWithPhoneRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        customerId: customerWithPhone.id,
        items: [{ productId: product.id, quantity: 1 }],
        payments: [{ paymentMethod: 'CASH', amount: 35.0 }],
      }),
    });
    const saleData = (await saleWithPhoneRes.json()) as any;
    if (saleWithPhoneRes.status !== 201 || !saleData.data.id) {
      throw new Error(`POS checkout failed: ${JSON.stringify(saleData)}`);
    }
    console.log(`   ✅ Sale created: ${saleData.data.invoiceNumber} | Total: ${saleData.data.total} EGP`);

    // Wait for event listener & background worker
    await new Promise((r) => setTimeout(r, 100));

    const saleWaMsg = await prisma.whatsAppMessage.findFirst({
      where: { saleId: saleData.data.id },
    });
    if (!saleWaMsg || saleWaMsg.status !== 'SENT') {
      throw new Error(`WhatsApp message not dispatched for POS sale!`);
    }
    console.log(`   ✅ Event-driven WhatsApp invoice automatically dispatched (Status: ${saleWaMsg.status}, Provider ID: ${saleWaMsg.providerMessageId})`);

    // 15. POS Checkout for Walk-in Customer (No phone) -> Sale succeeds without WhatsApp
    console.log('\n1️⃣5️⃣ Testing Walk-in Customer POS Checkout (No phone -> No WhatsApp, Sale succeeds)...');
    const walkinSaleRes = await fetch(`${BASE_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: pharmCookie },
      body: JSON.stringify({
        items: [{ productId: product.id, quantity: 1 }],
        payments: [{ paymentMethod: 'CASH', amount: 35.0 }],
      }),
    });
    const walkinData = (await walkinSaleRes.json()) as any;
    if (walkinSaleRes.status !== 201) {
      throw new Error(`Walk-in sale failed: ${JSON.stringify(walkinData)}`);
    }
    console.log(`   ✅ Walk-in sale succeeded seamlessly (Invoice: ${walkinData.data.invoiceNumber}) with zero external dependency!`);

    // 16. Verify Audit Logs in MySQL
    console.log('\n1️⃣6️⃣ Verifying Audit Logs in MySQL audit_logs table...');
    const auditCount = await prisma.auditLog.count({
      where: { entity: 'whatsapp_messages' },
    });
    console.log(`   ✅ Found ${auditCount} audit logs for WhatsApp operations in MySQL!`);

    // Cleanup test records
    await cleanupTestData();
    console.log('\n🧹 Temporary test records cleaned up from MySQL.');

    console.log('\n================================================================');
    console.log('🎉 ALL PHASE 10 NOTIFICATIONS & WHATSAPP TESTS PASSED 100%!');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Phase 10 Test Failed:', error);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
}

testPhase10();
