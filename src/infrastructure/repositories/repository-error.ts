import { Prisma } from '@prisma/client';
import { BadRequestError, ConflictError, InternalServerError } from '@/domain/errors';

export function toRepositoryError(error: unknown): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return new ConflictError('一意制約に違反しています。');
    if (error.code === 'P2003') return new BadRequestError('関連するデータが存在しません。');
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new InternalServerError('データベースへ接続できません。');
  }
  return error instanceof Error ? error : new InternalServerError();
}
