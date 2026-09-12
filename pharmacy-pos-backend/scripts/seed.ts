import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.util.js';

async function seed() {
  console.log('================================================================');
  console.log('🌱 Starting Comprehensive Multi-Branch Pharmacy POS Master Seed');
  console.log('================================================================\n');

  const UNIFIED_PASSWORD = '12345678';
  const sharedPasswordHash = await hashPassword(UNIFIED_PASSWORD);

  // -------------------------------------------------------------
  // 1. System Settings Seed
  // -------------------------------------------------------------
  console.log('1️⃣  Seeding System Settings...');
  const systemSettings = [
    { key: 'pharmacy_name', value: 'سلسلة صيدليات الأمل الحديثة (Al-Amal Modern Pharmacies)', description: 'Official Pharmacy Name', isPublic: true },
    { key: 'pharmacy_phone', value: '+201012345678', description: 'Official Hotline & WhatsApp Contact', isPublic: true },
    { key: 'pharmacy_address', value: '15 El-Tahrir Street, Dokki, Giza, Egypt', description: 'Physical Headquarter Address', isPublic: true },
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
  // 3. Branches Seed (3 Multi-Location Strategic Branches)
  // -------------------------------------------------------------
  console.log('\n3️⃣  Seeding Strategic Pharmacy Branches...');
  const branchesData = [
    {
      code: 'BR-01',
      name: 'الفرع الرئيسي - الدقي',
      address: '15 شارع التحرير، ميدان الدقي، الجيزة',
      phone: '0237612345',
      isMain: true,
      isActive: true,
    },
    {
      code: 'BR-02',
      name: 'فرع المعادي - شارع النصر',
      address: '24 شارع النصر، المعادي الجديدة، القاهرة',
      phone: '0225198765',
      isMain: false,
      isActive: true,
    },
    {
      code: 'BR-03',
      name: 'فرع مدينة نصر - عباس العقاد',
      address: '88 شارع عباس العقاد، مدينة نصر، القاهرة',
      phone: '0222712345',
      isMain: false,
      isActive: true,
    },
  ];

  const branchMap = new Map<string, any>();
  for (const b of branchesData) {
    const branch = await prisma.branch.upsert({
      where: { code: b.code },
      create: b,
      update: { name: b.name, address: b.address, phone: b.phone, isMain: b.isMain, isActive: b.isActive },
    });
    branchMap.set(b.code, branch);
    console.log(`   🏢 Branch [${b.code}]: ${b.name} (${b.isMain ? 'Main Headquarter' : 'Branch'})`);
  }

  const branchDokki = branchMap.get('BR-01')!;
  const branchMaadi = branchMap.get('BR-02')!;
  const branchNasr = branchMap.get('BR-03')!;

  // -------------------------------------------------------------
  // 4. Staff Users Seed per Branch (All Passwords: '12345678')
  // -------------------------------------------------------------
  console.log('\n4️⃣  Seeding Dedicated Staff Users per Branch...');
  const usersData = [
    // --- Executive Leadership ---
    {
      name: 'د. طارق المدير العام (Platform Admin)',
      phone: '01012345678',
      email: 'admin@pharmacy.local',
      role: 'PLATFORM_MANAGER' as const,
      branchId: branchDokki.id,
      alias: 'SUPER_ADMIN',
    },
    {
      name: 'د. ربيع مدير عام السلسلة (Chain GM)',
      phone: '01098765432',
      email: 'manager@pharmacy.local',
      role: 'PHARMACY_MANAGER' as const,
      branchId: branchDokki.id,
      alias: 'PHARMACY_MANAGER',
    },

    // --- Branch 1: Dokki (الفرع الرئيسي) ---
    {
      name: 'د. حسام مدير فرع الدقي',
      phone: '01011110001',
      email: 'dokki.manager@pharmacy.local',
      role: 'BRANCH_MANAGER' as const,
      branchId: branchDokki.id,
      alias: 'DOKKI_MANAGER',
    },
    {
      name: 'د. أحمد صيدلي الدقي',
      phone: '01111110001',
      email: 'dokki.pharm@pharmacy.local',
      role: 'PHARMACIST' as const,
      branchId: branchDokki.id,
      alias: 'DOKKI_PHARMACIST',
    },
    {
      name: 'أ. مصطفى محاسب الدقي',
      phone: '01211110001',
      email: 'dokki.acc@pharmacy.local',
      role: 'ACCOUNTANT' as const,
      branchId: branchDokki.id,
      alias: 'DOKKI_ACCOUNTANT',
    },

    // --- Branch 2: Maadi (فرع المعادي) ---
    {
      name: 'د. خالد مدير فرع المعادي',
      phone: '01055554444',
      email: 'maadi.manager@pharmacy.local',
      role: 'BRANCH_MANAGER' as const,
      branchId: branchMaadi.id,
      alias: 'MAADI_MANAGER',
    },
    {
      name: 'د. مريم صيدلي المعادي',
      phone: '01123456789',
      email: 'maadi.pharm@pharmacy.local',
      role: 'PHARMACIST' as const,
      branchId: branchMaadi.id,
      alias: 'MAADI_PHARMACIST',
    },
    {
      name: 'أ. هاني محاسب المعادي',
      phone: '01223456789',
      email: 'maadi.acc@pharmacy.local',
      role: 'ACCOUNTANT' as const,
      branchId: branchMaadi.id,
      alias: 'MAADI_ACCOUNTANT',
    },

    // --- Branch 3: Nasr City (فرع مدينة نصر) ---
    {
      name: 'د. عمرو مدير فرع مدينة نصر',
      phone: '01033330003',
      email: 'nasr.manager@pharmacy.local',
      role: 'BRANCH_MANAGER' as const,
      branchId: branchNasr.id,
      alias: 'NASR_MANAGER',
    },
    {
      name: 'د. نور صيدلي مدينة نصر',
      phone: '01133330003',
      email: 'nasr.pharm@pharmacy.local',
      role: 'PHARMACIST' as const,
      branchId: branchNasr.id,
      alias: 'NASR_PHARMACIST',
    },
    {
      name: 'أ. كريم محاسب مدينة نصر',
      phone: '01233330003',
      email: 'nasr.acc@pharmacy.local',
      role: 'ACCOUNTANT' as const,
      branchId: branchNasr.id,
      alias: 'NASR_ACCOUNTANT',
    },
  ];

  const userMap = new Map<string, any>();
  for (const u of usersData) {
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: u.phone }, { email: u.email }],
      },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: u.name,
          phone: u.phone,
          email: u.email,
          role: u.role,
          branchId: u.branchId,
          passwordHash: sharedPasswordHash,
          isActive: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: u.name,
          phone: u.phone,
          email: u.email,
          passwordHash: sharedPasswordHash,
          role: u.role,
          branchId: u.branchId,
          isActive: true,
        },
      });
    }

    userMap.set(u.alias, user);
    console.log(`   👤 User [${u.role}]: ${u.name} | Phone: ${u.phone} | Pass: 12345678`);
  }

  // -------------------------------------------------------------
  // 5. Customers & Loyalty Accounts Seed
  // -------------------------------------------------------------
  console.log('\n5️⃣  Seeding Customers & Loyalty Accounts...');
  const customersData = [
    {
      name: 'محمد علي الشريف (VIP Gold)',
      phone: '+201011112222',
      email: 'mohamed.ali@gmail.com',
      tier: 'GOLD',
      points: 1850,
      address: 'الدقي - شارع مصدق',
    },
    {
      name: 'كريم محمود السعدني (Silver)',
      phone: '+201033334444',
      email: 'kareem.m@yahoo.com',
      tier: 'SILVER',
      points: 620,
      address: 'المعادي - دجلة',
    },
    {
      name: 'نور الدين مصطفى (Standard)',
      phone: '+201055556666',
      email: 'nour.eldin@outlook.com',
      tier: 'BRONZE',
      points: 120,
      address: 'مدينة نصر - الحي السابع',
    },
    {
      name: 'عميل نقدي سريع (Walk-in)',
      phone: '+201000000001',
      email: null,
      tier: 'BRONZE',
      points: 0,
      address: 'عميل نقدي مباشر',
    },
  ];

  const customerMap = new Map<string, any>();
  for (const c of customersData) {
    let customer = await prisma.customer.findFirst({ where: { phone: c.phone } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: c.name,
          phone: c.phone,
          email: c.email,
          address: c.address,
          tierId: tierMap.get(c.tier) || null,
          isActive: true,
        },
      });
    }

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
    customerMap.set(c.phone, customer);
    console.log(`   💳 Customer: ${c.name} | Phone: ${c.phone} | Tier: ${c.tier}`);
  }

  // -------------------------------------------------------------
  // 6. Suppliers Seed
  // -------------------------------------------------------------
  console.log('\n6️⃣  Seeding Pharmaceutical Suppliers...');
  const suppliersData = [
    {
      name: 'ابن سينا فارما (Ibnsina Pharma)',
      phone: '+20224156789',
      email: 'orders@ibnsina-pharma.com',
      address: 'Nasr City, Cairo',
      taxNumber: '100-200-300',
      notes: 'Contact: Eng. Hesham Talaat',
    },
    {
      name: 'الشركة المتحدة للصيادلة (UCP)',
      phone: '+20227945678',
      email: 'supply@ucp.com.eg',
      address: 'Mohandessin, Giza',
      taxNumber: '200-300-400',
      notes: 'Contact: Dr. Magdy Yacoub',
    },
    {
      name: 'رامكو فارم للتوزيع (Ramco Pharm)',
      phone: '+20233456789',
      email: 'orders@ramcopharm.com',
      address: '6th of October City',
      taxNumber: '300-400-500',
      notes: 'Contact: Mr. Tamer Hosny',
    },
  ];

  for (const s of suppliersData) {
    const supplier = await prisma.supplier.findFirst({ where: { phone: s.phone } });
    if (!supplier) {
      await prisma.supplier.create({ data: s });
      console.log(`   🏭 Supplier: ${s.name}`);
    }
  }

  // -------------------------------------------------------------
  // 7. Categories Seed
  // -------------------------------------------------------------
  console.log('\n7️⃣  Seeding Medicine Categories...');
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
  // 8. Products & Distributed Batches Seed per Branch
  // -------------------------------------------------------------
  console.log('\n8️⃣  Seeding Products & Multi-Branch Batches...');
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'AUG-DOK-01', expiryMonths: 18, quantity: 45 },
        { branchId: branchMaadi.id, batchNumber: 'AUG-MAA-01', expiryMonths: 16, quantity: 25 },
        { branchId: branchNasr.id, batchNumber: 'AUG-NAS-01', expiryMonths: 20, quantity: 35 },
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'PAN-DOK-FEFO', expiryDays: 22, quantity: 15 }, // Near Expiry
        { branchId: branchDokki.id, batchNumber: 'PAN-DOK-MAIN', expiryMonths: 14, quantity: 80 },
        { branchId: branchMaadi.id, batchNumber: 'PAN-MAA-01', expiryMonths: 15, quantity: 40 },
        { branchId: branchNasr.id, batchNumber: 'PAN-NAS-01', expiryMonths: 16, quantity: 60 },
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'CON-DOK-01', expiryMonths: 14, quantity: 40 },
        { branchId: branchMaadi.id, batchNumber: 'CON-MAA-LOW', expiryMonths: 10, quantity: 4 }, // Low Stock (< 20)
        { branchId: branchNasr.id, batchNumber: 'CON-NAS-EXCESS', expiryMonths: 18, quantity: 85 }, // High stock for transfer
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'ANT-DOK-01', expiryMonths: 16, quantity: 50 },
        { branchId: branchMaadi.id, batchNumber: 'ANT-MAA-01', expiryMonths: 14, quantity: 30 },
        { branchId: branchNasr.id, batchNumber: 'ANT-NAS-01', expiryMonths: 15, quantity: 45 },
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'CTRL-DOK-01', expiryMonths: 20, quantity: 35 },
        { branchId: branchMaadi.id, batchNumber: 'CTRL-MAA-01', expiryMonths: 18, quantity: 20 },
        { branchId: branchNasr.id, batchNumber: 'CTRL-NAS-01', expiryMonths: 22, quantity: 30 },
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'GLU-DOK-01', expiryMonths: 15, quantity: 60 },
        { branchId: branchMaadi.id, batchNumber: 'GLU-MAA-01', expiryMonths: 14, quantity: 35 },
        { branchId: branchNasr.id, batchNumber: 'GLU-NAS-01', expiryMonths: 16, quantity: 45 },
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'CRT-DOK-01', expiryMonths: 10, quantity: 90 },
        { branchId: branchMaadi.id, batchNumber: 'CRT-MAA-01', expiryMonths: 12, quantity: 40 },
        { branchId: branchNasr.id, batchNumber: 'CRT-NAS-EXCESS', expiryMonths: 14, quantity: 120 }, // High stock
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'BET-DOK-01', expiryMonths: 22, quantity: 30 },
        { branchId: branchMaadi.id, batchNumber: 'BET-MAA-01', expiryMonths: 20, quantity: 20 },
        { branchId: branchNasr.id, batchNumber: 'BET-NAS-01', expiryMonths: 24, quantity: 25 },
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'OMG-DOK-01', expiryMonths: 18, quantity: 50 },
        { branchId: branchMaadi.id, batchNumber: 'OMG-MAA-LOW', expiryMonths: 12, quantity: 3 }, // Low Stock (< 15)
        { branchId: branchNasr.id, batchNumber: 'OMG-NAS-01', expiryMonths: 16, quantity: 40 },
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
      branchBatches: [
        { branchId: branchDokki.id, batchNumber: 'VOLT-DOK-01', expiryMonths: 16, quantity: 40 },
        { branchId: branchMaadi.id, batchNumber: 'VOLT-MAA-01', expiryMonths: 14, quantity: 25 },
        { branchId: branchNasr.id, batchNumber: 'VOLT-NAS-01', expiryMonths: 18, quantity: 35 },
      ],
    },
  ];

  const adminUser = userMap.get('SUPER_ADMIN');
  const productMap = new Map<string, any>();
  const batchMap = new Map<string, any>();

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
    }
    productMap.set(prod.barcode, product);

    // Seed branch batches
    for (const b of prod.branchBatches) {
      let batch = await prisma.batch.findUnique({
        where: {
          productId_batchNumber: {
            productId: product.id,
            batchNumber: b.batchNumber,
          },
        },
      });

      const expiryDate = new Date();
      if ((b as any).expiryDays !== undefined) {
        expiryDate.setDate(expiryDate.getDate() + (b as any).expiryDays);
      } else if (b.expiryMonths !== undefined) {
        expiryDate.setMonth(expiryDate.getMonth() + b.expiryMonths);
      }

      if (!batch) {
        batch = await prisma.batch.create({
          data: {
            productId: product.id,
            batchNumber: b.batchNumber,
            expiryDate,
            quantity: b.quantity,
            purchasePrice: prod.purchasePrice,
            sellingPrice: prod.sellingPrice,
            branchId: b.branchId,
          },
        });

        await prisma.inventoryTransaction.create({
          data: {
            productId: product.id,
            batchId: batch.id,
            quantity: b.quantity,
            type: 'MANUAL_IN',
            reason: `Initial stock allocation for ${b.batchNumber}`,
            createdById: adminUser?.id || null,
            branchId: b.branchId,
          },
        });
      } else {
        // Update batch branchId and quantity to ensure proper sync
        batch = await prisma.batch.update({
          where: { id: batch.id },
          data: {
            branchId: b.branchId,
            quantity: b.quantity,
          },
        });
      }
      batchMap.set(b.batchNumber, batch);
    }
  }
  console.log(`   ✅ Seeded ${productsData.length} Products with distributed multi-branch batches.`);

  // -------------------------------------------------------------
  // 9. Realistic Sales Invoices per Branch
  // -------------------------------------------------------------
  console.log('\n9️⃣  Seeding Realistic Sales Invoices per Branch...');
  const dokkiPharm = userMap.get('DOKKI_PHARMACIST')!;
  const maadiPharm = userMap.get('MAADI_PHARMACIST')!;
  const nasrPharm = userMap.get('NASR_PHARMACIST')!;

  const custVip = customerMap.get('+201011112222')!;
  const custSilver = customerMap.get('+201033334444')!;
  const custStandard = customerMap.get('+201055556666')!;

  const salesData = [
    // Branch 1: Dokki Sales
    {
      invoiceNumber: 'INV-DOK-001',
      branchId: branchDokki.id,
      userId: dokkiPharm.id,
      customerId: custVip.id,
      subtotal: 172.0,
      discount: 10.32, // 6% VIP Gold discount
      discountReason: 'GOLD_TIER_LOYALTY',
      total: 161.68,
      paidAmount: 161.68,
      status: 'COMPLETED' as const,
      paymentMethod: 'VISA' as const,
      items: [
        { barcode: '6221000111001', batchNumber: 'AUG-DOK-01', quantity: 1, unitPrice: 130.0, total: 130.0 },
        { barcode: '6221000222002', batchNumber: 'PAN-DOK-FEFO', quantity: 1, unitPrice: 42.0, total: 42.0 },
      ],
    },
    {
      invoiceNumber: 'INV-DOK-002',
      branchId: branchDokki.id,
      userId: dokkiPharm.id,
      customerId: custStandard.id,
      subtotal: 117.0,
      discount: 0.0,
      total: 117.0,
      paidAmount: 117.0,
      status: 'COMPLETED' as const,
      paymentMethod: 'CASH' as const,
      items: [
        { barcode: '6221000333003', batchNumber: 'CON-DOK-01', quantity: 1, unitPrice: 65.0, total: 65.0 },
        { barcode: '6221000666006', batchNumber: 'GLU-DOK-01', quantity: 1, unitPrice: 52.0, total: 52.0 },
      ],
    },

    // Branch 2: Maadi Sales
    {
      invoiceNumber: 'INV-MAA-001',
      branchId: branchMaadi.id,
      userId: maadiPharm.id,
      customerId: custSilver.id,
      subtotal: 74.0,
      discount: 2.22, // 3% Silver
      total: 71.78,
      paidAmount: 71.78,
      status: 'COMPLETED' as const,
      paymentMethod: 'CASH' as const,
      items: [
        { barcode: '6221000222002', batchNumber: 'PAN-MAA-01', quantity: 1, unitPrice: 42.0, total: 42.0 },
        { barcode: '6221000444004', batchNumber: 'ANT-MAA-01', quantity: 1, unitPrice: 32.0, total: 32.0 },
      ],
    },
    {
      invoiceNumber: 'INV-MAA-002',
      branchId: branchMaadi.id,
      userId: maadiPharm.id,
      customerId: null,
      subtotal: 163.0,
      discount: 0.0,
      total: 163.0,
      paidAmount: 163.0,
      status: 'COMPLETED' as const,
      paymentMethod: 'WALLET' as const,
      items: [
        { barcode: '6221000555005', batchNumber: 'CTRL-MAA-01', quantity: 1, unitPrice: 105.0, total: 105.0 },
        { barcode: '6221001000010', batchNumber: 'VOLT-MAA-01', quantity: 1, unitPrice: 58.0, total: 58.0 },
      ],
    },

    // Branch 3: Nasr City Sales
    {
      invoiceNumber: 'INV-NAS-001',
      branchId: branchNasr.id,
      userId: nasrPharm.id,
      customerId: custVip.id,
      subtotal: 178.0,
      discount: 10.68,
      total: 167.32,
      paidAmount: 167.32,
      status: 'COMPLETED' as const,
      paymentMethod: 'VISA' as const,
      items: [
        { barcode: '6221000111001', batchNumber: 'AUG-NAS-01', quantity: 1, unitPrice: 130.0, total: 130.0 },
        { barcode: '6221000888008', batchNumber: 'BET-NAS-01', quantity: 1, unitPrice: 48.0, total: 48.0 },
      ],
    },
  ];

  for (const s of salesData) {
    const existing = await prisma.sale.findUnique({ where: { invoiceNumber: s.invoiceNumber } });
    if (!existing) {
      const sale = await prisma.sale.create({
        data: {
          invoiceNumber: s.invoiceNumber,
          branchId: s.branchId,
          userId: s.userId,
          customerId: s.customerId,
          subtotal: s.subtotal,
          discount: s.discount,
          discountReason: s.discountReason || null,
          total: s.total,
          paidAmount: s.paidAmount,
          remainingAmount: 0.0,
          status: s.status,
          payments: {
            create: {
              amount: s.total,
              paymentMethod: s.paymentMethod,
              createdById: s.userId,
            },
          },
          items: {
            create: s.items.map((item) => {
              const prod = productMap.get(item.barcode)!;
              const bat = batchMap.get(item.batchNumber);
              return {
                productId: prod.id,
                batchId: bat ? bat.id : null,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              };
            }),
          },
        },
      });
      console.log(`   🧾 Sale: [${s.invoiceNumber}] Total: ${s.total} EGP | Branch: ${s.branchId.slice(0, 8)}`);
    }
  }

  // -------------------------------------------------------------
  // 10. Branch Operating Expenses Seed
  // -------------------------------------------------------------
  console.log('\n🔟 Seeding Branch Operating Expenses...');
  const dokkiAcc = userMap.get('DOKKI_ACCOUNTANT')!;
  const maadiAcc = userMap.get('MAADI_ACCOUNTANT')!;
  const nasrAcc = userMap.get('NASR_ACCOUNTANT')!;

  const expensesData = [
    // Dokki Expenses
    { description: 'إيجار مقر الفرع الرئيسي - الدقي لشهر أغسطس', amount: 18000.0, category: 'RENT' as const, paymentMethod: 'WALLET' as const, createdById: dokkiAcc.id },
    { description: 'فاتورة الكهرباء التجارية - فرع الدقي', amount: 3500.0, category: 'ELECTRICITY' as const, paymentMethod: 'CASH' as const, createdById: dokkiAcc.id },
    { description: 'رولات فواتير حرارية وأكياس تغليف - الدقي', amount: 1200.0, category: 'SUPPLIES' as const, paymentMethod: 'CASH' as const, createdById: dokkiAcc.id },

    // Maadi Expenses
    { description: 'إيجار صيدلية فرع المعادي - شارع النصر', amount: 14000.0, category: 'RENT' as const, paymentMethod: 'WALLET' as const, createdById: maadiAcc.id },
    { description: 'صيانة دورية للتكييف المركزي - فرع المعادي', amount: 1800.0, category: 'MAINTENANCE' as const, paymentMethod: 'CASH' as const, createdById: maadiAcc.id },
    { description: 'فاتورة كهرباء فرع المعادي', amount: 2800.0, category: 'ELECTRICITY' as const, paymentMethod: 'CASH' as const, createdById: maadiAcc.id },

    // Nasr City Expenses
    { description: 'إيجار فرع مدينة نصر - شارع عباس العقاد', amount: 16000.0, category: 'RENT' as const, paymentMethod: 'WALLET' as const, createdById: nasrAcc.id },
    { description: 'مستلزمات نظافة وأكياس طبية - فرع مدينة نصر', amount: 1500.0, category: 'SUPPLIES' as const, paymentMethod: 'CASH' as const, createdById: nasrAcc.id },
    { description: 'فاتورة الكهرباء فرع مدينة نصر', amount: 3100.0, category: 'ELECTRICITY' as const, paymentMethod: 'CASH' as const, createdById: nasrAcc.id },
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
          createdById: exp.createdById,
        },
      });
      console.log(`   💸 Expense: ${exp.description} (${exp.amount} EGP)`);
    }
  }

  // -------------------------------------------------------------
  // 11. Inter-Branch Transfer Requests (Simulating the 4 key stages)
  // -------------------------------------------------------------
  console.log('\n1️⃣1️⃣ Seeding Inter-Branch Stock Transfers (Transfer Requests)...');
  const pharmacyManager = userMap.get('PHARMACY_MANAGER')!;
  const dokkiManager = userMap.get('DOKKI_MANAGER')!;
  const maadiManager = userMap.get('MAADI_MANAGER')!;
  const nasrManager = userMap.get('NASR_MANAGER')!;

  const transfersData = [
    // 1. COMPLETED: Dokki -> Maadi
    {
      transferNumber: 'TR-2026-001',
      fromBranchId: branchDokki.id,
      toBranchId: branchMaadi.id,
      status: 'COMPLETED' as const,
      requestedById: maadiManager.id,
      approvedById: pharmacyManager.id,
      dispatchedById: dokkiPharm.id,
      receivedById: maadiPharm.id,
      notes: 'تحويل دوري لتعويض نواقص فرع المعادي (تم الاستلام بنجاح)',
      requestedAt: new Date(Date.now() - 3 * 86400000),
      approvedAt: new Date(Date.now() - 2 * 86400000),
      dispatchedAt: new Date(Date.now() - 1 * 86400000),
      receivedAt: new Date(),
      completedAt: new Date(),
      items: [
        { barcode: '6221000111001', batchNumber: 'AUG-DOK-01', quantity: 10, unitCost: 95.0, notes: 'أوجمنتين 1 جم' },
        { barcode: '6221000222002', batchNumber: 'PAN-DOK-MAIN', quantity: 20, unitCost: 28.0, notes: 'بنادول إكسترا' },
      ],
    },
    // 2. IN_TRANSIT: Nasr City -> Maadi (Ready to test 'Receive / استلام' in Maadi)
    {
      transferNumber: 'TR-2026-002',
      fromBranchId: branchNasr.id,
      toBranchId: branchMaadi.id,
      status: 'IN_TRANSIT' as const,
      requestedById: maadiManager.id,
      approvedById: pharmacyManager.id,
      dispatchedById: nasrPharm.id,
      notes: 'شحنة كونكور عاجلة في الطريق لفرع المعادي (جاهزة للتأكيد والاستلام)',
      requestedAt: new Date(Date.now() - 1 * 86400000),
      approvedAt: new Date(Date.now() - 12 * 3600000),
      dispatchedAt: new Date(Date.now() - 2 * 3600000),
      items: [
        { barcode: '6221000333003', batchNumber: 'CON-NAS-EXCESS', quantity: 25, unitCost: 45.0, notes: 'كونكور 5 مجم لنقص المخزون' },
      ],
    },
    // 3. APPROVED: Nasr City -> Dokki (Ready to test 'Dispatch / إرسال الشحنة' in Nasr City)
    {
      transferNumber: 'TR-2026-003',
      fromBranchId: branchNasr.id,
      toBranchId: branchDokki.id,
      status: 'APPROVED' as const,
      requestedById: dokkiManager.id,
      approvedById: pharmacyManager.id,
      notes: 'طلب تحويل معتمد من الإدارة - بانتظار تجهيز وإرسال الشحنة من مدينة نصر',
      requestedAt: new Date(Date.now() - 6 * 3600000),
      approvedAt: new Date(Date.now() - 1 * 3600000),
      items: [
        { barcode: '6221000777007', batchNumber: 'CRT-NAS-EXCESS', quantity: 30, unitCost: 16.0, notes: 'سي ريتارد 500' },
      ],
    },
    // 4. PENDING: Dokki -> Nasr City (Ready to test 'Approve / موافقة' in Dokki / Pharmacy Manager)
    {
      transferNumber: 'TR-2026-004',
      fromBranchId: branchDokki.id,
      toBranchId: branchNasr.id,
      status: 'PENDING' as const,
      requestedById: nasrManager.id,
      notes: 'طلب تحويل جديد قيد الانتظار لموافقة الإدارة أو مدير الفرع المصدر',
      requestedAt: new Date(),
      items: [
        { barcode: '6221000999009', batchNumber: 'OMG-DOK-01', quantity: 15, unitCost: 65.0, notes: 'أوميجا 3 بلس' },
      ],
    },
  ];

  for (const tr of transfersData) {
    const existing = await prisma.transferRequest.findUnique({ where: { transferNumber: tr.transferNumber } });
    if (!existing) {
      await prisma.transferRequest.create({
        data: {
          transferNumber: tr.transferNumber,
          fromBranchId: tr.fromBranchId,
          toBranchId: tr.toBranchId,
          status: tr.status,
          requestedById: tr.requestedById,
          approvedById: tr.approvedById || null,
          dispatchedById: tr.dispatchedById || null,
          receivedById: tr.receivedById || null,
          notes: tr.notes,
          requestedAt: tr.requestedAt,
          approvedAt: tr.approvedAt || null,
          dispatchedAt: tr.dispatchedAt || null,
          receivedAt: tr.receivedAt || null,
          completedAt: tr.completedAt || null,
          items: {
            create: tr.items.map((it) => {
              const prod = productMap.get(it.barcode)!;
              const bat = batchMap.get(it.batchNumber);
              return {
                productId: prod.id,
                batchId: bat ? bat.id : null,
                quantity: it.quantity,
                unitCost: it.unitCost,
                notes: it.notes,
              };
            }),
          },
        },
      });
      console.log(`   🔄 Transfer [${tr.transferNumber}]: Status ${tr.status} | From: ${tr.fromBranchId.slice(0, 6)} -> To: ${tr.toBranchId.slice(0, 6)}`);
    }
  }

  // -------------------------------------------------------------
  // 12. Operational Notifications Seed
  // -------------------------------------------------------------
  console.log('\n1️⃣2️⃣ Seeding Operational Notifications...');
  const notificationsData = [
    {
      userId: dokkiManager.id,
      title: 'طلب تحويل صادر جديد (TR-2026-004)',
      message: 'فرع مدينة نصر يطلب تحويل 15 علبة أوميجا 3 بلس. يرجى مراجعة الطلب والموافقة.',
      type: 'SYSTEM_ALERT' as const,
    },
    {
      userId: maadiManager.id,
      title: 'تنبيه نقص المخزون: كونكور 5 مجم وأوميجا 3',
      message: 'المخزون الحالي أقل من الحد الأدنى. تم إنشاء طلب تحويل من فرع مدينة نصر وهو الآن في الطريق.',
      type: 'LOW_STOCK' as const,
    },
    {
      userId: maadiPharm.id,
      title: 'شحنة في الطريق (TR-2026-002)',
      message: 'قام صيدلي فرع مدينة نصر بإرسال 25 علبة كونكور 5 مجم. يرجى تأكيد الاستلام فور الوصول.',
      type: 'GENERAL' as const,
    },
    {
      userId: dokkiPharm.id,
      title: 'تنبيه اقتراب انتهاء الصلاحية: بنادول إكسترا',
      message: 'التشغيلة PAN-DOK-FEFO تنتهي خلال 22 يوماً. يرجى إعطاء الأولوية لصرفها بنظام FEFO.',
      type: 'EXPIRY_ALERT' as const,
    },
    {
      userId: pharmacyManager.id,
      title: 'جاهزية شبكة الفروع الثلاثة',
      message: 'تم تفعيل الفروع الثلاثة (الدقي، المعادي، مدينة نصر) بنجاح مع ربط الحسابات وسلاسل الإمداد.',
      type: 'SYSTEM_ALERT' as const,
    },
  ];

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
  console.log(`   🔔 Seeded ${notificationsData.length} Contextual Notifications.`);

  console.log('\n================================================================');
  console.log('🎉 COMPREHENSIVE MULTI-BRANCH MASTER SEED COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
  console.log('🔑 ALL PASSWORDS SET TO: 12345678');
  console.log('----------------------------------------------------------------');
  console.log('📌 QUICK LOGIN ACCOUNTS:');
  console.log('   👑 [Platform Admin]   01012345678  (د. طارق المدير العام)');
  console.log('   🏢 [Pharmacy GM]      01098765432  (د. ربيع مدير عام السلسلة)');
  console.log('   📍 [Dokki Manager]    01011110001  (د. حسام مدير فرع الدقي)');
  console.log('   💊 [Dokki Pharm]      01111110001  (د. أحمد صيدلي الدقي)');
  console.log('   💰 [Dokki Acc]        01211110001  (أ. مصطفى محاسب الدقي)');
  console.log('   📍 [Maadi Manager]    01055554444  (د. خالد مدير فرع المعادي)');
  console.log('   💊 [Maadi Pharm]      01123456789  (د. مريم صيدلي المعادي)');
  console.log('   💰 [Maadi Acc]        01223456789  (أ. هاني محاسب المعادي)');
  console.log('   📍 [Nasr City Mgr]    01033330003  (د. عمرو مدير فرع مدينة نصر)');
  console.log('   💊 [Nasr City Pharm]  01133330003  (د. نور صيدلي مدينة نصر)');
  console.log('   💰 [Nasr City Acc]    01233330003  (أ. كريم محاسب مدينة نصر)');
  console.log('================================================================\n');
}

seed()
  .catch((e) => {
    console.error('❌ Multi-Branch Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
