import { prisma } from '../src/lib/prisma.js';

async function auditDB() {
  const [
    productsCount,
    categoriesCount,
    batchesCount,
    egyBatchesCount,
    nonEgyBatchesCount,
    inventoryTxCount,
    purchasesCount,
    salesCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.batch.count(),
    prisma.batch.count({ where: { batchNumber: { startsWith: 'EGY-' } } }),
    prisma.batch.count({ where: { NOT: { batchNumber: { startsWith: 'EGY-' } } } }),
    prisma.inventoryTransaction.count(),
    prisma.purchase.count(),
    prisma.sale.count(),
  ]);

  console.log('--- DATABASE AUDIT SUMMARY ---');
  console.log(`Products: ${productsCount}`);
  console.log(`Categories: ${categoriesCount}`);
  console.log(`Total Batches: ${batchesCount}`);
  console.log(`  - Fabricated Batches (EGY-*): ${egyBatchesCount}`);
  console.log(`  - Real/Prior Batches: ${nonEgyBatchesCount}`);
  console.log(`Inventory Transactions: ${inventoryTxCount}`);
  console.log(`Purchases: ${purchasesCount}`);
  console.log(`Sales: ${salesCount}`);
  console.log('------------------------------');

  await prisma.$disconnect();
}

auditDB().catch(console.error);
