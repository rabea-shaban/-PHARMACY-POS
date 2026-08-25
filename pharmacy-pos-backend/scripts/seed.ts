import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';

async function seed() {
  console.log('================================================================');
  console.log('🌱 Starting Comprehensive Pharmacy POS Master Database Seed');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // 1. System Settings Seed
  // -------------------------------------------------------------
  console.log('1️⃣  Seeding System Settings...');
  const systemSettings = [
    { key: 'pharmacy_name', value: 'Al-Amal Modern Pharmacy (صيدلية الأمل الحديثة)', description: 'Official Pharmacy Name', isPublic: true },
    { key: 'pharmacy_phone', value: '+201012345678', description: 'Official Hotline & WhatsApp Contact', isPublic: true },
    { key: 'pharmacy_address', value: '15 El-Tahrir Street, Dokki, Giza, Egypt', description: 'Physical Pharmacy Address', isPublic: true },
    { key: 'currency', value: 'EGP', description: 'Standard Currency Symbol', isPublic: true },
    { key: 'tax_rate', value: '0.00', description: 'Default Sales Tax Rate (%)', isPublic: true },
    { key: 'invoice_prefix', value: 'INV', description: 'Sales Invoice Number Prefix', isPublic: true },
    { key: 'low_stock_threshold', value: '10', description: 'Threshold for Low Stock Warning Alerts', isPublic: false },
    { key: 'expiry_alert_days', value: '90', description: 'Horizon for Expiring Batch Warning Alerts (Days)', isPublic: false },
    { key: 'loyalty_points_per_egp', value: '0.1', description: 'Loyalty Points Earned per 1 EGP Spent', isPublic: false },
    { key: 'loyalty_point_value', value: '0.1', description: 'Redemption Value of 1 Loyalty Point (EGP)', isPublic: false },
    { key: 'commission_default_rate', value: '5.0', description: 'Default Staff Commission Percentage (%)', isPublic: false },
  ];

  for (const s of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      create: s,
      update: { value: s.value, description: s.description, isPublic: s.isPublic },
    });
  }
  console.log(`   ✅ Seeded ${systemSettings.length} System Settings.`);

  // -------------------------------------------------------------
  // 2. Customer Tiers Seed
  // -------------------------------------------------------------
  console.log('\n2️⃣  Seeding Customer Loyalty Tiers...');
  const tiersData = [
    { name: 'BRONZE', discountPercentage: 0.0, minimumPoints: 0, description: 'Standard Tier (0% discount)' },
    { name: 'SILVER', discountPercentage: 3.0, minimumPoints: 500, description: 'Silver Tier (3% discount, 500+ pts)' },
    { name: 'GOLD', discountPercentage: 6.0, minimumPoints: 1500, description: 'Gold Tier (6% discount, 1500+ pts)' },
    { name: 'PLATINUM', discountPercentage: 10.0, minimumPoints: 3500, description: 'Platinum VIP Tier (10% discount, 3500+ pts)' },
  ];

  const tierMap = new Map<string, string>();
  for (const t of tiersData) {
    const tier = await prisma.customerTier.upsert({
      where: { name: t.name },
      create: t,
      update: { discountPercentage: t.discountPercentage, minimumPoints: t.minimumPoints, description: t.description },
    });
    tierMap.set(t.name, tier.id);
  }
  console.log(`   ✅ Seeded ${tiersData.length} Customer Loyalty Tiers.`);

  // -------------------------------------------------------------
  // 3. Staff Users Seed
  // -------------------------------------------------------------
  console.log('\n3️⃣  Seeding Staff Users & Accounts...');
  const usersData = [
    {
      name: 'Dr. Tarek El-Mansoury',
      phone: '01012345678',
      email: 'admin@pharmacy.local',
      password: 'AdminPass123!',
      role: 'PLATFORM_MANAGER' as const,
    },
    {
      name: 'Dr. Sarah Nabil',
      phone: '01098765432',
      email: 'sarah.manager@pharmacy.local',
      password: 'ManagerPass123!',
      role: 'PHARMACY_MANAGER' as const,
    },
    {
      name: 'Dr. Ahmed Hassan',
      phone: '01123456789',
      email: 'ahmed.pharm@pharmacy.local',
      password: 'PharmPass123!',
      role: 'PHARMACIST' as const,
    },
    {
      name: 'Dr. Mahmoud Samir',
      phone: '01198765432',
      email: 'mahmoud.pharm@pharmacy.local',
      password: 'PharmPass123!',
      role: 'PHARMACIST' as const,
    },
    {
      name: 'Mr. Mostafa Kamel',
      phone: '01223456789',
      email: 'mostafa.acc@pharmacy.local',
      password: 'AccPass123!',
      role: 'ACCOUNTANT' as const,
    },
  ];

  const userMap = new Map<string, any>();
  for (const u of usersData) {
    const passwordHash = await hashPassword(u.password);
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: u.phone }, { email: u.email }],
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: u.name,
          phone: u.phone,
          email: u.email,
          passwordHash,
          role: u.role,
          isActive: true,
        },
      });
    }
    userMap.set(u.role, user);
    console.log(`   👤 Staff User: [${u.role}] ${u.name} | Phone: ${u.phone} | Pass: ${u.password}`);
  }

  // -------------------------------------------------------------
  // 4. Customers & Loyalty Accounts Seed
  // -------------------------------------------------------------
  console.log('\n4️⃣  Seeding Customers & Loyalty Accounts...');
  const customersData = [
    {
      name: 'Mohamed Ali (VIP Gold)',
      phone: '+201011112222',
      email: 'mohamed.ali@gmail.com',
      tier: 'GOLD',
      points: 1850,
      totalSpend: 18500.0,
    },
    {
      name: 'Kareem Mahmoud (Silver)',
      phone: '+201033334444',
      email: 'kareem.m@yahoo.com',
      tier: 'SILVER',
      points: 620,
      totalSpend: 6200.0,
    },
    {
      name: 'Nour El-Din (Standard Bronze)',
      phone: '+201055556666',
      email: 'nour.eldin@outlook.com',
      tier: 'BRONZE',
      points: 120,
      totalSpend: 1200.0,
    },
    {
      name: 'Walk-in Guest (عميل نقدي سريع)',
      phone: '+201000000001',
      email: null,
      tier: 'BRONZE',
      points: 0,
      totalSpend: 0.0,
    },
  ];

  const customerMap = new Map<string, any>();
  for (const c of customersData) {
    let customer = c.phone ? await prisma.customer.findFirst({ where: { phone: c.phone } }) : null;
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: c.name,
          phone: c.phone,
          email: c.email,
          tierId: tierMap.get(c.tier) || null,
          isActive: true,
        },
      });
    }

    // Create Loyalty Account if not exists
    const existingAcc = await prisma.loyaltyAccount.findUnique({
      where: { customerId: customer.id },
    });

    if (!existingAcc) {
      await prisma.loyaltyAccount.create({
        data: {
          customerId: customer.id,
          totalPoints: c.points,
        },
      });
    }
    customerMap.set(c.name, customer);
    console.log(`   💳 Customer: ${c.name} | Phone: ${c.phone || 'N/A'} | Tier: ${c.tier} | Points: ${c.points}`);
  }

  // -------------------------------------------------------------
  // 5. Suppliers Seed
  // -------------------------------------------------------------
  console.log('\n5️⃣  Seeding Pharmaceutical Suppliers...');
  const suppliersData = [
    {
      name: 'Ibnsina Pharma (ابن سينا فارما)',
      phone: '+20224156789',
      email: 'orders@ibnsina-pharma.com',
      address: 'Nasr City, Cairo',
      taxNumber: '100-200-300',
      notes: 'Contact: Eng. Hesham Talaat',
    },
    {
      name: 'United Company of Pharmacists - UCP (الشركة المتحدة للصيادلة)',
      phone: '+20227945678',
      email: 'supply@ucp.com.eg',
      address: 'Mohandessin, Giza',
      taxNumber: '200-300-400',
      notes: 'Contact: Dr. Magdy Yacoub',
    },
    {
      name: 'Ramco Pharm (رامكو فارم)',
      phone: '+20233456789',
      email: 'orders@ramcopharm.com',
      address: '6th of October City',
      taxNumber: '300-400-500',
      notes: 'Contact: Mr. Tamer Hosny',
    },
    {
      name: 'PharmaOverseas (فارما أوفرسيز)',
      phone: '+20237654321',
      email: 'info@pharmaoverseas.com',
      address: 'Smart Village, Giza',
      taxNumber: '400-500-600',
      notes: 'Contact: Dr. Sameh Sami',
    },
  ];

  const supplierMap = new Map<string, any>();
  for (const s of suppliersData) {
    let supplier = await prisma.supplier.findFirst({ where: { name: s.name } });
    if (!supplier) {
      supplier = await prisma.supplier.create({ data: s });
    }
    supplierMap.set(s.name, supplier);
    console.log(`   🏭 Supplier: ${s.name} | Phone: ${s.phone}`);
  }

  // -------------------------------------------------------------
  // 6. Insurance Providers & Policies Seed
  // -------------------------------------------------------------
  console.log('\n6️⃣  Seeding Insurance Providers & Policies...');
  const insuranceData = [
    { name: 'Misr Insurance (مصر للتأمين)', phone: '+20100998877', email: 'claims@misr-insurance.eg', defaultCoveragePercentage: 80.0, notes: 'Corporate coverage' },
    { name: 'MetLife Alico (ميتلايف أليكو)', phone: '+20100887766', email: 'medical@metlife.eg', defaultCoveragePercentage: 85.0, notes: 'Direct billing provider' },
    { name: 'AXA Egypt (أكسا مصر للتأمين)', phone: '+20100776655', email: 'approvals@axa.eg', defaultCoveragePercentage: 90.0, notes: 'Comprehensive plan' },
  ];

  for (const ins of insuranceData) {
    const existing = await prisma.insuranceProvider.findFirst({ where: { name: ins.name } });
    if (!existing) {
      await prisma.insuranceProvider.create({
        data: {
          name: ins.name,
          phone: ins.phone,
          email: ins.email,
          defaultCoveragePercentage: ins.defaultCoveragePercentage,
          notes: ins.notes,
          isActive: true,
        },
      });
      console.log(`   🏥 Insurance Provider: ${ins.name} | Default Coverage: ${ins.defaultCoveragePercentage}%`);
    }
  }

  // -------------------------------------------------------------
  // 7. Discounts / Promotions Seed
  // -------------------------------------------------------------
  console.log('\n7️⃣  Seeding Promotional Discounts...');
  const discountsData = [
    { code: 'SUMMER10', name: 'Summer Health Promo 10%', type: 'PERCENTAGE' as const, value: 10.0, startDate: new Date('2026-06-01'), endDate: new Date('2026-09-30'), isActive: true },
    { code: 'SENIOR5', name: 'Senior Citizens Privilege 5%', type: 'PERCENTAGE' as const, value: 5.0, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), isActive: true },
  ];

  for (const d of discountsData) {
    const existing = await prisma.discount.findFirst({ where: { code: d.code } });
    if (!existing) {
      await prisma.discount.create({
        data: {
          code: d.code,
          name: d.name,
          type: d.type,
          value: d.value,
          startDate: d.startDate,
          endDate: d.endDate,
          isActive: d.isActive,
        },
      });
      console.log(`   🏷️ Discount: ${d.name} (${d.value}%) [Code: ${d.code}]`);
    }
  }

  // -------------------------------------------------------------
  // 8. Categories Seed
  // -------------------------------------------------------------
  console.log('\n8️⃣  Seeding Medicine Categories...');
  const categoriesData = [
    { name: 'Antibiotics & Anti-infectives (مضادات حيوية)', description: 'Broad and narrow spectrum antibiotics' },
    { name: 'Analgesics & Antipyretics (مسكنات وخافضات حرارة)', description: 'Pain management and fever reduction drugs' },
    { name: 'Cardiovascular & Hypertension (أدوية القلب والضغط)', description: 'Blood pressure, cardiac, and cholesterol medications' },
    { name: 'Gastrointestinal & Digestion (أدوية الجهاز الهضمي)', description: 'Antacids, proton pump inhibitors, and digestive aids' },
    { name: 'Vitamins & Supplements (فيتامينات ومكملات)', description: 'Daily multivitamins, minerals, and nutrition' },
    { name: 'Diabetes Care (أدوية السكري)', description: 'Oral hypoglycemic agents and insulin care' },
    { name: 'Dermatology & Skincare (العناية بالبشرة والجلد)', description: 'Topical ointments, gels, and therapeutic skincare' },
    { name: 'Medical Devices & First Aid (مستلزمات وإسعافات)', description: 'Bandages, antiseptics, syringes, and monitoring devices' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    let category = await prisma.category.findUnique({ where: { name: cat.name } });
    if (!category) {
      category = await prisma.category.create({ data: cat });
    }
    categoryMap.set(cat.name, category.id);
  }
  console.log(`   ✅ Seeded ${categoriesData.length} Medicine Categories.`);

  // -------------------------------------------------------------
  // 9. Products & Batches Seed (with FEFO & Expiry Horizons)
  // -------------------------------------------------------------
  console.log('\n9️⃣  Seeding Medicines, Batches & FEFO Inventory...');
  const productsData = [
    {
      name: 'Augmentin 1g Film-Coated Tablets',
      barcode: '6221000111001',
      scientificName: 'Amoxicillin 875mg + Clavulanic Acid 125mg',
      description: '14 Film-Coated Tablets (GlaxoSmithKline)',
      categoryName: 'Antibiotics & Anti-infectives (مضادات حيوية)',
      purchasePrice: 95.0,
      sellingPrice: 130.0,
      minimumStock: 15,
      batches: [
        { batchNumber: 'AUG-2026-F1', expiryMonths: 18, quantity: 45 },
        { batchNumber: 'AUG-2026-F2', expiryMonths: 24, quantity: 30 },
      ],
    },
    {
      name: 'Panadol Extra 500mg Tablets',
      barcode: '6221000222002',
      scientificName: 'Paracetamol 500mg + Caffeine 65mg',
      description: '24 Caplets for strong pain relief (Haleon)',
      categoryName: 'Analgesics & Antipyretics (مسكنات وخافضات حرارة)',
      purchasePrice: 28.0,
      sellingPrice: 42.0,
      minimumStock: 25,
      batches: [
        { batchNumber: 'PAN-FEFO-NEAR', expiryDays: 25, quantity: 20 }, // Near Expiry (< 30 days)
        { batchNumber: 'PAN-FEFO-FRESH', expiryMonths: 14, quantity: 100 }, // Normal
      ],
    },
    {
      name: 'Concor 5mg Tablets',
      barcode: '6221000333003',
      scientificName: 'Bisoprolol Fumarate 5mg',
      description: '30 Tablets for hypertension & heart protection (Merck)',
      categoryName: 'Cardiovascular & Hypertension (أدوية القلب والضغط)',
      purchasePrice: 45.0,
      sellingPrice: 65.0,
      minimumStock: 20,
      batches: [
        { batchNumber: 'CON-LOW-01', expiryMonths: 12, quantity: 6 }, // Low Stock (6 <= 20)
      ],
    },
    {
      name: 'Antinal 200mg Capsules',
      barcode: '6221000444004',
      scientificName: 'Nifuroxazide 200mg',
      description: '24 Capsules intestinal antiseptic (Amoun)',
      categoryName: 'Gastrointestinal & Digestion (أدوية الجهاز الهضمي)',
      purchasePrice: 20.0,
      sellingPrice: 32.0,
      minimumStock: 15,
      batches: [
        { batchNumber: 'ANT-2026-B1', expiryMonths: 16, quantity: 60 },
      ],
    },
    {
      name: 'Controloc 40mg Gastro-Resistant Tablets',
      barcode: '6221000555005',
      scientificName: 'Pantoprazole 40mg',
      description: '14 Tablets for GERD and stomach ulcers (Takeda)',
      categoryName: 'Gastrointestinal & Digestion (أدوية الجهاز الهضمي)',
      purchasePrice: 70.0,
      sellingPrice: 105.0,
      minimumStock: 10,
      batches: [
        { batchNumber: 'CTRL-2026-A1', expiryMonths: 20, quantity: 40 },
      ],
    },
    {
      name: 'Glucophage 1000mg XR Tablets',
      barcode: '6221000666006',
      scientificName: 'Metformin Hydrochloride 1000mg',
      description: '30 Extended Release Tablets (Merck)',
      categoryName: 'Diabetes Care (أدوية السكري)',
      purchasePrice: 35.0,
      sellingPrice: 52.0,
      minimumStock: 20,
      batches: [
        { batchNumber: 'GLU-2026-X1', expiryMonths: 15, quantity: 50 },
      ],
    },
    {
      name: 'C-Retard 500mg Sustained Release Capsules',
      barcode: '6221000777007',
      scientificName: 'Ascorbic Acid 500mg',
      description: '10 Sustained Release Capsules for immunity (Hikma)',
      categoryName: 'Vitamins & Supplements (فيتامينات ومكملات)',
      purchasePrice: 16.0,
      sellingPrice: 26.0,
      minimumStock: 30,
      batches: [
        { batchNumber: 'CRT-2026-V1', expiryMonths: 10, quantity: 80 },
      ],
    },
    {
      name: 'Betadine Antiseptic Solution 120ml',
      barcode: '6221000888008',
      scientificName: 'Povidone Iodine 10%',
      description: '120ml Topical Microbicidal Solution (Mundipharma)',
      categoryName: 'Medical Devices & First Aid (مستلزمات وإسعافات)',
      purchasePrice: 32.0,
      sellingPrice: 48.0,
      minimumStock: 12,
      batches: [
        { batchNumber: 'BET-2026-S1', expiryMonths: 22, quantity: 35 },
      ],
    },
    {
      name: 'Omega 3 Plus Soft Gelatin Capsules',
      barcode: '6221000999009',
      scientificName: 'Fish Oil 1000mg + Wheat Germ Oil 100mg',
      description: '30 Softgels for cholesterol & brain health (SEDICO)',
      categoryName: 'Vitamins & Supplements (فيتامينات ومكملات)',
      purchasePrice: 65.0,
      sellingPrice: 95.0,
      minimumStock: 15,
      batches: [
        { batchNumber: 'OMG-2026-P1', expiryMonths: 18, quantity: 40 },
      ],
    },
    {
      name: 'Voltaren Emulgel 50g',
      barcode: '6221001000010',
      scientificName: 'Diclofenac Diethylamine 1.16%',
      description: '50g Gel for joint & muscle pain (Novartis)',
      categoryName: 'Dermatology & Skincare (العناية بالبشرة والجلد)',
      purchasePrice: 38.0,
      sellingPrice: 58.0,
      minimumStock: 15,
      batches: [
        { batchNumber: 'VOLT-2026-G1', expiryMonths: 16, quantity: 50 },
      ],
    },
  ];

  const adminUser = userMap.get('PLATFORM_MANAGER');

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categoryName);
    if (!categoryId) continue;

    let product = await prisma.product.findUnique({ where: { barcode: prod.barcode } });
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: prod.name,
          barcode: prod.barcode,
          scientificName: prod.scientificName,
          description: prod.description,
          categoryId,
          purchasePrice: prod.purchasePrice,
          sellingPrice: prod.sellingPrice,
          minimumStock: prod.minimumStock,
          isActive: true,
        },
      });
      console.log(`   💊 Product: ${product.name} | Price: ${product.sellingPrice} EGP | Min: ${product.minimumStock}`);
    }

    // Seed Batches
    for (const b of prod.batches) {
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
              purchasePrice: prod.purchasePrice,
              sellingPrice: prod.sellingPrice,
            },
          });

          if (b.quantity > 0) {
            await tx.inventoryTransaction.create({
              data: {
                productId: product.id,
                batchId: createdBatch.id,
                quantity: b.quantity,
                type: 'MANUAL_IN',
                reason: `Initial stock balance for batch ${b.batchNumber}`,
                createdById: adminUser?.id || null,
              },
            });
          }
        });
        console.log(`      📦 Batch: ${b.batchNumber} | Qty: ${b.quantity} | Exp: ${expiryDate.toISOString().split('T')[0]}`);
      }
    }
  }

  // -------------------------------------------------------------
  // 10. Sample Operating Expenses Seed
  // -------------------------------------------------------------
  console.log('\n🔟 Seeding Sample Operating Expenses...');
  const expensesData = [
    { description: 'Monthly Pharmacy Premise Rent', amount: 15000.0, category: 'RENT' as const, paymentMethod: 'WALLET' as const, expenseDate: new Date('2026-08-01') },
    { description: 'Monthly Commercial Electricity Bill', amount: 3200.0, category: 'ELECTRICITY' as const, paymentMethod: 'CASH' as const, expenseDate: new Date('2026-08-05') },
    { description: 'Thermal Paper Rolls & Packaging Bags', amount: 1400.0, category: 'SUPPLIES' as const, paymentMethod: 'CASH' as const, expenseDate: new Date('2026-08-10') },
  ];

  for (const exp of expensesData) {
    const existing = await prisma.expense.findFirst({ where: { description: exp.description } });
    if (!existing) {
      await prisma.expense.create({
        data: {
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          paymentMethod: exp.paymentMethod,
          expenseDate: exp.expenseDate,
          createdById: adminUser?.id || null,
        },
      });
      console.log(`   💸 Expense: ${exp.description} (${exp.amount} EGP) [${exp.category}]`);
    }
  }

  // -------------------------------------------------------------
  // 11. Initial System Notifications Seed
  // -------------------------------------------------------------
  console.log('\n1️⃣1️⃣ Seeding Operational Notifications...');
  const notificationsData = [
    {
      userId: adminUser?.id || '',
      title: 'Welcome to Pharmacy POS Master System',
      message: 'The Pharmacy POS Backend engine has been fully bootstrapped and verified.',
      type: 'SYSTEM_ALERT' as const,
    },
    {
      userId: adminUser?.id || '',
      title: 'Low Stock Alert: Concor 5mg',
      message: 'Product Concor 5mg currently has 6 units remaining (Below threshold of 20).',
      type: 'LOW_STOCK' as const,
    },
    {
      userId: adminUser?.id || '',
      title: 'Expiry Horizon Warning: Panadol Extra',
      message: 'Batch PAN-FEFO-NEAR is expiring within 25 days. Prioritize FEFO dispensing.',
      type: 'EXPIRY_ALERT' as const,
    },
  ];

  if (adminUser) {
    for (const notif of notificationsData) {
      await prisma.notification.create({
        data: {
          userId: notif.userId,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          isRead: false,
        },
      });
    }
    console.log(`   🔔 Seeded ${notificationsData.length} Initial System Notifications.`);
  }

  console.log('\n================================================================');
  console.log('🎉 COMPREHENSIVE PHARMACY MASTER SEED COMPLETED SUCCESSFULLY!');
  console.log('================================================================\n');
}

seed()
  .catch((e) => {
    console.error('❌ Master Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
