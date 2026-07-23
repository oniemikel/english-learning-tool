import { auth } from '@/auth';
import { ApplicationError } from '@/domain/errors';

export async function requireAuth() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new ApplicationError('認証が必要です。', 'UNAUTHENTICATED', 401);
  return { session, userId };
}
