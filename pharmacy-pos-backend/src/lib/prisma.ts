import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { env } from '../config/env.js';

type MariaDbConfig = ConstructorParameters<typeof PrismaMariaDb>[0];

function parseDatabaseUrl(urlStr: string): MariaDbConfig {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname === 'localhost' ? '127.0.0.1' : parsed.hostname || '127.0.0.1';
    return {
      host,
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: parsed.username ? decodeURIComponent(parsed.username) : 'root',
      password: parsed.password ? decodeURIComponent(parsed.password) : '',
      database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'pharmacy_pos',
      connectionLimit: 5,
      connectTimeout: 10000,
    };
  } catch {
    return {
      host: 'srv1874.hstgr.io',
      port: 3306,
      user: 'u534453428_rabeashaban',
      password: '302060@Aa',
      database: 'u534453428_pharmacy_Db',
      connectionLimit: 5,
      connectTimeout: 10000,
    };
  }
}

// Global declaration for singleton in dev environment (prevents multiple Prisma instances on hot-reload)
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const dbConfig = parseDatabaseUrl(env.DATABASE_URL);
  const adapter = new PrismaMariaDb(dbConfig);

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/**
 * Executes a connectivity test to verify MySQL database connectivity.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown MySQL database error';
    console.error('❌ MySQL Database connectivity check failed:', errMessage);
    return false;
  }
}

/**
 * Performs a verified database INSERT + SELECT cycle on the connection_test table.
 */
export async function verifyDatabaseOperations(): Promise<{
  inserted: { id: number; message: string; createdAt: Date };
  totalCount: number;
}> {
  // Insert test record
  const insertedRecord = await prisma.connectionTest.create({
    data: {
      message: 'Pharmacy POS Backend is connected to local MySQL Database (XAMPP)',
    },
  });

  // Count records
  const totalCount = await prisma.connectionTest.count();

  return {
    inserted: insertedRecord,
    totalCount,
  };
}

/**
 * Disconnects Prisma client cleanly.
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
