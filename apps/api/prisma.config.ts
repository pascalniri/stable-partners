import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly load .env from the current directory
dotenv.config({ path: path.join(__dirname, '.env') });

export default defineConfig({
  datasource: {
    // For Prisma 7 CLI (migrations), we must use the direct connection
    url: process.env.DIRECT_URL,
  },
  migrations: {
    seed: 'npx tsx ./prisma/seed.ts',
  }
});
