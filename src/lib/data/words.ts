'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ★ export を外し、内部利用のスキーマに変更
const ListWordsSchema = z.object({
  deckId: z.string().optional(),
  query: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export async function listWords(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view words.');
  }
  const userId = session.user.id;

  const { deckId, query, page, pageSize } = ListWordsSchema.parse(input ?? {});
  const trimmedQuery = query?.trim();

  const where = {
    decks: {
      some: {
        userId,
        deletedAt: null,
        ...(deckId ? { id: deckId } : {}),
      },
    },
    deletedAt: null,
    ...(trimmedQuery
      ? {
          OR: [
            { word: { contains: trimmedQuery } },
            { meaning: { contains: trimmedQuery } },
          ],
        }
      : {}),
  };

  const [totalCount, words] = await prisma.$transaction([
    prisma.word.count({ where }),
    prisma.word.findMany({
      where,
      include: {
        decks: {
          where: {
            userId,
            deletedAt: null,
          },
          select: {
            id: true,
            title: true,
          },
        },
        card: {
          include: {
            fsrsState: true,
            reviewLogs: {
              where: { userId },
              select: { isCorrect: true },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const items = words.map((word) => {
    const logs = word.card?.reviewLogs ?? [];
    const totalReviews = logs.length;
    const correctCount = logs.filter((log) => log.isCorrect).length;

    const accuracy =
      totalReviews > 0 ? Math.round((correctCount / totalReviews) * 100) : 0;

    return {
      id: word.id,
      word: word.word,
      translation: word.meaning,
      partOfSpeech: word.partOfSpeech,
      nextReview: word.card?.fsrsState?.due.toISOString() ?? null,
      deckIds: word.decks.map((deck) => deck.id),
      decks: word.decks.map((deck) => ({
        id: deck.id,
        name: deck.title,
      })),
      accuracy,
    };
  });

  return {
    items,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  };
}

export async function getWordById(input: string | { id: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view word details.');
  }
  const userId = session.user.id;
  const wordId = typeof input === 'string' ? input : input?.id;

  if (!wordId) {
    return null;
  }

  const word = await prisma.word.findFirst({
    where: {
      id: wordId,
      deletedAt: null,
      decks: {
        some: {
          userId,
          deletedAt: null,
        },
      },
    },
    include: {
      decks: {
        where: {
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
        },
      },
      card: {
        include: {
          fsrsState: true,
          reviewLogs: {
            where: { userId },
            select: {
              id: true,
              isCorrect: true,
              rating: true,
              reviewedAt: true,
            },
            orderBy: {
              reviewedAt: 'desc',
            },
          },
        },
      },
    },
  });

  if (!word) {
    return null;
  }

  const logs = word.card?.reviewLogs ?? [];
  const totalReviews = logs.length;
  const correctCount = logs.filter((log) => log.isCorrect).length;
  const accuracy =
    totalReviews > 0 ? Math.round((correctCount / totalReviews) * 100) : 0;

  return {
    id: word.id,
    word: word.word,
    translation: word.meaning,
    partOfSpeech: word.partOfSpeech,
    nextReview: word.card?.fsrsState?.due.toISOString() ?? null,
    deckIds: word.decks.map((deck) => deck.id),
    decks: word.decks.map((deck) => ({
      id: deck.id,
      name: deck.title,
    })),
    accuracy,
    reviewLogs: logs,
  };
}