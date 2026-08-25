import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';

async function seed() {
  console.log('🌱 Seeding initial demo data into MySQL...');

  // 1. Seed Customer Tiers
  const defaultTiers = [
    { name: 'REGULAR', discountPercentage: 0.0, minimumPoints: 0, description: 'Standard Customer Tier' },
    { name: 'SILVER', discountPercentage: 5.0, minimumPoints: 500, description: 'Silver Loyalty Tier (5% discount)' },
    { name: 'GOLD', discountPercentage: 10.0, minimumPoints: 1500, description: 'Gold Loyalty Tier (10% discount)' },
    { name: 'VIP', discountPercentage: 15.0, minimumPoints: 3000, description: 'VIP Premier Tier (15% discount)' },
  ];

  for (const tierData of defaultTiers) {
    const existingTier = await prisma.customerTier.findUnique({ where: { name: tierData.name } });
    if (!existingTier) {
      const created = await prisma.customerTier.create({ data: tierData });
      console.log(`✅ Customer Tier created: ${created.name} (${created.discountPercentage}% off, min ${created.minimumPoints} pts)`);
    } else {
      console.log(`ℹ️ Customer Tier already exists: ${existingTier.name}`);
    }
  }

  // 2. Seed Staff Accounts
  const adminPhone = '01012345678';
  let admin = await prisma.user.findFirst({ where: { phone: adminPhone } });

  if (!admin) {
    const passwordHash = await hashPassword('AdminPass123!');
    admin = await prisma.user.create({
      data: {
        name: 'Dr. Tarek Admin',
        phone: adminPhone,
        email: 'admin@pharmacy.local',
        passwordHash,
        role: 'PLATFORM_MANAGER',
        isActive: true,
      },
    });
    console.log(`✅ Platform Manager created: ${admin.name} (Phone: ${admin.phone} | Password: AdminPass123!)`);
  } else {
    console.log(`ℹ️ Platform Manager already exists: ${admin.phone}`);
  }

  const pharmacistPhone = '01098765432';
  const existingPharm = await prisma.user.findFirst({ where: { phone: pharmacistPhone } });

  if (!existingPharm) {
    const passwordHash = await hashPassword('PharmPass123!');
    const pharm = await prisma.user.create({
      data: {
        name: 'Dr. Sarah Pharmacist',
        phone: pharmacistPhone,
        email: 'sarah@pharmacy.local',
        passwordHash,
        role: 'PHARMACIST',
        isActive: true,
      },
    });
    console.log(`✅ Pharmacist created: ${pharm.name} (Phone: ${pharm.phone} | Password: PharmPass123!)`);
  } else {
    console.log(`ℹ️ Pharmacist already exists: ${existingPharm.phone}`);
  }

  // 3. Seed Pharmacy Categories
  const categoriesData = [
    { name: 'Antibiotics', description: 'Oral and injectable antibacterial medications' },
    { name: 'Pain Relief & Fever', description: 'Analgesics, antipyretics, and anti-inflammatory drugs' },
    { name: 'Vitamins & Supplements', description: 'Multivitamins, minerals, and dietary health supplements' },
    { name: 'Cardiovascular', description: 'Blood pressure and cardiac health medicines' },
    { name: 'Medical Supplies', description: 'First aid, bandages, syringes, and medical devices' },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    let category = await prisma.category.findUnique({ where: { name: cat.name } });
    if (!category) {
      category = await prisma.category.create({ data: cat });
      console.log(`✅ Category created: ${category.name}`);
    } else {
      console.log(`ℹ️ Category already exists: ${category.name}`);
    }
    categoryMap.set(cat.name, category.id);
  }

  // 4. Seed Pharmacy Demo Products & Batches
  const productsData = [
    {
      name: 'Augmentin 1g Tablets',
      barcode: '6221234567890',
      scientificName: 'Amoxicillin + Clavulanic Acid',
      description: '14 film-coated tablets',
      categoryName: 'Antibiotics',
      purchasePrice: 85.0,
      sellingPrice: 115.0,
      minimumStock: 15,
      batches: [
        { batchNumber: 'AUG-2026-N1', expiryMonths: 18, quantity: 50 }, // Normal
        { batchNumber: 'AUG-2026-N2', expiryMonths: 24, quantity: 40 }, // Normal
      ],
    },
    {
      name: 'Panadol Extra 500mg',
      barcode: '6229876543210',
      scientificName: 'Paracetamol + Caffeine',
      description: '24 film-coated tablets',
      categoryName: 'Pain Relief & Fever',
      purchasePrice: 24.0,
      sellingPrice: 36.0,
      minimumStock: 20,
      batches: [
        { batchNumber: 'PAN-2026-FEFO1', expiryDays: 20, quantity: 25 }, // Expiring soon (< 30 days)
        { batchNumber: 'PAN-2026-FEFO2', expiryMonths: 12, quantity: 80 }, // Normal
      ],
    },
    {
      name: 'Concor 5mg Tablets',
      barcode: '6225555666677',
      scientificName: 'Bisoprolol Fumarate',
      description: '30 film-coated tablets',
      categoryName: 'Cardiovascular',
      purchasePrice: 42.0,
      sellingPrice: 60.0,
      minimumStock: 25,
      batches: [
        { batchNumber: 'CON-LOW-01', expiryMonths: 14, quantity: 5 }, // Low stock (5 <= 25)
      ],
    },
    {
      name: 'Vitamin C 1000mg Effervescent',
      barcode: '6224444333322',
      scientificName: 'Ascorbic Acid + Zinc',
      description: '20 effervescent tablets',
      categoryName: 'Vitamins & Supplements',
      purchasePrice: 30.0,
      sellingPrice: 45.0,
      minimumStock: 10,
      batches: [
        { batchNumber: 'VIT-EXP-OLD', expiryDays: -15, quantity: 12 }, // Expired (-15 days)
        { batchNumber: 'VIT-2026-FRESH', expiryMonths: 10, quantity: 30 }, // Normal
      ],
    },
  ];

  for (const prodData of productsData) {
    const categoryId = categoryMap.get(prodData.categoryName);
    if (!categoryId) continue;

    let product = await prisma.product.findUnique({ where: { barcode: prodData.barcode } });
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: prodData.name,
          barcode: prodData.barcode,
          scientificName: prodData.scientificName,
          description: prodData.description,
          categoryId,
          purchasePrice: prodData.purchasePrice,
          sellingPrice: prodData.sellingPrice,
          minimumStock: prodData.minimumStock,
          isActive: true,
        },
      });
      console.log(`✅ Product created: ${product.name} (Barcode: ${product.barcode})`);
    } else {
      console.log(`ℹ️ Product already exists: ${product.name}`);
    }

    // Seed Batches
    for (const b of prodData.batches) {
      const existingBatch = await prisma.batch.findUnique({
        where: {
          productId_batchNumber: {
            productId: product.id,
            batchNumber: b.batchNumber,
          },
        },
      });

      if (!existingBatch) {
        const expiryDate = new Date();
        if (b.expiryDays !== undefined) {
          expiryDate.setDate(expiryDate.getDate() + b.expiryDays);
        } else if (b.expiryMonths !== undefined) {
          expiryDate.setMonth(expiryDate.getMonth() + b.expiryMonths);
        }

        await prisma.$transaction(async (tx) => {
          const createdBatch = await tx.batch.create({
            data: {
              productId: product.id,
              batchNumber: b.batchNumber,
              expiryDate,
              quantity: b.quantity,
              purchasePrice: prodData.purchasePrice,
              sellingPrice: prodData.sellingPrice,
            },
          });

          if (b.quantity > 0) {
            await tx.inventoryTransaction.create({
              data: {
                productId: product.id,
                batchId: createdBatch.id,
                quantity: b.quantity,
                type: 'MANUAL_IN',
                reason: `Initial seed inventory for batch ${b.batchNumber}`,
                createdById: admin?.id || null,
              },
            });
          }
        });
        console.log(`   📦 Batch created: ${b.batchNumber} (Qty: ${b.quantity}, Expiry: ${expiryDate.toISOString().split('T')[0]})`);
      }
    }
  }

  console.log('✨ Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
