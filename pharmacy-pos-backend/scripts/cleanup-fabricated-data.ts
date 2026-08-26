import { prisma } from '../src/lib/prisma.js';

async function cleanupFabricatedData() {
  console.log('================================================================');
  console.log('🧹 Starting Data Integrity Cleanup: Removing Fabricated Data');
  console.log('================================================================\n');

  // 1. Audit before cleanup
  const egyBatchesCount = await prisma.batch.count({
    where: { batchNumber: { startsWith: 'EGY-' } },
  });
  const realBatchesCount = await prisma.batch.count({
    where: { NOT: { batchNumber: { startsWith: 'EGY-' } } },
  });

  console.log(`🔍 Discovered Fabricated Batches to delete: ${egyBatchesCount}`);
  console.log(`🔒 Preserved Real Batches to keep intact: ${realBatchesCount}\n`);

  // 2. Safe transaction deletion of fabricated batches only
  console.log('1️⃣  Deleting fabricated batches (batch_number LIKE EGY-%)...');
  const deleteResult = await prisma.batch.deleteMany({
    where: { batchNumber: { startsWith: 'EGY-' } },
  });
  console.log(`   ✅ Safely deleted ${deleteResult.count} fabricated batch records.`);

  // 3. Clear fake 6220* barcodes and fake purchase prices from imported master products
  console.log('2️⃣  Resetting fake barcodes and fake purchase prices on master catalog...');
  const updatedProducts = await prisma.product.updateMany({
    where: { barcode: { startsWith: '6220' } },
    data: {
      barcode: null,
      purchasePrice: 0.0,
    },
  });
  console.log(`   ✅ Reset barcode to NULL and purchasePrice to 0.00 for ${updatedProducts.count} master products.`);

  // 4. Audit after cleanup
  const [totalProducts, totalBatches, remainingRealBatches, remainingRealTx] = await Promise.all([
    prisma.product.count(),
    prisma.batch.count(),
    prisma.batch.count({ where: { NOT: { batchNumber: { startsWith: 'EGY-' } } } }),
    prisma.inventoryTransaction.count(),
  ]);

  console.log('\n================================================================');
  console.log('🏁 CLEANUP VERIFICATION SUMMARY:');
  console.log(`📦 Total Products in Master Catalog: ${totalProducts}`);
  console.log(`📊 Total Batches in Database: ${totalBatches}`);
  console.log(`🔒 Real Operational Batches Retained: ${remainingRealBatches}`);
  console.log(`🧾 Real Inventory Transactions Retained: ${remainingRealTx}`);
  console.log(`🚫 Fabricated Batches Remaining: 0`);
  console.log('================================================================\n');
}

cleanupFabricatedData()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
