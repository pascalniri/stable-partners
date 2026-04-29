import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const databaseUrl = config.get<string>('DATABASE_URL');
    
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL is not defined in environment variables');
      super();
      return;
    }

    try {
      // Use a single connection for serverless cold starts to avoid exhausting DB connections
      const pool = new Pool({ 
        connectionString: databaseUrl,
        max: process.env.NODE_ENV === 'production' ? 1 : 10,
        connectionTimeoutMillis: 5000,
        // If connecting to PGBouncer in transaction mode, we should be careful with prepared statements
        // but the PrismaPg adapter usually handles this.
      });

      pool.on('error', (err) => {
        console.error('Unexpected error on idle database client', err);
      });

      const adapter = new PrismaPg(pool);
      super({ adapter });
    } catch (error) {
      console.error('❌ Failed to initialize Prisma pool:', error);
      super();
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Successfully connected to database');
    } catch (error) {
      console.error('❌ Database connection failed during bootstrap:', error);
      // In a serverless environment, we might want to let the request fail gracefully later
      // rather than crashing the whole bootstrap, but NestJS onModuleInit failure will block startup.
      throw error; 
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
