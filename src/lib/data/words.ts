'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// --- スキーマ定義 ---

const ListWordsSchema = z.object({
  deckId: z.string().optional(),
  query: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

const CreateWordSchema = z.object({
  deckId: z.string().min(1, 'Deck ID is required'),
  word: z.string().min(1, 'Word is required'),
  meaning: z.string().min(1, 'Meaning is required'),
  pronunciation: z.string().optional(),
  partOfSpeech: z.string().optional(),
  example: z.string().optional(),
  definition: z.string().optional(),
  etymology: z.string().optional(),
});

const UpdateWordSchema = CreateWordSchema.partial().extend({
  id: z.string().min(1, 'Word ID is required'),
});

// --- 関数定義 ---

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
      exampleSentences: {
        where: { deletedAt: null },
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
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

  const firstExample = word.exampleSentences[0]?.english ?? '';

  return {
    id: word.id,
    word: word.word,
    translation: word.meaning,
    meaning: word.meaning,
    pronunciation: word.pronunciation ?? null,
    partOfSpeech: word.partOfSpeech ?? null,
    definition: word.meaning,
    example: firstExample,
    etymology: null,
    state: word.card?.fsrsState?.state ?? 'NEW',
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

/**
 * 新規単語の作成
 */
export async function createWord(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to create a word.');
  }
  const userId = session.user.id;

  const data = CreateWordSchema.parse(input);

  // 指定されたデッキがユーザー自身のものか確認
  const deck = await prisma.deck.findFirst({
    where: { id: data.deckId, userId, deletedAt: null },
  });
  if (!deck) {
    throw new Error('Deck not found or unauthorized.');
  }

  const newWord = await prisma.word.create({
    data: {
      word: data.word,
      meaning: data.meaning,
      pronunciation: data.pronunciation,
      partOfSpeech: data.partOfSpeech,
      decks: {
        connect: { id: data.deckId },
      },
      exampleSentences: data.example
        ? {
            create: {
              english: data.example,
              japanese: '',
            },
          }
        : undefined,
      card: {
        create: {
          fsrsState: {
            create: {
              state: 'NEW',
              due: new Date(),
            },
          },
        },
      },
    },
  });

  return newWord;
}

/**
 * 単語情報の更新
 */
export async function updateWord(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to update a word.');
  }
  const userId = session.user.id;

  const data = UpdateWordSchema.parse(input);

  const existingWord = await prisma.word.findFirst({
    where: {
      id: data.id,
      deletedAt: null,
      decks: { some: { userId, deletedAt: null } },
    },
  });

  if (!existingWord) {
    throw new Error('Word not found or unauthorized.');
  }

  const updatedWord = await prisma.word.update({
    where: { id: data.id },
    data: {
      word: data.word,
      meaning: data.meaning,
      pronunciation: data.pronunciation,
      partOfSpeech: data.partOfSpeech,
    },
  });

  return updatedWord;
}

/**
 * 公開デッキの単語一覧取得（文字列・オブジェクト形式両対応）
 */
export async function listPublicWords(
  input: string | { deckId: string; limit?: number },
) {
  const deckId = typeof input === 'string' ? input : input.deckId;
  const limit = typeof input === 'string' ? undefined : input.limit;

  const words = await prisma.word.findMany({
    where: {
      deletedAt: null,
      decks: {
        some: {
          id: deckId,
          deletedAt: null,
        },
      },
    },
    include: {
      exampleSentences: {
        where: { deletedAt: null },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return words.map((word) => ({
    id: word.id,
    word: word.word,
    meaning: word.meaning,
    translation: word.meaning,
    pronunciation: word.pronunciation,
    partOfSpeech: word.partOfSpeech,
    example: word.exampleSentences[0]?.english ?? '',
  }));
}