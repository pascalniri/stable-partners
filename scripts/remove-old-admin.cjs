const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const emailToRemove = "pascalniri@gmail.com";

  try {
    const deletedUser = await prisma.user.delete({
      where: { email: emailToRemove },
    });
    console.log(`Successfully removed admin: ${deletedUser.email}`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.log(`User ${emailToRemove} not found or already removed.`);
    } else {
      console.error("Error removing user:", error);
    }
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
