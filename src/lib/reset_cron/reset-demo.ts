import { PrismaClient } from '@prisma/client';
import { reseedDemoUserData } from './demo-seed';

// ロックタイムアウトなどを防止するため長時間トランザクションを許可する Prisma インスタンス
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function runCron() {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] 🔄 Starting Demo User Reseed...`);

  try {
    // 60秒タイムアウトのインタラクティブ・トランザクション内で実行
    await prisma.$transaction(
      async (tx) => {
        await reseedDemoUserData(tx);
      },
      {
        maxWait: 10000, // トランザクション開始待ち（最大10秒）
        timeout: 60000, // 処理全体タイムアウト（最大60秒）
      }
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[${new Date().toISOString()}] ✅ Demo Reseed Completed in ${duration}s!`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Demo Reseed Failed:`, error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCron();