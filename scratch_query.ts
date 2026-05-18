import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  console.log("=== ALL SESSIONS ===");
  const allSessions = await prisma.session.findMany({
    orderBy: { startTime: "asc" }
  });
  console.log(`Total sessions: ${allSessions.length}`);
  allSessions.forEach(s => {
    console.log(`ID: ${s.id} | Date: ${s.date.toISOString()} | Start: ${s.startTime.toISOString()} | End: ${s.endTime.toISOString()} | Status: ${s.status}`);
  });
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
