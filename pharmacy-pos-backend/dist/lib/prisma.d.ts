import { PrismaClient } from '@prisma/client';
declare global {
    var prismaGlobal: PrismaClient | undefined;
}
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
/**
 * Executes a connectivity test to verify MySQL database connectivity.
 */
export declare function checkDatabaseConnection(): Promise<boolean>;
/**
 * Performs a verified database INSERT + SELECT cycle on the connection_test table.
 */
export declare function verifyDatabaseOperations(): Promise<{
    inserted: {
        id: number;
        message: string;
        createdAt: Date;
    };
    totalCount: number;
}>;
/**
 * Disconnects Prisma client cleanly.
 */
export declare function disconnectPrisma(): Promise<void>;
