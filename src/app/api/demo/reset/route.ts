import { auth } from '@/auth';
import { DEMO_USER_EMAIL, reseedDemoUserData } from '@/lib/demo-seed';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== DEMO_USER_EMAIL) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only the demo account can reset demo data.',
        },
      },
      { status: 403 },
    );
  }

  const user = await reseedDemoUserData(prisma);

  return NextResponse.json({
    success: true,
    data: {
      userId: user.id,
      email: user.email,
      message: 'Demo data has been reset.',
    },
  });
}
