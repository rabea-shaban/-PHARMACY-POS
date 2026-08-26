import { env } from './env.js';
function parseDatabaseConfig(urlStr) {
    try {
        const parsed = new URL(urlStr);
        const host = parsed.hostname === 'localhost' ? '127.0.0.1' : parsed.hostname || '127.0.0.1';
        return {
            url: urlStr,
            host,
            port: parsed.port ? parseInt(parsed.port, 10) : 3306,
            user: parsed.username ? decodeURIComponent(parsed.username) : 'root',
            database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'pharmacy_pos',
            connectionLimit: 10,
        };
    }
    catch {
        return {
            url: urlStr,
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            database: 'pharmacy_pos',
            connectionLimit: 10,
        };
    }
}
export const databaseConfig = parseDatabaseConfig(env.DATABASE_URL);
//# sourceMappingURL=database.js.map