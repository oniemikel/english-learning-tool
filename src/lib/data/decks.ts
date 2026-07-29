'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ListDecksSchema = z.object({
  query: z.string().optional(),
});

export async function listDecks(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view decks.');
  }
  const userId = session.user.id;

  const { query } = ListDecksSchema.parse(input);
  const trimmedQuery = query?.trim();

  const decks = await prisma.deck.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(trimmedQuery
        ? {
            title: {
              contains: trimmedQuery,
            },
          }
        : {}),
    },
    include: {
      words: {
        where: {
          deletedAt: null,
        },
        include: {
          card: {
            include: {
              fsrsState: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const now = new Date();

  return decks.map((deck) => {
    const wordCount = deck.words.length;
    let dueCount = 0;
    let newCount = 0;
    let learnedCount = 0;

    for (const word of deck.words) {
      const state = word.card?.fsrsState;
      if (state) {
        if (state.state === 'NEW') {
          newCount++;
        }
        if (state.due <= now) {
          dueCount++;
        }
        if (state.state !== 'NEW' && state.state !== 'LEARNING') {
          learnedCount++;
        }
      }
    }

    const progress = wordCount > 0 ? Math.round((learnedCount / wordCount) * 100) : 0;

    return {
      id: deck.id,
      name: deck.title,
      description: deck.description,
      wordCount,
      isPublic: false,
      updatedAt: deck.updatedAt.toISOString(),
      dueCount,
      newCount,
      progress,
    };
  });
}

const ListPublicDecksSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export async function listPublicDecks(input: unknown = {}) {
  const { query, limit } = ListPublicDecksSchema.parse(input);
  const trimmedQuery = query?.trim();

  const decks = await prisma.deck.findMany({
    where: {
      deletedAt: null,
      ...(trimmedQuery
        ? {
            title: {
              contains: trimmedQuery,
            },
          }
        : {}),
    },
    include: {
      words: {
        where: {
          deletedAt: null,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: limit,
  });

  return decks.map((deck) => ({
    id: deck.id,
    name: deck.title,
    description: deck.description,
    wordCount: deck.words.length,
    isPublic: true,
    updatedAt: deck.updatedAt.toISOString(),
    dueCount: 0,
    newCount: 0,
    progress: 0,
  }));
}

export async function deleteDeck(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to delete a deck.');
  }
  const userId = session.user.id;

  // We need to verify the deck belongs to the user before deleting.
  const deck = await prisma.deck.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!deck) {
    throw new Error("Deck not found or you don't have permission to delete it.");
  }

  await prisma.deck.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return { id };
}

const CreateDeckSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});

export async function createDeck(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to create a deck.');
  }
  const userId = session.user.id;

  const data = CreateDeckSchema.parse(input);

  const newDeck = await prisma.deck.create({
    data: {
      userId,
      title: data.name,
      description: data.description,
      // isPublic is not in the schema, so we ignore data.isPublic
    },
  });

  return newDeck;
}

export async function getDeckById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view a deck.');
  }
  const userId = session.user.id;

  const deck = await prisma.deck.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  if (!deck) {
    return null;
  }

  return {
    id: deck.id,
    name: deck.title,
    description: deck.description ?? '',
    isPublic: false, // Placeholder
  };
}

export async function getPublicDeckById(id: string) {
  const deck = await prisma.deck.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          words: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  if (!deck) {
    return null;
  }

  return {
    id: deck.id,
    name: deck.title,
    description: deck.description ?? '',
    wordCount: deck._count.words,
    isPublic: true,
  };
}

const UpdateDeckSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});

export async function updateDeck(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to update a deck.');
  }
  const userId = session.user.id;

  const data = UpdateDeckSchema.parse(input);

  const deck = await prisma.deck.findFirst({
    where: {
      id: data.id,
      userId,
    },
  });

  if (!deck) {
    throw new Error("Deck not found or you don't have permission to update it.");
  }

  const updatedDeck = await prisma.deck.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.name,
      description: data.description,
    },
  });

  return updatedDeck;
}

export async function getDeckDetails(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to view deck details.');
  }
  const userId = session.user.id;

  const deck = await prisma.deck.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
    include: {
      _count: {
        select: {
          words: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!deck) {
    return null;
  }

  const now = new Date();

  const newCount = await prisma.fSRSState.count({
    where: {
      card: {
        word: {
          deckId: id,
        },
      },
      state: 'NEW',
    },
  });

  const dueCount = await prisma.fSRSState.count({
    where: {
      card: {
        word: {
          deckId: id,
        },
      },
      due: {
        lte: now,
      },
    },
  });

  return {
    id: deck.id,
    name: deck.title,
    description: deck.description ?? '',
    wordCount: deck._count.words,
    newCount,
    dueCount,
    isPublic: false, // Placeholder
  };
}

const ClonePublicDeckSchema = z.object({
  sourceDeckId: z.string().min(1),
  name: z.string().trim().min(1).max(100),
});

export async function clonePublicDeck(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be signed in to clone a deck.');
  }

  const { sourceDeckId, name } = ClonePublicDeckSchema.parse(input);

  const sourceDeck = await prisma.deck.findFirst({
    where: {
      id: sourceDeckId,
      deletedAt: null,
    },
    include: {
      words: {
        where: {
          deletedAt: null,
        },
        include: {
          exampleSentences: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      },
    },
  });

  if (!sourceDeck) {
    throw new Error('Source deck not found.');
  }

  const clonedDeck = await prisma.$transaction(async (tx) => {
    const deck = await tx.deck.create({
      data: {
        userId: session.user.id,
        title: name,
        description: sourceDeck.description,
      },
    });

    for (const sourceWord of sourceDeck.words) {
      const word = await tx.word.create({
        data: {
          deckId: deck.id,
          word: sourceWord.word,
          pronunciation: sourceWord.pronunciation,
          partOfSpeech: sourceWord.partOfSpeech,
          meaning: sourceWord.meaning,
          memo: sourceWord.memo,
          source: sourceWord.source,
        },
      });

      for (const sentence of sourceWord.exampleSentences) {
        await tx.exampleSentence.create({
          data: {
            wordId: word.id,
            english: sentence.english,
            japanese: sentence.japanese,
            sortOrder: sentence.sortOrder,
          },
        });
      }

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
    }

    return deck;
  });

  return {
    id: clonedDeck.id,
  };
}
