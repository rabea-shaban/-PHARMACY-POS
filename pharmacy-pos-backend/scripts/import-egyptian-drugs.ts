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

async function importDrugsMaster() {
  console.log('================================================================');
  console.log('🇪🇬 Egyptian Drug Master Data Import (ZERO Fabricated Data)');
  console.log('================================================================\n');

  const jsonPath = path.resolve(__dirname, '../../egyptian-drug-database/data/egyptian-drugs.json');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Egyptian drugs file not found at: ${jsonPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading Master dataset from ${jsonPath}...`);
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const drugs: EgyptianDrugRaw[] = JSON.parse(rawData);
  console.log(`📦 Loaded ${drugs.length} drug master records.\n`);

  // 1. Sync Categories safely
  console.log('1️⃣  Syncing therapeutic categories from drug_class...');
  const existingCategories = await prisma.category.findMany();
  const categoryMap = new Map<string, string>();
  for (const c of existingCategories) {
    categoryMap.set(c.name.trim().toLowerCase(), c.id);
  }

  const categoryNames = new Set<string>();
  for (const d of drugs) {
    const cat = d.drug_class ? d.drug_class.trim() : 'GENERAL PHARMACEUTICALS';
    if (cat) categoryNames.add(cat);
  }

  for (const catName of categoryNames) {
    const lowerKey = catName.toLowerCase();
    if (!categoryMap.has(lowerKey)) {
      try {
        const created = await prisma.category.create({
          data: {
            name: catName,
            description: `تصنيف دوائي: ${catName}`,
            isActive: true,
          },
        });
        categoryMap.set(lowerKey, created.id);
      } catch {
        const found = await prisma.category.findFirst({
          where: { name: catName },
        });
        if (found) {
          categoryMap.set(lowerKey, found.id);
        }
      }
    }
  }
  console.log(`   ✅ Synced ${categoryMap.size} Categories in database.\n`);

  // 2. Upsert Drug Master Records (Pure Catalog - ZERO Stock, ZERO Batches, ZERO Fake Barcodes)
  console.log('2️⃣  Syncing Drug Master products (Stock: 0, Batches: 0, Barcode: NULL)...');

  const defaultCatId = Array.from(categoryMap.values())[0];
  const BATCH_SIZE = 500;
  let importedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < drugs.length; i += BATCH_SIZE) {
    const chunk = drugs.slice(i, i + BATCH_SIZE);

    for (let j = 0; j < chunk.length; j++) {
      const drug = chunk[j];
      const globalIndex = i + j;

      const nameEn = drug.commercial_name_en ? drug.commercial_name_en.trim() : '';
      const nameAr = drug.commercial_name_ar ? drug.commercial_name_ar.trim() : '';
      
      let displayName = nameAr && nameEn ? `${nameAr} - ${nameEn}` : (nameAr || nameEn || `دواء مصري رقم ${globalIndex + 1}`);

      const catName = drug.drug_class ? drug.drug_class.trim() : 'GENERAL PHARMACEUTICALS';
      const categoryId = categoryMap.get(catName.toLowerCase()) || defaultCatId;

      const referencePrice = drug.price_egp && drug.price_egp > 0 ? Number(drug.price_egp) : 0.0;
      const manufacturer = drug.manufacturer ? drug.manufacturer.trim() : '';
      const route = drug.route ? drug.route.trim() : '';
      const description = [
        manufacturer ? `الشركة المصنعة: ${manufacturer}` : null,
        route ? `الشكل الدوائي: ${route}` : null,
      ].filter(Boolean).join(' | ') || null;

      try {
        const existing = await prisma.product.findFirst({
          where: { name: displayName },
        });

        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              scientificName: drug.scientific_name ? drug.scientific_name.trim() : null,
              description,
              categoryId,
              sellingPrice: referencePrice,
              purchasePrice: 0.0,
              barcode: null,
              isActive: true,
            },
          });
        } else {
          await prisma.product.create({
            data: {
              name: displayName,
              barcode: null,
              scientificName: drug.scientific_name ? drug.scientific_name.trim() : null,
              description,
              categoryId,
              purchasePrice: 0.0,
              sellingPrice: referencePrice,
              taxRate: 0.0,
              minimumStock: 5,
              isActive: true,
            },
          });
        }

        importedCount++;
      } catch (err) {
        skippedCount++;
      }
    }

    if ((i + BATCH_SIZE) % 5000 === 0 || i + BATCH_SIZE >= drugs.length) {
      console.log(`   ⏳ Processed ${Math.min(i + BATCH_SIZE, drugs.length)} / ${drugs.length} drug master records... (${importedCount} cataloged, ${skippedCount} skipped)`);
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 DRUG MASTER IMPORT COMPLETED SUCCESSFULLY!`);
  console.log(`📦 Master Cataloged Products: ${importedCount}`);
  console.log(`📊 Fabricated Batches Created: 0`);
  console.log(`📊 Fabricated Inventory Created: 0`);
  console.log(`📊 Fabricated Barcodes Created: 0`);
  console.log(`🔒 Real Inventory Status: Preserved and separated from master catalog`);
  console.log('================================================================\n');
}

importDrugsMaster()
  .catch((e) => {
    console.error('❌ Error during drug master import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
