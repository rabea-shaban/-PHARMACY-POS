import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url:
      process.env.DATABASE_URL ||
      'mysql://u534453428_rabeashaban:302060%40Aa@srv1874.hstgr.io:3306/u534453428_pharmacy_Db',
  },
  migrations: {
    path: 'prisma/migrations',
  },
});
