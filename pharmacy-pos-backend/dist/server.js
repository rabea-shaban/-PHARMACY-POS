import { createApp } from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection, disconnectPrisma } from './lib/prisma.js';
async function bootstrap() {
    const app = createApp();
    // Test database connection at startup
    const isDbConnected = await checkDatabaseConnection();
    const server = app.listen(env.PORT, () => {
        console.log('==================================================');
        console.log('🚀 Pharmacy POS API');
        console.log(`Server: http://localhost:${env.PORT}`);
        console.log(`Environment: ${env.NODE_ENV}`);
        console.log(`Database: ${isDbConnected ? 'connected' : 'disconnected'}`);
        console.log('==================================================');
    });
    // Graceful shutdown handling
    const shutdown = async (signal) => {
        console.log(`\nReceived ${signal}. Shutting down gracefully...`);
        server.close(async () => {
            console.log('HTTP server closed.');
            await disconnectPrisma();
            console.log('Database connections closed.');
            process.exit(0);
        });
        // Force shutdown after 10s if stuck
        setTimeout(() => {
            console.error('Forced shutdown due to timeout.');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map