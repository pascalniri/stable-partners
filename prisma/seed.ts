import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admins = [
    { email: 'stablepartnersgrp@gmail.com', name: 'System Admin' },
    { email: 'pascalniri@gmail.com', name: 'Pascal Niri' }
  ];

  const hashedPassword = await bcrypt.hash('admin123', 10);

  for (const adminData of admins) {
    const admin = await prisma.user.upsert({
      where: { email: adminData.email },
      update: {},
      create: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: 'ADMIN',
      },
    });
    console.log('Admin processed:', admin.email);
  }

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
