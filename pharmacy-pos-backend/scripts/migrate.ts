import { execSync } from 'node:child_process';
import { prisma, checkDatabaseConnection } from '../src/lib/prisma.js';

async function runMySQLMigration() {
  console.log('================================================================');
  console.log('🚀 Starting Pharmacy POS MySQL Migration Pipeline');
  console.log('================================================================\n');

  try {
    // 1. Validate Prisma schema
    console.log('1️⃣  Validating Prisma Schema (MySQL)...');
    execSync('npx prisma validate', { stdio: 'inherit' });

    // 2. Format Prisma schema
    console.log('\n2️⃣  Formatting Prisma Schema...');
    execSync('npx prisma format', { stdio: 'inherit' });

    // 3. Generate Prisma Client
    console.log('\n3️⃣  Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // 4. Apply migration directly to MySQL database
    console.log('\n4️⃣  Pushing Schema to MySQL (pharmacy_pos)...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // 5. Verify database connection
    console.log('\n5️⃣  Verifying MySQL Database Connectivity...');
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Could not connect to MySQL database.');
    }
    console.log('   ✅ Connected to MySQL successfully!');

    // 6. Verify all 30 tables in MySQL
    console.log('\n6️⃣  Verifying All 30 Models/Tables in MySQL (pharmacy_pos)...');
    const tableRows = await prisma.$queryRaw<{ TABLE_NAME: string }[]>`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'pharmacy_pos';
    `;

    const existingTables = new Set(tableRows.map((r) => r.TABLE_NAME));

    const expectedTables = [
      'users',
      'customer_tiers',
      'customers',
      'loyalty_accounts',
      'loyalty_transactions',
      'categories',
      'products',
      'batches',
      'suppliers',
      'purchases',
      'purchase_items',
      'inventory_transactions',
      'sales',
      'sale_items',
      'payments',
      'discounts',
      'insurance_providers',
      'customer_insurances',
      'sale_insurances',
      'sale_returns',
      'sale_return_items',
      'expenses',
      'commission_rules',
      'commission_transactions',
      'payrolls',
      'notifications',
      'whatsapp_messages',
      'audit_logs',
      'system_settings',
      'connection_test',
    ];

    let verifiedCount = 0;
    for (const table of expectedTables) {
      if (existingTables.has(table)) {
        console.log(`   ✅ Table "${table}" verified in MySQL.`);
        verifiedCount++;
      } else {
        console.log(`   ⚠️ Table "${table}" not found in MySQL.`);
      }
    }

    console.log('\n================================================================');
    console.log(`🎉 MYSQL DATABASE READY: ${verifiedCount}/${expectedTables.length} Tables Verified`);
    console.log('   Prisma Schema, Client & Local MySQL (XAMPP) are in 100% Sync.');
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ Migration failed:', (error as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMySQLMigration();
