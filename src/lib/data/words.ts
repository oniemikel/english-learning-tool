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

// ベースとなるオブジェクトスキーマ (.refine をかける前の状態)
const BaseWordSchema = z.object({
  deckIds: z.array(z.string()).default([]),
  word: z.string().min(1, 'Word is required'),
  translation: z.string().optional(),
  meaning: z.string().optional(),
  pronunciation: z.string().optional(),
  partOfSpeech: z.string().optional(),
  example: z.string().optional(),
  definition: z.string().optional(),
  etymology: z.string().optional(),
});

// 作成用スキーマ (意味/訳の存在チェックを追加)
const CreateWordSchema = BaseWordSchema.refine(
  (data) => data.translation || data.meaning,
  {
    message: 'Meaning/Translation is required',
    path: ['translation'],
  },
);

// 更新用スキーマ (部分更新を許可し、id を追加)
const UpdateWordSchema = BaseWordSchema.partial().extend({
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
    userId,
    deletedAt: null,
    ...(deckId
      ? {
          decks: {
            some: {
              id: deckId,
              userId,
              deletedAt: null,
            },
          },
        }
      : {}),
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
      userId,
      deletedAt: null,
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
  const meaningValue = data.translation || data.meaning || '';
  const deckIds = [...new Set(data.deckIds)];

  let userDecks: Array<{ id: string }> = [];

  if (deckIds.length > 0) {
    // 指定されたデッキすべてがユーザー自身のものか確認
    userDecks = await prisma.deck.findMany({
      where: {
        id: { in: deckIds },
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (userDecks.length !== deckIds.length) {
      throw new Error('Decks not found or unauthorized.');
    }
  }

  const newWord = await prisma.word.create({
    data: {
      userId,
      word: data.word,
      meaning: meaningValue,
      pronunciation: data.pronunciation,
      partOfSpeech: data.partOfSpeech,
      ...(deckIds.length > 0
        ? {
            decks: {
              connect: userDecks.map((deck) => ({ id: deck.id })),
            },
          }
        : {}),
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
  const meaningValue = data.translation || data.meaning;

  const existingWord = await prisma.word.findFirst({
    where: {
      id: data.id,
      userId,
      deletedAt: null,
    },
  });

  if (!existingWord) {
    throw new Error('Word not found or unauthorized.');
  }

  let deckSetData:
    | {
        decks: {
          set: Array<{ id: string }>;
        };
      }
    | undefined;

  if (data.deckIds !== undefined) {
    const deckIds = [...new Set(data.deckIds)];

    if (deckIds.length > 0) {
      const userDecks = await prisma.deck.findMany({
        where: {
          id: { in: deckIds },
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (userDecks.length !== deckIds.length) {
        throw new Error('Decks not found or unauthorized.');
      }
    }

    deckSetData = {
      decks: {
        set: deckIds.map((id) => ({ id })),
      },
    };
  }

  const updatedWord = await prisma.word.update({
    where: { id: data.id },
    data: {
      word: data.word,
      meaning: meaningValue,
      pronunciation: data.pronunciation,
      partOfSpeech: data.partOfSpeech,
      ...(deckSetData ?? {}),
    },
  });

  return updatedWord;
}

/**
 * 単語の削除
 */
export async function deleteWord(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to delete a word.');
  }
  const userId = session.user.id;

  const word = await prisma.word.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!word) {
    throw new Error("Word not found or you don't have permission to delete it.");
  }

  await prisma.word.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return { id };
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