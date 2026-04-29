import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Successfully connected to database');
    } catch (error) {
      console.error('❌ Database connection failed during bootstrap:', error);
      throw error; 
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
