import { PrismaClient } from '@prisma/client';
import { reseedDemoUserData } from '../src/lib/reset_cron/demo-seed';

const prisma = new PrismaClient();

async function main() {
  const demoUser = await reseedDemoUserData(prisma);
  console.log(`Demo user seeded: ${demoUser.email}`);
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
