import { prisma } from '../src/lib/prisma.js';
import { Prisma } from '@prisma/client';

async function runRelationshipIntegrationTest() {
  console.log('================================================================');
  console.log('🧪 Starting End-to-End Database Relationship Integration Test');
  console.log('================================================================\n');

  try {
    // 1. Create Staff User
    console.log('1️⃣  Creating Staff User (PHARMACIST)...');
    const user = await prisma.user.create({
      data: {
        name: 'Dr. Sarah Al-Sayed',
        phone: '+201099887766',
        email: 'sarah.pharmacist@pharmacy.local',
        passwordHash: '$2b$10$hashed_password_sample_for_testing_purposes',
        role: 'PHARMACIST',
        isActive: true,
      },
    });
    console.log(`   ✅ User Created: [${user.id}] ${user.name} (${user.role})`);

    // 2. Create Category
    console.log('\n2️⃣  Creating Category...');
    const category = await prisma.category.create({
      data: {
        name: 'Antibiotics & Antimicrobials',
        description: 'Prescription antibiotics for bacterial infections',
        isActive: true,
      },
    });
    console.log(`   ✅ Category Created: [${category.id}] ${category.name}`);

    // 3. Create Product
    console.log('\n3️⃣  Creating Product with Decimal Prices...');
    const product = await prisma.product.create({
      data: {
        name: 'Augmentin 1g (14 Film-Coated Tablets)',
        barcode: '6221000999888',
        scientificName: 'Amoxicillin + Clavulanic Acid',
        description: 'Broad-spectrum antibiotic',
        categoryId: category.id,
        purchasePrice: new Prisma.Decimal('85.50'),
        sellingPrice: new Prisma.Decimal('115.00'),
        taxRate: new Prisma.Decimal('0.00'),
        minimumStock: 15,
        isActive: true,
      },
    });
    console.log(`   ✅ Product Created: [${product.id}] ${product.name} (Selling Price: ${product.sellingPrice} EGP)`);

    // 4. Create Batch
    console.log('\n4️⃣  Creating Batch for Product...');
    const batch = await prisma.batch.create({
      data: {
        productId: product.id,
        batchNumber: 'AUG-2026-B1',
        expiryDate: new Date('2028-06-30'),
        quantity: 120,
        purchasePrice: new Prisma.Decimal('85.50'),
        sellingPrice: new Prisma.Decimal('115.00'),
      },
    });
    console.log(`   ✅ Batch Created: [${batch.id}] Batch# ${batch.batchNumber} (Expires: ${batch.expiryDate.toISOString().split('T')[0]})`);

    // 5. Create Customer Tier
    console.log('\n5️⃣  Creating Customer Tier...');
    const tier = await prisma.customerTier.create({
      data: {
        name: 'GOLD_VIP',
        discountPercentage: new Prisma.Decimal('10.00'),
        minimumPoints: 500,
        description: 'Gold VIP Customers with 10% discount on non-price-controlled items',
      },
    });
    console.log(`   ✅ Customer Tier Created: [${tier.id}] ${tier.name} (${tier.discountPercentage}%)`);

    // 6. Create Customer (Purchasing Profile - No Auth)
    console.log('\n6️⃣  Creating Customer Profile...');
    const customer = await prisma.customer.create({
      data: {
        name: 'Tarek Mahmoud',
        phone: '+201122334455',
        email: 'tarek@example.com',
        address: '15 Tahrir Square, Cairo',
        tierId: tier.id,
        gender: 'MALE',
        dateOfBirth: new Date('1990-05-15'),
      },
    });
    console.log(`   ✅ Customer Profile Created: [${customer.id}] ${customer.name} (Phone: ${customer.phone})`);

    // 7. Create Loyalty Account & Ledger Transaction
    console.log('\n7️⃣  Creating Loyalty Account & Ledger Transaction...');
    const loyaltyAccount = await prisma.loyaltyAccount.create({
      data: {
        customerId: customer.id,
        totalPoints: 100,
      },
    });

    const loyaltyTx = await prisma.loyaltyTransaction.create({
      data: {
        loyaltyAccountId: loyaltyAccount.id,
        points: 100,
        balanceAfter: 100,
        type: 'EARN',
        referenceType: 'WELCOME_BONUS',
        reason: 'Initial account signup loyalty points',
      },
    });
    console.log(`   ✅ Loyalty Account & Transaction Created: Balance = ${loyaltyTx.balanceAfter} points`);

    // 8. Create Sale (POS Invoice)
    console.log('\n8️⃣  Creating POS Sale Invoice...');
    const sale = await prisma.sale.create({
      data: {
        invoiceNumber: 'INV-2026-TEST-001',
        customerId: customer.id,
        userId: user.id,
        subtotal: new Prisma.Decimal('230.00'),
        discount: new Prisma.Decimal('23.00'),
        discountReason: 'GOLD_VIP 10% Tier Discount',
        insuranceAmount: new Prisma.Decimal('0.00'),
        tax: new Prisma.Decimal('0.00'),
        total: new Prisma.Decimal('207.00'),
        paidAmount: new Prisma.Decimal('207.00'),
        remainingAmount: new Prisma.Decimal('0.00'),
        status: 'COMPLETED',
        notes: 'Walk-in prescription sale with gold discount',
      },
    });
    console.log(`   ✅ Sale Invoice Created: [${sale.id}] #${sale.invoiceNumber} (Total: ${sale.total} EGP)`);

    // 9. Create Sale Item
    console.log('\n9️⃣  Creating Sale Item linked to Product & Batch...');
    const saleItem = await prisma.saleItem.create({
      data: {
        saleId: sale.id,
        productId: product.id,
        batchId: batch.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal('115.00'),
        discount: new Prisma.Decimal('23.00'),
        tax: new Prisma.Decimal('0.00'),
        total: new Prisma.Decimal('207.00'),
      },
    });
    console.log(`   ✅ Sale Item Created: [${saleItem.id}] Qty: ${saleItem.quantity} x ${saleItem.unitPrice} EGP`);

    // 10. Create Split Payments (Cash + Visa)
    console.log('\n🔟 Creating Split Payments (CASH + VISA)...');
    const cashPayment = await prisma.payment.create({
      data: {
        saleId: sale.id,
        amount: new Prisma.Decimal('107.00'),
        paymentMethod: 'CASH',
        createdById: user.id,
        notes: 'Cash payment portion',
      },
    });

    const visaPayment = await prisma.payment.create({
      data: {
        saleId: sale.id,
        amount: new Prisma.Decimal('100.00'),
        paymentMethod: 'VISA',
        referenceNumber: 'POS-VISA-AUTH-987654',
        createdById: user.id,
        notes: 'Credit card payment portion',
      },
    });
    console.log(`   ✅ Split Payments Created: Cash (${cashPayment.amount} EGP) + Visa (${visaPayment.amount} EGP) = ${sale.paidAmount} EGP`);

    // 11. Create Inventory Transaction (Ledger)
    console.log('\n1️⃣1️⃣ Recording Inventory Transaction (Stock Ledger)...');
    const invTx = await prisma.inventoryTransaction.create({
      data: {
        productId: product.id,
        batchId: batch.id,
        quantity: -2,
        type: 'SALE',
        referenceType: 'SALE',
        referenceId: sale.id,
        reason: 'Dispensed on POS invoice INV-2026-TEST-001',
        createdById: user.id,
      },
    });
    console.log(`   ✅ Inventory Movement Logged: [${invTx.id}] Qty: ${invTx.quantity} (${invTx.type})`);

    // 12. Verify Deep Relational Query
    console.log('\n1️⃣2️⃣ Executing Deep Nested Relational Query (Sale -> Customer -> Tier -> Items -> Product -> Batch -> Payments)...');
    const deepSale = await prisma.sale.findUnique({
      where: { id: sale.id },
      include: {
        customer: {
          include: {
            tier: true,
            loyaltyAccount: {
              include: {
                transactions: true,
              },
            },
          },
        },
        user: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            batch: true,
          },
        },
        payments: true,
      },
    });

    if (!deepSale) throw new Error('Failed to retrieve nested sale relations');
    console.log(`   ✅ Nested Query Successful:`);
    console.log(`      - Invoice: ${deepSale.invoiceNumber}`);
    console.log(`      - Pharmacist: ${deepSale.user.name} (${deepSale.user.role})`);
    console.log(`      - Customer: ${deepSale.customer?.name} (Tier: ${deepSale.customer?.tier?.name})`);
    console.log(`      - Item: ${deepSale.items[0]?.product.name} (Batch: ${deepSale.items[0]?.batch?.batchNumber})`);
    console.log(`      - Payments: ${deepSale.payments.length} payment(s) registered`);

    // 13. Clean up test records
    console.log('\n🧹 Cleaning up test integration records...');
    await prisma.inventoryTransaction.delete({ where: { id: invTx.id } });
    await prisma.payment.deleteMany({ where: { saleId: sale.id } });
    await prisma.saleItem.deleteMany({ where: { saleId: sale.id } });
    await prisma.sale.delete({ where: { id: sale.id } });
    await prisma.loyaltyTransaction.delete({ where: { id: loyaltyTx.id } });
    await prisma.loyaltyAccount.delete({ where: { id: loyaltyAccount.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
    await prisma.customerTier.delete({ where: { id: tier.id } });
    await prisma.batch.delete({ where: { id: batch.id } });
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.category.delete({ where: { id: category.id } });
    await prisma.user.delete({ where: { id: user.id } });

    console.log('   ✅ All temporary integration test records safely removed from MySQL!');

    console.log('\n================================================================');
    console.log('🎉 ALL RELATIONSHIP & DATA INTEGRITY TESTS PASSED 100% (MySQL)');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Relationship test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runRelationshipIntegrationTest();
