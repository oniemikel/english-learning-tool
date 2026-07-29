'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ListWordsSchema = z.object({
  deckId: z.string().optional(),
  query: z.string().optional(),
  limit: z.number().int().positive().max(200).optional(),
});

export async function listWords(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view words.');
  }
  const userId = session.user.id;

  const { deckId, query, limit } = ListWordsSchema.parse(input);
  const trimmedQuery = query?.trim();

  const words = await prisma.word.findMany({
    where: {
      ...(deckId ? { deckId } : {}),
      deck: {
        userId,
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
    },
    include: {
      deck: {
        select: {
          title: true,
        },
      },
      card: {
        include: {
          fsrsState: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: limit,
  });

  return words.map((word) => ({
    id: word.id,
    word: word.word,
    translation: word.meaning,
    partOfSpeech: word.partOfSpeech,
    nextReview: word.card?.fsrsState?.due.toISOString() ?? null,
    deckId: word.deckId,
    deckName: word.deck.title,
    accuracy: 0, // Placeholder
  }));
}

const ListPublicWordsSchema = z.object({
  deckId: z.string().min(1),
  limit: z.number().int().positive().max(200).optional(),
});

export async function listPublicWords(input: unknown) {
  const { deckId, limit } = ListPublicWordsSchema.parse(input);

  const words = await prisma.word.findMany({
    where: {
      deckId,
      deletedAt: null,
      deck: {
        deletedAt: null,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: limit,
  });

  return words.map((word) => ({
    id: word.id,
    deckId: word.deckId,
    word: word.word,
    translation: word.meaning,
    partOfSpeech: word.partOfSpeech,
  }));
}

const CreateWordSchema = z.object({
  word: z.string().trim().min(1).max(100),
  translation: z.string().trim().min(1).max(500),
  partOfSpeech: z.string().min(1),
  deckId: z.string().min(1),
});

export async function createWord(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to create a word.');
  }
  const userId = session.user.id;

  const data = CreateWordSchema.parse(input);

  const deck = await prisma.deck.findFirst({
    where: {
      id: data.deckId,
      userId,
      deletedAt: null,
    },
  });

  if (!deck) {
    throw new Error("Deck not found or you don't have permission to add words.");
  }

  const newWord = await prisma.$transaction(async (tx) => {
    const word = await tx.word.create({
      data: {
        deckId: data.deckId,
        word: data.word,
        meaning: data.translation,
        partOfSpeech: data.partOfSpeech,
      },
    });

    const card = await tx.card.create({
      data: {
        wordId: word.id,
      },
    });

    await tx.fSRSState.create({
      data: {
        cardId: card.id,
        state: 'NEW',
        due: new Date(),
      },
    });

    return word;
  });

  return newWord;
}

export async function getWordById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view a word.');
  }
  const userId = session.user.id;

  const word = await prisma.word.findFirst({
    where: {
      id,
      deck: {
        userId,
      },
      deletedAt: null,
    },
    include: {
      card: {
        include: {
          fsrsState: true,
        },
      },
      exampleSentences: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  if (!word) {
    return null;
  }

  return {
    id: word.id,
    word: word.word,
    translation: word.meaning,
    definition: word.memo ?? '',
    example: word.exampleSentences[0]?.english ?? '',
    pronunciation: word.pronunciation,
    partOfSpeech: word.partOfSpeech,
    etymology: word.source,
    nextReview: word.card?.fsrsState?.due.toISOString() ?? '',
    state: word.card?.fsrsState?.state ?? 'NEW',
  };
}

const UpdateWordSchema = z.object({
  id: z.string(),
  word: z.string().trim().min(1).max(100),
  translation: z.string().trim().min(1).max(500),
  definition: z.string().max(2000),
  example: z.string().max(2000),
});

export async function updateWord(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to update a word.');
  }
  const userId = session.user.id;

  const data = UpdateWordSchema.parse(input);

  const word = await prisma.word.findFirst({
    where: {
      id: data.id,
      deck: {
        userId,
      },
      deletedAt: null,
    },
    include: {
      exampleSentences: true,
    }
  });

  if (!word) {
    throw new Error("Word not found or you don't have permission to update it.");
  }

  await prisma.word.update({
    where: {
      id: data.id,
    },
    data: {
      word: data.word,
      meaning: data.translation,
      memo: data.definition,
    },
  });

  if (word.exampleSentences.length > 0) {
    await prisma.exampleSentence.update({
      where: {
        id: word.exampleSentences[0].id,
      },
      data: {
        english: data.example,
      },
    });
  } else if (data.example) {
    await prisma.exampleSentence.create({
      data: {
        wordId: data.id,
        english: data.example,
      },
    });
  }

  return { id: data.id };
}
