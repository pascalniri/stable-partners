const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const bcrypt = require('bcryptjs');

// Load .env manually if needed, or rely on environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admins = [
    { email: "stablepartnersgrp@gmail.com", name: "System Admin" },
    { email: "pascalniri@gmail.com", name: "Pascal Niri" }
  ];

  const password = "adminPassword123!"; 
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const adminData of admins) {
    const admin = await prisma.user.upsert({
      where: { email: adminData.email },
      update: {},
      create: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: "ADMIN",
      },
    });
    console.log(`Admin user ${admin.email} is ready.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
