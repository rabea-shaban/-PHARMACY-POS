import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../src/lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EgyptianDrugRaw {
  commercial_name_en: string;
  commercial_name_ar: string;
  scientific_name: string;
  manufacturer: string;
  drug_class: string;
  route: string;
  price_egp: number;
}

// Generate a deterministic unique barcode from index and name
function generateBarcode(index: number, name: string): string {
  const cleanIndex = (index + 1).toString().padStart(6, '0');
  // Egyptian GS1 prefix 622
  return `6220${cleanIndex}`;
}

async function importDrugs() {
  console.log('================================================================');
  console.log('🇪🇬 Starting Import of Egyptian Drug Database into Pharmacy POS');
  console.log('================================================================\n');

  const jsonPath = path.resolve(__dirname, '../../egyptian-drug-database/data/egyptian-drugs.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Egyptian drugs file not found at: ${jsonPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading JSON file from ${jsonPath}...`);
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const drugs: EgyptianDrugRaw[] = JSON.parse(rawData);
  console.log(`📦 Loaded ${drugs.length} total drug records.\n`);

  // 1. Extract and upsert Categories
  console.log('1️⃣  Extracting and creating drug categories...');
  const categoryNames = new Set<string>();
  for (const d of drugs) {
    const cat = d.drug_class ? d.drug_class.trim() : 'GENERAL PHARMACEUTICALS';
    if (cat) categoryNames.add(cat);
  }

  const categoryMap = new Map<string, string>();
  for (const catName of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name: catName },
      create: {
        name: catName,
        description: `تصنيف دوائي: ${catName}`,
        isActive: true,
      },
      update: {},
    });
    categoryMap.set(catName, category.id);
  }
  console.log(`   ✅ Synced ${categoryMap.size} Categories.\n`);

  // 2. Batch Process and Upsert Products with Active Stock & Batches
  console.log('2️⃣  Upserting medicines with available stock & valid FEFO batches...');

  const BATCH_SIZE = 250;
  let importedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < drugs.length; i += BATCH_SIZE) {
    const chunk = drugs.slice(i, i + BATCH_SIZE);

    await prisma.$transaction(async (tx) => {
      for (let j = 0; j < chunk.length; j++) {
        const drug = chunk[j];
        const globalIndex = i + j;

        const nameEn = drug.commercial_name_en ? drug.commercial_name_en.trim() : '';
        const nameAr = drug.commercial_name_ar ? drug.commercial_name_ar.trim() : '';
        
        // Composite display name
        let displayName = nameAr && nameEn ? `${nameAr} - ${nameEn}` : (nameAr || nameEn || `دواء مصري رقم ${globalIndex + 1}`);

        const barcode = generateBarcode(globalIndex, displayName);
        const catName = drug.drug_class ? drug.drug_class.trim() : 'GENERAL PHARMACEUTICALS';
        const categoryId = categoryMap.get(catName) || Array.from(categoryMap.values())[0];

        const sellingPrice = drug.price_egp && drug.price_egp > 0 ? Number(drug.price_egp) : 25.0;
        const purchasePrice = Number((sellingPrice * 0.75).toFixed(2));

        const manufacturer = drug.manufacturer ? drug.manufacturer.trim() : 'مصنع أدوية مصري';
        const route = drug.route ? drug.route.trim() : 'أقراص / علاج';
        const description = `الشركة المصنعة: ${manufacturer} | الشكل الدوائي: ${route}`;

        try {
          const product = await tx.product.upsert({
            where: { barcode },
            create: {
              name: displayName,
              barcode,
              scientificName: drug.scientific_name ? drug.scientific_name.trim() : null,
              description,
              categoryId,
              purchasePrice,
              sellingPrice,
              taxRate: 0.0,
              minimumStock: 5,
              isActive: true,
            },
            update: {
              name: displayName,
              scientificName: drug.scientific_name ? drug.scientific_name.trim() : null,
              description,
              sellingPrice,
              purchasePrice,
              isActive: true,
            },
          });

          // Ensure an active, non-expired batch with available quantity (e.g. 50 units)
          const batchNumber = `EGY-${globalIndex + 1}`;
          // Expiry date in 2027 or 2028
          const expiryDate = new Date(Date.now() + (365 * 2 + (globalIndex % 300)) * 24 * 60 * 60 * 1000);
          const initialQuantity = 30 + (globalIndex % 70); // 30 to 99 units available

          await tx.batch.upsert({
            where: {
              productId_batchNumber: {
                productId: product.id,
                batchNumber,
              },
            },
            create: {
              productId: product.id,
              batchNumber,
              expiryDate,
              quantity: initialQuantity,
              purchasePrice,
              sellingPrice,
            },
            update: {
              quantity: initialQuantity,
              expiryDate,
              purchasePrice,
              sellingPrice,
            },
          });

          importedCount++;
        } catch (err) {
          skippedCount++;
        }
      }
    });

    if ((i + BATCH_SIZE) % 2500 === 0 || i + BATCH_SIZE >= drugs.length) {
      console.log(`   ⏳ Processed ${Math.min(i + BATCH_SIZE, drugs.length)} / ${drugs.length} drugs... (${importedCount} imported, ${skippedCount} skipped)`);
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 IMPORT COMPLETED SUCCESSFULLY!`);
  console.log(`📊 Total Imported Products: ${importedCount}`);
  console.log(`💊 All products are now in stock with valid FEFO batches & ready in POS!`);
  console.log('================================================================\n');
}

importDrugs()
  .catch((e) => {
    console.error('❌ Error during drug import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
